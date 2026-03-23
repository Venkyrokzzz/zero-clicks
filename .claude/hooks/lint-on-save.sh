#!/bin/bash
# Zero Clicks — Auto-lint after file edits
# Runs on .ts and .tsx files only

FILE="$1"

if [[ "$FILE" =~ \.(ts|tsx)$ ]]; then
  npx eslint "$FILE" --fix --quiet 2>/dev/null
  echo "Linted: $FILE"
fi

exit 0
