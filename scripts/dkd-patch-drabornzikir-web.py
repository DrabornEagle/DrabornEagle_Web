from pathlib import Path
import json
import re

root = Path('DraBornZikir')
path = root / 'index.html'
html = path.read_text(encoding='utf-8')

html = re.sub(r'<meta\s+name=["\']theme-color["\'][^>]*>', '', html, flags=re.I)
html = re.sub(r'<meta\s+name=["\']viewport["\'][^>]*>', '', html, flags=re.I)
html = re.sub(r'<link\s+rel=["\']manifest["\'][^>]*>', '', html, flags=re.I)

head = r'''
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<meta name="theme-color" content="transparent">
<meta name="color-scheme" content="dark">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="msapplication-navbutton-color" content="transparent">
<link rel="manifest" href="/DraBornZikir/manifest.webmanifest">
<style>
:root{color-scheme:dark;background:#071827}html,body,#root{min-height:100%;margin:0;background:#071827}html,body{overscroll-behavior:none}body{padding:0 env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)}
#dkd-web-loader{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;overflow:hidden;background:radial-gradient(circle at 12% 18%,rgba(117,86,255,.42),transparent 31%),radial-gradient(circle at 86% 22%,rgba(0,224,196,.30),transparent 30%),radial-gradient(circle at 50% 86%,rgba(255,117,163,.22),transparent 34%),linear-gradient(145deg,#06131f 0%,#0a1830 44%,#071827 100%);transition:opacity .58s ease,visibility .58s ease}
#dkd-web-loader.dkd-hide{opacity:0;visibility:hidden;pointer-events:none}
#dkd-web-loader:before,#dkd-web-loader:after{content:"";position:absolute;border-radius:999px;filter:blur(1px);animation:dkdAura 4.8s ease-in-out infinite alternate}
#dkd-web-loader:before{width:430px;height:430px;background:conic-gradient(from 35deg,rgba(92,220,199,.17),rgba(142,92,255,.19),rgba(245,197,131,.14),rgba(92,220,199,.17));box-shadow:0 0 110px rgba(92,220,199,.12)}
#dkd-web-loader:after{width:620px;height:620px;border:1px solid rgba(255,255,255,.05);box-shadow:inset 0 0 80px rgba(154,104,255,.08);animation-delay:-2s}
.dkd-load-card{position:relative;width:min(88vw,390px);display:flex;flex-direction:column;align-items:center;text-align:center;animation:dkdEnter .85s cubic-bezier(.16,1,.3,1)}
.dkd-orbit-wrap{position:relative;width:240px;height:240px;display:grid;place-items:center}.dkd-orbit{position:absolute;border-radius:50%;border:1px solid transparent}
.dkd-orbit.a{inset:6px;border-top-color:#5cdcc7;border-right-color:rgba(181,157,255,.55);box-shadow:0 0 28px rgba(92,220,199,.24);animation:dkdSpin 4.2s linear infinite}.dkd-orbit.b{inset:27px;border-left-color:#f5c583;border-bottom-color:rgba(247,169,184,.55);animation:dkdSpinBack 5.8s linear infinite}.dkd-orbit.c{inset:49px;border-top-color:rgba(129,206,255,.65);border-bottom-color:rgba(181,157,255,.45);animation:dkdSpin 8.4s linear infinite}
.dkd-dot{position:absolute;width:9px;height:9px;border-radius:50%;box-shadow:0 0 18px currentColor}.dkd-dot.d1{top:8px;left:50%;color:#5cdcc7;background:#5cdcc7}.dkd-dot.d2{right:24px;bottom:42px;color:#f5c583;background:#f5c583}.dkd-dot.d3{left:26px;top:58px;color:#b59dff;background:#b59dff}
.dkd-core{width:140px;height:140px;border-radius:44px;display:grid;place-items:center;position:relative;background:linear-gradient(145deg,rgba(32,77,91,.95),rgba(17,31,56,.98));border:1px solid rgba(255,255,255,.16);box-shadow:0 24px 70px rgba(0,0,0,.5),0 0 42px rgba(92,220,199,.14);animation:dkdPulse 2s ease-in-out infinite}
.dkd-crescent{font-size:88px;line-height:1;color:#f8dca7;text-shadow:0 0 28px rgba(245,197,131,.55);transform:translateY(-4px)}.dkd-beads{position:absolute;bottom:24px;display:flex;gap:4px;transform:rotate(8deg)}.dkd-beads i{width:7px;height:7px;border-radius:50%;background:linear-gradient(145deg,#82f5de,#49b5ff);box-shadow:0 0 11px rgba(92,220,199,.55)}
.dkd-kicker{margin-top:17px;font-size:10px;font-weight:900;letter-spacing:3.4px;background:linear-gradient(90deg,#5cdcc7,#81ceff,#b59dff,#f5c583);-webkit-background-clip:text;background-clip:text;color:transparent}.dkd-load-card h1{margin:9px 0 0;font:900 36px/1 system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:-1.5px;color:#fff;text-shadow:0 10px 40px rgba(0,0,0,.35)}.dkd-load-card p{margin:10px 0 0;color:#a9c3cf;font:600 14px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif}
.dkd-loading-track{width:190px;height:5px;border-radius:999px;margin-top:30px;background:rgba(255,255,255,.09);overflow:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,.04)}.dkd-loading-bar{display:block;width:52%;height:100%;border-radius:inherit;background:linear-gradient(90deg,transparent,#5cdcc7,#81ceff,#b59dff,#f5c583,transparent);filter:drop-shadow(0 0 6px rgba(92,220,199,.75));animation:dkdLoad 1.15s ease-in-out infinite}.dkd-loading-text{margin-top:12px;color:#7599a7;font:800 10px/1.2 system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:1.15px;text-transform:uppercase}.dkd-version{position:absolute;bottom:max(26px,env(safe-area-inset-bottom));left:0;right:0;text-align:center;color:#6f8998;font:800 10px/1 system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:1.8px}.dkd-version b{color:#8fe8d7}
@keyframes dkdEnter{0%{opacity:0;transform:translateY(24px) scale(.86)}100%{opacity:1;transform:none}}@keyframes dkdSpin{to{transform:rotate(360deg)}}@keyframes dkdSpinBack{to{transform:rotate(-360deg)}}@keyframes dkdPulse{50%{transform:scale(1.045);box-shadow:0 28px 78px rgba(0,0,0,.52),0 0 52px rgba(181,157,255,.18)}}@keyframes dkdAura{to{transform:scale(1.12) rotate(16deg);opacity:.72}}@keyframes dkdLoad{0%{transform:translateX(-130%)}100%{transform:translateX(300%)}}
</style>
'''
html = html.replace('</head>', head + '</head>', 1)

beads = ''.join('<i></i>' for _ in range(11))
body_loader = f'''
<div id="dkd-web-loader" aria-hidden="true">
  <div class="dkd-load-card">
    <div class="dkd-orbit-wrap">
      <div class="dkd-orbit a"><span class="dkd-dot d1"></span></div>
      <div class="dkd-orbit b"><span class="dkd-dot d2"></span></div>
      <div class="dkd-orbit c"><span class="dkd-dot d3"></span></div>
      <div class="dkd-core"><div class="dkd-crescent">☾</div><div class="dkd-beads">{beads}</div></div>
    </div>
    <div class="dkd-kicker">DRABORN EAGLE</div>
    <h1>DraBornZikir</h1>
    <p>Zikir ile huzura, renklerle dinginliğe...</p>
    <div class="dkd-loading-track"><span class="dkd-loading-bar"></span></div>
    <div class="dkd-loading-text">Deneyim hazırlanıyor</div>
  </div>
  <div class="dkd-version">SÜRÜM <b>v0.3</b> • WEB</div>
</div>
<script>
(function(){{
  var loader=document.getElementById('dkd-web-loader');
  function closeLoader(){{
    if(!loader)return;
    loader.classList.add('dkd-hide');
    setTimeout(function(){{loader.remove();}},650);
  }}
  if(document.readyState==='complete'){{setTimeout(closeLoader,2850);}}
  else{{window.addEventListener('load',function(){{setTimeout(closeLoader,2850);}},{'{'}once:true{'}'});}}
  setTimeout(closeLoader,5200);
}})();
</script>
'''
html = re.sub(r'(<body[^>]*>)', lambda m: m.group(1) + body_loader, html, count=1, flags=re.I)
path.write_text(html, encoding='utf-8')

manifest = {
    'name': 'DraBornZikir',
    'short_name': 'DraBornZikir',
    'start_url': '/DraBornZikir/',
    'scope': '/DraBornZikir/',
    'display': 'standalone',
    'display_override': ['fullscreen', 'standalone', 'minimal-ui'],
    'background_color': '#071827',
    'theme_color': 'transparent',
    'orientation': 'portrait',
    'icons': [
        {'src': '/DraBornZikir/favicon.png', 'sizes': 'any', 'type': 'image/png', 'purpose': 'any maskable'}
    ],
}
(root / 'manifest.webmanifest').write_text(json.dumps(manifest, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print('DraBornZikir immersive web loader and browser chrome metadata patched.')
