globalThis.PhoenixStorage=(()=>{
  const local=location.protocol==='http:'&&location.hostname==='localhost';
  const browserDatabase=location.protocol==='https:'||location.protocol==='http:'&&!local;
  const mode=local?'sqlite':browserDatabase?'indexeddb':'portable';
  let revision=0,token='',queue=Promise.resolve(),failed=false,pending=0,needsMigration=false,databasePromise;
  const status=document.createElement('div');status.id='save-status';status.setAttribute('role','status');status.style.cssText='position:fixed;bottom:12px;right:16px;z-index:9999;background:#152127;color:#fff;padding:8px 12px;border:1px solid #53646b;border-radius:5px;max-width:420px';
  function openDatabase(){
    if(!databasePromise)databasePromise=new Promise((resolve,reject)=>{
      if(!indexedDB)return reject(Error('Este navegador no permite almacenamiento local.'));
      const request=indexedDB.open('phoenix-guide-device-v1',1);
      request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains('state'))request.result.createObjectStore('state',{keyPath:'key'});};
      request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error||Error('No se pudo abrir el archivo local del dispositivo.'));
    });
    return databasePromise;
  }
  async function readDeviceState(){const db=await openDatabase();return new Promise((resolve,reject)=>{const request=db.transaction('state','readonly').objectStore('state').get('current');request.onsuccess=()=>resolve(request.result?.value||null);request.onerror=()=>reject(request.error||Error('No se pudo leer el archivo local del dispositivo.'));});}
  async function writeDeviceState(state){const db=await openDatabase();return new Promise((resolve,reject)=>{const tx=db.transaction('state','readwrite');tx.objectStore('state').put({key:'current',value:state});tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error||Error('No se pudo guardar en este dispositivo.'));tx.onabort=()=>reject(tx.error||Error('Se canceló el guardado local.'));});}
  const description=mode==='sqlite'?'La instalación de Windows guarda tus datos en SQLite, fuera de la carpeta del código. Exporta una copia JSON para trasladarlos a otro equipo.':mode==='indexeddb'?'Esta versión guarda tus datos en el almacenamiento local de este dispositivo. No se sincronizan con el ordenador. Exporta una copia JSON para conservarlos o trasladarlos.':'La versión portable guarda tus datos en el navegador de este equipo. Exporta una copia JSON para trasladarlos.';
  document.body.append(status);
  async function load(){
    if(browserDatabase){
      status.textContent='Leyendo archivo local de este dispositivo…';
      try{if(navigator.storage?.persist)await navigator.storage.persist();}catch{}
      const stored=await readDeviceState();if(stored){status.textContent='Guardado en este dispositivo';return stored;}
      const legacy=JSON.parse(localStorage.getItem('phoenix-guide-v1')||'null');
      if(legacy)needsMigration=true;
      status.textContent='Guardado en este dispositivo';return legacy;
    }
    if(!local){status.textContent='Guardado en este navegador';return JSON.parse(localStorage.getItem('phoenix-guide-v1')||'null');}
    const response=await fetch('/api/state');if(!response.ok)throw Error('No se puede leer la base local.');
    const data=await response.json();revision=data.revision;token=data.token;
    status.textContent='Datos locales · SQLite';
    if(data.state)return data.state;
    needsMigration=true;
    const legacy=JSON.parse(localStorage.getItem('phoenix-guide-v1')||'null');
    return legacy;
  }
  function save(state){
    if(failed)return false;
    if(browserDatabase){
      const snapshot=JSON.parse(JSON.stringify(state));pending++;status.textContent='Guardando en este dispositivo…';
      queue=queue.then(()=>writeDeviceState(snapshot)).catch(error=>{failed=true;status.textContent='No se pudo guardar: '+error.message+' Exporta una copia desde Datos y copias.';status.style.borderColor='#ff9850';}).finally(()=>{pending--;if(!failed&&pending===0)status.textContent='Guardado en este dispositivo';});
      return true;
    }
    if(!local){try{localStorage.setItem('phoenix-guide-v1',JSON.stringify(state));status.textContent='Guardado en este navegador';return true;}catch{status.textContent='No se pudo guardar en este navegador. Exporta una copia.';return false;}}
    const snapshot=JSON.stringify(state);pending++;status.textContent='Guardando en SQLite…';
    queue=queue.then(async()=>{
      if(failed)return;
      const response=await fetch('/api/state',{method:'PUT',headers:{'Content-Type':'application/json','X-Phoenix-Token':token},body:JSON.stringify({revision,state:JSON.parse(snapshot)})});
      const data=await response.json();if(!response.ok)throw Error(data.error||'No se pudo guardar.');revision=data.revision;
    }).catch(error=>{failed=true;status.textContent='Sin guardar: '+error.message+' Exporta una copia desde Datos y copias.';status.style.borderColor='#ff9850';}).finally(()=>{pending--;if(!failed&&pending===0)status.textContent='Guardado en SQLite';});
    return true;
  }
  window.addEventListener('beforeunload',event=>{if(pending||failed){event.preventDefault();event.returnValue='';}});
  return {load,save,local,mode,description,get needsMigration(){return needsMigration;},flush:()=>queue};
})();
