#!/bin/bash

set -e

# Imports
project_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
javascript_dir="$project_dir"/javascript
program_dir="$project_dir"/programs

cd "$javascript_dir"/solana.js
npm ci && npm run build

cd "$javascript_dir"/sbv2-utils
npm ci && npm run build

cd "$javascript_dir"/sbv2-lite
npm ci && npm run build

cd "$javascript_dir"/feed-parser
npm ci && npm run build

cd "$javascript_dir"/feed-walkthrough
npm ci && npm run build

cd "$javascript_dir"/lease-observer
npm ci && npm run build

cd "$program_dir"/anchor-buffer-parser
npm ci && anchor build

cd "$program_dir"/anchor-feed-parser
npm ci && anchor build

cd "$program_dir"/anchor-vrf-parser
npm ci && anchor build