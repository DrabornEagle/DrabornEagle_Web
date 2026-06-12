import 'dotenv/config';
import express from 'express';
import { spawn } from 'child_process';

const dkdPort = Number(process.env.DKD_WORKER_CONTROL_PORT || 8788);
const dkdKey = process.env.DKD_ADMIN_PANEL_KEY || '';
const dkdApp = express();
const dkdWorkerFile = 'src/dkd_campaign_worker_v0_28.js';
const dkdVersion = 'v0.29';
let dkdProc = null;
let dkdStartedAt = null;
let dkdStoppedAt = null;
let dkdLastExit = null;
const dkdLogs = [];

function dkdLogLine(dkdLine) {
  const dkdText = String(dkdLine || '').trim();
  if (!dkdText) return;
  dkdLogs.unshift({ dkd_time: new Date().toISOString(), dkd_line: dkdText.slice(0, 1200) });
  while (dkdLogs.length > 30) dkdLogs.pop();
}

function dkdAuth(req, res, next) {
  if (!dkdKey || req.headers['x-dkd-admin-key'] !== dkdKey) return res.status(401).json({ dkd_error: 'unauthorized' });
  next();
}

function dkdState() {
  return { dkd_running: Boolean(dkdProc && !dkdProc.killed), dkd_pid: dkdProc?.pid || null, dkd_started_at: dkdStartedAt, dkd_stopped_at: dkdStoppedAt, dkd_last_exit: dkdLastExit, dkd_worker_file: dkdWorkerFile, dkd_worker_version: dkdVersion, dkd_logs: dkdLogs };
}

dkdApp.use(express.json({ limit: '64kb' }));
dkdApp.use((req, res, next) => { res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS'); res.setHeader('Access-Control-Allow-Headers', 'content-type,x-dkd-admin-key'); if (req.method === 'OPTIONS') return res.status(204).end(); next(); });
dkdApp.get('/api/dkd-worker-status', dkdAuth, (req, res) => res.json({ dkd_ok: true, dkd_state: dkdState() }));
dkdApp.post('/api/dkd-worker-start', dkdAuth, (req, res) => {
  if (dkdProc && !dkdProc.killed) return res.json({ dkd_ok: true, dkd_already_running: true, dkd_state: dkdState() });
  dkdLogs.length = 0;
  dkdStartedAt = new Date().toISOString();
  dkdStoppedAt = null;
  dkdLastExit = null;
  dkdProc = spawn(process.execPath, [dkdWorkerFile], { cwd: process.cwd(), env: process.env, stdio: ['ignore', 'pipe', 'pipe'] });
  dkdLogLine(`worker_started version=${dkdVersion} file=${dkdWorkerFile} pid=${dkdProc.pid}`);
  dkdProc.stdout.on('data', (dkdChunk) => dkdLogLine(dkdChunk.toString()));
  dkdProc.stderr.on('data', (dkdChunk) => dkdLogLine(`ERR ${dkdChunk.toString()}`));
  dkdProc.on('exit', (dkdCode, dkdSignal) => { dkdStoppedAt = new Date().toISOString(); dkdLastExit = { dkd_code: dkdCode, dkd_signal: dkdSignal, dkd_time: dkdStoppedAt }; dkdLogLine(`worker_exited code=${dkdCode} signal=${dkdSignal || ''}`); dkdProc = null; });
  res.json({ dkd_ok: true, dkd_started: true, dkd_state: dkdState() });
});
dkdApp.post('/api/dkd-worker-stop', dkdAuth, (req, res) => { if (!dkdProc || dkdProc.killed) return res.json({ dkd_ok: true, dkd_already_stopped: true, dkd_state: dkdState() }); const dkdPid = dkdProc.pid; dkdProc.kill('SIGTERM'); dkdLogLine(`worker_stop_requested pid=${dkdPid}`); res.json({ dkd_ok: true, dkd_stopping: true, dkd_state: dkdState() }); });
dkdApp.listen(dkdPort, '0.0.0.0', () => console.log(JSON.stringify({ dkd_message: 'dkd_worker_control_started', dkd_port: dkdPort, dkd_version: dkdVersion })));
