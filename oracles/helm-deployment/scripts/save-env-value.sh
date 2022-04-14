#!/bin/bash

project=$1
if [ -z "$project" ];
then
    echo "failed to provide project to save env value"
    exit 1
fi
envFile=$(realpath "$project".env)
touch "$envFile"

key=$2
if [ -z "$key" ];
then
    echo "failed to provide key to save env value"
    exit 1
fi

value=$3
if [ -z "$value" ];
then
    echo "failed to provide value to save env value"
    exit 1
fi

existingLineRegex="^$key=.*$"
newLine=$(printf '%s="%s"\n' "$key" "$value")

if grep "$existingLineRegex" "$envFile"
then
    sed -E -i '' "s!$existingLineRegex!$newLine!g" "$envFile"
else
    echo "$newLine" >> "$envFile"
fi

exit 0