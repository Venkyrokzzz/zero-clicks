#!/bin/bash
# Zero Clicks — Pre-commit checks
# Blocks commit if TypeScript or build errors found

echo "Running pre-commit checks..."

# 1. TypeScript check
npx tsc --noEmit
if [ $? -ne 0 ]; then
  echo "BLOCKED: TypeScript errors found. Fix before committing."
  exit 2
fi

# 2. Check for hardcoded colours (warn only)
if git diff --cached | grep -E '(#3b82f6|#020817|rgba\(59,130,246)' | grep -v 'globals.css' | grep -v '// ok' > /dev/null 2>&1; then
  echo "WARNING: Hardcoded colour values found. Consider using CSS variables."
fi

# 3. Check for any types (warn only)
if git diff --cached | grep ': any' > /dev/null 2>&1; then
  echo "WARNING: 'any' type found. Use proper TypeScript types."
fi

# 4. Never commit .env files
if git diff --cached --name-only | grep -E '^\.env' > /dev/null 2>&1; then
  echo "BLOCKED: .env file staged. Remove it immediately."
  exit 2
fi

echo "Pre-commit checks passed!"
exit 0
