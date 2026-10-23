(()=>{
  'use strict';
  if(location.protocol==='file:'||!('serviceWorker'in navigator)||!window.isSecureContext)return;
  const button=document.getElementById('install-app');let installPrompt=null,reloaded=false;
  function activateUpdate(registration){registration.waiting?.postMessage('PHOENIX_ACTIVATE_UPDATE');}
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(reloaded)return;reloaded=true;location.reload();});
  navigator.serviceWorker.register('./service-worker.js',{updateViaCache:'none'}).then(registration=>{
    activateUpdate(registration);
    registration.addEventListener('updatefound',()=>{
      const worker=registration.installing;if(!worker)return;
      worker.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)activateUpdate(registration);});
    });
    window.addEventListener('pageshow',()=>registration.update().catch(()=>{}));
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)registration.update().catch(()=>{});});
  }).catch(()=>{});
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;if(button)button.hidden=false;});
  button?.addEventListener('click',async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;button.hidden=true;});
  window.addEventListener('appinstalled',()=>{if(button)button.hidden=true;});
})();
