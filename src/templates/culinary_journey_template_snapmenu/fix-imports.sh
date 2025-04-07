#!/bin/bash

# Navigate to the src directory
cd "$(dirname "$0")/src"

# Find all JavaScript and JSX files
FILES=$(find . -type f -name "*.js" -o -name "*.jsx")

# Loop through each file
for file in $FILES; do
  # Check if the file contains @/ imports
  if grep -q "@/" "$file"; then
    echo "Fixing imports in $file"
    
    # Get the directory of the file relative to src
    dir=$(dirname "$file")
    
    # Calculate the relative path to src
    rel_path=""
    if [ "$dir" != "." ]; then
      # Count the number of directories to traverse up
      depth=$(echo "$dir" | tr -cd '/' | wc -c)
      depth=$((depth + 1))
      
      # Create the relative path
      for ((i=0; i<depth; i++)); do
        rel_path="../$rel_path"
      done
    else
      rel_path="./"
    fi
    
    # Replace @/ with the relative path
    sed -i.bak "s|@/|$rel_path|g" "$file"
    rm "${file}.bak"
  fi
done

echo "All imports fixed successfully!"
