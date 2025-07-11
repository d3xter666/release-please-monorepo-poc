#!/bin/bash

ORDER=("pckg-a" "pckg-b" "pckg-c" "pckg-d")
CUR="pckg-b"  # Pass the current package as the first argument

# Find the index of the current package
for i in "${!ORDER[@]}"; do
  if [[ "${ORDER[$i]}" == "$CUR" ]]; then
    CUR_IDX=$i
    break
  fi
done

PR_NUMBER=""
# Search for open PRs for the next packages in order
for ((j=CUR_IDX+1; j<${#ORDER[@]}; j++)); do
  NEXT_PKG="${ORDER[$j]}"
  PR_NUMBER=$(gh pr list --state open --search "release: ${NEXT_PKG}" --json number,title | jq -r --arg pkg "$NEXT_PKG" '.[] | select(.title | test("^release: \($pkg) v[0-9]+\\.[0-9]+\\.[0-9]+$")) | .number'| head -n1)
  if [[ -n "$PR_NUMBER" ]]; then
    echo "Found open PR #$PR_NUMBER for $NEXT_PKG"
    break
  fi
done

echo "pr_number=$PR_NUMBER"