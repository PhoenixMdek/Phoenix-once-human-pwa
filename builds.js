/* Builds personales: piezas por ranura, validación y conservación al actualizar el catálogo. */
(function(root){
 const ModOptions=root.PhoenixModOptions||(typeof module!=='undefined'?require('./mod-options.js'):null);
 const slots=[['weapon','Arma principal'],['helmet','Cabeza'],['mask','Máscara'],['top','Torso'],['gloves','Guantes'],['bottoms','Pantalones'],['shoes','Calzado']];
 const armor={helmet:['Casco'],mask:['Máscara'],top:['Torso'],gloves:['Guantes'],bottoms:['Pantalones'],shoes:['Calzado','Botas']};
 function accepts(entry,slot){if(slot==='weapon')return entry.category==='Armas';return entry.category==='Armaduras'&&entry.wiki?.kind==='piece'&&(armor[slot]||[]).some(label=>entry.wiki.fields?.includes('Ranura: '+label));}
 function candidates(entries,slot,owned,progress){return entries.filter(e=>accepts(e,slot)&&(!owned||!!progress.done[e.id]));}
 function validate(entry,entries){const p=entry.personalBuild;if(!p||p.schemaVersion!==1||!entry.id.startsWith('personal-build-')||entry.category!=='Builds'||typeof p.slots!=='object'||p.slots===null||Array.isArray(p.slots))throw Error('Build personal incompatible.');
 for(const [key,id]of Object.entries(p.slots)){if(!slots.some(([s])=>s===key)||typeof id!=='string'||(id&&!/^[a-z0-9][a-z0-9-]{0,79}$/.test(id)))throw Error('Ranura de build inválida.');const target=entries.find(e=>e.id===id);if(target&&!accepts(target,key))throw Error('La pieza no corresponde a la ranura '+key+'.');}ModOptions.validate(p.mods,p.slots,entries);return entry;}
 function preserve(previous,next){const map=new Map(next.entries.map(e=>[e.id,e]));for(const e of previous.entries.filter(e=>e.personalBuild))map.set(e.id,e);const ids=new Set(map.keys());return {...next,entries:[...map.values()].map(e=>({...e,related:e.related.filter(id=>ids.has(id))}))};}
 function create({id,name,description,version,selection,mods={}},entries,date=new Date().toISOString().slice(0,10)){
 const chosen=Object.fromEntries(slots.map(([key])=>[key,selection[key]||'']));const present=[...Object.values(chosen),...Object.values(mods).map(m=>m.id)].filter(Boolean),count=Object.values(chosen).filter(Boolean).length;
 const entry={id,category:'Builds',name:name.trim(),subtitle:'Build personal · '+count+'/7 ranuras elegidas',summary:description.trim()||'Configuración personal de equipo. Puedes completarla y modificarla cuando quieras.',details:['Equipo elegido por ti. Las piezas que no están en tu colección se pueden guardar como objetivo de la build.','Esta vista no calcula daño ni certifica sinergias o compatibilidad de parche.'],tags:['Personal','Mi build'],related:[...new Set(present)].filter(id=>entries.some(e=>e.id===id)),sources:[],status:'Build personal',updatedAt:date,gameVersion:version.trim()||'Versión sin indicar',personalBuild:{schemaVersion:1,slots:chosen,mods:structuredClone(mods),description:description.trim()}};
 return validate(entry,entries);
 }
 root.PhoenixBuilds={slots,accepts,candidates,validate,preserve,create};if(typeof module!=='undefined')module.exports=root.PhoenixBuilds;
})(globalThis);
