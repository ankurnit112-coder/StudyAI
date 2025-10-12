// Test script to verify imports work
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Testing module resolution...');

// Check if files exist
const userDataServicePath = path.join(__dirname, 'lib', 'user-data-service.ts');
const databaseSupabasePath = path.join(__dirname, 'lib', 'database-supabase.ts');

console.log('user-data-service.ts exists:', fs.existsSync(userDataServicePath));
console.log('database-supabase.ts exists:', fs.existsSync(databaseSupabasePath));

// Check tsconfig paths
const tsconfigPath = path.join(__dirname, 'tsconfig.json');
if (fs.existsSync(tsconfigPath)) {
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  console.log('TypeScript paths configuration:', tsconfig.compilerOptions.paths);
}

console.log('Module resolution test complete.');