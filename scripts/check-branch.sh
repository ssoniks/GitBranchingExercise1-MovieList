#!/bin/bash

branch_name=$(git rev-parse --abbrev-ref HEAD)

regex="^(feat|fix|test|chore)\/[a-z0-9._-]+$"

# List of main branches
protected_branches=("master" "dev" "release" "prod")

for protected in "${protected_branches[@]}"; do
    if [[ "$branch_name" == "$protected" ]]; then
        echo "✅ Push allowed"
        exit 0
    fi
done

if [[ ! $branch_name =~ $regex ]]; then
    echo "❌ ERROR: Aborting push, '$branch_name' does not follow the correct format."
    echo "✅ Correct format: <type>/<description>"
    echo "Allowed types: feat, fix, test, chore"
    exit 1 
fi

exit 0