/* Nombres de presentación en castellano. No modifican los identificadores ni los originales de la wiki. */
(function(root){
  'use strict';
  const sets={
    'Agent Set':'Agente','Bastille Set':'Bastilla','Blackstone Set':'Piedra Negra','Blast Set':'Explosivo','Dark Resonance Set':'Resonancia Oscura','Falcon Set':'Halcón','Ghost Link Set':'Vínculo Fantasmal','Gravity Tide Set':'Marea Gravitatoria','Heavy Duty Set':'Trabajo Pesado','Lonewolf Set':'Lobo Solitario','Raid Set (Armor)':'Saqueo','Renegade Set':'Renegado','Rustic Set (Armor)':'Rústico','Savior Set':'Salvador','Scout Set':'Explorador','Shelterer Set':'Refugio','Snow Panther Set':'Pantera de las Nieves','Stormweaver Set':'Tejetormentas','Test Subject Set':'Sujeto de Pruebas','Treacherous Tides Set':'Mareas Traicioneras'
  };
  const pieces={
    'Ankh Mask':'Máscara de Anj','BBQ Gloves':'Guantes Parrilleros','Beret':'Boina','Bloodstained Tracker Boots':'Botas de Rastreador Ensangrentadas','Cage Helmet':'Casco de Jaula','Charmed Mag Top':'Torso de Cargador Encantado','Covert Walker Shirt':'Camisa de Caminante Encubierto','Stealth Walker Wrap':'Prenda de Caminante Sigiloso','Cowboy Boots':'Botas de Vaquero',"Doyen's Cloak":'Capa del Decano','Drifter Gauntlets':'Guanteletes de Vagabundo','Dust Mask':'Máscara Antipolvo','Earthly Boots':'Botas Terrenales','Explosive Front Top':'Torso de Frente Explosivo','Fire Rune Boots':'Botas de Runas de Fuego','Frost Tactical Top':'Torso Táctico de Escarcha','Gas Mask Hood':'Capucha con Máscara de Gas','Gas-Tight Helmet':'Casco Hermético','Gilded Gloves':'Guantes Dorados','Glide Pants':'Pantalones de Planeo','Hard Tactical Boots':'Botas Tácticas Reforzadas','Hardy Gloves':'Guantes Resistentes','Hot Dog Shorts':'Pantalones Cortos de Perrito Caliente','Leather Boots':'Botas de Cuero','Magnetic Moment Top':'Torso de Momento Magnético','Mayfly Goggles':'Gafas de Efímera','Oasis Mask':'Máscara de Oasis','Old Huntsman Boots':'Botas de Viejo Cazador','Overloaded Pants':'Pantalones Sobrecargados','Pivot Step Leather Boots':'Botas de Cuero de Paso Pivotante','Precise Shot Mask':'Máscara de Disparo Preciso','Renegade Hood':'Capucha de Renegado','Shaman Vulture Top':'Torso de Chamán Buitre','Shaman Vulture':'Chamán Buitre','Sharp Blade Pants':'Pantalones de Hoja Afilada','Sleek Leather Jacket':'Chaqueta de Cuero Elegante','Snow Camo Gloves':'Guantes de Camuflaje de Nieve','Snowdrift Top':'Torso de Ventisquero','Tactical Combat Shoes':'Calzado de Combate Táctico','Tattoo Pants':'Pantalones de Tatuaje','Test Subject Mask':'Máscara de Sujeto de Pruebas','Test Subject Pants':'Pantalones de Sujeto de Pruebas','Test Subject Top':'Torso de Sujeto de Pruebas','Viper Mask':'Máscara de Víbora','Wind Interpreter Cap':'Gorra de Intérprete del Viento','Yellow Paint Mask':'Máscara de Pintura Amarilla'
  };
  const weapons={
    'KVD - Boom! Boom!':'KVD - ¡Bum! ¡Bum!',
    'ACS12 - Corrosion':'ACS12 - Corrosión','ACS12 - Netherworld':'ACS12 - Inframundo','ACS12 - Pyroclasm Starter':'ACS12 - Iniciador de Piroclastos','AUG - Electron Cloud':'AUG - Nube de Electrones','AWS.338 - Bingo':'AWS.338 - Bingo','AWS.338 - Black Panther':'AWS.338 - Pantera Negra',
    'Baseball Bat':'Bate de Béisbol','Broken Bottle':'Botella Rota','Camping Knife':'Cuchillo de Acampada','Compound Bow':'Arco Compuesto','Compound Bow - The Burden of Betrayal':'Arco Compuesto - El Peso de la Traición','Critical Pulse':'Pulso Crítico','Crowbar':'Palanca',
    'DB12 - Backfire':'DB12 - Tiro por la Culata','DB12 - Raining Cash':'DB12 - Lluvia de Dinero','DBSG - Doombringer':'DBSG - Portador de la Perdición','DBSG - Dual Fury':'DBSG - Furia Doble','DBSG B.P.':'Plano de DBSG','DE.50':'DE.50','DE.50 - Jaws':'DE.50 - Mandíbulas','DE.50 - Wildfire':'DE.50 - Fuego Salvaje','EBR-14 - Octopus! Grilled Rings!':'EBR-14 - ¡Pulpo! ¡Aros a la Parrilla!','FP9 - Additional Rules':'FP9 - Reglas Adicionales','Frozen Northern Pike':'Lucio Congelado',
    'G17 - Dusty':'G17 - Polvoriento','G17 - Hazardous Object':'G17 - Objeto Peligroso','HAMR - Brahminy':'HAMR - Brahminy','HAMR - CRUMBLE B.P.':'Plano de HAMR - Derrumbe','KAM - Abyss Glance':'KAM - Mirada del Abismo','KAM - Burning Rage':'KAM - Furia Ardiente','KAM - Pioneer':'KAM - Pionero','KAM B.P':'Plano de KAM','Kukri':'Kukri','KV-SBR - Icy Rain':'KV-SBR - Lluvia Helada','KV-SBR - Little Jaws':'KV-SBR - Pequeñas Mandíbulas','KVD - ICEBREAKER B.P.':'Plano de KVD - Rompehielos','Long Axe':'Hacha Larga',
    'M416 - Autumn Equinox':'M416 - Equinoccio de Otoño','M416 - Scorched Earth':'M416 - Tierra Quemada','M416 - Silent Anabasis':'M416 - Anábasis Silenciosa','MG4 - Conflicting Memories':'MG4 - Recuerdos Contradictorios','MG4 - Mr Squid':'MG4 - Señor Calamar','MG4 - Predator':'MG4 - Depredador','MG4 - Wrath Of Hades':'MG4 - Ira de Hades','MG4 B.P.':'Plano de MG4','MGL':'MGL','Military Dagger':'Daga Militar','Military Shovel':'Pala Militar',
    'MPS5 - Blue Tiger':'MPS5 - Tigre Azul','MPS5 - Kumawink':'MPS5 - Kumawink','MPS5 - Primal Rage':'MPS5 - Furia Primigenia','MPS7 - Div-Evo':'MPS7 - Div-Evo','MPS7 - Outer Space':'MPS7 - Espacio Exterior','MPS7 B.P.':'Plano de MPS7','Nail Gun':'Pistola de Clavos','NORTHERN PIKE B.P.':'Plano de Lucio','OLD HUNTSMAN B.P.':'Plano de Viejo Cazador','PDW90 - Holographic Resonance':'PDW90 - Resonancia Holográfica','QBJ97 - Fiery Trees and Silver Flowers':'QBJ97 - Árboles de Fuego y Flores de Plata',
    'R500 - Hammerhead Shark':'R500 - Tiburón Martillo','R500 - Hunter':'R500 - Cazador','R500 - Hunter 500':'R500 - Cazador 500','R500 - Memento':'R500 - Memento','Recurve Bow':'Arco Recurvo','Recurve Crossbow':'Ballesta Recurva','RPG7 Rocket Launcher':'Lanzacohetes RPG7','Rusted Blade':'Hoja Oxidada','Rustic Crossbow':'Ballesta Rústica','S870 - SANDSTORM B.P.':'Plano de S870 - Tormenta de Arena','Scourge':'Azote','SKS - Pathfinder':'SKS - Explorador','SN700 - Finale':'SN700 - Gran Final','SN700 - Gulped Lore':'SN700 - Saber Engullido','SN700 B.P.':'Plano de SN700','SOCR - OUTSIDER':'SOCR - Forastero','SOCR - The Last Valor':'SOCR - El Último Valor','Steel Pipe':'Tubo de Acero','Stun Baton':'Porra Eléctrica','The Fabled Masamune':'La Legendaria Masamune','Torch':'Antorcha','Warning sign':'Señal de Advertencia','Wrench (Weapon)':'Llave Inglesa (arma)'
  };
  const weaponAliases={'KVD Boom! Boom!':'KVD - ¡Bum! ¡Bum!'};
  const slots={Helmet:'Casco',Mask:'Máscara',Top:'Torso',Gloves:'Guantes',Bottoms:'Pantalones',Pants:'Pantalones',Shoes:'Calzado',Boots:'Botas'};
  const garmentWords={Hood:'Capucha',Helmet:'Casco',Mask:'Máscara',Jacket:'Chaqueta',Shirt:'Camisa',Top:'Torso',Gloves:'Guantes',Gauntlets:'Guanteletes',Bottoms:'Pantalones',Pants:'Pantalones',Shoes:'Calzado',Boots:'Botas',Hat:'Sombrero',Cap:'Gorra',Shorts:'Pantalones cortos'};
  const notice='Nombre en castellano orientativo; no verificado como localización oficial del juego. El original inglés se conserva como referencia.';
  function name(entry){
    if(entry.category==='Deviations')return root.PhoenixDeviations?.name(entry.name)||(entry.wiki?.kind==='deviation'?'Desviación por revisar · ficha '+entry.wiki.pageId:entry.name);
    if(entry.category==='Mods/Calibraciones'&&entry.wiki?.kind==='mod')return root.PhoenixMods?.name(entry.name)||'Mod por revisar · ficha '+entry.wiki.pageId;
    if(entry.category==='Armas')return weapons[entry.name]||weaponAliases[entry.name]||entry.name;
    if(entry.category!=='Armaduras')return entry.name;
    if(sets[entry.name])return 'Conjunto '+sets[entry.name];
    if(pieces[entry.name])return pieces[entry.name];
    if(entry.wiki?.setId){
      const set=Object.keys(sets).find(s=>entry.tags.includes(s));
      if(set){
        const last=entry.name.split(/\s+/).at(-1),slot=Object.keys(slots).find(k=>entry.id.endsWith('-'+k.toLowerCase()));
        const garment=garmentWords[last]||slots[slot];
        if(garment)return garment+' de '+sets[set];
      }
    }
    return entry.name;
  }
  function replaceSetNames(text){let result=text;for(const [en,es] of Object.entries(sets))result=result.split(en).join(es);return result;}
  function present(entry,entries=[]){
    const translated=name(entry),changed=translated!==entry.name;
    return {...entry,name:translated,...(changed?{originalName:entry.name,nameNotice:notice}:{}),
      summary:replaceSetNames(entry.summary),subtitle:replaceSetNames(entry.subtitle),details:entry.details.map(replaceSetNames),
      equipment:entry.equipment?.map(part=>{const target=entries.find(e=>e.name===part&&(e.category==='Armas'||e.wiki?.setId===entry.id));return target?name(target):weapons[part]||weaponAliases[part]||pieces[part]||part;})};
  }
  function terms(entry){return [name(entry),entry.name,entry.originalName||''];}
  root.PhoenixNames={name,present,terms,notice,hasWeaponName:original=>Object.hasOwn(weapons,original)};
  if(typeof module!=='undefined')module.exports=root.PhoenixNames;
})(globalThis);
