const { spawn } = require('child_process');
const fs = require('fs');

const logStream = fs.createWriteStream('/home/z/my-project/dev.log', { flags: 'w' });

const child = spawn('node', ['node_modules/.bin/next', 'dev', '-p', '3000', '--webpack'], {
  cwd: '/home/z/my-project',
  env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=768' },
  stdio: ['ignore', logStream, logStream]
});

child.on('exit', (code, signal) => {
  fs.appendFileSync('/home/z/my-project/dev.log', `\nProcess exited with code ${code}, signal ${signal}\nRestarting in 5s...\n`);
  setTimeout(() => {
    spawn('node', ['/home/z/my-project/server-wrapper.js'], {
      detached: true,
      stdio: 'ignore'
    }).unref();
  }, 5000);
});

process.on('SIGTERM', () => { child.kill(); process.exit(0); });
process.on('SIGINT', () => { child.kill(); process.exit(0); });

// Keep alive
setInterval(() => {}, 60000);
