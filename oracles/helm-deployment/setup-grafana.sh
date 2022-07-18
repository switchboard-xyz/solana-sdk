#!/bin/bash

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

## Create TLS Certificate
mkdir -p secrets
tls_privkey_file=$(realpath "secrets/${project}-letsencrypt.private.key")
tls_pubkey_file=$(realpath "secrets/${project}-tls.public.pub")
csr_privkey_file=$(realpath "secrets/${project}-csr.private.key")
csr_file=$(realpath "secrets/${project}-csr.pem")
chain_file=$(realpath "secrets/${project}-tls-chain.pem")
crt_file=$(realpath "secrets/${project}-crt.pem")

## Exit if we have the files we need
if [ -s "$csr_privkey_file" ] && [ -s "$crt_file" ]
then
    grafana_tls_key=$(base64 "$csr_privkey_file")
    printf "\nGRAFANA_TLS_KEY=\"%s\"\n" "$grafana_tls_key"
    "$script_dir"/scripts/save-env-value.sh "$project" "GRAFANA_TLS_KEY" "$grafana_tls_key" > /dev/null
    grafana_tls_crt=$(base64 "$crt_file")
    printf "\nGRAFANA_TLS_CRT=\"%s\"\n" "$grafana_tls_crt"
    "$script_dir"/scripts/save-env-value.sh "$project" "GRAFANA_TLS_CRT" "$grafana_tls_crt" > /dev/null
    exit 0
fi

if [ ! -s "$tls_privkey_file" ]; then
    openssl genrsa 4096 > "$tls_privkey_file"
fi
tls_pubkey=$(openssl rsa -in "$tls_privkey_file" -pubout)
echo "$tls_pubkey" > "$tls_pubkey_file"
printf '\nStep #1: Account Public Key:\n%s\n\n' "$tls_pubkey"

if [ ! -s "$csr_privkey_file" ]; then
    openssl genrsa 4096 > "$csr_privkey_file"
fi
if [[  -s "$csr_privkey_file" ]]; then
    grafana_tls_key=$(base64 "$csr_privkey_file")
    # printf "\nGRAFANA_TLS_KEY=\"%s\"\n" "$grafana_tls_key"
    "$script_dir"/scripts/save-env-value.sh "$project" "GRAFANA_TLS_KEY" "$grafana_tls_key" > /dev/null
fi

if [ ! -s "$csr_file" ]; then
    domain=$2
    read -rp "is this domain correct (${domain})? (y/n)? " answer
    case ${answer:0:1} in
        y|Y )
        ;;
        * )
            read -rp "Enter your registered domain name where you will view grafana metrics (Ex. grafana.switchboard.com): " domain
        ;;
    esac
    email=$3
    read -rp "is this email correct (${email})? (y/n)? " answer
    case ${answer:0:1} in
        y|Y )
        ;;
        * )
            read -rp "Enter an email for your TLS CRT: " email
        ;;
    esac
    "$script_dir"/scripts/save-env-value.sh "$project" "GRAFANA_HOSTNAME" "$domain"
    openssl req -new -nodes -key "$csr_privkey_file" -out "$csr_file" -subj "/CN=${domain}/emailAddress=${email}"
fi
tls_csr=$(<"$csr_file")
printf '\nStep#2: Certificate Signing Request:\n%s\n' "$tls_csr"


if [ -s "$chain_file" ]
then
    if [[ ! -f "$crt_file" || ! -s "$crt_file" ]]; then
         openssl x509 -in "$chain_file" -out "$crt_file"
    fi
    grafana_tls_crt=$(base64 "$crt_file")
    printf "\nGRAFANA_TLS_CRT=\"%s\"\n" "$grafana_tls_crt"
    "$script_dir"/scripts/save-env-value.sh "$project" "GRAFANA_TLS_KEY" "$grafana_tls_key" > /dev/null
    exit 0
else
    printf '\nPrivate Key File: %s' "$tls_privkey_file"
    printf '\nPublic Key File: %s' "$tls_pubkey_file"
    printf '\nCert Signing Request File: %s' "$csr_file"

    printf "\n\nComplete the steps at https://gethttpsforfree.com and save the entire TLS certificate chain to:\n\t%s\n" "$chain_file"

    echo -e "\n\texport PRIV_KEY=\"$tls_privkey_file\""
    exit 0
fi

exit 0
