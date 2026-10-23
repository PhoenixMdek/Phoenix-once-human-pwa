/* Familias/sufijos documentados; no multiplica automáticamente efectos de la ficha base. */
(function(root){
 const wiki='https://once-human.fandom.com/wiki/Mods/suffixes',aero='https://www.oncehuman.game/banner/20260528/41906_1301797.html',overhaul='https://www.oncehuman.game/news/devBlog/20251212/40781_1276354.html',modern='https://www.oncehuman.game/news/update/20260709/40780_1307147.html',community='https://www.oncehumandb.com/items/non-keyword-suffix-mod-selection-crate-legendary-cc2cb89dab64';
 const definitions=[
 ['general','General','General','Familia documentada en una base comunitaria. Efectos concretos pendientes de verificar.',community],
 ['violent','Violento','Violent','Relacionado con daño crítico.',wiki],
 ['precision','Precisión','Precision','Relacionado con daño a puntos débiles.',wiki],
 ['talents','Talentos','Talents','Relacionado con daño elemental.',wiki],
 ['deviant-energy','Energía desviada','Deviant Energy','Variante mencionada en fichas de mods. Consulta su efecto concreto.','https://once-human.fandom.com/wiki/Precision_Charge'],
 ['survival','Supervivencia','Survival','Familia documentada en una base comunitaria. Sin cifras verificadas.',community],
 ['aero','Aéreo','Aero','Se activa en el aire, incluido el salto. El efecto concreto depende de la variante.',aero],
 ['aero-deviant-energy','Aéreo · Energía desviada','Aero Deviant Energy','Variante citada en las cajas de mods de la actualización S4; consulta sus atributos.',aero],
 ['downstar','Estrella descendente','Downstar','Bonificaciones al atacar a objetivos situados más abajo.','https://www.oncehuman.game/news/devBlog/20250603/40781_1233907.html',['bottoms','shoes']],
 ['downstar-deviant-energy','Estrella descendente · Energía desviada','Downstar Deviant Energy','Variante citada en las cajas de mods de la actualización S4; consulta sus atributos.',aero,['bottoms','shoes']],
 ['lunar','Oráculo lunar','Lunar Oracle','Bonificaciones conforme baja la salud.','https://www.oncehuman.game/news/update/20250115/40780_1207023.html',['helmet','top']],
 ['mirror','Espejo','Mirror','Familia del evento Linaje aberrante; consulta el efecto de la variante.','https://www.oncehuman.game/news/update/20260121/40780_1282991.html',['top','shoes']],
 ['wild','Salvaje','Wild','Familia del evento Linaje aberrante; consulta el efecto de la variante.','https://www.oncehuman.game/news/update/20260121/40780_1282991.html',['top','shoes']],
 ['phantasmal','Fantasmal','Phantasmal','Familia del evento Linaje aberrante; consulta el efecto de la variante.','https://www.oncehuman.game/news/update/20260121/40780_1282991.html',['top','shoes']],
 ['battle','Batalla','Battle','Reducción de daño de arma/estado bajo condiciones de combate.',wiki],
 ['battlefield','Campo de batalla','Battlefield','Combinaciones de daño elemental, crítico o a puntos débiles.',wiki],
 ['resonance','Resonancia','Resonance','Combinaciones de daño elemental, crítico o a puntos débiles.',wiki],
 ['burn','Quemadura','Burn','Daño de Quemadura.',wiki],
 ['power-surge','Sobrecarga eléctrica','Power Surge','Daño de Sobrecarga eléctrica.',wiki],
 ['frost-vortex','Vórtice de escarcha','Frost Vortex','Daño de Vórtice de escarcha.',wiki],
 ['bullseye','Diana',"The Bull's Eye",'Daño crítico o a puntos débiles.',wiki],
 ['unstable-bomber','Bombardero inestable','Unstable Bomber','Daño de Bombardero inestable.',wiki],
 ['fast-gunner','Artillero rápido','Fast Gunner','Daño de arma relacionado con Artillero rápido.',wiki],
 ['bounce','Rebote','Bounce','Daño de Rebote.',wiki],
 ['shrapnel','Metralla','Shrapnel','Relacionado con Metralla.',wiki]
 ];
 const suffixes=definitions.map(([id,name,original,effect,source,slots])=>({id,name,original,effect,source,...(slots?{slots}:{})}));
 function suffix(id){return suffixes.find(s=>s.id===id);}
 function compatible(mod,slot){if(mod.wiki?.kind!=='mod')return false;if(slot==='weapon')return mod.wiki.modType==='Weapon Mod';const mapped={helmet:'Helmet',mask:'Mask',top:'Top',gloves:'Gloves',bottoms:'Bottoms',shoes:'Shoes'};return mod.wiki.modType==='Armor Mod'&&[mapped[slot],'Universal'].includes(mod.wiki.slot);}
 function candidates(entries,slot,owned,progress){return entries.filter(e=>compatible(e,slot)&&(!owned||!!progress.done[e.id]));}
 function validate(mods,selection,entries){if(mods===undefined)return;if(!mods||typeof mods!=='object'||Array.isArray(mods))throw Error('Mods de build inválidos.');for(const [slot,choice]of Object.entries(mods)){if(!['weapon','helmet','mask','top','gloves','bottoms','shoes'].includes(slot)||!selection[slot]||!choice||typeof choice!=='object'||typeof choice.id!=='string'||!/^[a-z0-9][a-z0-9-]{0,79}$/.test(choice.id)||!Number.isInteger(choice.level)||choice.level<1||choice.level>17||typeof choice.suffix!=='string'||(choice.suffix&&!suffix(choice.suffix)))throw Error('Configuración de mod inválida.');const target=entries.find(e=>e.id===choice.id);if(target&&!compatible(target,slot))throw Error('Mod incompatible con la ranura.');const s=suffix(choice.suffix);if(s?.slots&&!s.slots.includes(slot))throw Error('El sufijo no está documentado para esta ranura.');}}
 root.PhoenixModOptions={suffixes,suffix,compatible,candidates,validate,levelMin:1,levelMax:17,sources:{wiki,aero,overhaul,modern,community},reviewedAt:'2026-10-23'};if(typeof module!=='undefined')module.exports=root.PhoenixModOptions;
})(globalThis);
