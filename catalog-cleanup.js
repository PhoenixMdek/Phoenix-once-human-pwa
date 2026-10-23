/* Retira únicamente restos del prototipo conversacional; nunca fichas wiki ni builds del usuario. */
(function(root){
 const legacy=new Set(['burn','resources']);
 function wikiBacked(e){return !!e.wiki||e.sources?.some(s=>{try{return new URL(s.url).hostname==='once-human.fandom.com';}catch{return false;}});}
 function clean(catalog){
  const entries=catalog.entries.filter(e=>!((legacy.has(e.id)&&!e.personalBuild&&!wikiBacked(e))||(e.id==='mods'&&e.name==='Mods para Quemadura'&&!e.personalBuild&&!e.wiki))),ids=new Set(entries.map(e=>e.id));let changed=entries.length!==catalog.entries.length;
  const result=entries.map(e=>{const related=e.related.filter(id=>ids.has(id)),details=e.details.map(t=>t.startsWith('Nombre usado en la conversación: ')?t.replace('Nombre usado en la conversación: ','Adaptación editorial al castellano: '):t);if(related.length!==e.related.length||details.some((t,i)=>t!==e.details[i])){changed=true;return {...e,related,details};}return e;});
  return changed?{...catalog,entries:result}:catalog;
 }
 root.PhoenixCatalogCleanup={clean,wikiBacked};if(typeof module!=='undefined')module.exports=root.PhoenixCatalogCleanup;
})(globalThis);
