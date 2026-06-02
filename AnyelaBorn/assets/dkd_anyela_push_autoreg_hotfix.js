(function(){
'use strict';
function dkdAutoRegister(){
  try{
    if(!('Notification' in window)){return;}
    if(window.Notification.permission!=='granted'){return;}
    var dkdButton=document.getElementById('dkd_anyela_push_button');
    var dkdStatus=document.getElementById('dkd_anyela_push_status');
    if(!dkdButton){window.setTimeout(dkdAutoRegister,700);return;}
    if(dkdStatus&&/veritabanına kaydedildi|cihaz veritabanına/i.test(dkdStatus.textContent||'')){return;}
    dkdButton.click();
  }catch(dkdError){}
}
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',function(){window.setTimeout(dkdAutoRegister,1400);});
}else{
  window.setTimeout(dkdAutoRegister,1400);
}
})();
