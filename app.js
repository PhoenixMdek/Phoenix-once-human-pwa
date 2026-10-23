(async() => {
  'use strict';
  const Core=PhoenixCore, Collection=PhoenixCollection;
  const $=id=>document.getElementById(id);
  let catalog=Core.validateCatalog(PHOENIX_SEED),progress={favorites:{},done:{},notes:{},equipment:{}},section='Inicio',query='',pending=null,storageAvailable=true;
  try{const parsed=await PhoenixStorage.load();if(parsed){const c=Core.validateCatalog(parsed.catalog),p=Core.validateProgress(parsed.progress);catalog=c;progress=p;}}catch{document.body.replaceChildren(document.createTextNode('No se pudo leer el guardado local. No se han sobrescrito tus datos. Reinicia Phoenix y vuelve a intentarlo.'));return;}
  const upgradedWorld=PhoenixSupply.upgrade(PhoenixWorld.upgrade(catalog,PHOENIX_SEED),PHOENIX_SEED),worldChanged=upgradedWorld!==catalog;catalog=Core.validateCatalog(upgradedWorld);
  const modGuideAdded=!catalog.entries.some(e=>e.id==='mod-system-guide');if(modGuideAdded)catalog={...catalog,entries:[...catalog.entries,PHOENIX_SEED.entries.find(e=>e.id==='mod-system-guide')]};
  const cleanedCatalog=PhoenixCatalogCleanup.clean(catalog),legacyCleaned=cleanedCatalog!==catalog;catalog=Core.validateCatalog(cleanedCatalog);
  const symbols={'Inicio':'◈','Armas':'⌁','Builds':'▧','Deviations':'◉','Silos/Monolitos':'▥','Escenarios':'◇','Comida':'♨','Mods/Calibraciones':'⚙','Armaduras':'⬡','Recursos':'▤','Favoritos':'☆','Checklist':'☑'};
  function node(tag,text,cls){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el;}
  function button(text,fn,cls){const el=node('button',text,cls);el.type='button';el.addEventListener('click',fn);return el;}
  $('storage-description').textContent=PhoenixStorage.description;
  const imageNote=node('p',undefined,'muted');$('data-dialog').append(imageNote);
  const collectionFilterLabel=node('label','Colección '),collectionFilter=node('select');collectionFilter.id='collection-filter';collectionFilter.setAttribute('aria-label','Filtrar por colección');
  for(const [value,text] of [['','Todos'],['owned','Ya en mi colección'],['missing','Me faltan']]){const option=node('option',text);option.value=value;collectionFilter.append(option);}collectionFilterLabel.append(collectionFilter);document.querySelector('.filters').append(collectionFilterLabel);
  collectionFilter.addEventListener('change',render);
  const activityFilterLabel=node('label','Actividad '),activityFilter=node('select');activityFilter.id='activity-filter';activityFilter.setAttribute('aria-label','Filtrar tipo de actividad');activityFilterLabel.append(activityFilter);document.querySelector('.filters').append(activityFilterLabel);
  for(const type of ['',...new Set(PHOENIX_SEED.entries.filter(e=>e.category==='Silos/Monolitos').map(e=>e.world?.type).filter(Boolean))]){const o=node('option',type||'Todas');o.value=type;activityFilter.append(o);}activityFilter.addEventListener('change',render);
  const worldInfo=node('p',undefined,'world-info');worldInfo.hidden=true;$('cards').before(worldInfo);
  function scenarioOptions(){const value=$('scenario').value;$('scenario').replaceChildren();const all=node('option','Todos los escenarios');all.value='';$('scenario').append(all);for(const e of catalog.entries.filter(e=>e.category==='Escenarios')){const o=node('option',e.name);o.value=e.id;$('scenario').append(o);}$('scenario').value=value;}
  document.querySelector('.filter-help').textContent='Disponibilidad documentada en silos y escenarios; en otras fichas busca menciones.';
  const modGuideShortcut=button('Sufijos y niveles: Violento, General, Aéreo…',()=>openDetail('mod-system-guide'),'secondary');modGuideShortcut.id='mod-guide-shortcut';modGuideShortcut.hidden=true;$('cards').before(modGuideShortcut);
  function itemPicture(entry,detail=false,choice=false){
    const figure=node('figure',undefined,detail?'detail-photo':'item-photo'),resolved=PhoenixMedia.resolve(entry.id,PHOENIX_MEDIA,entry);
    if(!resolved){figure.dataset.imageState='missing';figure.append(node('span','Sin imagen disponible','missing-photo'));return figure;}
    const media=resolved.metadata,img=node('img');figure.dataset.imageState='loading';img.alt=media.caption+' · '+entry.name;img.loading=detail?'eager':'lazy';img.decoding='async';img.referrerPolicy='no-referrer';
    const sourceLink=()=>{const link=node('a','Abrir imagen en la fuente ↗','image-source');link.href=media.filePage;link.target='_blank';link.rel='noopener noreferrer';return link;};
    img.addEventListener('load',()=>{figure.dataset.imageState='loaded';});
    img.addEventListener('error',()=>{img.remove();figure.dataset.imageState='error';figure.prepend(node('span',resolved.remote?'No se pudo cargar la imagen en línea':'Imagen no disponible','missing-photo'));if(!detail&&!choice)figure.append(sourceLink());});
    img.src=resolved.src;figure.append(img);
    if(detail){const caption=node('figcaption',media.caption+'. '+(resolved.remote?'Se carga desde su fuente con Internet. ':'Incluida en la app. '));caption.append(sourceLink());figure.append(caption);}
    else if(media.caption!=='Imagen del objeto')figure.append(node('figcaption',media.caption));
    return figure;
  }
  function toast(text){$('toast').textContent=text;$('toast').style.display='block';clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').style.display='none',5500);}
  // El panel resuelve únicamente las selecciones guardadas en la build.
  function buildEquipment(entry){
    if(entry.personalBuild){const find=key=>catalog.entries.find(e=>e.id===entry.personalBuild.slots[key]);return {weapon:find('weapon'),armor:PhoenixBuilds.slots.slice(1).map(([key,slot])=>({slot,entry:find(key)}))};}
    return null;
  }
  function buildView(entry,compact=false){
    const equipment=buildEquipment(entry);if(!equipment)return itemPicture(entry,!compact);
    const view=node('section',undefined,compact?'build-preview':'build-equipment');view.setAttribute('aria-label',compact?'Vista previa del equipo':'Configuración de equipo');
    function tile(raw,label,cls,key){
      const box=node('div',undefined,'gear-slot '+cls);box.append(node('span',label,'gear-label'));
      if(raw){const localized=PhoenixNames.present(raw,catalog.entries);box.append(itemPicture(localized));const link=button(localized.name,()=>openDetail(raw.id),'gear-link');box.append(link);}
      else box.append(node('span',compact?'Sin pieza':'Sin pieza seleccionada o no disponible','muted'));
      const mod=entry.personalBuild?.mods?.[key];if(mod){const target=catalog.entries.find(e=>e.id===mod.id),suffix=PhoenixModOptions.suffix(mod.suffix);const line=node('div',undefined,'equipped-mod');line.append(node('span',(target?PhoenixNames.name(target):'Mod no disponible')+' · Nv. '+mod.level+(suffix?' · '+suffix.name:'')));if(!compact&&target)line.append(button('Consultar mod',()=>openDetail(target.id),'gear-link'));box.append(line);}
      return box;
    }
    const weapon=tile(equipment.weapon,'Arma principal','gear-weapon','weapon');view.append(weapon);
    const armor=node('div',undefined,'gear-armor');for(const [i,piece]of equipment.armor.entries())armor.append(tile(piece.entry,piece.slot,'',PhoenixBuilds.slots[i+1][0]));view.append(armor);
    if(!compact){
      const info=node('div',undefined,'gear-overview');info.append(node('div','TU CONFIGURACIÓN','eyebrow'),node('h3','Equipo de la build'),node('p',entry.subtitle),node('p','Usa «Editar build» para cambiar las piezas. Las selecciones no marcan automáticamente los planos como obtenidos.','muted'),node('p','Pulsa el nombre de una pieza para consultar su ficha.','muted'));view.prepend(info);
    }
    view.append(node('p',compact?'Equipo de tu build personal':'Imágenes desde la wiki. Esta vista no calcula estadísticas del personaje.','gear-note'));return view;
  }
  const editor=node('dialog',undefined,'build-dialog'),picker=node('dialog',undefined,'build-dialog');editor.id='build-editor';picker.id='gear-picker';document.body.append(editor,picker);
  let draft=null,pickerSlot='helmet',pickerOwned=true,pickerKind='piece',returnDetail=null;
  const editorTop=node('div',undefined,'dialog-top');editorTop.append(node('span','CONSTRUCTOR DE BUILDS','eyebrow'),button('×',()=>editor.close(),'icon'));editorTop.lastChild.setAttribute('aria-label','Cerrar constructor');
  const editorHeading=node('h2','Crear build');editorHeading.id='editor-heading';editor.setAttribute('aria-labelledby',editorHeading.id);
  function editorField(label,id,tag,max){const wrapper=node('label',label,'builder-field'),input=node(tag);input.id=id;input.maxLength=max;wrapper.htmlFor=id;wrapper.append(input);return {wrapper,input};}
  const buildName=editorField('Nombre de la build','build-name','input',120),buildVersion=editorField('Versión o parche','build-version','input',120),buildDescription=editorField('Descripción y objetivo','build-description','textarea',2000);
  const fields=node('div',undefined,'builder-fields');fields.append(buildName.wrapper,buildVersion.wrapper,buildDescription.wrapper);
  const editorEquipment=node('section',undefined,'build-equipment builder-equipment');editorEquipment.setAttribute('aria-label','Editar equipamiento');
  const editorError=node('p',undefined,'preview-error');editorError.setAttribute('role','alert');
  const editorActions=node('div',undefined,'builder-actions');editorActions.append(button('Guardar build',commitBuild),button('Cancelar',()=>editor.close(),'secondary'));
  editor.append(editorTop,editorHeading,fields,node('p','Pulsa cada ranura para elegir una pieza. Puedes guardar una build incompleta.','muted'),editorEquipment,editorError,editorActions);
  const pickerTop=node('div',undefined,'dialog-top');pickerTop.append(node('span','ELEGIR EQUIPO','eyebrow'),button('×',()=>picker.close(),'icon'));pickerTop.lastChild.setAttribute('aria-label','Cerrar selector');
  const pickerHeading=node('h2');pickerHeading.id='picker-heading';picker.setAttribute('aria-labelledby',pickerHeading.id);
  const pickerSearch=node('input');pickerSearch.type='search';pickerSearch.id='picker-search';pickerSearch.placeholder='Buscar por nombre en castellano u original';pickerSearch.setAttribute('aria-label','Buscar pieza');pickerSearch.addEventListener('input',renderPicker);
  const pickerFilters=node('div',undefined,'picker-filters'),ownedButton=button('En mi colección',()=>{pickerOwned=true;renderPicker();},'secondary'),allButton=button('Mostrar todos',()=>{pickerOwned=false;renderPicker();},'secondary');pickerFilters.append(ownedButton,allButton,button('Vaciar ranura',()=>choosePiece(''),'secondary'));
  const pickerCount=node('p',undefined,'muted'),pickerGrid=node('div',undefined,'picker-grid');picker.append(pickerTop,pickerHeading,pickerSearch,pickerFilters,pickerCount,pickerGrid);
  function drawEditorEquipment(){
    editorEquipment.replaceChildren();const overview=node('div',undefined,'gear-overview');overview.append(node('div','TU EQUIPO','eyebrow'),node('h3','Elige tu configuración'),node('p','Un arma principal y seis piezas de armadura.','muted'),node('p','Las piezas fuera de tu colección quedan identificadas. No se calculan estadísticas del personaje.','muted'));editorEquipment.append(overview);
    const armor=node('div',undefined,'gear-armor');
    for(const [key,label]of PhoenixBuilds.slots){const raw=catalog.entries.find(e=>e.id===draft.slots[key]),wrapper=node('div',undefined,'gear-slot builder-slot '+(key==='weapon'?'gear-weapon':'')),tile=button('',()=>openPicker(key),'gear-piece');tile.dataset.slot=key;tile.setAttribute('aria-label','Elegir '+label);tile.append(node('span',label,'gear-label'));
      if(raw){const e=PhoenixNames.present(raw,catalog.entries);tile.append(itemPicture(e,false,true),node('span',e.name,'gear-link'),node('span',progress.done[e.id]?'✓ En mi colección':'Pendiente de conseguir','gear-owned'));}else tile.append(node('span',draft.slots[key]?'Pieza no disponible · elegir otra':'＋ Elegir pieza','empty-slot'));
      wrapper.append(tile);const modControls=node('div',undefined,'mod-controls'),choice=draft.mods[key],mod=catalog.entries.find(e=>e.id===choice?.id),pickMod=button(mod?PhoenixNames.name(mod):choice?'Mod no disponible':'＋ Elegir mod',()=>openPicker(key,'mod'),'mod-select-button');pickMod.setAttribute('aria-label','Elegir mod · '+label);pickMod.disabled=!draft.slots[key];modControls.append(pickMod);
      if(choice){
        const levelLabel=node('label','Nivel '),level=node('select');level.setAttribute('aria-label','Nivel del mod · '+label);for(let n=1;n<=17;n++){const o=node('option','Nv. '+n);o.value=String(n);level.append(o);}level.value=String(choice.level);level.addEventListener('change',()=>{draft.mods[key].level=Number(level.value);});levelLabel.append(level);
        const suffixLabel=node('label','Sufijo '),suffix=node('select');suffix.setAttribute('aria-label','Sufijo del mod · '+label);const unknown=node('option','Sin indicar');unknown.value='';suffix.append(unknown);for(const s of PhoenixModOptions.suffixes.filter(s=>!s.slots||s.slots.includes(key))){const o=node('option',s.name);o.value=s.id;suffix.append(o);}suffix.value=choice.suffix;
        const hint=node('p',undefined,'mod-hint');function updateHint(){const s=PhoenixModOptions.suffix(suffix.value);hint.textContent=s?s.effect+' Comprueba que esta variante exista para tu mod.':'Selecciona la familia que aparece en tu mod. El nivel no recalcula aquí su efecto.';}suffix.addEventListener('change',()=>{draft.mods[key].suffix=suffix.value;updateHint();});updateHint();suffixLabel.append(suffix);
        modControls.append(levelLabel,suffixLabel,hint,button('Quitar mod',()=>{delete draft.mods[key];drawEditorEquipment();},'remove-mod'));
      }else modControls.append(node('p',draft.slots[key]?'Selecciona un mod compatible con esta ranura.':'Elige primero una pieza.','mod-hint'));
      wrapper.append(modControls);if(key==='weapon')editorEquipment.append(wrapper);else armor.append(wrapper);
    }editorEquipment.append(armor);
  }
  function openEditor(entry=null,copy=false){
    returnDetail=$('detail').open?entry?.id:null;if($('detail').open)$('detail').close();
    const selection=entry?.personalBuild?.slots||{};
    draft={id:entry?.personalBuild&&!copy?entry.id:'personal-build-'+crypto.randomUUID(),slots:{...selection},mods:structuredClone(entry?.personalBuild?.mods||{})};buildName.input.value=entry?(copy?entry.name+' · copia':entry.name):'Nueva build';buildVersion.input.value=entry?.gameVersion||'';buildDescription.input.value=entry?.personalBuild?.description||'';editorHeading.textContent=entry?.personalBuild&&!copy?'Editar build':'Crear build';editorError.textContent='';drawEditorEquipment();editor.showModal();buildName.input.focus();
  }
  function openPicker(key,kind='piece'){pickerSlot=key;pickerKind=kind;pickerOwned=true;pickerSearch.value='';pickerHeading.textContent='Elegir '+(kind==='mod'?'mod · ':'')+PhoenixBuilds.slots.find(([s])=>s===key)[1];renderPicker();picker.showModal();pickerSearch.focus();}
  function renderPicker(){
    pickerFilters.lastChild.textContent=pickerKind==='mod'?'Quitar mod':'Vaciar ranura';
    ownedButton.setAttribute('aria-pressed',String(pickerOwned));allButton.setAttribute('aria-pressed',String(!pickerOwned));pickerGrid.replaceChildren();const provider=pickerKind==='mod'?PhoenixModOptions:PhoenixBuilds,all=provider.candidates(catalog.entries,pickerSlot,false,progress);let entries=provider.candidates(catalog.entries,pickerSlot,pickerOwned,progress);if(pickerSearch.value.trim())entries=Core.search(entries,pickerSearch.value);
    pickerCount.textContent=entries.length+' opciones visibles · '+all.length+' en el catálogo'+(pickerKind==='mod'?' · La colección filtra el mod base, no su nivel o sufijo.':'');
    if(!entries.length)pickerGrid.append(node('p',pickerOwned?'No tienes piezas de esta ranura para esta búsqueda. Pulsa «Mostrar todos» para elegir también las que te faltan.':'No hay piezas para esta búsqueda.','empty'));
    for(const raw of entries){const e=PhoenixNames.present(raw,catalog.entries),item=button('',()=>choosePiece(e.id),'picker-item');item.dataset.itemId=e.id;item.setAttribute('aria-label','Seleccionar '+e.name);item.setAttribute('aria-pressed',String((pickerKind==='mod'?draft.mods[pickerSlot]?.id:draft.slots[pickerSlot])===e.id));item.append(itemPicture(e,false,true),node('strong',e.name),node('span',e.originalName||'','original-name'),node('span',progress.done[e.id]?'✓ En mi colección':'Pendiente de conseguir','gear-owned'));if(pickerKind==='mod')item.append(node('p',e.summary,'mod-hint'));pickerGrid.append(item);}
  }
  function choosePiece(id){if(pickerKind==='mod'){if(id)draft.mods[pickerSlot]={id,level:draft.mods[pickerSlot]?.level||1,suffix:draft.mods[pickerSlot]?.suffix||''};else delete draft.mods[pickerSlot];}else{draft.slots[pickerSlot]=id;if(!id)delete draft.mods[pickerSlot];}picker.close();drawEditorEquipment();editorEquipment.querySelector('[data-slot="'+pickerSlot+'"]')?.focus({preventScroll:true});}
  function commitBuild(){
    if(!buildName.input.value.trim()){editorError.textContent='Escribe un nombre para la build.';buildName.input.focus();return;}
    try{const entry=PhoenixBuilds.create({id:draft.id,name:buildName.input.value,description:buildDescription.input.value,version:buildVersion.input.value,selection:draft.slots,mods:draft.mods},catalog.entries),index=catalog.entries.findIndex(e=>e.id===entry.id),next={...catalog,entries:index<0?[...catalog.entries,entry]:catalog.entries.map(e=>e.id===entry.id?entry:e)};Core.validateCatalog(next);catalog=next;const ok=save();returnDetail=null;editor.close();section='Builds';query='';$('search').value='';$('scenario').value='';collectionFilter.value='';render();openDetail(entry.id);toast(ok?'Build preparada. Comprueba el indicador de guardado.':'Build disponible en esta sesión. Exporta una copia para conservarla.');}catch(error){editorError.textContent=error.message;}
  }
  editor.addEventListener('close',()=>{if(picker.open)picker.close();if(returnDetail){const id=returnDetail;returnDetail=null;openDetail(id);}});
  const createBuild=button('＋ Crear build',()=>openEditor());createBuild.id='create-build';createBuild.hidden=true;document.querySelector('.section-heading').append(createBuild);
  const communityBuilds=button('Builds de la comunidad ↗',()=>window.open('https://meta-builds.net/builds','_blank','noopener,noreferrer'),'secondary');communityBuilds.id='community-builds';communityBuilds.hidden=true;document.querySelector('.section-heading').append(communityBuilds);
  function save(){try{const accepted=PhoenixStorage.save({catalog,progress});storageAvailable=accepted;return accepted;}catch{storageAvailable=false;toast('No se pudo guardar localmente. Exporta una copia de seguridad de esta sesión.');return false;}}
  function toggle(key,id){progress[key][id]=!progress[key][id];save();render();}
  function collectionCheck(e,text,afterChange,compact=false){
    const label=node('label',undefined,compact?'collection-toggle':'check-row'),input=node('input');input.type='checkbox';input.dataset.collectionId=e.id;input.setAttribute('aria-label',text+': '+e.name);
    label.title=Collection.isSet(e)?'Marca o desmarca los planos de todas las piezas del conjunto':e.category==='Armas'||e.category==='Armaduras'?'Marca el plano desbloqueado en tu colección':'Marca este objeto como conseguido';
    label.append(input,node('span',text));label.refresh=()=>{const state=Collection.state(e,progress,catalog.entries);input.checked=state.checked;input.indeterminate=state.mixed;label.classList.toggle('is-owned',state.checked);};label.refresh();
    input.addEventListener('change',()=>{Collection.set(e,input.checked,progress,catalog.entries);save();render();afterChange?.();if(compact)$('cards').querySelector('[data-collection-id="'+e.id+'"]')?.focus({preventScroll:true});});
    return label;
  }
  function render(){
    modGuideShortcut.hidden=section!=='Mods/Calibraciones';
    createBuild.hidden=section!=='Builds';
    communityBuilds.hidden=section!=='Builds';
    if(Collection.migrate(progress,catalog.entries))save();
    const isHome=section==='Inicio'&&!query;
    scenarioOptions();activityFilterLabel.hidden=section!=='Silos/Monolitos';
    document.querySelector('.filters').hidden=isHome;
    $('stats').hidden=!isHome;
    $('home-links').hidden=!isHome;
    const menuScroll=$('navigation').querySelector('.nav-catalog')?.scrollTop||0;
    $('navigation').replaceChildren();
    const personal=node('div',undefined,'nav-personal'),catalogMenu=node('div',undefined,'nav-catalog');
    catalogMenu.setAttribute('aria-label','Catálogo');catalogMenu.append(node('div','EXPLORAR LA GUÍA','nav-heading'));
    $('navigation').append(personal,catalogMenu);
    for(const name of ['Inicio','Checklist','Favoritos',...Core.categories]){
      const count=name==='Inicio'?catalog.entries.length:name==='Favoritos'?catalog.entries.filter(e=>progress.favorites[e.id]).length:name==='Checklist'?Collection.count(catalog.entries,progress):catalog.entries.filter(e=>e.category===name).length;
      const b=button('',()=>{section=name;query='';$('search').value='';$('scenario').value='';collectionFilter.value='';render();},section===name?'active':'');
      b.append(node('span',symbols[name],'nav-symbol'),node('span',Core.categoryLabel(name)),node('span',String(count).padStart(2,'0'),'nav-count'));if(section===name)b.setAttribute('aria-current','page');(Core.categories.includes(name)?catalogMenu:personal).append(b);
    }
    catalogMenu.scrollTop=menuScroll;
    $('catalog-version').textContent=catalog.catalogVersion;$('catalog-date').textContent=catalog.updatedAt;
    const pictures=catalog.entries.map(e=>PhoenixMedia.resolve(e.id,PHOENIX_MEDIA,e)).filter(Boolean);
    imageNote.textContent='Imágenes en línea: '+pictures.filter(p=>p.remote).length+' / '+catalog.entries.length+' fichas. La app y tus datos siguen en este equipo; las imágenes se cargan directamente desde la wiki o los medios oficiales y requieren Internet. Si la fuente bloquea una imagen, puedes abrir su procedencia. No hace falta descargarlas previamente.';
    $('breadcrumb').textContent=query?'Búsqueda global':Core.categoryLabel(section);
    $('stats').replaceChildren();
    for(const [num,label,target] of [[catalog.entries.length,'FICHAS EN LA GUÍA',''],[catalog.entries.filter(e=>progress.favorites[e.id]).length,'FAVORITOS','Favoritos'],[Collection.count(catalog.entries,progress),'MI COLECCIÓN','Checklist']]){const item=target?button('',()=>{section=target;query='';$('search').value='';$('scenario').value='';collectionFilter.value='';render();},'stat'):node('div',undefined,'stat');if(target)item.setAttribute('aria-label','Abrir '+Core.categoryLabel(target));item.append(node('b',String(num).padStart(2,'0')),node('span',label));if(target)item.append(node('span','↗','stat-arrow'));$('stats').append(item);}
    const recent=[...catalog.entries].sort((a,b)=>String(b.updatedAt||b.wiki?.fetchedAt||'').localeCompare(String(a.updatedAt||a.wiki?.fetchedAt||''))).slice(0,6);
    let entries=query?Core.search(catalog.entries,query):isHome?recent:catalog.entries.filter(e=>section==='Favoritos'&&progress.favorites[e.id]||section==='Checklist'&&Collection.eligible(e)&&!Collection.isSet(e)&&Collection.state(e,progress,catalog.entries).checked||e.category===section);
    if($('scenario').value){const scenario=catalog.entries.find(e=>e.id===$('scenario').value);entries=entries.filter(e=>e.world?PhoenixWorld.matches(e,scenario.id):Core.search([e],scenario.originalName||scenario.name).length);}
    if(section==='Silos/Monolitos'&&activityFilter.value)entries=entries.filter(e=>e.world?.type===activityFilter.value);
    worldInfo.hidden=!['Silos/Monolitos','Escenarios'].includes(section)||!!query;
    const selectedScenario=catalog.entries.find(e=>e.id===$('scenario').value);
    worldInfo.textContent=selectedScenario?.world?.coverage||'Consulta de la wiki: 23/10/2026. Las fichas distinguen silos, monolitos y otras actividades. Las lagunas o discrepancias de las fuentes se indican en cada ficha; las variantes con el mismo código no se mezclan.';
    if(collectionFilter.value)entries=entries.filter(e=>Collection.eligible(e)&&(collectionFilter.value==='owned'?Collection.state(e,progress,catalog.entries).checked:!Collection.state(e,progress,catalog.entries).checked));
    $('section-title').textContent=query?'Resultados en toda la guía':isHome?'Lo último en la guía':Core.categoryLabel(section);
    $('section-kicker').textContent=query?'BUSCADOR GLOBAL':isHome?'ACTUALIZACIONES RECIENTES':section==='Checklist'?'PLANOS, MODS Y DESVIACIONES QUE YA TIENES':'TU ARCHIVO DE NALCOTT';
    $('result-count').textContent=isHome?entries.length+' novedades':entries.length+' fichas';$('cards').replaceChildren();
    if(!entries.length)$('cards').append(node('div',section==='Checklist'?'Tu colección está vacía para estos filtros. Marca los checks junto a los favoritos para añadir lo que ya tienes.':query?'No hay coincidencias. Prueba con «Burn», «PHI» o «Pyro Dino».':section==='Builds'?'Aún no tienes builds. Pulsa «Crear build» para preparar tu equipo.':section==='Favoritos'?'Aún no tienes favoritos. Usa la estrella de cualquier ficha.':'No hay fichas para este filtro.','empty'));
    for(const raw of entries){
      const e=PhoenixNames.present(raw,catalog.entries);
      const card=node('article',undefined,'card'),art=node('div',undefined,'card-art'),body=node('div',undefined,'card-body'),foot=node('div',undefined,'card-foot');
      if(e.category==='Builds'&&buildEquipment(e)){art.classList.add('build-art');art.append(buildView(e,true));}else if(e.world&&!PhoenixMedia.resolve(e.id,PHOENIX_MEDIA,e)){art.classList.add('world-art');art.append(node('span',e.category==='Escenarios'?'◈':'▥','world-glyph'),node('div',e.world.type,'world-kind'),node('div',e.world.region,'world-region'));}else art.append(itemPicture(e));
      art.append(node('span',Core.categoryLabel(e.category),'type'));
      body.append(node('h3',e.name));
      if(e.originalName)body.append(node('div',e.originalName,'original-name'));
      body.append(node('div',e.subtitle,'subtitle'),node('p',e.summary),node('span',e.status,'status'));
      if(e.world){const labels=e.world.scenarios.map(id=>catalog.entries.find(s=>s.id===id)?.name).filter(Boolean);body.append(node('p',e.category==='Escenarios'?e.world.coverage:labels.join(' · '),'world-availability'));}
      if(e.gameVersion)body.append(node('span',e.updatedAt+' · '+e.gameVersion,'card-date'));
      const star=button(progress.favorites[e.id]?'★':'☆',()=>toggle('favorites',e.id),'favorite'+(progress.favorites[e.id]?' selected':''));star.setAttribute('aria-label',(progress.favorites[e.id]?'Quitar de':'Añadir a')+' favoritos: '+e.name);star.setAttribute('aria-pressed',String(!!progress.favorites[e.id]));
      const toggles=node('div',undefined,'card-toggles');if(Collection.eligible(e))toggles.append(collectionCheck(e,'En colección',null,true));toggles.append(star);
      foot.append(button('Abrir ficha ↗',()=>openDetail(e.id)),toggles);card.append(art,body,foot);
      card.tabIndex=0;card.setAttribute('aria-label','Abrir ficha: '+e.name);card.setAttribute('aria-haspopup','dialog');
      card.addEventListener('click',event=>{if(event.target.closest('button,a,input,label,select,textarea'))return;if(window.getSelection()?.toString())return;openDetail(e.id);});
      card.addEventListener('keydown',event=>{if(event.target===card&&(event.key==='Enter'||event.key===' ')){event.preventDefault();openDetail(e.id);}});
      $('cards').append(card);
    }
    if(isHome){
      const links=$('home-links-grid');links.replaceChildren();
      for(const category of Core.categories){
        const count=catalog.entries.filter(e=>e.category===category).length;
        const link=button('',()=>{section=category;query='';$('search').value='';$('scenario').value='';collectionFilter.value='';render();},'home-link');
        link.append(node('strong',Core.categoryLabel(category)),node('span',count+' fichas'),node('span','↗','home-link-arrow'));links.append(link);
      }
    }
  }
  function checkRow(text,checked,fn){const label=node('label',undefined,'check-row'),input=node('input');input.type='checkbox';input.checked=checked;input.addEventListener('change',fn);label.append(input,node('span',text));return label;}
  function openDetail(id){
    const raw=catalog.entries.find(e=>e.id===id);if(!raw)return;const e=PhoenixNames.present(raw,catalog.entries);
    const box=$('detail-content');box.replaceChildren();const top=node('div',undefined,'dialog-top');top.append(node('span',Core.categoryLabel(e.category),'eyebrow'),button('×',()=>$('detail').close(),'icon'));top.lastChild.setAttribute('aria-label','Cerrar ficha');
    box.append(top,node('h2',e.name));
    if(e.originalName)box.append(node('div','Original: '+e.originalName,'original-name'),node('p',e.nameNotice,'muted'));
    box.append(node('div',e.subtitle,'detail-subtitle'));
    $('detail').classList.toggle('build-dialog',e.category==='Builds'&&!!buildEquipment(e));
    if(e.world){if(PhoenixMedia.resolve(e.id,PHOENIX_MEDIA,e))box.append(itemPicture(e,true));const facts=node('dl',undefined,'world-facts');for(const [label,value] of [['Tipo',e.world.type],['Modalidad',e.world.mode],['Región',e.world.region],['Nivel de referencia',e.world.level],['Jefe',e.world.boss],['Recompensas documentadas',e.world.rewards],['Cobertura de actividades',e.world.coverage]]){if(value!==undefined&&value!==null){facts.append(node('dt',label),node('dd',String(value)));}}box.append(facts);}
    else box.append(e.category==='Builds'?buildView(e):itemPicture(e,true));
    const tags=node('div',undefined,'detail-tags');e.tags.forEach(t=>tags.append(node('span',t)));box.append(tags);
    box.append(node('div',e.status+(e.gameVersion?' · '+e.gameVersion+' · Actualización editorial: '+e.updatedAt:''),'metadata'),node('p',e.summary));
    e.details.forEach(t=>box.append(node('p',t)));
    if(e.wiki?.kind==='mod'&&e.wiki.originalEffect){const reference=node('details');reference.append(node('summary','Texto original del efecto (referencia)'),node('p',e.wiki.originalEffect));if(e.wiki.originalAttribute)reference.append(node('p',e.wiki.originalAttribute));box.append(reference);}
    const actions=node('div',undefined,'detail-actions');actions.append(button(progress.favorites[id]?'★ En favoritos':'☆ Guardar favorito',()=>{toggle('favorites',id);openDetail(id);},'secondary'));if(raw.id==='kvd')actions.append(button('Ver builds de KVD en Meta-Builds ↗',()=>window.open('https://meta-builds.net/once-human/weapons/kvd-boom-boom-96/','_blank','noopener,noreferrer'),'secondary'));box.append(actions);
    if(e.category==='Builds'){if(e.personalBuild)actions.prepend(button('Editar build',()=>openEditor(raw)));actions.append(button('Crear copia editable',()=>openEditor(raw,true),'secondary'));const panel=box.querySelector('.build-equipment');if(panel)box.insertBefore(actions,panel);}
    const collectionControls=[],refreshCollection=()=>collectionControls.forEach(c=>c.refresh());
    if(Collection.eligible(e)){const control=collectionCheck(e,Collection.isSet(e)?'Todos los planos del conjunto en mi colección':'Ya en mi colección',refreshCollection);collectionControls.push(control);box.append(control);if(e.category==='Armas'||e.category==='Armaduras')box.append(node('p','Marca los planos que has desbloqueado; recoger una copia de un arma o armadura no implica tener su plano.','muted'));}
    if(Collection.isSet(e)){box.append(node('h3','Planos de las piezas'));for(const part of Collection.parts(e,catalog.entries)){const localized=PhoenixNames.present(part,catalog.entries),control=collectionCheck(localized,localized.name,refreshCollection);collectionControls.push(control);box.append(control);}}
    else if(e.equipment){box.append(node('h3','Equipo por reunir'));e.equipment.forEach((part,i)=>{const key=id+':'+i;box.append(checkRow(part,!!progress.equipment[key],()=>{progress.equipment[key]=!progress.equipment[key];save();}));});}
    const label=node('label','Notas personales');label.htmlFor='entry-notes';box.append(node('h3'));box.lastChild.append(label);
    const notes=node('textarea');notes.id='entry-notes';notes.maxLength=20000;notes.placeholder='Tu ruta, pruebas de daño, materiales pendientes…';notes.value=progress.notes[id]||'';notes.addEventListener('input',()=>{progress.notes[id]=notes.value;const ok=save();noteStatus.textContent=ok?'Cambios guardados en este dispositivo.':'No se han podido guardar los cambios.';});const noteStatus=node('div',storageAvailable?'Tus notas se guardan en este dispositivo.':'No se han podido guardar los cambios.','muted');box.append(notes,noteStatus);
    box.append(node('h3','Fichas relacionadas'));const related=node('div',undefined,'related');for(const link of e.related){const target=catalog.entries.find(x=>x.id===link);related.append(button(PhoenixNames.name(target),()=>openDetail(link),'secondary'));}box.append(related);
    box.append(node('h3','Fuentes y procedencia'));
    if(!e.sources.length)box.append(node('p',e.personalBuild?'Build creada localmente por ti. Consulta las fuentes de cada pieza en sus fichas relacionadas.':'Ficha personal basada en nuestra conversación; sin fuente externa suficiente.'));
    for(const s of e.sources){const a=node('a',s.label+' ↗','source');a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';box.append(a);}
    box.append(node('p',e.personalBuild?'Última modificación de tu build: '+e.updatedAt:e.wiki?'Revisión de la wiki: '+e.wiki.revisedAt+' · Descargada: '+e.wiki.fetchedAt+'. La descarga no certifica el balance del parche actual.':'Consulta de fuentes: 22/10/2026 para el catálogo inicial. La fecha editorial no certifica el balance del parche actual.','muted'));
    if(!$('detail').open)$('detail').showModal();else $('detail').scrollTop=0;
  }
  function download(name,data){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=node('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function clearPreview(){pending=null;$('import-preview').hidden=true;$('import-preview').replaceChildren();}
  let wikiController=null,wikiResult=null;
  const wikiPanel=node('section');wikiPanel.id='wiki-panel';
  const wikiStatus=node('p','Actualiza armas, armaduras, mods y desviaciones desde la wiki. Revisa el resultado antes de guardarlo. El resto de secciones se conserva.','muted');wikiStatus.setAttribute('role','status');
  const wikiPreview=node('div');wikiPreview.id='wiki-preview';
  const cancelWiki=button('Cancelar descarga',()=>wikiController?.abort(),'secondary');cancelWiki.hidden=true;
  async function consultWiki(kind){
    const armor=kind==='armor',mods=kind==='mods',deviations=kind==='deviations',label=deviations?'desviaciones':mods?'mods':armor?'armaduras':'armas',capital=deviations?'Desviaciones':mods?'Mods':armor?'Armaduras':'Armas';
    if(wikiController)return;
    clearPreview();wikiResult=null;wikiPreview.replaceChildren();wikiController=new AbortController();updateWiki.disabled=true;updateArmor.disabled=true;updateMods.disabled=true;updateDeviations.disabled=true;cancelWiki.hidden=false;
    const timeout=setTimeout(()=>wikiController?.abort(),180000);
    try{
      wikiStatus.textContent='Leyendo el índice de '+label+'…';
      wikiResult=await (deviations?PhoenixWiki.importDeviations:mods?PhoenixWiki.importMods:armor?PhoenixWiki.importArmor:PhoenixWiki.importWeapons)({signal:wikiController.signal,onProgress:text=>wikiStatus.textContent=text});
      Core.validateCatalog(PhoenixWiki.merge(catalog,wikiResult));
      wikiStatus.textContent=wikiResult.entries.length+' fichas de '+label+' listas para revisar. '+wikiResult.skipped.length+' páginas sin plantilla compatible omitidas. Todavía no se ha modificado tu catálogo.';
      const list=node('ul');wikiResult.entries.forEach(e=>list.append(node('li',PhoenixNames.name(e)+' · revisión '+e.wiki.revisedAt.slice(0,10))));
      const details=node('details'),summary=node('summary','Ver fichas descargadas');details.append(summary,list);wikiPreview.append(details);
      if(wikiResult.skipped.length)wikiPreview.append(node('p','Omitidas: '+wikiResult.skipped.join(', '),'muted'));
      wikiPreview.append(node('p',deviations?'Se importan criaturas base, función general y condiciones de bienestar en castellano. Las fotos se cargan por URL con Internet; la wiki puede bloquearlas. Las descripciones incompletas se señalan.':mods?'Se importan nombres, efectos, rareza y ranuras de mods en castellano. Las revisiones antiguas y los textos que hayan cambiado se señalan para su revisión. No se importan sufijos, rutas ni calibraciones.':armor?'Se importan conjuntos y piezas por separado, con rangos de atributos y efectos. Los efectos sin traducción revisada aparecen en inglés. No se importan recetas.':'Se importan atributos y mecánicas detectadas. Las habilidades completas, recetas, traducción editorial y builds de otras webs quedan fuera de esta primera conexión.','muted'));
      wikiPreview.append(button('Guardar '+label+' para consultar sin conexión',()=>{
        if(!wikiResult)return;catalog=Core.validateCatalog(PhoenixWiki.merge(catalog,wikiResult));const ok=save();wikiResult=null;wikiPreview.replaceChildren();clearPreview();render();wikiStatus.textContent=ok?capital+(mods?' guardados. Ya puedes consultarlos sin conexión.':' guardadas. Ya puedes consultarlas sin conexión.'):capital+' disponibles solo en esta sesión. Exporta una copia para conservarlos.';toast(wikiStatus.textContent);
      }),button('Descartar descarga',()=>{wikiResult=null;wikiPreview.replaceChildren();wikiStatus.textContent='Descarga descartada. Tu catálogo sigue igual.';},'secondary'));
    }catch(error){wikiStatus.textContent=error.name==='AbortError'?'Descarga cancelada o agotó el tiempo. Tu catálogo sigue igual.':'No se pudo consultar la wiki. Tu catálogo sigue igual. '+error.message+' Si Fandom limita la conexión, puedes importar updates/wiki-'+label+'.json incluido en el proyecto.';}
    finally{clearTimeout(timeout);wikiController=null;updateWiki.disabled=false;updateArmor.disabled=false;updateMods.disabled=false;updateDeviations.disabled=false;cancelWiki.hidden=true;}
  }
  const updateWiki=button('↻ Consultar armas en la wiki',()=>consultWiki('weapons'));
  const updateArmor=button('↻ Consultar armaduras en la wiki',()=>consultWiki('armor'));
  const updateMods=button('↻ Consultar mods en la wiki',()=>consultWiki('mods'));
  const updateDeviations=button('↻ Consultar desviaciones en la wiki',()=>consultWiki('deviations'));
  const wikiActions=node('div',undefined,'data-actions');wikiActions.append(updateWiki,updateArmor,updateMods,updateDeviations,cancelWiki);wikiPanel.append(node('h3','Actualizar desde Once Human Wiki'),wikiStatus,wikiActions,wikiPreview,node('hr'));$('data-dialog').insertBefore(wikiPanel,$('data-dialog').querySelector('hr'));
  async function readFile(input,kind){
    const file=input.files[0];input.value='';if(!file)return;clearPreview();
    try{
      if(file.size>8*1024*1024)throw Error('El archivo supera el límite de 8 MB.');
      const data=JSON.parse(await file.text());let next,nextProgress;
      if(kind==='backup'){if(data.type!=='phoenix-backup'||data.schemaVersion!==1)throw Error('No es una copia Phoenix v1.');next=Core.validateCatalog(data.catalog);nextProgress=Core.validateProgress(data.progress);}else next=Core.validateCatalog(PhoenixBuilds.preserve(catalog,Core.validateCatalog(data)));
      if(!next.entries.some(e=>e.id==='mod-system-guide'))next={...next,entries:[...next.entries,PHOENIX_SEED.entries.find(e=>e.id==='mod-system-guide')]};
      next=Core.validateCatalog(PhoenixCatalogCleanup.clean(next));
      pending={catalog:next,progress:nextProgress};const preview=$('import-preview');preview.hidden=false;
      const oldIds=new Set(catalog.entries.map(e=>e.id)),newIds=new Set(next.entries.map(e=>e.id));
      preview.append(node('h3',kind==='backup'?'Restaurar copia completa':'Revisar actualización'),node('p','Versión: '+catalog.catalogVersion+' → '+next.catalogVersion+' · Fecha: '+next.updatedAt),node('p',next.entries.length+' fichas · '+[...newIds].filter(id=>!oldIds.has(id)).length+' nuevas · '+[...oldIds].filter(id=>!newIds.has(id)).length+' retiradas.'),node('p',kind==='backup'?'Se sustituirán el catálogo, favoritos, checklist y notas. Exporta tu copia actual si quieres conservarla.':'Se sustituye el catálogo completo. Se conservan favoritos, objetivos y notas por identificador. El progreso de fichas retiradas se mantiene para posibles futuras importaciones.'));
      preview.append(button('Aplicar '+(kind==='backup'?'restauración':'actualización'),()=>{if(!pending)return;catalog=pending.catalog;if(pending.progress)progress=pending.progress;const ok=save();clearPreview();render();toast(ok?'Archivo aplicado y guardado.':'Archivo aplicado solo a esta sesión. Exporta una copia.');}),button('Cancelar',clearPreview,'secondary'));
    }catch(error){toast('No se ha importado: '+error.message);}
  }
  $('search').addEventListener('input',e=>{query=e.target.value;render();});$('scenario').addEventListener('change',render);
  $('data-button').addEventListener('click',()=>{clearPreview();$('data-dialog').showModal();});document.querySelector('.close-data').addEventListener('click',()=>$('data-dialog').close());
  for(const dialog of [$('detail'),$('data-dialog'),editor,picker]){
    const outside=event=>{const r=dialog.getBoundingClientRect();return event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom;};
    let startedOutside=false;
    dialog.addEventListener('pointerdown',event=>{startedOutside=event.target===dialog&&outside(event);});
    dialog.addEventListener('click',event=>{if(startedOutside&&event.target===dialog&&outside(event))dialog.close();startedOutside=false;});
    dialog.addEventListener('close',()=>{startedOutside=false;});
  }
  $('export-backup').addEventListener('click',()=>download('phoenix-copia-'+new Date().toISOString().slice(0,10)+'.json',{type:'phoenix-backup',schemaVersion:1,catalog,progress}));
  $('export-catalog').addEventListener('click',()=>download('phoenix-catalogo.json',catalog));
  $('catalog-file').addEventListener('change',e=>readFile(e.target,'catalog'));$('restore-file').addEventListener('change',e=>readFile(e.target,'backup'));
  document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();section='Inicio';query='';$('search').value='';$('scenario').value='';collectionFilter.value='';render();});
  document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!document.querySelector('dialog[open]')){e.preventDefault();$('search').focus();}});
  if(worldChanged||modGuideAdded||legacyCleaned||PhoenixStorage.needsMigration)save();
  render();
})();
