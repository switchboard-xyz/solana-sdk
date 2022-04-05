#!/bin/bash

set -e

stty sane # dont show backspace char during prompts

script_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

## Get Project Name
project=$1
if [[ -z "${project}" ]]; then
  read -rp "Enter the name for the google cloud project (Ex. switchboard-oracle-cluster): " project
fi
project=$(echo "${project// /-}" | awk '{print tolower($0)}') # Replace spaces with dashes and make lower case
echo -e "project: $project"

envFile="$project.env"
if [ -f "$envFile" ]
then
    envFile=$(realpath "${envFile}")
    echo "env file: $envFile"
else
    echo "failed to find env file: $envFile"
    exit 1
fi

set -a
. "$envFile"
set +a

prefix="kubernetes-"
outputPath=$(realpath "$prefix$project")
echo "output path: $outputPath";

mkdir -p "$outputPath"
cp -r "${script_dir}/helm/" "$outputPath/"

files=(
"$outputPath/dashboard.yaml"
"$outputPath/grafana-values.yaml"
"$outputPath/nginx-values.yaml"
"$outputPath/vmetrics-values.yaml"
"$outputPath/switchboard-oracle/values.yaml"
)

if [[ -z "${CLUSTER}" ]]; then
  echo "failed to set CLUSTER"
  exit 1
elif [[ "$CLUSTER" != "devnet" && "$CLUSTER" != "mainnet-beta" && "$CLUSTER" != "localnet" ]]; then
  echo "invalid CLUSTER ($CLUSTER) - [devnet, mainnet-beta, or localnet]"
  exit 1
fi
if [[ -z "${RPC_URL}" ]]; then
  echo "failed to set RPC_URL"
  exit 1
fi
if [[ -z "${WS_URL}" ]]; then
  WS_URL=""
fi
if [[ -z "${BACKUP_MAINNET_RPC}" ]]; then
  BACKUP_MAINNET_RPC="https://api.mainnet-beta.solana.com"
fi
if [[ -z "${ORACLE_KEY}" ]]; then
  echo "failed to set ORACLE_KEY"
  exit 1
fi
if [[ -z "${HEARTBEAT_INTERVAL}" ]]; then
  HEARTBEAT_INTERVAL="15"
fi
if [[ -z "${GOOGLE_PAYER_SECRET_PATH}" ]]; then
  echo "failed to set GOOGLE_PAYER_SECRET_PATH"
  exit 1
fi
if [[ -z "${GCP_CONFIG_BUCKET}" ]]; then
  GCP_CONFIG_BUCKET="oracle-configs:configs.json"
fi
if [[ -z "${SERVICE_ACCOUNT_BASE64}" ]]; then
  echo "failed to set SERVICE_ACCOUNT_BASE64"
  exit 1
fi
if [[ -z "${EXTERNAL_IP}" ]]; then
  echo "failed to set EXTERNAL_IP"
  exit 1
fi
if [[ -z "${PAGERDUTY_EVENT_KEY}" ]]; then
  PAGERDUTY_EVENT_KEY=""
fi
if [[ -z "${GRAFANA_HOSTNAME}" ]]; then
  echo "failed to set GRAFANA_HOSTNAME"
  exit 1
fi
if [[ -z "${GRAFANA_ADMIN_PASSWORD}" ]]; then
  GRAFANA_ADMIN_PASSWORD="${GRAFANA_ADMIN_PASSWORD:-SbCongraph50!}"
fi
if [[ -z "${GRAFANA_TLS_CRT}" ]]; then
  echo "failed to set GRAFANA_TLS_CRT"
  exit 1
fi
if [[ -z "${GRAFANA_TLS_KEY}" ]]; then
  echo "failed to set GRAFANA_TLS_KEY"
  exit 1
fi
if [[ -z "${METRICS_EXPORTER}" ]]; then
  METRICS_EXPORTER="${METRICS_EXPORTER:-prometheus}"
elif [[ "$METRICS_EXPORTER" != "prometheus" && "$CLUSTER" != "gcp" && "$CLUSTER" != "opentelemetry-collector" ]]; then
  echo "invalid METRICS_EXPORTER ($METRICS_EXPORTER) - [prometheus, gcp, or opentelemetry-collector]"
  exit 1
fi

for f in "${files[@]}"; do
  PAGERDUTY_EVENT_KEY="$PAGERDUTY_EVENT_KEY" \
  METRICS_EXPORTER="$METRICS_EXPORTER" \
  GRAFANA_ADMIN_PASSWORD="$GRAFANA_ADMIN_PASSWORD"\
  envsubst '$CLUSTER $RPC_URL $WS_URL $BACKUP_MAINNET_RPC $ORACLE_KEY $HEARTBEAT_INTERVAL $GOOGLE_PAYER_SECRET_PATH $GCP_CONFIG_BUCKET $SERVICE_ACCOUNT_BASE64 $EXTERNAL_IP $PAGERDUTY_EVENT_KEY $GRAFANA_HOSTNAME $GRAFANA_ADMIN_PASSWORD $GRAFANA_TLS_CRT $GRAFANA_TLS_KEY $METRICS_EXPORTER' < "$f" \
  | tee "$outputPath/tmp.txt" \
  > /dev/null ;
  cat "$outputPath/tmp.txt" > "$f";
done

rm "$outputPath/tmp.txt"

exit 0
