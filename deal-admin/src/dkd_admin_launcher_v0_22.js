import { spawn } from 'child_process';

const dkdChildren = [];

function dkdStart(dkdName, dkdArgs) {
  const dkdChild = spawn(process.execPath, dkdArgs, {
    cwd: process.cwd(),
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  dkdChildren.push(dkdChild);
  dkdChild.stdout.on('data', (dkdChunk) => process.stdout.write(`[${dkdName}] ${dkdChunk}`));
  dkdChild.stderr.on('data', (dkdChunk) => process.stderr.write(`[${dkdName} ERR] ${dkdChunk}`));
  dkdChild.on('exit', (dkdCode, dkdSignal) => {
    console.log(JSON.stringify({ dkd_message: 'dkd_child_exited', dkd_name: dkdName, dkd_code: dkdCode, dkd_signal: dkdSignal }));
  });
  return dkdChild;
}

console.log(JSON.stringify({ dkd_message: 'dkd_admin_launcher_started', dkd_version: 'v0.23' }));
dkdStart('admin', ['src/dkd_server_v0_23.js']);
dkdStart('worker-control', ['src/dkd_worker_control_server_v0_22.js']);

function dkdShutdown() {
  for (const dkdChild of dkdChildren) {
    try { dkdChild.kill('SIGTERM'); } catch {}
  }
  setTimeout(() => process.exit(0), 400);
}

process.on('SIGINT', dkdShutdown);
process.on('SIGTERM', dkdShutdown);
