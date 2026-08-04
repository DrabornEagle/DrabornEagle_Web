const DKD_V321_COMPAT_VERSION = '3.2.11';

await import(`./v3.2.4.data.js?v=${DKD_V321_COMPAT_VERSION}`);
await import(`./v3.2.4.auth.js?v=${DKD_V321_COMPAT_VERSION}`);

if (!window.dkdV31Data?.refreshLock) {
  throw new Error('DraBornGate v3.2.11 kilitli oturum katmanı başlatılamadı.');
}
