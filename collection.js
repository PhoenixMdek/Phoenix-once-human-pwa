/* La colección registra planos desbloqueados y objetos reunidos; mantiene los identificadores del guardado. */
(function(root){
  const isSet=e=>e.category==='Armaduras'&&e.wiki?.kind==='set';
  const eligible=e=>['Armas','Armaduras','Deviations'].includes(e.category)||(e.category==='Mods/Calibraciones'&&e.wiki?.kind==='mod');
  const parts=(e,entries)=>isSet(e)?entries.filter(p=>p.wiki?.kind==='piece'&&p.wiki.setId===e.id):[];
  function state(e,progress,entries){
    const pieces=parts(e,entries);
    if(pieces.length){const count=pieces.filter(p=>progress.done[p.id]).length;return {checked:count===pieces.length,mixed:count>0&&count<pieces.length,count,total:pieces.length};}
    return {checked:!!progress.done[e.id],mixed:false,count:progress.done[e.id]?1:0,total:1};
  }
  function set(e,checked,progress,entries){
    if(!eligible(e))return;
    const pieces=parts(e,entries);
    if(pieces.length){pieces.forEach(p=>progress.done[p.id]=checked);delete progress.done[e.id];}else progress.done[e.id]=checked;
  }
  function migrate(progress,entries){
    let changed=false;
    for(const e of entries.filter(isSet)){
      const pieces=parts(e,entries);if(!pieces.length)continue;
      for(const [i,name] of (e.equipment||[]).entries()){
        const key=e.id+':'+i,piece=pieces.find(p=>p.name===name);if(!piece||!Object.hasOwn(progress.equipment,key))continue;
        if(!Object.hasOwn(progress.done,piece.id))progress.done[piece.id]=progress.equipment[key];delete progress.equipment[key];changed=true;
      }
      if(!Object.hasOwn(progress.done,e.id))continue;
      for(const p of pieces)if(!Object.hasOwn(progress.done,p.id))progress.done[p.id]=progress.done[e.id];
      delete progress.done[e.id];changed=true;
    }return changed;
  }
  const count=(entries,progress)=>entries.filter(e=>eligible(e)&&!isSet(e)&&state(e,progress,entries).checked).length;
  root.PhoenixCollection={eligible,isSet,parts,state,set,migrate,count};if(typeof module!=='undefined')module.exports=root.PhoenixCollection;
})(globalThis);
