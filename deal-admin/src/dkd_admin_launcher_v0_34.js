console.log(JSON.stringify({ dkd_version: 'v0.34' }));
await Promise.all([
  import('./dkd_server_v0_34.js'),
  import('./dkd_drabornbee_control_server_v0_34.js'),
  import('./dkd_click_server_v0_34.js')
]);
