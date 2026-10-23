/* Amplía comida/recursos y enlaces de imagen sin reemplazar las otras secciones ni el progreso. */
(function(root){function upgrade(catalog,seed){
 const supplies=(catalog.supplyContentVersion||0)<(seed.supplyContentVersion||0),images=(catalog.remoteImageVersion||0)<(seed.remoteImageVersion||0);if(!supplies&&!images)return catalog;
 const map=new Map(catalog.entries.map(e=>[e.id,e]));
 if(supplies)for(const e of seed.entries.filter(e=>e.supply)){const old=map.get(e.id);if(old?.supply?.reviewedAt>e.supply.reviewedAt)continue;map.set(e.id,{...e,related:[...new Set([...(old?.related||[]),...e.related])]});}
 if(images)for(const e of seed.entries.filter(e=>e.image&&(e.world||e.supply||e.id==='resources'))){const old=map.get(e.id);if(old)map.set(e.id,{...old,image:e.image});}
 const ids=new Set(map.keys());return {...catalog,catalogVersion:catalog.catalogVersion+'+suministros-v1',updatedAt:catalog.updatedAt>seed.updatedAt?catalog.updatedAt:seed.updatedAt,supplyContentVersion:seed.supplyContentVersion,remoteImageVersion:seed.remoteImageVersion,entries:[...map.values()].map(e=>({...e,related:e.related.filter(id=>ids.has(id))}))};
}root.PhoenixSupply={upgrade};if(typeof module!=='undefined')module.exports=root.PhoenixSupply;})(globalThis);
