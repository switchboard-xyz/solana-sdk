#!/bin/bash

cli_dir_path="./cli"

cli_output_rel_path="../website/api/cli"


cd "$cli_dir_path" || exit

"../node_modules/@oclif/dev-cli/bin/run" readme --multi --dir "$cli_output_rel_path"

cd "$cli_output_rel_path" || exit

# Backup old files
find . -name '_*.md' -exec rm {} \;
# for file in *_*.md ; do rm -f "_${file%.md}.md"; done

# Add underscore to new files so they are hidden in sidebar
# Remove first two lines to make partial md files
for f in *.md; 
do 
    mv -f "${f%.md}.md" "_${f%.md}.md"; 
    sed -i "" '1,2d' "_${f%.md}.md";
    sed -i "" 's#https://github.com/switchboard-xyz/switchboard-v2/blob/.*/src#https://github.com/switchboard-xyz/switchboard-v2/tree/main/cli/src#g' "_${f%.md}.md";
done



