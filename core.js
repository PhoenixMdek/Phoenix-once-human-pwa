(function(root){
  const Builds=root.PhoenixBuilds||(typeof module!=='undefined'?require('./builds.js'):null);
  const categories = ['Armas','Builds','Deviations','Silos/Monolitos','Escenarios','Comida','Mods/Calibraciones','Armaduras','Recursos'];
  const normalize = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  function validateCatalog(data){
    if(!data || data.schemaVersion!==1 || typeof data.catalogVersion!=='string' || !date(data.updatedAt) || !Array.isArray(data.entries) || !data.entries.length || data.entries.length>5000) throw Error('Catálogo incompatible: se requiere schemaVersion 1, versión, fecha y entre 1 y 5000 fichas.');
    const ids=new Set();
    for(const e of data.entries){
      if(!e || !/^[a-z0-9][a-z0-9-]{0,79}$/.test(e.id) || ids.has(e.id)) throw Error('Identificador inválido o duplicado.');
      ids.add(e.id);
      if(!categories.includes(e.category) || !['name','subtitle','summary','status'].every(k=>typeof e[k]==='string' && e[k].length>0 && e[k].length<=10000)) throw Error('Ficha incompleta o categoría desconocida.');
      for(const k of ['tags','details','related']) if(!Array.isArray(e[k]) || !e[k].every(v=>typeof v==='string'&&v.length<=10000)) throw Error('Listas inválidas en '+e.id);
      if(e.equipment!==undefined && (!Array.isArray(e.equipment)||!e.equipment.every(v=>typeof v==='string'&&v.length<=200))) throw Error('Equipo inválido.');
      if(!Array.isArray(e.sources)||!e.sources.every(s=>s && typeof s.label==='string' && typeof s.url==='string' && /^https:\/\//i.test(s.url) && safeURL(s.url))) throw Error('Fuente inválida: usa enlaces HTTPS.');
      if(e.category==='Builds' && (!date(e.updatedAt)||typeof e.gameVersion!=='string')) throw Error('Las builds requieren updatedAt y gameVersion.');
      if(e.personalBuild)Builds.validate(e,data.entries);
      if(e.world&&(!['Escenarios','Silos/Monolitos'].includes(e.category)||!Array.isArray(e.world.scenarios)||!e.world.scenarios.length||!e.world.scenarios.every(id=>typeof id==='string')||typeof e.world.type!=='string'||!date(e.world.reviewedAt)||!Number.isInteger(e.world.contentVersion)))throw Error('Datos de escenario inválidos.');
      if(e.wiki && (!Number.isInteger(e.wiki.pageId)||!Number.isInteger(e.wiki.revisionId)||typeof e.wiki.revisedAt!=='string'||!date(e.wiki.revisedAt.slice(0,10))||typeof e.wiki.fetchedAt!=='string'||!date(e.wiki.fetchedAt.slice(0,10))))throw Error('Procedencia de wiki inválida.');
      if(e.image){
        if(!['sourceURL','filePage','caption','fileTitle'].every(k=>typeof e.image[k]==='string'&&e.image[k].length>0&&e.image[k].length<=4096)||!safeURL(e.image.sourceURL)||!safeURL(e.image.filePage))throw Error('Imagen de ficha inválida.');
        const source=new URL(e.image.sourceURL),page=new URL(e.image.filePage),wiki=source.hostname==='static.wikia.nocookie.net'&&source.pathname.startsWith('/once-human/images/')&&page.hostname==='once-human.fandom.com',official=source.hostname==='r.res.easebar.com'&&source.pathname.startsWith('/pic/')&&page.hostname==='www.oncehuman.game';if(source.port||page.port||!(wiki||official))throw Error('Fuente de imagen no admitida.');
      }
    }
    for(const e of data.entries){if(e.related.some(id=>!ids.has(id))) throw Error('Enlace interno inexistente en '+e.id);if(e.world?.scenarios.some(id=>!data.entries.some(s=>s.id===id&&s.category==='Escenarios')))throw Error('Escenario inexistente en '+e.id);}
    return data;
  }
  function date(s){return typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&!isNaN(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s;}
  function safeURL(s){try{const u=new URL(s);return u.protocol==='https:'&&!u.username&&!u.password;}catch{return false;}}
  function search(entries,query){const words=normalize(query).split(' ').filter(Boolean);return entries.filter(e=>{const hay=normalize([e.name,e.subtitle,e.summary,e.category,...e.tags,...e.details,...(root.PhoenixNames?.terms(e)||[])].join(' '));return words.every(w=>hay.includes(w));});}
  function validateProgress(p){
    if(!p||typeof p!=='object'||Array.isArray(p))throw Error('Progreso inválido.');
    const result={favorites:{},done:{},notes:{},equipment:{}};
    for(const key of Object.keys(result)){
      if(!p[key]||typeof p[key]!=='object'||Array.isArray(p[key]))throw Error('Falta el campo '+key);
      for(const [id,value] of Object.entries(p[key])){
        if(!/^[a-z0-9][a-z0-9-]*(?::\d+)?$/.test(id))throw Error('Clave de progreso inválida.');
        if(key==='notes'?(typeof value!=='string'||value.length>20000):typeof value!=='boolean')throw Error('Valor de progreso inválido.');
        result[key][id]=value;
      }
    }return result;
  }
  const categoryLabel=category=>category==='Deviations'?'Desviaciones':category==='Checklist'?'Mi colección':category;
  root.PhoenixCore={categories,categoryLabel,normalize,validateCatalog,search,validateProgress};
  if(typeof module!=='undefined')module.exports=root.PhoenixCore;
})(globalThis);
