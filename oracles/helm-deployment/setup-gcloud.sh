#!/bin/bash
# Initiate a new google cloud project and build the necessary configuration

set -e

stty sane # dont show backspace char during prompts

script_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

## Get Project Name
project=$1
if [ -z "$project" ];
then
  read -rp "Enter the name for the google cloud project (Ex. switchboard-oracle-cluster): " project
fi
project=$(echo "${project// /-}" | awk '{print tolower($0)}') # Replace spaces with dashes and make lower case
echo -e "project name: $project"

## Create GCP Project
if gcloud projects list | grep -q "^${project}\s"; 
then
  echo -e "\ngcloud project already exists: ${project}"
else
echo -e "\nCreating gcloud project: ${project}"
  gcloud projects create "$project"
fi
gcloud config set project "$project" ## TODO: Remove when each command explicitly sets project
"$script_dir"/scripts/save-env-value.sh "$project" "PROJECT" "$project" 

echo -e "\nhttps://console.cloud.google.com/billing/enable?project=$project"
read -rp "Have you enabled billing on this project ($project)? (y/n)? " answer
case ${answer:0:1} in
    y|Y )
    ;;
    * )
        echo "User Exited"
        exit 0
    ;;
esac

## Enable Required Services
printf "\n########## Enabling GCP Services ##########\n"
gcloud services enable compute.googleapis.com --project "$project" > /dev/null
gcloud services enable container.googleapis.com --project "$project" > /dev/null
gcloud services enable iamcredentials.googleapis.com --project "$project" > /dev/null
gcloud services enable secretmanager.googleapis.com --project "$project" > /dev/null

## Set Default Region/Zone
printf "\n########## GCP Project Config ##########\n"
region=$(gcloud compute project-info describe --project "$project" | grep -A1 "google-compute-default-region" | tail -n 1 | cut -d ":" -f2- | awk '{$1=$1};1')
zone=$(gcloud compute project-info describe --project "$project"  | grep -A1 "google-compute-default-zone" | tail -n 1 | cut -d ":" -f2- | awk '{$1=$1};1')
if [[ -z "$region"  ||  -z "$zone" ]]
then 
  PS3="Enter a number to select your clusters region: "
  select region in us-east1 us-central1 us-west1 europe-north1 europe-west1 asia-east1 asia-southeast1 asia-east2
  do
      case $region in
      us-east1)
        region="us-east1"
        zone="us-east1-b"
        break
        ;;
      us-central1)
        region="us-central1"
        zone="us-central1-a"
        break
        ;;
    us-west1)
        region="us-west1"
        zone="us-west1-a"
        break
        ;;
    europe-north1)
        region="europe-north1"
        zone="europe-north1-a"
        break
        ;;
    europe-west1)
        region="europe-west1"
        zone="europe-west1-b"
        break
        ;;
    asia-east1)
        region="asia-east1"
        zone="asia-east1-a"
        break
        ;;
    asia-southeast1)
        region="asia-southeast1"
        zone="asia-southeast1-a"
        break
        ;;
    asia-east2)
        region="asia-east2"
        zone="asia-east2-a"
        break
        ;;
      *) 
        echo "Invalid option $REPLY"
        ;;
    esac
  done
  gcloud compute project-info add-metadata --metadata google-compute-default-region=$region,google-compute-default-zone=$zone --project "$project"
else 
  echo -e "project default region ($region) and zone ($zone) already configured"
fi
"$script_dir"/scripts/save-env-value.sh "$project" "DEFAULT_REGION" "$region"
"$script_dir"/scripts/save-env-value.sh "$project" "DEFAULT_ZONE" "$zone"

## Create Service Account
printf "\n########## Service Account ##########\n"
service_account_display_name="Oracle Service Account"
service_account_name=$(echo "${service_account_display_name// /-}" | awk '{print tolower($0)}') # Replace spaces with dashes and make lower case
service_account_file="secrets/$project-$service_account_name.private-key.json"
service_account_email="${service_account_name}@${project}.iam.gserviceaccount.com"
if gcloud iam service-accounts list --project "$project" | grep -q "${service_account_email}\s"; 
then
  echo -e "service account already exists: ${service_account_email}"
else
  echo -e "Creating service account: ${service_account_name}"
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
"$script_dir"/scripts/save-env-value.sh "$project" "SERVICE_ACCOUNT_EMAIL" "$service_account_email"
"$script_dir"/scripts/save-env-value.sh "$project" "SERVICE_ACCOUNT_BASE64" "$service_account_base64"

## Create External IP
printf "\n########## External IP ##########\n"
external_ip_name="cluster-external-ip"
if gcloud compute addresses list  --project "$project" | grep -q "^${external_ip_name}\s"; 
then
  echo -e "external ipv4 address already exists: ${external_ip_name}"
else
  echo -e "Creating external ipv4 address: ${external_ip_name}"
  gcloud compute addresses create ${external_ip_name} --region $region --project "$project"
fi
external_ip=$(gcloud compute addresses list --project "$project" | grep "^${external_ip_name}\s" | grep -oE "((1?[0-9][0-9]?|2[0-4][0-9]|25[0-5])\.){3}(1?[0-9][0-9]?|2[0-4][0-9]|25[0-5])")
"$script_dir"/scripts/save-env-value.sh "$project" "EXTERNAL_IP" "$external_ip"

## Create Keypair Secret
printf "\n########## Oracle Payer Secret ##########\n"
secret_name="oracle-payer-secret"
if gcloud secrets list --project "$project" | grep -q "^${secret_name}\s"; 
then
  echo -e "payer secret already exists: ${secret_name}"
else
  echo -e "Creating payer secret: ${secret_name}"
  while 
    read -rp "Enter the path to your payer keypair: " payer_keypair_path
    do    
      if [[ -f "$payer_keypair_path" ]]
      then 
        gcloud secrets create $secret_name --replication-policy="automatic" --data-file="$payer_keypair_path" --project "$project"
        sleep 3
        gcloud secrets add-iam-policy-binding $secret_name --member="serviceAccount:${service_account_email}" --role="roles/secretmanager.secretAccessor" --project "$project" > /dev/null
        break
      else 
        echo "File does not exists, please try again."
        continue
      fi
  done
fi
google_payer_secret_path="$(gcloud secrets list --uri --filter=${secret_name} --project "$project" | cut -c41- | tr -d '\n')/versions/latest"
"$script_dir"/scripts/save-env-value.sh "$project" "SECRET_NAME" "$secret_name"
"$script_dir"/scripts/save-env-value.sh "$project" "GOOGLE_PAYER_SECRET_PATH" "$google_payer_secret_path"

## Storage Bucket
printf "\n########## Storage Bucket ##########\n"
storage_bucket_name="${project}-oracle-configs"
storage_bucket_path="$storage_bucket_name:configs.json"
full_storage_bucket_name="gs://$project-oracle-configs"
if gsutil ls | grep -q "^gs://$storage_bucket_name/"; 
then
  echo -e "storage bucket already exists: ${storage_bucket_name}"
else
  echo -e "Creating storage bucket: ${storage_bucket_name}"
  gsutil mb -p "$project" -l "$region" "$full_storage_bucket_name"
  gsutil iam ch serviceAccount:"$service_account_email":legacyBucketReader "$full_storage_bucket_name"
fi
storage_bucket_path="$storage_bucket_name:configs.json"
"$script_dir"/scripts/save-env-value.sh "$project" "GCP_CONFIG_BUCKET" "$storage_bucket_path"

## Start container and save credentials
printf "\n########## Kubernetes Cluster ##########\n"
cluster_name="switchboard-cluster"
if gcloud container clusters list --project "$project" | grep -q "^${cluster_name}\s"; 
then
  echo -e "kubernetes cluster already exists: ${cluster_name}"
else
  echo -e "Creating kubernetes cluster: ${cluster_name}"
  gcloud container clusters create-auto $cluster_name --service-account="$service_account_email" --region $region --project "$project"
fi
gcloud container clusters get-credentials $cluster_name --project "$project" --region $region
"$script_dir"/scripts/save-env-value.sh "$project" "CLUSTER_NAME" "$cluster_name"

echo -e "\nEnvironment variables saved to ${project}.env"