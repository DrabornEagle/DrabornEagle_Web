(() => {
  'use strict';
  const modules = [{"name":"dkd_core.js","chunks":["core_00.txt","core_01.txt","core_02.txt"]},{"name":"dkd_customer.js","chunks":["customer_00.txt","customer_01.txt"]},{"name":"dkd_staff.js","chunks":["staff_00.txt","staff_01.txt","staff_02.txt"]},{"name":"dkd_garage.js","chunks":["garage_00.txt"]}];
  async function inflate(encoded) {
    const bytes = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
    if (!('DecompressionStream' in window)) throw new Error('Tarayıcınız DraBornGarage web paketini açmak için çok eski.');
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    return new Response(stream).text();
  }
  (async () => {
    for (const module of modules) {
      let encoded = '';
      for (const chunk of module.chunks) {
        const response = await fetch(`/DraBornGarage/assets/chunks/${chunk}`, {cache:'force-cache'});
        if (!response.ok) throw new Error(`${module.name} paketi yüklenemedi.`);
        encoded += (await response.text()).trim();
      }
      const source = await inflate(encoded);
      (0, eval)(`${source}\n//# sourceURL=/DraBornGarage/assets/${module.name}`);
    }
  })().catch(error => {
    console.error(error);
    const app = document.getElementById('dkd-app');
    if (app) app.innerHTML = `<div class="dkd-section"><div class="dkd-empty"><div class="ico">⚠</div><h1>Web paketi açılamadı</h1><p>${String(error.message || error)}</p><button class="dkd-btn" onclick="location.reload()">Tekrar Dene</button></div></div>`;
  });
})();
