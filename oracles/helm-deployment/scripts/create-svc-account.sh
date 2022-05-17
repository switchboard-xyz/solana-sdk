#!/bin/bash

set -e

script_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

stty sane # dont show backspace char during prompts

project=$1
if [ -z "$project" ];
then
    echo "failed to provide project to create secret"
    exit 1
fi
service_account_display_name=$2
if [ -z "$service_account_display_name" ];
then
    echo "failed to provide project service_account_name, defaulting to Oracle Service Account"
    service_account_display_name="oracle-svc-account"
fi

service_account_name=$(echo "${service_account_display_name// /-}" | awk '{print tolower($0)}') # Replace spaces with dashes and make lower case
service_account_file="secrets/$project-$service_account_name.private-key.json"
service_account_email="${service_account_name}@${project}.iam.gserviceaccount.com"
if gcloud iam service-accounts list --project "$project" | grep -q "${service_account_email}\s"; 
then
  echo -e "\nservice account already exists: ${service_account_email}"
else
  echo -e "\nCreating service account: ${service_account_name}"
  gcloud iam service-accounts create "$service_account_name" --display-name="$service_account_display_name" --project "$project"
fi
while true; do
  if [ ! -s "$service_account_file" ]
  then
    mkdir -p secrets
    if ! gcloud iam service-accounts keys create "$service_account_file" --iam-account="$service_account_email" --project "$project"; then
      echo "failed to create new svc-account key and output file is empty - deleting and recreating svc-account key"
      lastKeyId=$(gcloud iam service-accounts keys list --iam-account="$service_account_email" | awk 'NR==2' | grep -o "^\w*\b" | tr -d '\n')
      gcloud iam service-accounts keys delete "$lastKeyId" --iam-account="$service_account_email" --project "$project"
      continue
    fi
  fi
  break
done
service_account_base64=$(base64 "$service_account_file")


read -rp "Want to save values to $project.env? (y/n)? " answer
case ${answer:0:1} in
    y|Y )
    "$script_dir"/save-env-value.sh "$project" "SERVICE_ACCOUNT_EMAIL" "$service_account_email"
    "$script_dir"/save-env-value.sh "$project" "SERVICE_ACCOUNT_BASE64" "$service_account_base64"
    ;;
    * )
        echo "User Exited"
        exit 0
    ;;
esac

exit 0