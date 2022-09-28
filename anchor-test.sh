#!/bin/bash

set -e

# Imports
project_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
program_dir="$project_dir"/programs

cd "$program_dir"/anchor-buffer-parser
anchor test

cd "$program_dir"/anchor-feed-parser
anchor test

cd "$program_dir"/anchor-vrf-parser
anchor test