#!/bin/bash

cli_dir_path="../../switchboardv2-cli"

cli_output_rel_path="../docusaurus/switchboard-documentation/api/switchboardv2-cli"


cd "$cli_dir_path" || exit

"./node_modules/@oclif/dev-cli/bin/run" readme --multi --dir "$cli_output_rel_path"

cd "$cli_output_rel_path" || exit

# Backup old files
for file in *_*.md ; do mv $file ${file//.md/.md.bak} ; done

# Add underscore to new files so they are hidden in sidebar
# Remove first two lines to make partial md files
for f in *.md; 
do 
    mv "${f%.md}.md" "_${f%.md}.md"; 

    sed -i "" '1,2d' "_${f%.md}.md"; 
done
