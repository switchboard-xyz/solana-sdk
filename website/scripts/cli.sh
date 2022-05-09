#!/bin/bash

cli_dir_path="./cli"

cli_output_rel_path="../website/api/switchboardv2-cli"


cd "$cli_dir_path" || exit

"../node_modules/@oclif/dev-cli/bin/run" readme --multi --dir "$cli_output_rel_path"

cd "$cli_output_rel_path" || exit

# Backup old files
# for file in *_*.md ; do mv $file ${file//.md/.md.bak} ; done

# Add underscore to new files so they are hidden in sidebar
# Remove first two lines to make partial md files
for f in *.md; 
do 
    mv -f "${f%.md}.md" "_${f%.md}.md"; 

    sed -i "" '1,2d' "_${f%.md}.md"; 
done

# find . -type f -name "*.md" -exec rename 's/\.md$/.md.bak/' '{}' \;


# Your use of rename might not work everywhere. Another way to achieve this is to use find, mv, and some bash substitution.

# find . -name '*.foo' -exec bash -c 'mv "$0" "${0%.foo}.foo1"' "{}" \;