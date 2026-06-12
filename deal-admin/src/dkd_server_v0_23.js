import 'dotenv/config';

const dkdOriginalConsoleLog = console.log.bind(console);
console.log = (...dkdArgs) => {
  const dkdPatchedArgs = dkdArgs.map((dkdArg) => {
    if (typeof dkdArg !== 'string') return dkdArg;
    return dkdArg
      .replace(/"dkd_version":"v0\.17\.1"/g, '"dkd_version":"v0.34"')
      .replace(/"dkd_version":"v0\.23"/g, '"dkd_version":"v0.34"')
      .replace(/"dkd_stats_version":"v0\.17\.1"/g, '"dkd_stats_version":"v0.34"')
      .replace(/"dkd_stats_version":"v0\.23"/g, '"dkd_stats_version":"v0.34"');
  });
  dkdOriginalConsoleLog(...dkdPatchedArgs);
};

await import('./dkd_server_v0_17_1.js');
