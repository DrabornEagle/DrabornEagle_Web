/* DraBornPark v0.5.3 — additive camera/card polish. */
(function(){
  const rawTag=(new URLSearchParams(location.search).get('tag')||'').trim();
  const CONTACT_URL='https://xpdiwyxnnrmyvpcqwuyb.supabase.co/functions/v1/drabornpark-public-contact';
  let avatarLoaded=false;
  let avatarUrl='';

  function syncEvidenceText(){
    const button=document.getElementById('dbp53-camera-open');
    if(button&&!document.getElementById('dbp53-evidence-preview')?.hidden){
      const span=button.querySelector('span');
      if(span&&span.textContent!=='YENİDEN ÇEK')span.textContent='YENİDEN ÇEK';
      return;
    }
    if(button){
      const span=button.querySelector('span');
      if(span&&span.textContent!=='Fotoğraf ÇEK')span.textContent='Fotoğraf ÇEK';
    }
    const capture=document.querySelector('#dbp53-capture span');
    if(capture)capture.textContent='Fotoğraf ÇEK';
  }

  function applyAvatar(){
    if(!avatarUrl)return;
    const holder=document.querySelector('.dbp47-vehicle .dbp47-car');
    if(!holder||holder.querySelector('.dbp47-owner-avatar'))return;
    const dot=holder.querySelector(':scope > span:last-child');
    holder.querySelectorAll('.dbp48-raster,.dbp49-car-raster').forEach(node=>node.remove());
    const img=document.createElement('img');
    img.className='dbp47-owner-avatar';
    img.src=avatarUrl;
    img.alt='Araç sahibinin profil fotoğrafı';
    img.loading='eager';
    img.referrerPolicy='no-referrer';
    img.addEventListener('error',()=>{img.remove();holder.insertAdjacentHTML('afterbegin','<span class="dbp48-raster dbp48-i-blocking dbp49-car-raster" aria-hidden="true"></span>');},{once:true});
    if(dot)holder.insertBefore(img,dot);else holder.prepend(img);
  }

  async function loadAvatar(){
    if(avatarLoaded||!rawTag)return;
    avatarLoaded=true;
    try{
      const response=await fetch(CONTACT_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'lookup',tagCode:rawTag})});
      if(!response.ok)return;
      const data=await response.json();
      const url=String(data?.snapshot?.ownerAvatarUrl||'').trim();
      if(!/^https:\/\//i.test(url))return;
      avatarUrl=url;
      applyAvatar();
    }catch{}
  }

  function sync(){syncEvidenceText();applyAvatar();}
  const observer=new MutationObserver(sync);
  observer.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{loadAvatar();sync();});else{loadAvatar();sync();}
})();
