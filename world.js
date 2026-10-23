/* Catálogo editorial de mundos: actualización local y pertenencia explícita a escenarios. */
(function(root){
 function upgrade(catalog,seed){
  if((catalog.worldContentVersion||0)>=(seed.worldContentVersion||1))return catalog;
  const map=new Map(catalog.entries.map(e=>[e.id,e]));
  for(const e of seed.entries.filter(e=>e.world)){
   const old=map.get(e.id);if(old?.world?.reviewedAt>e.world.reviewedAt)continue;
   map.set(e.id,{...e,related:[...new Set([...(old?.related||[]),...e.related])]});
  }
  const ids=new Set(map.keys());return {...catalog,catalogVersion:catalog.catalogVersion+'+mundos-v1',updatedAt:catalog.updatedAt>seed.updatedAt?catalog.updatedAt:seed.updatedAt,worldContentVersion:seed.worldContentVersion||1,entries:[...map.values()].map(e=>({...e,related:e.related.filter(id=>ids.has(id))}))};
 }
 function matches(entry,scenario){return !!entry.world?.scenarios.includes(scenario);}
 root.PhoenixWorld={upgrade,matches};if(typeof module!=='undefined')module.exports=root.PhoenixWorld;
})(globalThis);
