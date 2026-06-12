import 'dotenv/config';
import express from 'express';
import { spawn } from 'child_process';

const dkdControlPort = Number(process.env.DKD_WORKER_CONTROL_PORT || 8788);
const dkdAdminPanelKey = process.env.DKD_ADMIN_PANEL_KEY || '';
const dkdApp = express();
let dkdWorkerProcess = null;
let dkdWorkerStartedAt = null;
let dkdWorkerStoppedAt = null;
let dkdWorkerLastExit = null;
const dkdWorkerLogs = [];
const dkdWorkerFile = 'src/dkd_gateway_worker_v0_21.js';
const dkdVisibleVersion = 'v0.23';

function dkdPushLog(dkdLine) {
  const dkdText = String(dkdLine || '').trim();
  if (!dkdText) return;
  dkdWorkerLogs.unshift({ dkd_time: new Date().toISOString(), dkd_line: dkdText.slice(0, 1200) });
  while (dkdWorkerLogs.length > 30) dkdWorkerLogs.pop();
}

function dkdRequireAdmin(req, res, next) {
  const dkdGivenKey = req.headers['x-dkd-admin-key'];
  if (!dkdAdminPanelKey || dkdGivenKey !== dkdAdminPanelKey) return res.status(401).json({ dkd_error: 'unauthorized' });
  next();
}

function dkdState() {
  return {
    dkd_running: Boolean(dkdWorkerProcess && !dkdWorkerProcess.killed),
    dkd_pid: dkdWorkerProcess?.pid || null,
    dkd_started_at: dkdWorkerStartedAt,
    dkd_stopped_at: dkdWorkerStoppedAt,
    dkd_last_exit: dkdWorkerLastExit,
    dkd_worker_file: dkdWorkerFile,
    dkd_worker_version: dkdVisibleVersion,
    dkd_logs: dkdWorkerLogs
  };
}

dkdApp.use(express.json({ limit: '64kb' }));
dkdApp.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'content-type,x-dkd-admin-key');
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
});

dkdApp.get('/api/dkd-worker-status', dkdRequireAdmin, (req, res) => {
  res.json({ dkd_ok: true, dkd_state: dkdState() });
});

dkdApp.post('/api/dkd-worker-start', dkdRequireAdmin, (req, res) => {
  if (dkdWorkerProcess && !dkdWorkerProcess.killed) {
    return res.json({ dkd_ok: true, dkd_already_running: true, dkd_state: dkdState() });
  }

  dkdWorkerLogs.length = 0;
  dkdWorkerStartedAt = new Date().toISOString();
  dkdWorkerStoppedAt = null;
  dkdWorkerLastExit = null;
  dkdWorkerProcess = spawn(process.execPath, [dkdWorkerFile], {
    cwd: process.cwd(),
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  dkdPushLog(`worker_started version=${dkdVisibleVersion} pid=${dkdWorkerProcess.pid}`);
  dkdWorkerProcess.stdout.on('data', (dkdChunk) => dkdPushLog(dkdChunk.toString()));
  dkdWorkerProcess.stderr.on('data', (dkdChunk) => dkdPushLog(`ERR ${dkdChunk.toString()}`));
  dkdWorkerProcess.on('exit', (dkdCode, dkdSignal) => {
    dkdWorkerStoppedAt = new Date().toISOString();
    dkdWorkerLastExit = { dkd_code: dkdCode, dkd_signal: dkdSignal, dkd_time: dkdWorkerStoppedAt };
    dkdPushLog(`worker_exited code=${dkdCode} signal=${dkdSignal || ''}`);
    dkdWorkerProcess = null;
  });

  res.json({ dkd_ok: true, dkd_started: true, dkd_state: dkdState() });
});

dkdApp.post('/api/dkd-worker-stop', dkdRequireAdmin, (req, res) => {
  if (!dkdWorkerProcess || dkdWorkerProcess.killed) {
    return res.json({ dkd_ok: true, dkd_already_stopped: true, dkd_state: dkdState() });
  }
  const dkdPid = dkdWorkerProcess.pid;
  dkdWorkerProcess.kill('SIGTERM');
  dkdPushLog(`worker_stop_requested pid=${dkdPid}`);
  res.json({ dkd_ok: true, dkd_stopping: true, dkd_state: dkdState() });
});

dkdApp.listen(dkdControlPort, '0.0.0.0', () => {
  console.log(JSON.stringify({ dkd_message: 'dkd_worker_control_started', dkd_port: dkdControlPort, dkd_version: dkdVisibleVersion }));
});
