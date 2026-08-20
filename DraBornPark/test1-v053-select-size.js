/* DraBornPark web v0.5.3 — NFC/QR seçim ipucunu tüm ekranlarda sabit 12.5 px yapar. */
(function(){
  const raw=new URLSearchParams(location.search).get('tag')||'';
  const clean=raw.toUpperCase().replace(/^DP-/,'').replace(/[^A-Z0-9]/g,'');
  if(!clean)return;
  const style=document.createElement('style');
  style.id='dbp53-select-size';
  style.textContent='.dbp47-select-hint{font-size:12.5px!important}';
  document.head.appendChild(style);
})();
