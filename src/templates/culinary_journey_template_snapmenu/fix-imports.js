const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Function to recursively get all files in a directory
async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = path.resolve(dir, subdir);
    return (await stat(res)).isDirectory() ? getFiles(res) : res;
  }));
  return files.flat();
}

// Function to fix imports in a file
async function fixImports(filePath) {
  try {
    // Only process JavaScript/JSX files
    if (!filePath.match(/\.(js|jsx)$/)) {
      return;
    }

    // Read file content
    const content = await readFile(filePath, 'utf8');
    
    // Skip files that don't have @/ imports
    if (!content.includes('@/')) {
      return;
    }

    console.log(`Fixing imports in ${filePath}`);

    // Calculate relative path from file to src directory
    const srcDir = path.resolve(__dirname, '.');
    const fileDir = path.dirname(filePath);
    const relativePathToSrc = path.relative(fileDir, srcDir);
    
// Replace @/ with relative path
let newContent = content.replace(/@\/([^'"]+)/g, (match, importPath) => {
  // Handle special case for root-level imports
  if (relativePathToSrc === '') {
    return `./${importPath}`;
  }
  
  // Handle normal case
  return `${relativePathToSrc}/${importPath}`;
});

    // Write updated content back to file
    await writeFile(filePath, newContent, 'utf8');
    console.log(`Fixed imports in ${filePath}`);
  } catch (error) {
    console.error(`Error fixing imports in ${filePath}:`, error);
  }
}

// Main function
async function main() {
  try {
    // Get all files in the src directory
    const files = await getFiles(__dirname);
    
    // Fix imports in all files
    await Promise.all(files.map(fixImports));
    
    console.log('All imports fixed successfully!');
  } catch (error) {
    console.error('Error fixing imports:', error);
  }
}

// Run the script
main();
