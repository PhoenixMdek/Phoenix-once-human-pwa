/* Nombres y resúmenes editoriales vinculados a los campos de origen revisados. */
(function(root){
const records={
  "405": {
    "originalName": "The Digby Boy",
    "name": "Chico Digby",
    "summary": "Trabaja en el territorio recogiendo minerales o utilizando la plataforma minera.",
    "snapshot": "[\"Territory\",\"Materials\",\"{{PAGENAME}} is a B-grade [[Deviation/Territory List|Territory Deviation]] that works in the territory to gather ores or works at the mining platform.\"]",
    "partial": false
  },
  "866": {
    "originalName": "Strange Door",
    "name": "Puerta Extraña",
    "summary": "Produce materiales para construir portales y permite desplazarse entre sus réplicas.",
    "snapshot": "[\"Crafting\",\"Facility\",\"{{PAGENAME}} is an A-grade [[Deviation/Crafting List|Crafting Deviation]] that produces special materials and can repair its own replicas. Its owner can teleport between different Strange Doors. Unlocks the The Portal formula (The formula is displayed as the following facilities formulas: [[Standing Portal]] and [[Horizontal Portal]]). Produces [[Shattered Strange Door]], a required material for building the [[Standing Portal]] and [[Horizontal Portal]].\"]",
    "partial": false
  },
  "868": {
    "originalName": "Pyro Dino",
    "name": "Dino Ígneo",
    "summary": "Desviación de combate que potencia el daño de fuego y provoca explosiones.",
    "snapshot": "[\"Combat\",\"Attack\",\"[[Pyro Dino]] is an S-grade [[:Category:Combat Deviation|Combat Deviation]] that increases Blaze DMG and applies Explosion.\"]",
    "partial": false
  },
  "915": {
    "originalName": "Upper World Spawn",
    "name": "Engendro del Mundo Superior",
    "summary": "Produce materiales para fabricar un objeto táctico de protección del mundo superior.",
    "snapshot": "[\"Crafting\",\"Tactical Item\",\"{{PAGENAME}} is an S-grade [[Deviation/Crafting List|Crafting Deviation]] that unlocks the [[Upper World Protection]] formula and produces [[Upper World Feather]] material, a required material for crafting [[Upper World Protection]] tactical items.\"]",
    "partial": false
  },
  "921": {
    "originalName": "Butterfly's Emissary",
    "name": "Emisario de la Mariposa",
    "summary": "Señala puntos débiles de los enemigos y aumenta el daño que reciben.",
    "snapshot": "[\"Combat\",\"Offense\",\"[[Butterfly's Emissary]] is a B-grade [[Deviation/Combat List|Combat Deviation]] that marks enemy Weakspots, increasing the damage they receive.\"]",
    "partial": false
  },
  "923": {
    "originalName": "Mr. Wish",
    "name": "Señor Deseo",
    "summary": "Desviación de combate de grado S. Su resumen no detalla la función concreta; consulta las habilidades de tu escenario.",
    "snapshot": "[\"Combat\",\"Offense\",\"{{PAGENAME}} is an S-grade [[Deviation/Combat List|Combat Deviation]].\"]",
    "partial": true
  },
  "924": {
    "originalName": "Dr. Teddy",
    "name": "Doctor Osito",
    "summary": "Puede curar a desviaciones aliadas y curar o rescatar a metahumanos caídos.",
    "snapshot": "[\"Combat\",\"Defense\",\"'''Dr. Teddy''' is an A-grade [[Deviation/Combat List|Combat Deviation]] that can heal allied deviations and heal or rescue fallen Metas.\"]",
    "partial": false
  },
  "925": {
    "originalName": "Grumpy Bulb",
    "name": "Bulbo Gruñón",
    "summary": "Altera la atención de los enemigos para que se ataquen entre sí e inflige daño de estado en área.",
    "snapshot": "[\"Combat\",\"Offense\",\"{{PAGENAME}} is an A-grade [[Deviation/Combat List|Combat Deviation]] that can participate in combat to disrupt enemy threat, making them attack each other. Deals AoE Status DMG and disrupts aggro.\"]",
    "partial": false
  },
  "926": {
    "originalName": "Nutcracker",
    "name": "Cascanueces",
    "summary": "Defiende el territorio frente a enemigos invasores. La wiki documenta distintas variantes.",
    "snapshot": "[\"Territory\",\"Defense\",\"{{PAGENAME}} is an A-grade Territory Deviation that works within the Territory to defend it from invading enemies. There are 5 normal, 3 advanced and 1 rare Nutcracker.\"]",
    "partial": false
  },
  "927": {
    "originalName": "Artisan's Touch",
    "name": "Toque del Artesano",
    "summary": "Produce materiales para fabricar un consumible que repara una pieza equipada creada por el jugador; no sirve para equipo saqueado.",
    "snapshot": "[\"Crafting\",\"Tactical Item\",\"{{PAGENAME}} is an A-grade [[Deviation/Crafting List|Crafting Deviation]] that produces special materials that can be used to craft Tactical Items. Use it to repair an equipment that is currently equipped. Unlocks the [[All-Purpose Hand]] recipe, a consumable that repairs a single equipped item that has the least durability remaining, which has '''not''' been looted, but instead crafted by the player.\"]",
    "partial": false
  },
  "928": {
    "originalName": "Mini Feaster",
    "name": "Pequeño Devorador",
    "summary": "Marca enemigos o invoca tentáculos para atacarlos.",
    "snapshot": "[\"Combat\",\"Offense\",\"The {{PAGENAME}} is an S-grade [[Deviations#Combat/Control Deviations|Combat Deviation]] that will mark enemies, or summon tentacles to attack them.\"]",
    "partial": false
  },
  "929": {
    "originalName": "H37 (Deviation)",
    "name": "H37",
    "summary": "Recoge recursos de cajas en bastiones enemigos. Obtiene materiales de desensamblaje disponibles en la zona.",
    "snapshot": "[\"Territory\",\"Materials\",\"{{PAGENAME}} is an A-grade [[Deviation/Territory List|Territory Deviation]] that enters strongholds occupied by the enemy and collects resources from their Storage Crates. Only materials which are normally acquired from a [[Disassembly Bench]] are collected; for example [[Adhesive]], [[Electronic Part]]s, [[Rubber]], etc. {{PAGENAME}} will not gather anything not normally available nearby, ie. If you can't gather it, neither can {{PAGENAME}}.\"]",
    "partial": false
  },
  "931": {
    "originalName": "Extradimensional Cat",
    "name": "Gato Extradimensional",
    "summary": "Acompaña al dueño mientras duerme y favorece su recuperación en el territorio.",
    "snapshot": "[\"Territory\",\"Recovery Boost\",\"'''{{PAGENAME}}''' is an S-grade [[Deviation/Territory List|Territory Deviation]] that enjoys itself inside the Territory. Accompanies its owner to sleep to make sure that they're fully energetic the next day.\"]",
    "partial": false
  },
  "935": {
    "originalName": "Lethal Rabbit",
    "name": "Conejo Letal",
    "summary": "Caza animales de la zona para traer pieles y carne. No elimina los animales capturados y domesticados por el jugador.",
    "snapshot": "[\"Territory\",\"Materials\",\"{{PAGENAME}} is an A-grade [[Deviation/Territory List|Territory Deviation]] that works inside the Territory. Can hunt animals and bring back Leather and Meat. Gathers materials from the nearby native animal population, such as [[Rawhide]] and meats ([[Beast Meat]], [[Pork]], etc.) [[Lethal Rabbit]] will not produce materials belonging to non-native animals, ie. If you can't gather it, neither can [[Lethal Rabbit]]. This deviant will also not interfere and kill animals that the player has captured and tamed.\"]",
    "partial": false
  },
  "939": {
    "originalName": "Polar Jelly",
    "name": "Medusa Polar",
    "summary": "Provoca retroceso e inflige daño de escarcha en área.",
    "snapshot": "[\"Combat\",\"Offense\",\"[[Polar Jelly]] is an A-grade [[Deviation/Combat List|Combat Deviation]] that applies Knockback and AOE [[Frost]] DMG.\"]",
    "partial": false
  },
  "950": {
    "originalName": "Buzzy Bee",
    "name": "Abeja Zumbona",
    "summary": "Aumenta la probabilidad de mutación de los cultivos del jugador cuando está contenida en el territorio.",
    "snapshot": "[\"Territory\",\"Facility\",\"{{PAGENAME}} is a B-grade [[Deviation/Territory List|Territory Deviation]]. When placed inside of a [[Isolated Securement Unit|Securement Pod]] in the player character's territory, it will increase the rate at which player-planted crops become mutated.\"]",
    "partial": false
  },
  "957": {
    "originalName": "Lonewolf's Whisper",
    "name": "Susurro del Lobo Solitario",
    "summary": "Se transforma en un lobo negro que ataca a los enemigos.",
    "snapshot": "[\"Combat\",\"undefined\",\"Lonewolf's Whisper is an A-grade [[Deviation/Combat List|Combat Deviation]] that can participate in combat. Will transform into a black wolf and attack enemies.\"]",
    "partial": false
  },
  "958": {
    "originalName": "Festering Gel",
    "name": "Gel Supurante",
    "summary": "Puede transformarse en una cobertura para bloquear ataques enemigos.",
    "snapshot": "[\"Combat\",\"Defense\",\"{{PAGENAME}} is a B-grade [[Deviation/Combat List|Combat Deviation]] that can participate in combat to transform into Shelter and block enemy attacks.\"]",
    "partial": false
  },
  "959": {
    "originalName": "Enchanting Void",
    "name": "Vacío Encantador",
    "summary": "Potencia el ataque cuerpo a cuerpo a cambio de una penalización a la defensa cuerpo a cuerpo.",
    "snapshot": "[\"Combat\",\"Offense\",\"[[Enchanting Void]] is an S-grade [[Deviation/Combat List|Combat Deviation]] that enhances Melee Attack while simultaneously penalizing Melee Defense.\"]",
    "partial": false
  },
  "960": {
    "originalName": "By-The-Wind",
    "name": "Al Viento",
    "summary": "Genera muros de viento que bloquean las balas entrantes.",
    "snapshot": "[\"Combat\",\"Offense\",\"{{PAGENAME}} is an A-grade [[Deviation/Combat List|Combat Deviation]] that can generate walls of wind that block incoming bullets.\"]",
    "partial": false
  },
  "961": {
    "originalName": "Zeno-Purifier",
    "name": "Purificador Zeno",
    "summary": "Ataca con una hoja oscura y concede al dueño un ataque con desplazamiento instantáneo.",
    "snapshot": "[\"Combat\",\"Offense\",\"Zeno-Purifier is an S-grade [[Deviation/Combat List|Combat Deviation]] that can participate in combat, granting its owner a blink strike ability and attacks enemies with a dark blade.\"]",
    "partial": false
  },
  "962": {
    "originalName": "Shattered Maiden",
    "name": "Doncella Quebrada",
    "summary": "Controla a los enemigos con miedo, congelación, ralentización e inmovilización, y aumenta el daño de explosión.",
    "snapshot": "[\"Combat\",\"Offense\",\"{{PAGENAME}} is a [[Deviation/Combat List|Combat Deviation]] that can participate in combat, fearing and freezing enemies. Inflicts [[Slowdown]], [[Chained]], and increases [[Explosion]] DMG.\"]",
    "partial": false
  },
  "963": {
    "originalName": "Voodoo Doll",
    "name": "Muñeco Vudú",
    "summary": "Comparte el daño recibido por su dueño o posee enemigos para que reciban parte de ese daño.",
    "snapshot": "[\"Combat\",\"Defense\",\"{{PAGENAME}} is an A-grade [[Deviation/Combat List|Combat Deviation]] that can participate in combat, sharing the damage received by its master or possessing enemies so they share the damage its master receives instead.\"]",
    "partial": false
  },
  "964": {
    "originalName": "Mini Wonder",
    "name": "Pequeña Maravilla",
    "summary": "Absorbe las balas que se dirigen hacia su dueño.",
    "snapshot": "[\"Combat\",\"Defense\",\"'''Mini Wonder''' is an S-grade [[Deviation/Combat List|Combat Deviation]] that can participate in combat to absorb flying bullets toward its owner.\"]",
    "partial": false
  },
  "965": {
    "originalName": "Logging Beaver",
    "name": "Castor Leñador",
    "summary": "Recoge madera en el territorio o trabaja en la plataforma de tala.",
    "snapshot": "[\"Territory\",\"Materials\",\"'''Logging Beaver''' is an A-grade [[Deviation/Territory List|Territory Deviation]] that works within the Territory to gather Wood or work at the [[Logging Platform]].\"]",
    "partial": false
  },
  "966": {
    "originalName": "Chefosaurus Rex",
    "name": "Chefosaurio Rex",
    "summary": "Ayuda a cocinar. La wiki indica que la comida que prepara obtiene una mejora del 10% en sus efectos.",
    "snapshot": "[\"Territory\",\"Production\",\"[[Chefosaurus Rex]] is an S-grade [[:Category:Territory Deviation|Territory Deviation]] that assists with cooking. Any food [[Chefosaurus Rex]] cooks will gain a 10% boost to effects.\"]",
    "partial": false
  },
  "967": {
    "originalName": "Electric Eel",
    "name": "Anguila Eléctrica",
    "summary": "Mejora la potencia de los generadores del territorio.",
    "snapshot": "[\"Territory\",\"Facility\",\"{{PAGENAME}} is a B-grade [[Deviation/Territory List|Territory Deviation]] that improves the Power of generators.\"]",
    "partial": false
  },
  "968": {
    "originalName": "Rebecca",
    "name": "Rebecca",
    "summary": "Invoca una representación de sí misma para reconfortar a otras desviaciones.",
    "snapshot": "[\"Territory\",\"Deviant Energy Recovery\",\"Rebecca is an S-grade [[Deviation/Territory List|Territory Deviation]] that can summon the avatar of \\\"herself\\\" to comfort and soothe other Deviations.\"]",
    "partial": false
  },
  "969": {
    "originalName": "Fetch-A-Lot Bunny",
    "name": "Conejito Recolector",
    "summary": "Recoge plantas, semillas y cultivos disponibles en la zona del territorio.",
    "snapshot": "[\"Territory\",\"Materials\",\"{{PAGENAME}} is a B-grade [[Deviation/Territory List|Territory Deviation]] that works in the Territory to gather all sorts of Plants. It gathers materials from nearby native plants such as [[:Category:Seeds|seeds]], [[:Category:Flowers|flowers]], and [[:Category:Crops|crops]]. {{PAGENAME}} will not produce materials belonging to non-native plants, ie. if you can't gather it neither can {{PAGENAME}}.\"]",
    "partial": false
  },
  "970": {
    "originalName": "Flame Essence",
    "name": "Esencia de Llama",
    "summary": "Aumenta la eficiencia de un horno. La wiki indica una reducción aproximada del tiempo de producción del 25–30%.",
    "snapshot": "[\"Territory\",\"Facility\",\"{{PAGENAME}} is a B-grade [[Deviation/Territory List|Territory Deviation]] that increases the production efficiency of the [[Furnace]] and [[Electric Furnace]]. When activated, furnaces enjoy duration reduction of approximately 25-30%. One {{PAGENAME}} can only boost the efficiency of one furnace at a time. For an [[Electric Furnace]] the efficiency boost applies to both active formulas.\"]",
    "partial": false
  },
  "971": {
    "originalName": "Paper Doll",
    "name": "Muñeca de Papel",
    "summary": "Recoge materiales de desensamblaje, mejora el botín de enemigos y repara paredes y suelos dañados.",
    "snapshot": "[\"Territory\",\"Materials\",\"{{PAGENAME}} is a B-grade [[Deviation/Territory List|Territory Deviation]] that collects materials for use in a [[Disassembly Bench]], improves loot from defeated Deviants, and will repair damaged walls and floors.\"]",
    "partial": false
  },
  "972": {
    "originalName": "Growshroom",
    "name": "Hongo Cultivador",
    "summary": "Automatiza tareas de jardinería como plantar y cosechar en el territorio.",
    "snapshot": "[\"Territory\",\"Gardening\",\"{{PAGENAME}} is an A-grade [[Deviation/Territory List|Territory Deviation]] that works inside the Territory. Can proactively plant and harvest. When placed inside of an [[Isolated Securement Unit|Securement Pod]] in the player's territory, it will be able to automate gardening tasks, such as harvesting and planting.\"]",
    "partial": false
  },
  "973": {
    "originalName": "Rain Man",
    "name": "Hombre de la Lluvia",
    "summary": "Provoca lluvia cerca de su posición para ayudar al crecimiento de los cultivos.",
    "snapshot": "[\"Territory\",\"Rain Maker\",\"{{PAGENAME}} is an A-grade [[Deviation/Territory List|Territory Deviation]] that works inside the Territory. Can cause a rainfall around him to help crops grow.\"]",
    "partial": false
  },
  "974": {
    "originalName": "Harveseed",
    "name": "Semilla Cosechadora",
    "summary": "Produce materiales para fabricar el consumible de armadura viviente. El resumen de la wiki mezcla esta función con una descripción de combate; necesita revisión.",
    "snapshot": "[\"Crafting\",\"Consumables\",\"[[Harveseed]] is an A-grade [[Deviation/Crafting List|Crafting Deviation]] that can participate in combat to periodically release blazing energy rays, which attack all nearby enemies, inflicting continuous Burn DMG. Unlocks the [[Living Armor]] whim potion formula. Generates [[Living Armor#Heart Vine|Heart Vines]], a required material for crafting the [[Living Armor]] whim potion.\"]",
    "partial": true
  },
  "975": {
    "originalName": "Dreamcatcher",
    "name": "Atrapasueños",
    "summary": "Produce materiales para un consumible que despliega una trampa de telaraña y sujeta a los enemigos.",
    "snapshot": "[\"Crafting\",\"Consumables\",\"{{PAGENAME}} is a B-grade [[Deviation/Crafting List|Crafting Deviation]] that produces special materials that can be used to craft Whim Potions. Unleashes a spiderweb trap to bind enemies when you are in danger. Unlocks the [[The Weaver]] whim potion formula. Generates [[Thread of Dreams]] a required material for crafting the [[The Weaver]] whim potion.\"]",
    "partial": false
  },
  "976": {
    "originalName": "Atomic Lighter",
    "name": "Encendedor Atómico",
    "summary": "Produce materiales para fabricar un objeto táctico que causa una potente explosión al lanzarlo.",
    "snapshot": "[\"Crafting\",\"Tactical Item\",\"{{PAGENAME}} is an A-grade [[Deviation/Crafting_List|Crafting Deviation]] that produces special materials that can be used to craft Tactical Items. Throw it to cause a powerful explosion. Unlocks the [[Fusion Lighter]] formula. Generates [[Fusion Lighter#Split-Core Cotton|Split-Core Cotton]] material, a required material for crafting the Fusion Lighter tactical item.\"]",
    "partial": false
  },
  "977": {
    "originalName": "Pup Buddy",
    "name": "Cachorro Compañero",
    "summary": "Produce materiales para fabricar un consumible que aumenta la capacidad de carga.",
    "snapshot": "[\"Crafting\",\"Consumables\",\"'''Pup Buddy''' is an A-grade [[Deviation/Crafting_List|Crafting Deviation]] that produces special materials that can be used to craft Whim Potions. Use it to increase Load capabilities. Unlocks the [[Featherweight]] whim potion. Generates [[Small Balloon]]s, a required material for crafting the [[Featherweight]] whim potion.\"]",
    "partial": false
  },
  "978": {
    "originalName": "Disco Ball",
    "name": "Bola de Discoteca",
    "summary": "Produce materiales para fabricar un consumible que prolonga la duración de otros efectos de capricho.",
    "snapshot": "[\"Crafting\",\"Consumables\",\"{{PAGENAME}} is a B-grade [[Deviation/Crafting List|Crafting Deviation]] that produces special materials that can be used to craft Whim Potions. Use it to extend other Whim duration. Unlocks the [[Utter Delight]] whim potion formula. Generates [[Utter Delight#Inspiration Fragment|Inspiration Fragment]] material, a required material for crafting the [[Utter Delight]] whim potion.\"]",
    "partial": false
  },
  "979": {
    "originalName": "Gingerbread House",
    "name": "Casa de Jengibre",
    "summary": "Produce materiales para fabricar una galleta de transformación que permite adoptar la apariencia de un objeto.",
    "snapshot": "[\"Crafting\",\"Tactical Item\",\"{{PAGENAME}} is an A-grade [[Deviation/Crafting_List|Crafting Deviation]] that produces special materials that can be used to craft special Dishes. Consume it to transform into an object. Unlocks the [[Transformation Cookie]] formula. Generates [[Transformation Cookie#Cracker Crumbs|Cracker Crumbs]] material a required material for crafting the [[Transformation Cookie]] tactical item.\"]",
    "partial": false
  },
  "980": {
    "originalName": "Hug-in-a-Bowl",
    "name": "Abrazo en un Cuenco",
    "summary": "Produce materiales para preparar un alimento que recupera la cordura por completo.",
    "snapshot": "[\"Crafting\",\"Consumable\",\"{{PAGENAME}} is a B-grade [[Deviation/Crafting List|Crafting Deviation]] that produces special materials that can be used to craft special Dishes. Consume to fully recover Sanity. Unlocks the [[Homestyle Noodles]] formula. Generates [[Homestyle Noodles#Delcious Soup|Delicous Soup]] a required material for crafting the [[Homestyle Noodles]] consumable.\"]",
    "partial": false
  },
  "982": {
    "originalName": "Frog the Leaper",
    "name": "Rana Saltarina",
    "summary": "Produce materiales para un consumible que mejora el salto y también genera cebo de pesca.",
    "snapshot": "[\"Crafting\",\"Consumables\",\"[[Frog the Leaper]] is a B-grade [[Deviation/Crafting List|Crafting Deviation]] that produces special materials that can be used to craft Whim Potions. Use it to increase Jump capabilities. Unlocks the [[Spring Legs]] whim potion formula. Generates [[Spring Legs#Silver Spring|Silver Spring]], a required material for crafting [[Spring Legs]] whim potions and [[Crankbait]], a fishing bait for the fishing rod.\"]",
    "partial": false
  },
  "983": {
    "originalName": "Masonic Pyramid",
    "name": "Pirámide Masónica",
    "summary": "Produce materiales para consumibles que permiten hacerse invisible o detectar enemigos ocultos.",
    "snapshot": "[\"Crafting\",\"Consumables\",\"{{PAGENAME}} is a B-grade [[Deviation/Crafting List|Crafting Deviation]] that produces special materials that can be used to craft Whim Potions. Use it to become invisible or spot hiding enemies. Unlocks the [[Predator]] and [[Parapsychology]] whim potion formulas. Generates Wolflame, a required material for crafting the [[Predator]] whim potion; and Mind Matrix, a required material for crafting the [[Parapsychology]] whim potion\"]",
    "partial": false
  },
  "984": {
    "originalName": "Orb Lightning",
    "name": "Orbe Relámpago",
    "summary": "Produce materiales para un objeto táctico que mejora el rendimiento de las torretas de la zona.",
    "snapshot": "[\"Crafting\",\"Tactical Item\",\"{{PAGENAME}} is a B-grade [[Deviation/Crafting List|Crafting Deviation]] that produces special materials that can be used to craft Tactical Items. When thrown, the performance of turrets in the area will be increased. Unlocks the [[Lightning Bottle]] formula. Generates [[Lightning_Bottle#Plasma|Plasma]] material, a required material for crafting the [[Lightning Bottle]] tactical item.\"]",
    "partial": false
  },
  "990": {
    "originalName": "Space Turner",
    "name": "Manipulador Espacial",
    "summary": "Produce materiales para un objeto táctico que teletransporta a un compañero hasta tu posición.",
    "snapshot": "[\"Crafting\",\"Tactical Item\",\"[[Space Turner]] is an A-grade [[Deviation/Crafting List|Crafting Deviation]] that produces special materials that can be used to craft Tactical Items. Use it to teleport a teammate to your location. Unlocks the [[Space Twister]] formula. Generates [[Space Twister#Spatial Keystone|Spatial Keystone]] material, a required material for crafting the [[Space Twister]] tactical item.\"]",
    "partial": false
  },
  "1491": {
    "originalName": "Snow Globe",
    "name": "Bola de Nieve",
    "summary": "Produce materiales para fabricar un objeto táctico arrojadizo que congela a sus objetivos.",
    "snapshot": "[\"Crafting\",\"Tactical Item\",\"{{PAGENAME}} is a B-grade [[Deviation/Crafting_List|Crafting Deviation]] that produces special materials that can be used to craft Tactical Items. When thrown, targets will become Frozen. Unlocks the [[Snowball]] formula. Generates [[Snowball#Snowdust|Snowdust]] material, a required material for crafting the [[Snowball]] tactical item.\"]",
    "partial": false
  },
  "1803": {
    "originalName": "Atomic Snail",
    "name": "Caracol Atómico",
    "summary": "Produce materiales para fabricar un consumible que concede un desplazamiento rápido en el aire.",
    "snapshot": "[\"Crafting\",\"Consumables\",\"{{PAGENAME}} is an A-grade [[Deviation/Crafting List|Crafting Deviation]] that produces special materials that can be used to craft Whim Potions. Using the potion will grant the air dash ability. Unlocks the [[Aero Leap]] whim potion formula. Generates [[Aero Leap#Tunneling Fluid|Tunneling Fluid]], a required material for crafting the [[Aero Leap]] whim potion.\"]",
    "partial": false
  },
  "2535": {
    "originalName": "Wish Box",
    "name": "Caja de Deseos",
    "summary": "Transforma los objetos que recibe en otros objetos aleatorios dentro del territorio.",
    "snapshot": "[\"Territory\",\"Production\",\"{{PAGENAME}} is an A-grade [[Deviation/Territory List|Territory Deviation]] used in the Territory to transform items into something else after digestion. When placed inside of a [[Isolated Securement Unit|Securement Pod]] in the player character's territory, it will be able to transform items into a random item.\"]",
    "partial": false
  },
  "2704": {
    "originalName": "Hydrangeas",
    "name": "Hortensias",
    "summary": "Desviación de territorio clasificada para materiales. La ficha no incluye un resumen funcional completo.",
    "snapshot": "[\"Territory\",\"Materials\",\"\"]",
    "partial": true
  },
  "4451": {
    "originalName": "Gazocchio (Deviation)",
    "name": "Gazocchio",
    "summary": "Defiende el territorio, produce su objeto táctico y recoge algunos materiales de fabricación.",
    "snapshot": "[\"Territory\",\"Defense\",\"{{PAGENAME}} is an S-grade [[Deviation/Territory List|Territory Deviation]] that will defend the player character's territory from invading enemies. He also produces the [[Gazocchio (Tactical Item)]], as well as collects crafting items such as [[Refined Part|Refined Parts]].\"]",
    "partial": false
  },
  "5037": {
    "originalName": "Snapshot",
    "name": "Cámara de Descargas",
    "summary": "Fotografía a enemigos cercanos y aumenta el daño de arma que reciben. La wiki también utiliza el nombre ZapCam.",
    "snapshot": "[\"Combat\",\"Offense\",\"ZapCam is an A-grade [[Deviation/Combat List|Combat Deviation]] that can participate in combat to constantly photograph nearby enemies, increasing the Weapon DMG they receive.\"]",
    "partial": false
  },
  "5039": {
    "originalName": "Tar Pudding",
    "name": "Pudin de Alquitrán",
    "summary": "Extrae petróleo crudo o trabaja en instalaciones de refinado dentro del territorio.",
    "snapshot": "[\"Territory\",\"Production\",\"'''{{PAGENAME}}''' is an A-grade [[Deviation/Territory List|Territory Deviation]] that works within the territory, able to extract crude oil or work in [[Refining Facilities|Refining Facilities]]. When placed inside of a [[Isolated Securement Unit|Securement Pod]] in the player's territory, it will be able to extract crude oil from the ground or work in a [[Refining Facilities|Refining Facility]].\"]",
    "partial": false
  },
  "5040": {
    "originalName": "Hydronaut Fish",
    "name": "Pez Hidronauta",
    "summary": "Recoge agua de mar y mejora el funcionamiento de instalaciones de tratamiento de agua; puede conseguir peces ocasionalmente.",
    "snapshot": "[\"Territory\",\"Facility\",\"{{PAGENAME}} is an A-grade [[Deviation/Territory List|Territory Deviation]] that can work in the territory to gather Sea Water, or operate a water purification facility to get fish occasionally. When placed inside of a [[isolated Securement Unit|Securement Pod]] in the player's territory, it will be able to extract sea water and increase the conversion efficiency of the [[Compact Water Filter]]/[[Large Water Filter]] and [[Brewing Barrel]].\"]",
    "partial": false
  },
  "5041": {
    "originalName": "Invincible Sun",
    "name": "Sol Invencible",
    "summary": "Emite rayos de energía abrasadora contra los enemigos cercanos y les inflige daño continuo de Quemadura.",
    "snapshot": "[\"Combat\",\"Offense\",\"{{PAGENAME}} is an A-grade [[Deviation/Combat List|Combat Deviation]] that can participate in combat to periodically release blazing energy rays, which attack all nearby enemies, inflicting continuous Burn DMG.\"]",
    "partial": false
  },
  "5055": {
    "originalName": "Ice Pot",
    "name": "Vasija de Hielo",
    "summary": "Produce materiales para generar grandes bloques de hielo mediante un objeto táctico.",
    "snapshot": "[\"Crafting\",\"Tactical Item\",\"{{PAGENAME}} is a B-grade [[Deviation/Crafting List|Crafting Deviation]] that produces special materials that can be used to craft Tactical Items. Use to make large ice cubes. Generates [[Sticky Ice Crystal]], a tactical item.\"]",
    "partial": false
  },
  "5073": {
    "originalName": "Zapamander",
    "name": "Salamandra Eléctrica",
    "summary": "Invoca nubes de tormenta para golpear a los enemigos y potenciar el daño eléctrico.",
    "snapshot": "[\"Combat\",\"Offense\",\"'''{{PAGENAME}}''' is an S-grade [[Deviation/Combat List|Combat Deviation]] that was added on October 29, 2025 with the Version 2.2.0. Update.<ref>https://www.oncehuman.game/news/official/20251022/40779_1266368.html</ref> It can participate in combat by summoning thunderclouds to strike enemies and enhancing electrical damage.\"]",
    "partial": false
  },
  "5075": {
    "originalName": "Snowsprite",
    "name": "Duende de Nieve",
    "summary": "Desviación de combate de grado S. El resumen funcional de la wiki está sin completar y necesita revisión.",
    "snapshot": "[\"Combat\",\"Offense\",\"{{PAGENAME}} is an S-grade [[:Category:Combat Deviation|Combat Deviation]] that [ADD DESCRIPTION HERE]].\"]",
    "partial": true
  },
  "5087": {
    "originalName": "Brave George",
    "name": "Jorge el Valiente",
    "summary": "Compañero que participa en combate.",
    "snapshot": "[\"Combat\",\"Offense\",\"[[Brave George]] is a B-grade [[Deviation/Combat List|Combat Deviation]] that was added to the game on March 25, 2026 with the Version 2.3.5. Update.<ref name=\\\":0>https://www.oncehuman.game/news/update/20260325/40780_1292938.html</ref> He is a loyal companion that can participate in combat.\"]",
    "partial": false
  },
  "5090": {
    "originalName": "Whalepup",
    "name": "Ballenato",
    "summary": "Transforma el campo de batalla en un entorno submarino que ahoga a los enemigos y aumenta el daño de arma que reciben.",
    "snapshot": "[\"Combat\",\"Offense\",\"{{PAGENAME}} is an A-grade [[Deviation/Combat List|Combat Deviation]] that was added on October 29, 2025 with the Version 2.2.0. Update.<ref>https://www.oncehuman.game/news/official/20251022/40779_1266368.html</ref> It can participate in combat, transforming the battlefield into an underwater world that drowns enemies and increases the Weapon DMG they receive.\"]",
    "partial": false
  },
  "5092": {
    "originalName": "Soul Summoner",
    "name": "Invocador de Almas",
    "summary": "Debilita a los enemigos con flechas malditas y aumenta el daño de arma que reciben.",
    "snapshot": "[\"Combat\",\"Offense\",\"{{PAGENAME}} is an A-grade [[Deviation/Combat List|Combat Deviation]] that was added on October 29, 2025 with the Version 2.2.0. Update.<ref>https://www.oncehuman.game/news/official/20251022/40779_1266368.html</ref> It can participate in combat to weaken enemies with cursed arrows, increasing the Weapon DMG they receive.\"]",
    "partial": false
  },
  "5094": {
    "originalName": "Director Fox",
    "name": "Zorro Director",
    "summary": "Ayuda a domesticar, criar y desarrollar a los animales del territorio.",
    "snapshot": "[\"Territory\",\"Production\",\"{{PAGENAME}} is an A-grade [[Deviation/Territory List|Territory Deviation]] that was added on October 29, 2025 with the Version 2.2.0. Update.<ref>https://www.oncehuman.game/news/official/20251022/40779_1266368.html</ref> It can work in a player character's territory helping tame, grow, and breed animals.\"]",
    "partial": false
  },
  "5096": {
    "originalName": "Party Monkey (Deviation)",
    "name": "Mono Fiestero",
    "summary": "Produce materiales para construir una instalación que atrae la atención de los monstruos cercanos.",
    "snapshot": "[\"Crafting\",\"Facility\",\"{{PAGENAME}} is a B-grade [[Deviation/Crafting_List|Crafting Deviation]] that produces special materials and can repair its own replicas. It will attract the threat of nearby monsters. Unlocks the [[Party Monkey (Facility)]] formula. Generates [[Party Monkey (Facility)#Great Party|Great Party]] material, a required material for building the [[Party Monkey (Facility)]].\"]",
    "partial": false
  },
  "5098": {
    "originalName": "Doctor Raven",
    "name": "Doctor Cuervo",
    "summary": "Mejora la eficiencia del banco de suministros y añade efectos a las jeringas curativas fabricadas.",
    "snapshot": "[\"Territory\",\"Facility\",\"{{PAGENAME}} is an A-grade [[Deviation/Territory_List|Territory Deviation]] that works in the territory to improve Supplies Workbench efficiency. Crafted Healing Syringes have a bonus effect.\"]",
    "partial": false
  },
  "5100": {
    "originalName": "Behemoth",
    "name": "Behemoth",
    "summary": "Compañero de Jorge que inflige daño de ataque físico. La wiki indica que no se puede montar en el escenario Deviation.",
    "snapshot": "[\"Combat\",\"Offense\",\"{{PAGENAME}} is an A-grade [[Deviation/Combat_List|Combat Deviation]] that does P.ATK DMG. He is a loyal companion for George. He was added to the game on July 9, 2026 with the Version 3.0.1. Update<ref>https://www.oncehuman.game/news/update/20260709/40780_1307147.html</ref> '''This deviation can NOT be ridden in the Deviation: SCP scenario.''' Note: {{PAGENAME}} regularly growls and roars in his Securement Pod,\"]",
    "partial": false
  },
  "5163": {
    "originalName": "Blackback",
    "name": "Lomo Negro",
    "summary": "Acompaña al jugador en el territorio y ayuda a recuperar cordura.",
    "snapshot": "[\"Territory\",\"\",\"{{PAGENAME}} is an B-grade [[:Category:Territory Deviation|Territory Deviation]] that was added on April 24, 2025 with the Version 1.5.1. Update.<ref name=\\\":0\\\">https://www.oncehuman.game/news/update/20250421/40780_1229033.html</ref> It follows the player character in their territory and assists with sanity restoration.\"]",
    "partial": false
  },
  "5164": {
    "originalName": "Doberman",
    "name": "Dóberman",
    "summary": "Acompaña al jugador en el territorio y ayuda a recuperar cordura.",
    "snapshot": "[\"Territory\",\"\",\"{{PAGENAME}} is an B-grade [[:Category:Territory Deviation|Territory Deviation]] that was added on April 24, 2025 with the Version 1.5.1. Update.<ref name=\\\":0\\\">https://www.oncehuman.game/news/update/20250421/40780_1229033.html</ref> It follows the player character in their territory and assists with sanity restoration.\"]",
    "partial": false
  },
  "5165": {
    "originalName": "Labrador",
    "name": "Labrador",
    "summary": "Acompaña al jugador en el territorio y ayuda a recuperar cordura.",
    "snapshot": "[\"Territory\",\"\",\"{{PAGENAME}} is an B-grade [[:Category:Territory Deviation|Territory Deviation]] that was added on April 24, 2025 with the Version 1.5.1. Update.<ref name=\\\":0\\\">https://www.oncehuman.game/news/update/20250421/40780_1229033.html</ref> It follows the player character in their territory and assists with sanity restoration.\"]",
    "partial": false
  },
  "5174": {
    "originalName": "Cattiva",
    "name": "Cattiva",
    "summary": "Trabaja en el territorio recogiendo minerales o utilizando la plataforma minera, según el resumen de la wiki.",
    "snapshot": "[\"Territory\",\"Production\",\"{{PAGENAME}} is an S-grade [[:Category:Territory Deviation|Territory Deviation]] that was added on October 30, 2025 with the Version 2.2.0. Update.<ref>https://www.oncehuman.game/news/update/20251029/40780_1267745.html</ref> It works in the territory to gather ores or works at the Mining Platform.\"]",
    "partial": false
  },
  "5175": {
    "originalName": "Chillet",
    "name": "Chillet",
    "summary": "Desviación de territorio de la colaboración con Palworld. El resumen funcional repite el de otras criaturas y necesita contrastarse antes de recomendar una tarea concreta.",
    "snapshot": "[\"Territory\",\"\",\"{{PAGENAME}} is an S-grade [[:Category:Territory Deviation|Territory Deviation]] that was added on October 30, 2025 with the Version 2.2.0. Update.<ref>https://www.oncehuman.game/news/update/20251029/40780_1267745.html</ref> It works in the territory to gather ores or works at the Mining Platform.\"]",
    "partial": true
  },
  "5176": {
    "originalName": "Chillet Ignis",
    "name": "Chillet Ignis",
    "summary": "Desviación de territorio de la colaboración con Palworld. El resumen funcional repite el de otras criaturas y necesita contrastarse antes de recomendar una tarea concreta.",
    "snapshot": "[\"Territory\",\"\",\"{{PAGENAME}} is an S-grade [[:Category:Territory Deviation|Territory Deviation]] that was added on October 30, 2025 with the Version 2.2.0. Update.<ref>https://www.oncehuman.game/news/update/20251029/40780_1267745.html</ref> It works in the territory to gather ores or works at the Mining Platform.\"]",
    "partial": true
  }
};
const byName=new Map(Object.values(records).map(r=>[r.originalName,r.name]));
root.PhoenixDeviations={name:original=>byName.get(original),translate:(id,snapshot)=>{const r=records[id];return r&&r.snapshot===snapshot?{summary:r.summary,partial:r.partial}:null;}};
if(typeof module!=="undefined")module.exports=root.PhoenixDeviations;
})(globalThis);
