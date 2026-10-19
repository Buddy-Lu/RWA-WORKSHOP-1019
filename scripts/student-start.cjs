// Local student launcher. Never deploys contracts or sends transactions.
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const frontend = path.join(root, 'frontend');
const action = process.argv[2];
if (!['install', 'start', 'build'].includes(action)) {
  console.error('Usage: node scripts/student-start.cjs install|start|build');
  process.exit(1);
}
const [major, minor] = process.versions.node.split('.').map(Number);
if (!((major === 22 && minor >= 12) || major >= 24)) {
  console.error('Install Node.js 24 LTS from https://nodejs.org/ then reopen this file.');
  process.exit(1);
}
if (action !== 'install' && !fs.existsSync(path.join(frontend, 'node_modules', 'vite', 'package.json'))) {
  console.error('Run 01-install.cmd first. macOS/Linux: node scripts/student-start.cjs install');
  process.exit(1);
}
const args = {
  install: ['ci'],
  start: ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '5173', '--strictPort', '--open'],
  build: ['run', 'build'],
}[action];
console.log(`\nRWA Workshop / ${action}\nFolder: ${frontend}\n`);
if (action === 'start') console.log('Open http://127.0.0.1:5173 . Keep this window open. Ctrl+C stops the website.');
const result = process.platform === 'win32'
  ? spawnSync('cmd.exe', ['/d', '/s', '/c', `npm ${args.join(' ')}`], { cwd: frontend, stdio: 'inherit' })
  : spawnSync('npm', args, { cwd: frontend, stdio: 'inherit' });
if (result.error) console.error(result.error.message);
if (result.status === 0 && action === 'install') console.log('\nReady. Open 02-start.cmd next.');
if (result.status === 0 && action === 'build') console.log('\nBuild passed. Follow START-HERE.html to deploy the frontend SOURCE to Vercel.');
process.exit(result.status ?? 1);
