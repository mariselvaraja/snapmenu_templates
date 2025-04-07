#!/bin/bash

# Navigate to the src directory
cd "$(dirname "$0")/src"

# Find all JavaScript and JSX files
FILES=$(find . -type f -name "*.js" -o -name "*.jsx")

# Loop through each file
for file in $FILES; do
  # Check if the file contains LoadingSpinner imports
  if grep -q "import.*LoadingSpinner.*from.*components/LoadingSpinner" "$file"; then
    echo "Fixing LoadingSpinner import in $file"
    
    # Get the directory of the file relative to src
    dir=$(dirname "$file")
    
    # Calculate the relative path to the LoadingSpinner component
    rel_path=""
    depth=$(echo "$dir" | tr -cd '/' | wc -c)
    
    # Create the relative path based on the depth
    for ((i=0; i<depth; i++)); do
      rel_path="../$rel_path"
    done
    
    # Replace the import with the correct relative path
    sed -i.bak "s|import { LoadingSpinner } from '[^']*components/LoadingSpinner'|import { LoadingSpinner } from '${rel_path}components/LoadingSpinner'|g" "$file"
    rm "${file}.bak"
  fi
done

echo "All LoadingSpinner imports fixed successfully!"
