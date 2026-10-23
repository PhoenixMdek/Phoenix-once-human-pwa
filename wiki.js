/* Importadores de atributos de armas y armaduras. Sin HTML remoto ni ejecución de plantillas. */
(function(root){
  'use strict';
  const API='https://once-human.fandom.com/api.php';
  const labels={weapon_type:'Tipo',rarity:'Rareza',style:'Estilo',weight:'Peso',durability:'Durabilidad',dmg:'Daño (rango de la ficha)',fire_rate:'Cadencia',magazine_capacity:'Capacidad del cargador',weakspot_dmg:'Daño a punto débil (%)',crit_rate:'Probabilidad crítica (%)',crit_dmg:'Daño crítico (%)'};
  const words={Ranged:'A distancia',Melee:'Cuerpo a cuerpo',Legendary:'Legendaria',Epic:'Épica',Rare:'Rara',Uncommon:'Poco común',Common:'Común'};
  const effects=[['Burn','Quemadura'],['Frost Vortex','Vórtice de escarcha'],['Power Surge','Sobrecarga eléctrica'],['Shrapnel','Metralla'],['Bounce','Rebote'],['Fast Gunner','Artillero rápido'],['Fortress Warfare','Guerra de fortaleza'],['Bullseye','Diana'],['Unstable Bomber','Bombardero inestable']];
  function clean(value){return String(value).replace(/<!--[\s\S]*?-->/g,'').replace(/\[\[(?:[^\]|]*\|)?([^\]]+)\]\]/g,'$1').replace(/\{\{[^{}]*\}\}/g,'').replace(/<[^>]*>/g,'').replace(/'{2,}/g,'').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();}
  function readFields(raw,match){
    let depth=1,end=match.index+match[0].length;
    for(;end<raw.length-1;end++){const pair=raw.slice(end,end+2);if(pair==='{{'){depth++;end++;}else if(pair==='}}'){depth--;if(!depth)break;end++;}}
    if(depth)throw Error('Plantilla de equipo incompleta.');
    const body=raw.slice(match.index+match[0].length,end),values={};
    const parts=[...body.matchAll(/^\s*\|\s*([a-z_][a-z_-]*)\s*=/gm)];
    parts.forEach((p,i)=>values[p[1]]=body.slice(p.index+p[0].length,parts[i+1]?.index??body.length).trim());
    return values;
  }
  function fields(raw){const match=/\{\{Infobox[ _]weapon\b/i.exec(raw);return match?readFields(raw,match):null;}
  function armorFields(raw){return [...raw.matchAll(/\{\{Infobox[ _]armor\b/gi)].map(match=>readFields(raw,match));}
  function modFields(raw){const match=/\{\{Infobox[ _]item\b/i.exec(raw);return match?readFields(raw,match):null;}
  function deviationSnapshot(raw){
    const match=/\{\{Infobox[ _]deviation\b/i.exec(raw);if(!match)return null;
    const f=readFields(raw,match),summary=(raw.match(/==\s*Summary\s*==\s*([\s\S]*?)(?=\n==|$)/i)?.[1]||'').trim();
    return {fields:f,summary,binding:JSON.stringify([clean(f.type),clean(f.utility),summary.replace(/\s+/g,' ')])};
  }
  const armorLabels={armor_type:'Ranura',rarity:'Rareza',style:'Estilo',weight:'Peso',durability:'Durabilidad',hp:'Salud (rango de la ficha)',pollution_resist:'Resistencia a contaminación (rango)',psi_intensity:'Intensidad PSI (rango)'};
  const slotNames={Helmet:'Casco',Mask:'Máscara',Top:'Torso',Gloves:'Guantes',Pants:'Pantalones',Bottoms:'Pantalones',Shoes:'Calzado',Boots:'Botas'};
  // Traducciones editoriales ligadas al texto de origen: si cambia, se muestra el original marcado.
  const translatedEffects={
    'Gain burn frequency increase based on Burn stacks, up to 100%.':'La frecuencia de Quemadura aumenta con sus acumulaciones, hasta un 100%.',
    'Medicine Cooldown Haste 0.2.':'Aceleración de la recuperación de medicinas: 0,2 (valor de la wiki).',
    'While shielded, Weapon DMG and Status DMG dealt increases by +10%.':'Mientras tienes escudo, aumenta un 10% el daño de arma y de estado.',
    'Consumes 8% of current HP upon hit to generate a temporary shield equal to 5% of Max HP, lasting 30s (Cooldown: 0.5s; when shield exceeds 40%, hits landed will refresh shield duration and damage boost timer without deducting HP). When HP is consumed, Weapon and Statud DMG +5%, stacking up to 4 stack(s), lasting 12s.':'Al impactar, consume el 8% de la salud actual y genera un escudo del 5% de la salud máxima durante 30 s (recarga: 0,5 s). Con escudo superior al 40%, los impactos renuevan la duración del escudo y del bonus de daño sin consumir salud. Consumir salud otorga +5% de daño de arma y de estado, hasta 4 acumulaciones, durante 12 s.',
    'Automatically uses the lease potent Healing Syringe in the backpack when HP is below 30% (Cooldown: 40s).':'Usa automáticamente la jeringa curativa menos potente de la mochila si la salud baja del 30% (recarga: 40 s).',
    'Weapon DMG Reduction 10%.':'Reducción del daño de arma recibido: 10%.',
    'When HP is below 70%, weapon and Status DMG +12%.':'Con salud inferior al 70%, daño de arma y de estado +12%.',
    'The HP reduction from low Sanity is decreased by 40%. Weapon and Status DMG +10% and further increases as your Sanity drops, up to +28% (at 30% max Sanity).':'Reduce un 40% la pérdida de salud por baja cordura. Daño de arma y de estado +10%, que aumenta al bajar la cordura hasta +28% (al 30% de cordura máxima).',
    'Generates a shield equal to 20% of Max HP when HP is below 40% of the Max. Cooldown: 8s.':'Con salud inferior al 40% de la máxima, genera un escudo del 20% de la salud máxima (recarga: 8 s).'
  };
  function armorEffects(raw){
    return String(raw||'').split(/\n(?=\s*\*)/).map(line=>{
      const match=/^\s*\*\s*([1-9])\s*[-–:]\s*([\s\S]*)$/.exec(line);
      const original=clean(match?match[2]:line.replace(/^\s*\*\s*/,''));
      return original?{pieces:match?Number(match[1]):null,original,text:translatedEffects[original]||original,translated:!!translatedEffects[original]}:null;
    }).filter(Boolean);
  }
  function convertArmor(page,now=new Date().toISOString()){
    const rev=page.revisions?.[0],raw=rev?.slots?.main?.['*'];
    if(!raw||!Number.isInteger(page.pageid)||!rev.revid||!rev.timestamp)return [];
    const boxes=armorFields(raw).filter(f=>f.armor_type&&f.rarity).sort((a,b)=>clean(a.armor_type).localeCompare(clean(b.armor_type)));if(!boxes.length)return [];
    const isSet=boxes.length>1||/\bSet\b/.test(page.title);
    const alias=page.title==='Savior Set'?'savior':page.title==='Treacherous Tides Set'?'tides':page.title==='BBQ Gloves'?'bbq':null;
    const baseId=alias||'wiki-armor-'+page.pageid;
    const source='https://once-human.fandom.com/wiki/'+encodeURIComponent(page.title.replace(/ /g,'_'));
    const sources=[{label:'Once Human Wiki · '+page.title,url:source},{label:'Revisión '+rev.revid+' · '+rev.timestamp.slice(0,10),url:'https://once-human.fandom.com/wiki/Special:Redirect/revision/'+rev.revid},{label:'Historial de autores y contribuciones',url:source+'?action=history'},{label:'Licencia CC BY-SA (ver condiciones de la wiki)',url:'https://www.fandom.com/licensing'}];
    const warning='Rangos de la tabla general de la wiki: varían por nivel, mejora y escenario. No son atributos garantizados de tu personaje. No se importan recetas ni tablas de fabricación. Verifica las restricciones de Deviation en la fuente.';
    const effects=armorEffects(boxes[0].armor_features);
    const formatEffect=e=>(e.pieces?e.pieces+(e.pieces===1?' pieza: ':' piezas: '):'Efecto: ')+(e.translated?e.text:'[Original en inglés; pendiente de traducción] '+e.original);
    const shared={category:'Armaduras',sources,status:'Importada de wiki · Sin validar en juego',updatedAt:now.slice(0,10)};
    const metadata=facts=>({pageId:page.pageid,revisionId:rev.revid,revisedAt:rev.timestamp,fetchedAt:now,fields:facts,scope:'Tabla general de armaduras; no garantiza valores por escenario',adapterVersion:2});
    const slotIds=new Set();
    const pieces=boxes.map(f=>{
      const slot=clean(f.armor_type),slug=slot.toLowerCase().replace(/[^a-z0-9]+/g,'-');
      if(slotIds.has(slug))throw Error('Ranura duplicada en '+page.title+'. Se requiere revisar la plantilla.');slotIds.add(slug);
      const name=clean(f.name||'')||(isSet?page.title+' · '+(slotNames[slot]||slot):page.title);
      const id=isSet?baseId+'-'+slug:baseId;
      const facts=Object.entries(armorLabels).flatMap(([key,label])=>{const value=clean(f[key]||'');return value?[label+': '+(words[value]||slotNames[value]||value)]:[];});
      const detected=effectsFrom(f.armor_features);
      return {...shared,id,name,subtitle:(words[clean(f.rarity)]||clean(f.rarity))+' · '+(slotNames[slot]||slot),tags:['Wiki','Armadura',slotNames[slot]||slot,...(isSet?[page.title]:[]),...(alias==='bbq'?['Guantes Parrilleros']:[]),...detected],summary:isSet?'Pieza del conjunto '+page.title+'. Atributos importados de su propia plantilla.':'Pieza de armadura importada de Once Human Wiki.',details:[...facts,...(!isSet?armorEffects(f.armor_features).map(formatEffect):[]),warning],related:isSet?[baseId]:alias==='bbq'?['burn','mods']:[],wiki:{...metadata(facts),kind:'piece',...(isSet?{setId:baseId}:{})}};
    });
    if(!isSet)return pieces;
    const names={savior:'Salvador',tides:'Mareas Traicioneras'};
    const set={...shared,id:baseId,name:page.title,subtitle:'Conjunto · '+pieces.length+' piezas documentadas',tags:['Wiki','Conjunto',...(names[alias]?[names[alias]]:[]),...effectsFrom(boxes[0].armor_features)],summary:'Conjunto con fichas separadas para cada pieza. '+(effects.length?'Incluye los efectos de conjunto recogidos en su plantilla.':'La plantilla no ofrece efectos de conjunto reconocibles.'),details:[...(names[alias]?['Adaptación editorial al castellano: '+names[alias]+'. Localización oficial sin contrastar.']:[]),...effects.map(formatEffect),'Las condiciones de los bonus proceden de la wiki. Traducción editorial para los efectos reconocidos; el resto se muestra en inglés, identificado como pendiente. Los atributos de cada ranura se consultan en sus fichas.',warning],equipment:pieces.map(p=>p.name),related:pieces.map(p=>p.id),wiki:{...metadata([]),kind:'set',effects}};
    return [set,...pieces];
  }
  function effectsFrom(raw){return [...new Set([...effects.filter(([en])=>String(raw||'').includes(en)).map(([,es])=>es),...(String(raw||'').includes("The Bull's Eye")?['Diana']:[])])];}
  function convert(page,now=new Date().toISOString()){
    const rev=page.revisions?.[0],raw=rev?.slots?.main?.['*'];
    if(!raw||!Number.isInteger(page.pageid)||!rev.revid||!rev.timestamp)return null;
    const f=fields(raw);if(!f)return null;
    if(!f.weapon_type||!f.rarity)return null;
    const facts=[];
    for(const [key,label] of Object.entries(labels)){const value=clean(f[key]||'');if(value)facts.push(label+': '+(words[value]||value));}
    const detected=effects.filter(([en])=>(f.weapon_features||'').includes(en)).map(([,es])=>es);
    const isKVD=page.title==='KVD - Boom! Boom!';
    const source='https://once-human.fandom.com/wiki/'+encodeURIComponent(page.title.replace(/ /g,'_'));
    return {id:isKVD?'kvd':'wiki-weapon-'+page.pageid,category:'Armas',name:page.title,subtitle:(words[clean(f.rarity)]||clean(f.rarity))+' · '+(words[clean(f.weapon_type)]||clean(f.weapon_type)),tags:['Wiki',page.title,...detected],summary:'Ficha importada de Once Human Wiki. '+(detected.length?'Mecánicas detectadas en sus habilidades: '+detected.join(', ')+'.':'Consulta los atributos disponibles y la revisión de origen.'),details:[...facts,'Los valores son los de la tabla general de la wiki, no una medición de tu personaje. Pueden variar por nivel, mejoras, escenario y parche. No deben aplicarse automáticamente al escenario Deviation.','Importación parcial: se extraen atributos y nombres de mecánicas, no las habilidades completas, recetas ni tablas específicas de cada escenario. Las traducciones de etiquetas son orientativas; se conservan los nombres originales.'],related:isKVD?['burn','pyro','bbq','mods']:[],sources:[{label:'Once Human Wiki · '+page.title,url:source},{label:'Revisión '+rev.revid+' · '+rev.timestamp.slice(0,10),url:'https://once-human.fandom.com/wiki/Special:Redirect/revision/'+rev.revid},{label:'Historial de autores y contribuciones',url:source+'?action=history'},{label:'Licencia CC BY-SA (ver condiciones de la wiki)',url:'https://www.fandom.com/licensing'}],status:'Importada de wiki · Sin validar en juego',updatedAt:now.slice(0,10),wiki:{pageId:page.pageid,revisionId:rev.revid,revisedAt:rev.timestamp,fetchedAt:now,fields:facts,scope:'Tabla general; no garantiza valores por escenario',adapterVersion:1}};
  }
  async function request(params,{fetcher=globalThis.fetch,signal}={}){
    const url=new URL(API);url.search=new URLSearchParams({format:'json',origin:'*',...params});
    const response=await fetcher(url,{signal,credentials:'omit',referrerPolicy:'no-referrer'});
    if(!response.ok)throw Error('La wiki respondió HTTP '+response.status+'. Inténtalo más tarde.');
    const data=await response.json();if(data.error)throw Error('Wiki: '+data.error.code);if(!data.query)throw Error('Respuesta de wiki inesperada.');return data;
  }
  async function importCategory(category,label,converter,{fetcher,signal,onProgress=()=>{},pause=()=>new Promise(r=>setTimeout(r,350))}={}){
    const options={fetcher,signal},members=[];let continuation;
    do{
      const data=await request({action:'query',list:'categorymembers',cmtitle:category,cmnamespace:'0',cmlimit:'100',...(continuation?{cmcontinue:continuation}:{})},options);
      if(!Array.isArray(data.query.categorymembers))throw Error('No se pudo leer el índice de '+label+'.');
      members.push(...data.query.categorymembers);continuation=data.continue?.cmcontinue;
      if(members.length>500)throw Error('El índice supera el límite de 500 páginas. No se aplicó ningún cambio.');
      if(continuation)await pause();
    }while(continuation);
    if(!members.length)throw Error('El índice de '+label+' está vacío.');
    const entries=[],skipped=[],now=new Date().toISOString();
    for(let i=0;i<members.length;i+=10){
      signal?.throwIfAborted();onProgress('Descargando '+label+' '+Math.min(i+10,members.length)+' / '+members.length+'…');
      const batch=members.slice(i,i+10),data=await request({action:'query',prop:'revisions|pageimages',pageids:batch.map(x=>x.pageid).join('|'),rvprop:'ids|timestamp|content',rvslots:'main',piprop:'name|thumbnail|original',pithumbsize:'320'},options);
      const pages=Object.values(data.query.pages||{});
      for(const member of batch){const page=pages.find(p=>p.pageid===member.pageid);if(!page?.revisions?.[0]?.slots?.main?.['*'])throw Error('Falta el contenido de '+member.title+'. Se conserva tu catálogo.');const converted=converter(page,now),items=Array.isArray(converted)?converted:converted?[converted]:[];if(items.length)entries.push(...items);else skipped.push(member.title);}
      if(i+10<members.length)await pause();
    }
    if(!entries.length)throw Error('No se reconoció ninguna plantilla de '+label+'. Se conserva tu catálogo.');
    entries.sort((a,b)=>a.name.localeCompare(b.name));
    return {entries,skipped,fetchedAt:now,indexCount:members.length};
  }
  const importWeapons=options=>importCategory('Category:Weapon','armas',convert,options);
  const importArmor=options=>importCategory('Category:Armor','armaduras',convertArmor,options);
  const deviationEnvironment={env_bluelight:'Luz azul',env_redlight:'Luz roja',env_greenlight:'Luz verde',env_electricity:'Electricidad',env_music:'Música',env_toy:'Juguetes',env_hightemp:'Temperatura alta',env_lowtemp:'Temperatura baja',env_flowers:'Flores',env_crops:'Cultivos'};
  function deviationImage(page,sourceURL,fileTitle){
    try{const u=new URL(sourceURL);if(u.protocol!=='https:'||u.hostname!=='static.wikia.nocookie.net'||!u.pathname.startsWith('/once-human/images/'))return null;}catch{return null;}
    return {sourceURL,fileTitle:'File:'+fileTitle.replace(/^File:/i,'').replace(/_/g,' '),filePage:'https://once-human.fandom.com/wiki/File:'+encodeURIComponent(fileTitle.replace(/^File:/i,'').replace(/ /g,'_')),caption:'Foto de la desviación',pageURL:'https://once-human.fandom.com/wiki/'+encodeURIComponent(page.title.replace(/ /g,'_'))};
  }
  function convertDeviation(page,now=new Date().toISOString()){
    const rev=page.revisions?.[0],raw=rev?.slots?.main?.['*'];if(!raw||!Number.isInteger(page.pageid)||!rev.revid||!rev.timestamp)return null;
    const snapshot=deviationSnapshot(raw);if(!snapshot)return null;const f=snapshot.fields;
    const types={Combat:'Combate',Territory:'Territorio',Crafting:'Fabricación'},type=types[clean(f.type)];if(!type)return null;
    const utilities={Attack:'Ataque',Offense:'Ofensiva',Defense:'Defensa',Materials:'Materiales',Facility:'Instalaciones',Production:'Producción',Gardening:'Jardinería','Recovery Boost':'Mejora de recuperación','Deviant Energy Recovery':'Recuperación de energía','Rain Maker':'Riego','Tactical Item':'Objetos tácticos',Consumable:'Consumibles',Consumables:'Consumibles'};
    const locale=root.PhoenixDeviations||(typeof require==='function'?require('./deviations-es.js'):null),translated=locale?.translate(page.pageid,snapshot.binding);
    const environment=Object.entries(deviationEnvironment).filter(([key])=>clean(f[key])==='1').map(([,label])=>label);
    const grade=/\b([SABC])-grade\b/.exec(snapshot.summary)?.[1],source='https://once-human.fandom.com/wiki/'+encodeURIComponent(page.title.replace(/ /g,'_'));
    const alias=page.pageid===868?'pyro':page.pageid===5041?'sun':'wiki-deviation-'+page.pageid;
    const facts=['Tipo: '+type,...(grade?['Grado según la wiki: '+grade]:[]),...(f.utility?['Función: '+(utilities[clean(f.utility)]||'Por revisar')]:[]),'Bienestar: '+(environment.length?environment.join(', '):'Sin condiciones documentadas en la plantilla')];
    const image=page.pageimage?deviationImage(page,page.thumbnail?.source||page.original?.source,page.pageimage):null;
    return {id:alias,category:'Deviations',name:page.title,subtitle:'Desviación de '+type.toLowerCase()+(grade?' · Grado '+grade:''),tags:['Wiki','Desviaciones','Deviants',type,...environment,...(page.pageid===868||page.pageid===5041?['Quemadura','Burn']:[])],summary:translated?.summary||'El resumen de esta revisión necesita revisión en castellano. Consulta los datos estructurados y la fuente.',details:[...facts,...(page.pageid===868?['Obtención documentada para Manibus, Endless Dream y escenarios agrupados en esa sección de la wiki: Silo PHI, con aparición poco frecuente. En el escenario Deviation, la fuente indica obtención mediante fusión; no es una ruta universal.']:[]),'Ficha de la criatura base: no incluye un catálogo separado de variantes, aspectos, técnicas o talentos por escenario. La función y la obtención pueden cambiar entre escenarios; revisa las condiciones de tu servidor.','Los nombres y el resumen son adaptaciones editoriales al castellano, sin certificar todos los nombres oficiales del cliente.'],related:page.pageid===868?['phi','burn','sun']:page.pageid===5041?['burn','pyro']:[],sources:[{label:'Once Human Wiki · '+page.title,url:source},{label:'Revisión '+rev.revid+' · '+rev.timestamp.slice(0,10),url:'https://once-human.fandom.com/wiki/Special:Redirect/revision/'+rev.revid},{label:'Historial de autores y contribuciones',url:source+'?action=history'},{label:'Licencia del texto: información de Fandom',url:'https://www.fandom.com/licensing'}],status:!translated?'Resumen pendiente de revisar':translated.partial?'Ficha parcial · Revisar fuente':'Importada de wiki · Revisar en juego',updatedAt:now.slice(0,10),...(image?{image}:{}),wiki:{pageId:page.pageid,revisionId:rev.revid,revisedAt:rev.timestamp,fetchedAt:now,fields:facts,kind:'deviation',deviationType:clean(f.type),environment,translationReviewed:!!translated,sourceSummary:snapshot.summary,imageCandidate:clean(f.photo||f.icon||page.title+'.png'),adapterVersion:4}};
  }
  async function importDeviations(options={}){
    const result=await importCategory('Category:Deviation','desviaciones',convertDeviation,options);
    const missing=result.entries.filter(e=>!e.image&&/^[^|{}<>\[\]\n]+\.(png|jpe?g|webp)$/i.test(e.wiki.imageCandidate));
    for(let i=0;i<missing.length;i+=20){const batch=missing.slice(i,i+20),data=await request({action:'query',prop:'imageinfo',titles:batch.map(e=>'File:'+e.wiki.imageCandidate).join('|'),iiprop:'url',iiurlwidth:'320',iilimit:'1'},options);
      const pages=Object.values(data.query.pages||{});for(const e of batch){const match=pages.find(p=>p.title.replace(/_/g,' ')===('File:'+e.wiki.imageCandidate).replace(/_/g,' ')),info=match?.imageinfo?.[0];if(info){const image=deviationImage({title:e.name},info.thumburl||info.url,match.title);if(image)e.image=image;}}
    }
    return result;
  }
  function convertMod(page,now=new Date().toISOString()){
    const rev=page.revisions?.[0],raw=rev?.slots?.main?.['*'];
    if(!raw||!Number.isInteger(page.pageid)||!rev.revid||!rev.timestamp)return null;
    const f=modFields(raw);if(!f||!['Weapon Mod','Armor Mod'].includes(clean(f.type))||!f.rarity||!f.mod_type)return null;
    const locale=root.PhoenixMods||(typeof require==='function'?require('./mods-es.js'):null);
    const originalEffect=clean(f.status_effects||f.core_effect||''),originalAttribute=clean(f.attribute_effects||'');
    if(!originalEffect)return null;
    const translation=locale?.translate(page.pageid,originalEffect,originalAttribute);
    const type=clean(f.type)==='Weapon Mod'?'Mod de arma':'Mod de armadura',slot=clean(f.mod_type);
    const slots={...slotNames,Weapon:'Arma',Universal:'Universal'};
    const source='https://once-human.fandom.com/wiki/'+encodeURIComponent(page.title.replace(/ /g,'_'));
    const old=Date.parse(now)-Date.parse(rev.timestamp)>365*86400000;
    const effect=translation?.effect||'El efecto de esta revisión necesita traducción y revisión en castellano. Puedes contrastar el original en la fuente.';
    const attributes=originalAttribute?(translation?.attributes||'El atributo adicional necesita revisión en castellano. Consulta la fuente.'):null;
    const reviewed=!!translation?.effect&&(!originalAttribute||!!translation?.attributes);
    const related=page.title==='Elemental Overload'||page.title==='Status Enhancement'?['mods','burn','bbq']:effectsFrom(originalEffect).includes('Quemadura')?['burn','mods']:['mods'];
    const facts=['Tipo: '+type,'Ranura: '+(slots[slot]||'Sin traducir; revisar en la fuente'),'Rareza: '+(words[clean(f.rarity)]||'Sin clasificar')];
    return {id:'wiki-mod-'+page.pageid,category:'Mods/Calibraciones',name:page.title,subtitle:type+' · '+(slots[slot]||'Ranura por revisar'),tags:['Wiki','Mod',type,slots[slot]||slot,...effectsFrom(originalEffect)],summary:effect,details:[...facts,...(attributes?['Atributo adicional de la ficha: '+attributes]:[]),'Revisión de la fuente: '+rev.timestamp.slice(0,10)+'. '+(old?'Esta revisión tiene más de un año; comprueba el efecto y la ranura en tu cliente actual.':'Comprueba el efecto y la ranura en tu cliente actual.'),'La descarga no certifica compatibilidad con el parche o escenario. No se importan rutas de obtención, sufijos ni calibraciones.'],related,sources:[{label:'Once Human Wiki · '+page.title,url:source},{label:'Revisión '+rev.revid+' · '+rev.timestamp.slice(0,10),url:'https://once-human.fandom.com/wiki/Special:Redirect/revision/'+rev.revid},{label:'Historial de autores y contribuciones',url:source+'?action=history'},{label:'Licencia CC BY-SA (ver condiciones de la wiki)',url:'https://www.fandom.com/licensing'}],status:!reviewed?'Traducción pendiente de revisar':old?'Wiki · Revisión antigua; revisar en juego':'Importado de wiki · Revisar en juego',updatedAt:now.slice(0,10),wiki:{pageId:page.pageid,revisionId:rev.revid,revisedAt:rev.timestamp,fetchedAt:now,fields:facts,kind:'mod',modType:clean(f.type),slot,originalEffect,originalAttribute,translationReviewed:reviewed,adapterVersion:3}};
  }
  async function importMods(options={}){
    const weapon=await importCategory('Category:Weapon Mod','mods de armas',convertMod,options);
    const armor=await importCategory('Category:Armor Mod','mods de armadura',convertMod,options);
    const entries=[],skipped=[...weapon.skipped,...armor.skipped],seen=new Set();
    for(const e of [...weapon.entries,...armor.entries].sort((a,b)=>a.wiki.pageId-b.wiki.pageId)){
      const key=e.name.toLowerCase()+'|'+e.wiki.slot+'|'+e.wiki.originalEffect;
      if(seen.has(key))skipped.push(e.name+' (ficha duplicada)');else{seen.add(key);entries.push(e);}
    }
    entries.sort((a,b)=>a.name.localeCompare(b.name));
    return {entries,skipped,fetchedAt:armor.fetchedAt,indexCount:weapon.indexCount+armor.indexCount};
  }
  function merge(catalog,result){
    // Solo actualiza identificadores recibidos. Las fichas ausentes nunca se borran automáticamente.
    const map=new Map(catalog.entries.map(e=>[e.id,e]));
    for(const entry of result.entries){const old=map.get(entry.id);map.set(entry.id,{...entry,related:[...new Set([...(old?.related||[]),...entry.related])]});}
    const ids=new Set(map.keys());
    const entries=[...map.values()].map(e=>({...e,related:e.related.filter(id=>ids.has(id))}));
    return {...catalog,catalogVersion:'wiki-'+result.fetchedAt.replace(/[:.]/g,'-'),updatedAt:result.fetchedAt.slice(0,10),entries};
  }
  root.PhoenixWiki={fields,armorFields,modFields,deviationSnapshot,convert,convertArmor,convertMod,convertDeviation,request,importWeapons,importArmor,importMods,importDeviations,merge};
  if(typeof module!=='undefined')module.exports=root.PhoenixWiki;
})(globalThis);
