import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readFile = fs.promises.readFile;
const writeFile = fs.promises.writeFile;
const readdir = fs.promises.readdir;
const stat = fs.promises.stat;

// Function to recursively get all files in a directory
async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = path.resolve(dir, subdir);
    return (await stat(res)).isDirectory() ? getFiles(res) : res;
  }));
  return files.flat();
}

// Function to fix LoadingSpinner imports in a file
async function fixImports(filePath) {
  try {
    // Only process JavaScript/JSX files
    if (!filePath.match(/\.(js|jsx)$/)) {
      return;
    }

    // Read file content
    const content = await readFile(filePath, 'utf8');
    
    // Skip files that don't import LoadingSpinner
    if (!content.includes('LoadingSpinner')) {
      return;
    }

    console.log(`Checking imports in ${filePath}`);

    // Get the directory of the file relative to src
    const srcDir = path.resolve(__dirname, 'src');
    const fileDir = path.dirname(filePath);
    
    // Calculate the relative path from the file to the LoadingSpinner component
    const loadingSpinnerPath = path.resolve(__dirname, 'src/components/LoadingSpinner.jsx');
    const loadingSpinnerDir = path.dirname(loadingSpinnerPath);
    const relativePathToLoadingSpinner = path.relative(fileDir, loadingSpinnerDir);
    
    // Replace incorrect LoadingSpinner imports with the correct relative path
    const newContent = content.replace(
      /import\s+{(?:\s*LoadingSpinner\s*(?:,\s*[^}]+)?)}\s+from\s+['"]([^'"]+)['"]/g,
      (match, importPath) => {
        if (importPath.includes('LoadingSpinner') && !importPath.startsWith('.')) {
          // Calculate the correct relative path
          const correctPath = relativePathToLoadingSpinner ? 
            `${relativePathToLoadingSpinner}/LoadingSpinner` : 
            './LoadingSpinner';
          
          // Extract any other imports from the original import statement
          const otherImports = match.match(/{\s*(LoadingSpinner\s*,\s*[^}]+)}/);
          if (otherImports && otherImports[1] && otherImports[1].includes(',')) {
            // Handle case where LoadingSpinner is imported with other components
            const importList = otherImports[1].split(',').map(i => i.trim());
            const loadingSpinnerImport = `import { LoadingSpinner } from '${correctPath}';`;
            
            // Filter out LoadingSpinner from the original import
            const remainingImports = importList.filter(i => !i.startsWith('LoadingSpinner'));
            if (remainingImports.length > 0) {
              return `${loadingSpinnerImport}\nimport { ${remainingImports.join(', ')} } from '${importPath}'`;
            }
            return loadingSpinnerImport;
          }
          
          return `import { LoadingSpinner } from '${correctPath}'`;
        }
        return match;
      }
    );

    // If content was changed, write it back to the file
    if (newContent !== content) {
      console.log(`Fixing imports in ${filePath}`);
      await writeFile(filePath, newContent, 'utf8');
      console.log(`Fixed imports in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error fixing imports in ${filePath}:`, error);
  }
}

// Main function
async function main() {
  try {
    // Get all files in the src directory
    const files = await getFiles(path.resolve(__dirname, 'src'));
    
    // Fix imports in all files
    await Promise.all(files.map(fixImports));
    
    console.log('All LoadingSpinner imports fixed successfully!');
  } catch (error) {
    console.error('Error fixing imports:', error);
  }
}

// Run the script
main();
