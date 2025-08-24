// Heroku post-build script to handle the build process
const { execSync } = require('child_process');

console.log('Starting Heroku post-build process...');

try {
  // Build the frontend
  console.log('Building frontend with Vite...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  // Build the backend
  console.log('Building backend with esbuild...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}