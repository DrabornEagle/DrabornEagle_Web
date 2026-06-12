const dkdOriginalLog = console.log.bind(console);
console.log = (...dkdArgs) => {
  const dkdNextArgs = dkdArgs.map((dkdArg) => typeof dkdArg === 'string' ? dkdArg.replace(/"dkd_version":"v0\.30"/g, '"dkd_version":"v0.34"').replace(/worker_started version=v0\.30/g, 'DraBornBee started version=v0.34') : dkdArg);
  dkdOriginalLog(...dkdNextArgs);
};
console.log(JSON.stringify({ dkd_worker_engine: 'DraBornBee', dkd_version: 'v0.34' }));
await import('./dkd_worker_control_server_v0_30.js');
