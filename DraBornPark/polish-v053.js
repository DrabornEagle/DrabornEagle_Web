/* DraBornPark v0.5.3 — safe additive camera/card polish hotfix. */
(function(){
  const rawTag=(new URLSearchParams(location.search).get('tag')||'').trim();
  const CONTACT_URL='https://xpdiwyxnnrmyvpcqwuyb.supabase.co/functions/v1/drabornpark-public-contact';
  let avatarRequestStarted=false;
  let observer=null;

  function syncEvidenceText(){
    const button=document.getElementById('dbp53-camera-open');
    const preview=document.getElementById('dbp53-evidence-preview');
    if(button){
      const span=button.querySelector('span');
      if(span){
        const desired=preview&&!preview.hidden?'YENİDEN ÇEK':'Fotoğraf ÇEK';
        if(span.textContent!==desired)span.textContent=desired;
      }
    }
    const capture=document.querySelector('#dbp53-capture span');
    if(capture&&capture.textContent!=='Fotoğraf ÇEK')capture.textContent='Fotoğraf ÇEK';
  }

  function installAvatar(url){
    const holder=document.querySelector('.dbp47-vehicle .dbp47-car');
    if(!holder||holder.querySelector('.dbp47-owner-avatar'))return;
    const dot=holder.querySelector(':scope > span:last-child');
    const img=document.createElement('img');
    img.className='dbp47-owner-avatar';
    img.alt='Araç sahibinin profil fotoğrafı';
    img.loading='eager';
    img.referrerPolicy='no-referrer';
    img.addEventListener('load',()=>{
      holder.querySelectorAll('.dbp48-raster,.dbp49-car-raster').forEach(node=>node.remove());
      if(!img.isConnected){if(dot)holder.insertBefore(img,dot);else holder.prepend(img);}
    },{once:true});
    img.addEventListener('error',()=>img.remove(),{once:true});
    img.src=url;
    if(dot)holder.insertBefore(img,dot);else holder.prepend(img);
  }

  async function loadAvatarAfterRender(){
    if(avatarRequestStarted||!rawTag||!document.querySelector('.dbp47-vehicle'))return;
    avatarRequestStarted=true;
    try{
      const response=await fetch(CONTACT_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'lookup',tagCode:rawTag})});
      if(!response.ok)return;
      const data=await response.json();
      const url=String(data?.snapshot?.ownerAvatarUrl||'').trim();
      if(/^https:\/\//i.test(url))installAvatar(url);
    }catch{}
  }

  function sync(){
    syncEvidenceText();
    loadAvatarAfterRender();
    if(document.querySelector('.dbp47-vehicle')&&document.getElementById('dbp53-evidence')){
      if(observer){observer.disconnect();observer=null;}
    }
  }

  function start(){
    sync();
    if(!observer){observer=new MutationObserver(sync);observer.observe(document.body||document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});}
    setTimeout(sync,250);
    setTimeout(sync,900);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
