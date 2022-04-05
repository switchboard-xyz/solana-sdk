#!/bin/bash

set -e

### SHOULD WE ENSURE WERE CONNECTED TO THE RIGHT K8S BEFORE RUNNING?

## Get Project Name
project=$1
if [[ -z "${project}" ]]; then
  read -rp "Enter the name for the google cloud project (Ex. switchboard-oracle-cluster): " project
fi
project=$(echo "${project// /-}" | awk '{print tolower($0)}') # Replace spaces with dashes and make lower case
echo -e "project: $project"

prefix="kubernetes-"
helmDir=$(realpath "$prefix$project")
if [ -d "$helmDir" ]
then
    echo "helm directory: $helmDir";
else
    echo "failed to find helm directory: $helmDir"
    exit 1
fi

## Add / Update Helm Charts
helm repo add vm https://victoriametrics.github.io/helm-charts/
helm repo add grafana https://grafana.github.io/helm-charts
helm repo add nginx-stable https://helm.nginx.com/stable
helm repo add stable https://charts.helm.sh/stable
helm repo update

## Deploy Helm Charts
if ! kubectl apply -f "$helmDir/dashboard.yaml" -n grafana
then
  kubectl create ns grafana
  kubectl apply -f "$helmDir/dashboard.yaml" -n grafana
fi

helm upgrade -i grafana grafana/grafana -f "$helmDir/grafana-values.yaml"
helm upgrade -i vmsingle vm/victoria-metrics-single -f "$helmDir/vmetrics-values.yaml"
helm upgrade -i nginx-helm nginx-stable/nginx-ingress -f "$helmDir/nginx-values.yaml"
helm upgrade -i switchboard-oracle helm/switchboard-oracle -f "$helmDir/switchboard-oracle/values.yaml"

printf "\nHelm charts deployed from %s\n" "${helmDir}"

exit 0