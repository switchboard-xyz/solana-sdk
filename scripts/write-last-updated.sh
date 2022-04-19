#!/bin/bash
set -e

code_dir=$1
if [[ -z "${code_dir}" ]]; then
  echo "specify a git working directory"; exit 1;
fi

out_dir=$2
if [[ -z "${out_dir}" ]]; then
  echo "specify an output directory for the svg file"; exit 1;
fi

date_str=$(git log -1 --pretty="format:%as" "$code_dir")

svg_template='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="190" height="20" role="img" aria-label="Page LastUpdated: <<<LAST_UPDATED>>>"><title>Page LastUpdated: <<<LAST_UPDATED>>></title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="190" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="109" height="20" fill="#555"/><rect x="109" width="81" height="20" fill="#007ec6"/><rect width="190" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="555" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="990">Page LastUpdated</text><text x="555" y="140" transform="scale(.1)" fill="#fff" textLength="990">Page LastUpdated</text><text aria-hidden="true" x="1485" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="710"><<<LAST_UPDATED>>></text><text x="1485" y="140" transform="scale(.1)" fill="#fff" textLength="710"><<<LAST_UPDATED>>></text></g></svg>'
search_str="<<<LAST_UPDATED>>>"

# echo "$svg_template" | sed -e 's/<<<LAST_UPDATED>>>/${date_str}/g' > "$test_dir/last-updated.svg"
string=$svg_template ; echo "${string//$search_str/$date_str}" > "$out_dir/last-updated.svg"

