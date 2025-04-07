#!/bin/bash

# Navigate to the src directory
cd "$(dirname "$0")/src"

# Find all JavaScript and JSX files
FILES=$(find . -type f -name "*.js" -o -name "*.jsx")

# Loop through each file
for file in $FILES; do
  # Get the directory of the file relative to src
  dir=$(dirname "$file")
  
  # Calculate the relative path to the components directory
  rel_path=""
  depth=$(echo "$dir" | tr -cd '/' | wc -c)
  
  # Create the relative path based on the depth
  for ((i=0; i<depth; i++)); do
    rel_path="../$rel_path"
  done
  
  # Fix LoadingSpinner imports
  if grep -q "LoadingSpinner.*from" "$file"; then
    echo "Fixing LoadingSpinner import in $file"
    
    # Calculate the correct path to LoadingSpinner
    if [ "$depth" -eq 0 ]; then
      # Root level file
      sed -i.bak "s|import { LoadingSpinner } from '[^']*'|import { LoadingSpinner } from './components/LoadingSpinner'|g" "$file"
    else
      # Nested file
      sed -i.bak "s|import { LoadingSpinner } from '[^']*'|import { LoadingSpinner } from '${rel_path}components/LoadingSpinner'|g" "$file"
    fi
    rm "${file}.bak"
  fi
  
  # Fix context imports
  if grep -q "from '[^']*context/contexts/" "$file"; then
    echo "Fixing context imports in $file"
    
    # Calculate the correct path to context
    if [ "$depth" -eq 0 ]; then
      # Root level file
      sed -i.bak "s|from '[^']*context/contexts/|from './context/contexts/|g" "$file"
    else
      # Nested file
      sed -i.bak "s|from '[^']*context/contexts/|from '${rel_path}context/contexts/|g" "$file"
    fi
    rm "${file}.bak"
  fi
  
  # Fix other imports with @/
  if grep -q "@/" "$file"; then
    echo "Fixing @/ imports in $file"
    
    # Replace @/ with the relative path
    if [ "$depth" -eq 0 ]; then
      # Root level file
      sed -i.bak "s|@/|./|g" "$file"
    else
      # Nested file
      sed -i.bak "s|@/|${rel_path}|g" "$file"
    fi
    rm "${file}.bak"
  fi
done

echo "All imports fixed successfully!"
