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
secret_name=$2
if [ -z "$secret_name" ];
then
    echo "failed to provide project secret_name to create secret"
    exit 1
fi
service_account_email=$3
if [ -z "$service_account_email" ];
then
    echo "failed to provide project service_account_email to create secret"
    exit 1
fi

if gcloud secrets list --project "$project" | grep -q "^${secret_name}\s"; 
then
  echo -e "\npayer secret already exists: ${secret_name}"
else
  echo -e "\nCreating payer secret: ${secret_name}"
  while 
    read -rp "Enter the path to your payer keypair: " payer_keypair_path
    do    
      if [[ -f "$payer_keypair_path" ]]
      then 
        gcloud secrets create "$secret_name" --replication-policy="automatic" --data-file="$payer_keypair_path" --project "$project"
        sleep 3
        gcloud secrets add-iam-policy-binding "$secret_name" --member="serviceAccount:${service_account_email}" --role="roles/secretmanager.secretAccessor" --project "$project" > /dev/null
        break
      else 
        echo "File does not exists, please try again."
        continue
      fi
  done
fi
google_payer_secret_path="$(gcloud secrets list --uri --filter="${secret_name}" --project "$project" | cut -c41- | tr -d '\n')/versions/latest"

printf "secret: %s\n" "$google_payer_secret_path"


read -rp "Want to save values to $project.env? (y/n)? " answer
case ${answer:0:1} in
    y|Y )
    "$script_dir"/save-env-value.sh "$project" "SECRET_NAME" "$secret_name"
    "$script_dir"/save-env-value.sh "$project" "GOOGLE_PAYER_SECRET_PATH" "$google_payer_secret_path"
    ;;
    * )
        echo "User Exited"
        exit 0
    ;;
esac


exit 0