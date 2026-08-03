// --- CONSTANTS & CONFIG ---
const NATURE_MODIFIERS = {
	Adamant: { boost: "attack", nerf: "special-attack" }, Bold: { boost: "defense", nerf: "attack" },
	Brave: { boost: "attack", nerf: "speed" }, Calm: { boost: "special-defense", nerf: "attack" },
	Careful: { boost: "special-defense", nerf: "special-attack" }, Gentle: { boost: "special-defense", nerf: "defense" },
	Hasty: { boost: "speed", nerf: "defense" }, Impish: { boost: "defense", nerf: "special-attack" },
	Jolly: { boost: "speed", nerf: "special-attack" }, Lax: { boost: "defense", nerf: "special-defense" },
	Lonely: { boost: "attack", nerf: "defense" }, Mild: { boost: "special-attack", nerf: "defense" },
	Modest: { boost: "special-attack", nerf: "attack" }, Naive: { boost: "speed", nerf: "special-defense" },
	Naughty: { boost: "attack", nerf: "special-defense" }, Quiet: { boost: "special-attack", nerf: "speed" },
	Rash: { boost: "special-attack", nerf: "special-defense" }, Relaxed: { boost: "defense", nerf: "speed" },
	Sassy: { boost: "special-defense", nerf: "speed" }, Timid: { boost: "speed", nerf: "attack" }
};
const NATURES = ["Bashful", "Docile", "Hardy", "Quirky", "Serious", ...Object.keys(NATURE_MODIFIERS)];

const ITEM_DESCRIPTIONS = {
	Leftovers: "Restores 1/16th of maximum HP at the end of each turn.",
	"Choice Scarf": "Boosts Speed by 50%, but locks holder into first selected move.",
	"Choice Band": "Boosts Attack by 50%, but locks holder into first selected move.",
	"Choice Specs": "Boosts Sp. Atk by 50%, but locks holder into first selected move.",
	"Life Orb": "Boosts damage by 30%, but drains 10% max HP per attack.",
	"Focus Sash": "Survives any single lethal hit from full HP with 1 HP.",
	Eviolite: "Boosts Defense & Sp. Def by 50% if holder can still evolve.",
	"Rocky Helmet": "Damages physical attackers for 1/6th max HP on contact.",
	"Sitrus Berry": "Restores 25% max HP when falling below 50% HP.",
	"Lum Berry": "Instantly cures any status condition.",
	"Expert Belt": "Boosts power of super-effective moves by 20%.",
	"Air Balloon": "Grants Ground immunity & entry hazard safety until popped."
};

const HELD_ITEMS = Object.keys(ITEM_DESCRIPTIONS);
const ALL_TYPES = ["normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "steel", "dark"];

const STAT_NAMES = [
	{ key: 'hp', label: 'HP', maxPossible: 714 },
	{ key: 'attack', label: 'Atk', maxPossible: 526 },
	{ key: 'defense', label: 'Def', maxPossible: 614 },
	{ key: 'special-attack', label: 'SpA', maxPossible: 535 },
	{ key: 'special-defense', label: 'SpD', maxPossible: 614 },
	{ key: 'speed', label: 'Spe', maxPossible: 504 }
];

const TYPE_CHART = {
	normal: { rock: 0.5, ghost: 0, steel: 0.5 },
	fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
	water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
	electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
	grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
	ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
	fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2 },
	poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0 },
	ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
	flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
	psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
	bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5 },
	rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
	ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
	dragon: { dragon: 2, steel: 0.5 },
	steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5 },
	dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5 }
};

// PokéAPI base form alias map for edge-case species
const FORM_MAP = {
	frillish: 'frillish-male', jellicent: 'jellicent-male', unfezant: 'unfezant-male', meowstic: 'meowstic-male',
	deoxys: 'deoxys-normal', meloetta: 'meloetta-aria', giratina: 'giratina-altered', shaymin: 'shaymin-land',
	wormadam: 'wormadam-plant', basculin: 'basculin-red-striped', darmanitan: 'darmanitan-standard',
	tornadus: 'tornadus-incarnate', thundurus: 'thundurus-incarnate', landorus: 'landorus-incarnate', keldeo: 'keldeo-ordinary'
};

// Alternate forms for Gens 1-5 (Excluding gender duplicates)
const GEN_1_5_EXTRA_FORMS = [
	{ id: 479, name: 'rotom-heat', displayName: 'Rotom (Heat)', gen: 4 },
	{ id: 479, name: 'rotom-wash', displayName: 'Rotom (Wash)', gen: 4 },
	{ id: 479, name: 'rotom-frost', displayName: 'Rotom (Frost)', gen: 4 },
	{ id: 479, name: 'rotom-fan', displayName: 'Rotom (Fan)', gen: 4 },
	{ id: 479, name: 'rotom-mow', displayName: 'Rotom (Mow)', gen: 4 },
	{ id: 386, name: 'deoxys-normal', displayName: 'Deoxys (Normal)', gen: 3 },
	{ id: 386, name: 'deoxys-attack', displayName: 'Deoxys (Attack)', gen: 3 },
	{ id: 386, name: 'deoxys-defense', displayName: 'Deoxys (Defense)', gen: 3 },
	{ id: 386, name: 'deoxys-speed', displayName: 'Deoxys (Speed)', gen: 3 },
	{ id: 648, name: 'meloetta-aria', displayName: 'Meloetta (Aria)', gen: 5 },
	{ id: 648, name: 'meloetta-pirouette', displayName: 'Meloetta (Pirouette)', gen: 5 },
	{ id: 487, name: 'giratina-altered', displayName: 'Giratina (Altered)', gen: 4 },
	{ id: 487, name: 'giratina-origin', displayName: 'Giratina (Origin)', gen: 4 },
	{ id: 492, name: 'shaymin-land', displayName: 'Shaymin (Land)', gen: 4 },
	{ id: 492, name: 'shaymin-sky', displayName: 'Shaymin (Sky)', gen: 4 },
	{ id: 413, name: 'wormadam-plant', displayName: 'Wormadam (Plant)', gen: 4 },
	{ id: 413, name: 'wormadam-sandy', displayName: 'Wormadam (Sandy)', gen: 4 },
	{ id: 413, name: 'wormadam-trash', displayName: 'Wormadam (Trash)', gen: 4 },
	{ id: 550, name: 'basculin-red-striped', displayName: 'Basculin (Red-Striped)', gen: 5 },
	{ id: 550, name: 'basculin-blue-striped', displayName: 'Basculin (Blue-Striped)', gen: 5 },
	{ id: 555, name: 'darmanitan-standard', displayName: 'Darmanitan (Standard)', gen: 5 },
	{ id: 555, name: 'darmanitan-zen', displayName: 'Darmanitan (Zen)', gen: 5 },
	{ id: 641, name: 'tornadus-incarnate', displayName: 'Tornadus (Incarnate)', gen: 5 },
	{ id: 641, name: 'tornadus-therian', displayName: 'Tornadus (Therian)', gen: 5 },
	{ id: 642, name: 'thundurus-incarnate', displayName: 'Thundurus (Incarnate)', gen: 5 },
	{ id: 642, name: 'thundurus-therian', displayName: 'Thundurus (Therian)', gen: 5 },
	{ id: 645, name: 'landorus-incarnate', displayName: 'Landorus (Incarnate)', gen: 5 },
	{ id: 645, name: 'landorus-therian', displayName: 'Landorus (Therian)', gen: 5 },
	{ id: 646, name: 'kyurem', displayName: 'Kyurem', gen: 5 },
	{ id: 646, name: 'kyurem-black', displayName: 'Kyurem (Black)', gen: 5 },
	{ id: 646, name: 'kyurem-white', displayName: 'Kyurem (White)', gen: 5 },
	{ id: 647, name: 'keldeo-ordinary', displayName: 'Keldeo (Ordinary)', gen: 5 },
	{ id: 647, name: 'keldeo-resolute', displayName: 'Keldeo (Resolute)', gen: 5 }
];

// --- STATE & CACHE ---
const createEmptySlot = () => ({
	pokemon: null, species: null, nickname: "", level: 100, shiny: false, showBack: false, showDesc: false, nature: "Hardy",
	gender: "M", friendship: 255, ability: "", item: "", moves: ["", "", "", ""], spriteStyle: "gen5_anim",
	ivs: { hp: 31, attack: 31, defense: 31, 'special-attack': 31, 'special-defense': 31, speed: 31 },
	evs: { hp: 0, attack: 0, defense: 0, 'special-attack': 0, 'special-defense': 0, speed: 0 }
});

let maxTeamSlots = 6;
let teamState = Array.from({ length: maxTeamSlots }, createEmptySlot);
let speciesIndex = [];
const moveCache = {}, abilityCache = {};

// --- UTILS ---
const getGen = id => id <= 151 ? 1 : id <= 251 ? 2 : id <= 386 ? 3 : id <= 493 ? 4 : 5;
const fmtName = name => name.replace(/-/g, ' ');

function refreshUI() {
	const openDrawerIndices = [];
	document.querySelectorAll('.grid .card').forEach((card, idx) => {
		if (card.classList.contains('drawer-open')) openDrawerIndices.push(idx);
	});
	
	renderTeamSlots();
	renderAnalysis();
	
	openDrawerIndices.forEach(idx => {
		document.querySelectorAll('.grid .card')[idx]?.classList.add('drawer-open');
	});
}

function playCry(url) {
	if (url) new Audio(url).play().catch(() => {});
}

const SPRITE_VERSIONS = {
	gen5_anim: "Gen 5 Animated (BW)", showdown: "Showdown 3D Animated", home: "Pokémon HOME 3D",
	official: "Official Artwork", gen1: "Gen 1 (Yellow)", gen2: "Gen 2 (Crystal)", gen3: "Gen 3 (Emerald)", gen4: "Gen 4 (Platinum)"
};

function getPokemonSprite(pokemon, isShiny, isFemale, showBack, versionKey = 'gen5_anim') {
	const dir = showBack ? 'back' : 'front';
	const shiny = isShiny ? '_shiny' : '_default';
	const { sprites } = pokemon;
	
	const resolveGenderSprite = (obj) => obj ? (obj[`${dir}${shiny}`] || obj[`${dir}_default`] || obj.front_default) : null;
	
	switch (versionKey) {
		case 'showdown': return resolveGenderSprite(sprites?.other?.showdown) || sprites?.other?.['official-artwork']?.front_default;
		case 'home': return isShiny ? (sprites?.other?.home?.front_shiny || sprites?.other?.home?.front_default) : sprites?.other?.home?.front_default;
		case 'official': return isShiny ? (sprites?.other?.['official-artwork']?.front_shiny || sprites?.other?.['official-artwork']?.front_default) : sprites?.other?.['official-artwork']?.front_default;
		case 'gen1': return sprites?.versions?.['generation-i']?.['yellow']?.[dir === 'back' ? 'back_default' : 'front_default'] || sprites?.front_default;
		case 'gen2': return resolveGenderSprite(sprites?.versions?.['generation-ii']?.['crystal']) || sprites?.front_default;
		case 'gen3': return resolveGenderSprite(sprites?.versions?.['generation-iii']?.['emerald']) || sprites?.front_default;
		case 'gen4': return resolveGenderSprite(sprites?.versions?.['generation-iv']?.['platinum']) || sprites?.front_default;
		default: return resolveGenderSprite(sprites?.versions?.['generation-v']?.['black-white']?.animated) || resolveGenderSprite(sprites) || sprites?.other?.['official-artwork']?.front_default;
	}
}

// ✅ Replace calculateStat() with this:
function calculateStat(base, iv, ev, level, statKey, nature) {
	if (statKey === 'hp') {
		const val = base === 1 ? 1 : Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
		return { value: val, multiplier: 1.0 };
	}
	const raw = Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5;
	const mod = NATURE_MODIFIERS[nature];
	const mult = mod?.boost === statKey ? 1.1 : mod?.nerf === statKey ? 0.9 : 1.0;
	return { value: Math.floor(raw * mult), multiplier: mult };
}

function getFriendshipDetails(val) {
	const status = val === 0 ? "Hates you" : val < 50 ? "Wary" : val < 100 ? "Neutral" : val < 150 ? "Friendly" : val < 200 ? "Trusts you" : val < 255 ? "Loves you" : "Unbreakable Bond";
	return { status, desc: `Bond: ${status} (${val}/255).\n• Return Base Power: ${Math.floor(val / 2.5)}\n• Frustration Base Power: ${Math.floor((255 - val) / 2.5)}` };
}

function getNatureDetails(nature) {
	const mod = NATURE_MODIFIERS[nature];
	return mod ? `${nature} Nature:\n• Increases: ${mod.boost.toUpperCase()} (+10%)\n• Decreases: ${mod.nerf.toUpperCase()} (-10%)` : `${nature} Nature: Neutral (No stat modifications).`;
}

async function fetchEntityDetails(endpoint, cache, key) {
	if (!key) return null;
	if (cache[key]) return cache[key];
	try {
		const res = await fetch(`https://pokeapi.co/api/v2/${endpoint}/${key}`);
		const data = await res.json();
		const flavor = (data.flavor_text_entries?.find(f => f.language.name === 'en')?.flavor_text || 
		data.effect_entries?.find(e => e.language.name === 'en')?.short_effect || 'No description.').replace(/[\r\n\f]/g, ' ');
		
		cache[key] = endpoint === 'move' ? {
			name: data.name, type: data.type.name, damageClass: data.damage_class.name,
			power: data.power ?? '—', accuracy: data.accuracy ? `${data.accuracy}%` : '100%', pp: data.pp ?? '—', desc: flavor
		} : { name: data.name, desc: flavor };
		
		return cache[key];
	} catch { return null; }
}

const fetchMoveDetails = move => fetchEntityDetails('move', moveCache, move);
const fetchAbilityDetails = ability => fetchEntityDetails('ability', abilityCache, ability);

// --- CORE RENDER FUNCTIONS ---
function renderTeamSlots() {
	const grid = document.getElementById('pokemon-grid');
	grid.innerHTML = '';
	
	teamState.forEach((slot, index) => {
		const slotWrapper = document.createElement('div');
		slotWrapper.className = 'slot-wrapper';
		const isLead = index === 0;
		
		if (!slot.pokemon) {
			slotWrapper.innerHTML = `
			<div class="card empty-slot ${isLead ? 'lead-slot' : ''}">
			${isLead ? `<div class="leader-badge" style="position:absolute; top:12px; left:12px;">👑 Leader</div>` : ''}
			<div class="card-id">Slot #${index + 1}</div>
			<div class="search-box">
            <input type="text" class="search-input" placeholder="${isLead ? '+ Choose Lead Pokémon...' : '+ Choose Pokémon...'}" data-index="${index}">
            <div class="suggestions-list" id="suggestions-${index}"></div>
			</div>
			</div>`;
			} else {
			const { pokemon, species, shiny: isShiny, gender, showBack } = slot;
			const speciesName = fmtName(pokemon.name.replace(/-(female|male)$/i, ''));
			const displayName = slot.nickname || speciesName;
			const isFemale = gender === 'F';
			const spriteUrl = getPokemonSprite(pokemon, isShiny, isFemale, showBack, slot.spriteStyle || 'gen5_anim');
			const cryUrl = pokemon.cries?.latest || pokemon.cries?.legacy;
			const gRate = species.gender_rate;
			
			const genderBadge = gRate === -1 ? `<span class="gender-icon gender-genderless">∅</span>` : 
			isFemale ? `<span class="gender-icon gender-female">♀</span>` : `<span class="gender-icon gender-male">♂</span>`;
			
			const friendInfo = getFriendshipDetails(slot.friendship);
			const natureDesc = getNatureDetails(slot.nature);
			const activeAbility = abilityCache[slot.ability];
			
			// ✅ Update the calculatedStats block inside renderTeamSlots():
			const calculatedStats = STAT_NAMES.map(s => {
				const base = pokemon.stats.find(p => p.stat.name === s.key)?.base_stat || 0;
				const res = calculateStat(base, slot.ivs[s.key] ?? 31, slot.evs[s.key] ?? 0, slot.level, s.key, slot.nature);
				const val = typeof res === 'object' ? res.value : res;
				return { ...s, base, val, mult: res.multiplier || 1.0 };
			});
			
			slotWrapper.innerHTML = `
			<div class="slot-top-bar">
			<div style="display:flex; align-items:center; gap:4px;">
            ${index > 0 ? `<button class="bar-btn-tag" onclick="moveSlot(${index}, -1)" title="Move Left">◄</button>` : ''}
            ${index < teamState.length - 1 ? `<button class="bar-btn-tag" onclick="moveSlot(${index}, 1)" title="Move Right">►</button>` : ''}
            ${isLead ? `<span class="leader-badge">👑</span>` : `<span class="card-id">#${String(species.id).padStart(4, '0')}</span>`}
			</div>
			<div style="display:flex; gap:4px; align-items:center;">
            <button class="bar-btn-tag flip-btn-tag ${showBack ? 'active' : ''}" onclick="updateSlot(${index}, 'showBack', ${!showBack})" title="Toggle Front/Back Sprite">🔄</button>
			<button class="bar-btn-tag desc-btn-tag ${slot.showDesc ? 'active' : ''}" onclick="updateSlot(${index}, 'showDesc', ${!slot.showDesc})" title="Toggle Pokédex Description">📖</button>
            <button class="bar-btn-tag" onclick="toggleDrawer(${index})" title="Edit Pokémon Stats/Moves">⚙️</button>
            <button class="bar-btn-tag" onclick="exportSlotAsImage(${index})" title="Export Pokémon as Image">📸</button>
            <button class="btn-danger-sm" onclick="removePokemon(${index})" title="Remove Pokémon">🗑️</button>
			</div>
			</div>
			
			${slot.showDesc ? `
				<div class="slot-flavor-box">
				📜 ${slot.flavorText || "No Pokédex description available."}
				</div>
			` : ''}
			
			<div class="card ${isShiny ? 'is-shiny' : ''} ${isLead ? 'lead-slot' : ''}">
			<div class="card-header">
            <span class="card-name" title="Species: ${speciesName}">
			${displayName} ${slot.nickname ? `<span style="font-size:0.7rem; color:var(--text-muted); font-weight:normal;">(${speciesName})</span>` : ''}
            </span>            
            <span class="level-badge">Lv.${slot.level}</span>
            ${genderBadge}
			</div>
			
			<div class="types">
            <span class="header-gen-badge">Gen ${getGen(species.id)}</span>
            ${pokemon.types.map(t => `<span class="type-badge ${t.type.name}">${t.type.name}</span>`).join('')}
			</div>
			
			<!-- Pokémon Sprite -->
			<div class="sprite-container">
            <img src="${spriteUrl}" alt="${pokemon.name}">
			</div>
			
			<div class="meta-badges-container">
            <div class="pill-badge pill-nature" title="${natureDesc}">${slot.nature}</div>
            <div class="pill-badge pill-friend" title="${friendInfo.desc}">♥ ${slot.friendship}/255</div>
            ${slot.item ? `<div class="pill-badge pill-item" title="${ITEM_DESCRIPTIONS[slot.item] || ''}">🎒 ${slot.item}</div>` : ''}
            ${slot.ability ? `<div class="pill-badge pill-ability" title="${activeAbility?.desc || 'Loading...'}">${fmtName(slot.ability)}</div>` : ''}
			</div>
			
			<div class="moveset-card">
            ${slot.moves.map(mName => {
				const move = moveCache[mName];
				if (!move || !mName) return `<div class="move-slot empty" title="Empty Move Slot"><span class="move-empty-txt">— Empty Move —</span></div>`;
				
				const catIcon = move.damageClass === 'physical' ? '💥' : move.damageClass === 'special' ? '🔮' : '🛡️';
				const moveTooltip = `${fmtName(move.name).toUpperCase()} (${move.type.toUpperCase()})\n• Class: ${move.damageClass.toUpperCase()}\n• Power: ${move.power} | Acc: ${move.accuracy} | PP: ${move.pp}\n• Effect: ${move.desc}`;
				return `
                <div class="move-slot" title="${moveTooltip}">
				<div class="move-type-pill ${move.type}">
				<span class="move-cat-icon">${catIcon}</span>
				<span class="move-type-lbl">${move.type.slice(0, 3)}</span>
				</div>
				<div class="move-main-info">
				<span class="move-title">${fmtName(move.name)}</span>
				<div class="move-pills-row">
				<span>Pwr <b>${move.power}</b></span>
				<span>Acc <b>${move.accuracy}</b></span>
				<span>PP <b>${move.pp}</b></span>
				</div>
				</div>
                </div>`;
			}).join('')}
			</div>
			
			<div class="stats-graph-container">
            ${calculatedStats.map(st => {
				const cls = st.mult === 1.1 ? 'boost' : st.mult === 0.9 ? 'nerf' : '';
				const pct = Math.min(100, Math.max(8, Math.round((st.val / st.maxPossible) * 100)));
				return `
                <div class="stat-graph-row">
				<span class="stat-graph-lbl">${st.label}</span>
				<span class="stat-graph-val ${cls ? 'stat-' + cls : ''}">${st.val}</span>
				<div class="stat-bar-track"><div class="stat-bar-fill ${cls ? 'fill-' + cls : ''}" style="width: ${pct}%;"></div></div>
                </div>`;
			}).join('')}
			</div>
			
			<div class="misc-info-container">
            <div class="misc-grid">
			<div class="misc-item"><span class="misc-lbl">📏 Height</span><span class="misc-val">${(pokemon.height / 10).toFixed(1)} m</span></div>
			<div class="misc-item"><span class="misc-lbl">⚖️ Weight</span><span class="misc-val">${(pokemon.weight / 10).toFixed(1)} kg</span></div>
            </div>
			</div>
			
			<div class="controls-drawer" id="drawer-${index}">
            <div class="drawer-header">
			<span class="drawer-title">Edit ${fmtName(pokemon.name)}</span>
			<button class="action-btn-sm" style="padding:4px 10px;" onclick="toggleDrawer(${index})">Done</button>
            </div>
            <div class="slot-controls">
			<div class="field-group">
			<label>Nickname (Max 12)</label>
			<input type="text" maxlength="12" placeholder="${speciesName}" value="${slot.nickname}" onchange="updateSlot(${index}, 'nickname', this.value.trim())">
			</div>
			<div class="field-group"><label>Level</label><input type="number" min="1" max="100" value="${slot.level}" onchange="updateSlot(${index}, 'level', parseInt(this.value))"></div>
			<div class="field-group"><label>Gender</label>
			<select onchange="updateSlot(${index}, 'gender', this.value)" ${gRate === -1 ? 'disabled' : ''}>
			${gRate === -1 ? `<option value="N">Genderless</option>` : ''}
			${gRate !== -1 && gRate !== 8 ? `<option value="M" ${slot.gender === 'M' ? 'selected' : ''}>Male (♂)</option>` : ''}
			${gRate !== -1 && gRate !== 0 ? `<option value="F" ${slot.gender === 'F' ? 'selected' : ''}>Female (♀)</option>` : ''}
			</select>
			</div>
			<div class="field-group"><label>Shiny Mode</label>
			<select onchange="updateSlot(${index}, 'shiny', this.value === 'true')">
			<option value="false" ${!isShiny ? 'selected' : ''}>No</option>
			<option value="true" ${isShiny ? 'selected' : ''}>Yes</option>
			</select>
			</div>
			<div class="field-group">
			<label>Sprite Style</label>
			<select onchange="updateSlot(${index}, 'spriteStyle', this.value)">
			${Object.entries(SPRITE_VERSIONS).map(([key, label]) => `
				<option value="${key}" ${(slot.spriteStyle || 'gen5_anim') === key ? 'selected' : ''}>${label}</option>
			`).join('')}
			</select>
			</div>
			<div class="field-group"><label>Nature</label>
			<select onchange="updateSlot(${index}, 'nature', this.value)">${NATURES.map(n => `<option value="${n}" ${slot.nature === n ? 'selected' : ''}>${n}</option>`).join('')}</select>
			</div>
			<div class="field-group"><label>Friendship (0-255)</label><input type="number" min="0" max="255" value="${slot.friendship}" onchange="updateSlot(${index}, 'friendship', Math.min(255, Math.max(0, parseInt(this.value) || 0)))"></div>
			<div class="field-group"><label>Held Item</label>
			<select onchange="updateSlot(${index}, 'item', this.value)">
			<option value="">None</option>${HELD_ITEMS.map(i => `<option value="${i}" ${slot.item === i ? 'selected' : ''}>${i}</option>`).join('')}
			</select>
			</div>
            </div>
			
            <div class="field-group" style="width:100%; margin:2px 0;">
			<div style="display:flex; justify-content:space-between;"><label>EV & IV Customizer</label><span style="font-size:0.65rem; color:var(--primary-yellow);">Total EVs: ${Object.values(slot.evs).reduce((a,b)=>a+b,0)} / 510</span></div>
			<div class="ev-iv-grid">
			<div class="ev-iv-row-header">Stat</div><div class="ev-iv-row-header">IV (0-31)</div><div class="ev-iv-row-header">EV (0-252)</div>
			${STAT_NAMES.map(s => `
				<span style="font-size:0.7rem; font-weight:bold;">${s.label}</span>
				<input type="number" min="0" max="31" value="${slot.ivs[s.key]}" onchange="updateIvEv(${index}, 'ivs', '${s.key}', this.value)">
				<input type="number" min="0" max="252" value="${slot.evs[s.key]}" onchange="updateIvEv(${index}, 'evs', '${s.key}', this.value)">
			`).join('')}
			</div>
            </div>
			
            <div class="field-group" style="width:100%; margin:4px 0;">
			<label>Ability Selection</label>
			<select onchange="handleAbilitySelect(${index}, this.value)">
			${pokemon.abilities.map(a => `<option value="${a.ability.name}" ${slot.ability === a.ability.name ? 'selected' : ''}>${fmtName(a.ability.name)} ${a.is_hidden ? '(Hidden)' : ''}</option>`).join('')}
			</select>
            </div>
			
            <div class="field-group" style="width:100%;">
			<label>Moveset Configuration</label>
			<div class="drawer-moves-container">
			${[0, 1, 2, 3].map(mIdx => `
				<div class="move-edit-card">
				<select onchange="handleMoveSelect(${index}, ${mIdx}, this.value)">
				<option value="">- Select Move ${mIdx + 1} -</option>
				${pokemon.moves.map(m => `<option value="${m.move.name}" ${slot.moves[mIdx] === m.move.name ? 'selected' : ''}>${fmtName(m.move.name)}</option>`).join('')}
				</select>
			</div>`).join('')}
			</div>
            </div>
			</div>
			</div>`;
			
			const spriteContainer = slotWrapper.querySelector('.sprite-container');
			const spriteImg = spriteContainer.querySelector('img');
			spriteContainer.addEventListener('click', (e) => {
				e.stopPropagation();
				playCry(cryUrl);
				spriteImg.classList.remove('jumping');
				void spriteImg.offsetWidth;
				spriteImg.classList.add('jumping');
			});
		}
		grid.appendChild(slotWrapper);
	});
	
	attachSearchListeners();
	updateDashboard();
}

// --- CONTROLLERS & ACTIONS ---
function toggleDrawer(index) {
	document.querySelectorAll('.grid .card')[index]?.classList.toggle('drawer-open');
}

async function updateSlot(index, field, value) {
	teamState[index][field] = value;
	refreshUI();
}

function moveSlot(fromIndex, direction) {
	const toIndex = fromIndex + direction;
	if (toIndex < 0 || toIndex >= teamState.length) return; // Works with dynamic array lengths
	[teamState[fromIndex], teamState[toIndex]] = [teamState[toIndex], teamState[fromIndex]];
	refreshUI();
}

function updateIvEv(slotIdx, type, statKey, val) {
	let parsed = parseInt(val) || 0;
	if (type === 'ivs') {
		teamState[slotIdx].ivs[statKey] = Math.min(31, Math.max(0, parsed));
		} else {
		parsed = Math.min(252, Math.max(0, parsed));
		const otherTotal = Object.keys(teamState[slotIdx].evs).filter(k => k !== statKey).reduce((sum, k) => sum + teamState[slotIdx].evs[k], 0);
		teamState[slotIdx].evs[statKey] = otherTotal + parsed > 510 ? 510 - otherTotal : parsed;
	}
	refreshUI();
}

function applyBulkField(field, value) {
	teamState.forEach(slot => { if (slot.pokemon) slot[field] = value; });
	refreshUI();
}

function applyBulkIvPreset(presetType) {
	const isTrickRoom = presetType === 'trickroom';
	teamState.forEach(slot => {
		if (slot.pokemon) slot.ivs = { hp: 31, attack: 31, defense: 31, 'special-attack': 31, 'special-defense': 31, speed: isTrickRoom ? 0 : 31 };
	});
	renderTeamSlots();
}

function setTeamSize(newSize) {
	maxTeamSlots = parseInt(newSize, 10);
	
	if (teamState.length < maxTeamSlots) {
		// Expand team capacity
		while (teamState.length < maxTeamSlots) {
			teamState.push(createEmptySlot());
		}
		} else if (teamState.length > maxTeamSlots) {
		// Check if slots being removed contain active Pokémon
		const slotsToRemove = teamState.slice(maxTeamSlots);
		const hasActivePokemon = slotsToRemove.some(slot => slot.pokemon !== null);
		
		if (hasActivePokemon) {
			if (!confirm(`Shrinking team size to ${maxTeamSlots} will delete Pokémon in slot(s) ${maxTeamSlots + 1}–${teamState.length}. Continue?`)) {
				// Reset select dropdown value back to current length if cancelled
				document.getElementById('max-slots-select').value = teamState.length;
				return;
			}
		}
		teamState = teamState.slice(0, maxTeamSlots);
	}
	
	refreshUI();
}

function applyBulkEvPreset(presetType) {
	const presets = {
		reset: { hp: 0, attack: 0, defense: 0, 'special-attack': 0, 'special-defense': 0, speed: 0 },
		physical: { hp: 4, attack: 252, defense: 0, 'special-attack': 0, 'special-defense': 0, speed: 252 },
		special: { hp: 4, attack: 0, defense: 0, 'special-attack': 252, 'special-defense': 0, speed: 252 },
		bulky: { hp: 252, attack: 0, defense: 128, 'special-attack': 0, 'special-defense': 128, speed: 0 }
	};
	teamState.forEach(slot => { if (slot.pokemon && presets[presetType]) slot.evs = { ...presets[presetType] }; });
	renderTeamSlots();
}

async function handleAbilitySelect(slotIdx, abilityName) {
	teamState[slotIdx].ability = abilityName;
	await fetchAbilityDetails(abilityName);
	refreshUI();
}

async function handleMoveSelect(slotIdx, moveIdx, moveName) {
	teamState[slotIdx].moves[moveIdx] = moveName;
	await fetchMoveDetails(moveName);
	refreshUI();
}

async function selectPokemon(index, name) {
	try {
		const cleanName = name.toLowerCase().trim().replace(/ (female|male)/g, '');
		const apiKey = cleanName.replace(/ /g, '-');
		
		let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${FORM_MAP[apiKey] || apiKey}`);
		if (!res.ok) {
			const baseSlug = apiKey.split('-')[0];
			res = await fetch(`https://pokeapi.co/api/v2/pokemon/${FORM_MAP[baseSlug] || baseSlug}`);
		}
		
		if (!res.ok) throw new Error(`API fetch failed for ${apiKey}`);
		const pokemon = await res.json();
		
		const speciesSlug = pokemon.species?.name || apiKey.split('-')[0];
		const species = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${speciesSlug}`).then(r => r.ok ? r.json() : null);
		
		// --- ADD THIS BLOCK TO GET GEN 5 FLAVOR TEXT ---
		let flavorText = "No Pokédex description available.";
		if (species && species.flavor_text_entries) {
			// Find Gen 5 entry (black-white or black-2-white-2) in English
			const gen5Entry = species.flavor_text_entries.find(f => 
				f.language.name === 'en' && 
				(f.version.name === 'black' || f.version.name === 'white' || f.version.name === 'black-2-white-2')
			) || species.flavor_text_entries.find(f => f.language.name === 'en'); // Fallback to any English text
			
			if (gen5Entry) {
				flavorText = gen5Entry.flavor_text.replace(/[\r\n\f]/g, ' ');
			}
		}
		
		const defaultGender = species ? (species.gender_rate === -1 ? 'N' : species.gender_rate === 8 ? 'F' : 'M') : 'M';
		const defaultAbility = pokemon.abilities[0]?.ability.name || "";
		
		teamState[index] = {
			...createEmptySlot(),
			pokemon,
			species: species || { id: pokemon.id, gender_rate: -1, base_happiness: 70 },
			gender: defaultGender,
			friendship: species?.base_happiness ?? 70,
			ability: defaultAbility,
			flavorText: flavorText // Store description in slot state
		};
		
		if (defaultAbility) await fetchAbilityDetails(defaultAbility);
		refreshUI();
		
		} catch (e) {
		console.error("Setting Pokémon failed:", e);
		alert(`Could not load details for ${fmtName(name)}.`);
	}
}

function removePokemon(index) {
	teamState[index] = createEmptySlot();
	refreshUI();
}

function updateDashboard() {
	const active = teamState.filter(s => s.pokemon !== null);
	document.getElementById('team-counter').textContent = `${active.length} / ${teamState.length}`;
	document.getElementById('shiny-counter').textContent = active.filter(s => s.shiny).length;
	document.getElementById('avg-level-counter').textContent = active.length ? `Lv. ${Math.round(active.reduce((a, c) => a + c.level, 0) / active.length)}` : '--';
}

function renderAnalysis() {
	const container = document.getElementById('type-matrix');
	container.innerHTML = ALL_TYPES.map(type => {
		let weaknesses = 0, resistances = 0, immunities = 0;
		teamState.forEach(slot => {
			if (!slot.pokemon) return;
			let mult = 1.0;
			slot.pokemon.types.forEach(t => { 
				if (TYPE_CHART[type]?.[t.type.name] !== undefined) mult *= TYPE_CHART[type][t.type.name]; 
			});
			if (mult > 1.0) weaknesses++; 
			else if (mult === 0) immunities++; 
			else if (mult < 1.0) resistances++;
		});
		
		const netScore = (resistances + immunities) - weaknesses;
		const alertClass = netScore < 0 ? 'threat-high' : netScore === 0 ? 'threat-neutral' : 'threat-safe';
		
		return `
		<div class="analysis-card ${alertClass}" title="Incoming ${type.toUpperCase()} Attacks:
		• ${weaknesses} weak to it
		• ${resistances} resist it
		• ${immunities} immune to it">
        <span class="type-badge ${type}">${type.slice(0, 3)}</span>
        <div class="analysis-row">
		<span class="analysis-count count-weak" title="Weaknesses">⚠️ ${weaknesses}</span>
		<span class="analysis-count count-resist" title="Resistances">🛡️ ${resistances}</span>
		${immunities > 0 ? `<span class="analysis-count count-immune" title="Immunities">✨ ${immunities}</span>` : ''}
        </div>
		</div>`;
	}).join('');
}

function attachSearchListeners() {
	document.querySelectorAll('.search-input').forEach(input => {
		if (input.id === 'dex-search-input') return;
		input.addEventListener('input', (e) => {
			const index = e.target.dataset.index;
			const query = e.target.value.toLowerCase().trim();
			const list = document.getElementById(`suggestions-${index}`);
			
			if (!query) return (list.style.display = 'none');
			const matches = speciesIndex.filter(s => s.name.includes(query) || s.displayName.toLowerCase().includes(query)).slice(0, 8);
			if (!matches.length) return (list.style.display = 'none');
			
			list.innerHTML = matches.map(m => `
				<div class="suggestion-item" onclick="selectPokemon(${index}, '${m.name}')">
				${m.displayName || fmtName(m.name)}
				</div>
			`).join('');
			list.style.display = 'block';
		});
	});
}

function renderPokedexGrid() {
	const container = document.getElementById('dex-grid-container');
	const query = document.getElementById('dex-search-input').value.toLowerCase().trim();
	const genFilter = document.getElementById('dex-gen-filter').value;
	
	const filtered = speciesIndex.filter(i => 
		(i.name.includes(query) || i.displayName.toLowerCase().includes(query) || String(i.id).includes(query)) && 
		(genFilter === 'all' || i.gen === parseInt(genFilter))
	);
	
	document.getElementById('dex-results-count').textContent = `Showing ${filtered.length} Pokémon`;
	
	container.innerHTML = filtered.map(item => `
		<div class="dex-card" onclick="promptSlotSelection('${item.name}')">
		<div class="dex-meta-row">
        <span class="dex-number">#${String(item.id).padStart(3, '0')}</span>
        <span class="gen-badge">Gen ${item.gen}</span>
		</div>
		<img class="dex-thumb" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png" alt="${item.name}" loading="lazy">
		<span class="dex-name">${item.displayName || fmtName(item.name)}</span>
		</div>
	`).join('');
}

let pendingPokemonSelection = null;

function promptSlotSelection(name) {
	pendingPokemonSelection = name;
	document.getElementById('dex-modal').style.display = 'none';
	document.getElementById('slot-modal-title').textContent = `Add ${fmtName(name).toUpperCase()} to Slot:`;
	
	const container = document.getElementById('slot-picker-container');
	container.innerHTML = teamState.map((slot, idx) => {
		const isOccupied = slot.pokemon !== null;
		const pokeName = isOccupied ? fmtName(slot.pokemon.name) : 'Empty Slot';
		const statusText = isOccupied ? `Lv. ${slot.level}` : 'Click to place here';
		const thumbUrl = isOccupied ? getPokemonSprite(slot.pokemon, slot.shiny, slot.gender === 'F', false) : '';
		
		return `
		<div class="slot-picker-card ${!isOccupied ? 'is-empty' : ''}" onclick="confirmSlotSelection(${idx})">
        <span class="slot-picker-num">#${idx + 1}</span>
        ${isOccupied ? `<img src="${thumbUrl}" style="width:32px; height:32px; object-fit:contain; image-rendering:pixelated;">` : ''}
        <div class="slot-picker-info">
		<span class="slot-picker-name">${pokeName}</span>
		<span class="slot-picker-status">${statusText}</span>
        </div>
		</div>`;
	}).join('');
	
	document.getElementById('slot-select-modal').style.display = 'flex';
}

function confirmSlotSelection(slotIndex) {
	if (pendingPokemonSelection) {
		selectPokemon(slotIndex, pendingPokemonSelection);
		pendingPokemonSelection = null;
	}
	document.getElementById('slot-select-modal').style.display = 'none';
	document.getElementById('dex-modal').style.display = 'none';
}

async function exportSlotAsImage(index) {
	const slotNode = document.querySelectorAll('.grid .slot-wrapper')[index];
	if (!slotNode || !teamState[index].pokemon) return;
	
	try {
		const canvas = await html2canvas(slotNode.querySelector('.card'), { backgroundColor: null, scale: 2, useCORS: true });
		const link = document.createElement("a");
		link.href = canvas.toDataURL("image/png");
		link.download = `${teamState[index].pokemon.name}-card.png`;
		link.click();
		} catch (err) {
		console.error("Failed to render card image:", err);
		alert("Could not export image.");
	}
}

async function loadTeamCache(team) {
	const promises = [];
	team.forEach(slot => {
		if (!slot.pokemon) return;
		if (slot.ability) promises.push(fetchAbilityDetails(slot.ability));
		slot.moves.forEach(m => { if (m) promises.push(fetchMoveDetails(m)); });
	});
	await Promise.all(promises);
}

function saveTeamToLocalStorage() {
	if (localStorage.getItem('pokemon_team_builder_save')) {
		if (!confirm("A saved team already exists in browser storage. Overwrite?")) return;
	}
	localStorage.setItem('pokemon_team_builder_save', JSON.stringify(teamState));
}

async function loadTeamFromLocalStorage() {
	const saved = localStorage.getItem('pokemon_team_builder_save');
	if (!saved) return alert('No saved team found in browser storage.');
	try {
		teamState = JSON.parse(saved);
		await loadTeamCache(teamState);
		refreshUI();
		} catch (e) {
		console.error("Load error:", e);
		alert('Failed to load saved team.');
	}
}

function exportTeamJSON() {
	const dlAnchor = document.createElement('a');
	dlAnchor.setAttribute("href", "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(teamState, null, 2)));
	dlAnchor.setAttribute("download", "pokemon_team.json");
	dlAnchor.click();
	dlAnchor.remove();
}

function importTeamJSON(event) {
	const file = event.target.files[0];
	if (!file) return;
	
	const reader = new FileReader();
	reader.onload = async (e) => {
		try {
			const importedState = JSON.parse(e.target.result);
			if (Array.isArray(importedState) && importedState.length >= 1 && importedState.length <= 10) {
				teamState = importedState;
				maxTeamSlots = teamState.length;
				const select = document.getElementById('max-slots-select');
				if (select) select.value = maxTeamSlots;
				
				await loadTeamCache(teamState);
				refreshUI();
			} else alert('Invalid JSON structure. Team size must be between 1 and 10.');
		} catch { alert('Error parsing JSON file.'); }
	};
	reader.readAsText(file);
}

function toggleHeaderDeck() {
	const deck = document.getElementById('header-deck');
	const icon = document.getElementById('deck-toggle-icon');
	const text = document.getElementById('deck-toggle-text');
	
	const isCollapsed = deck.classList.toggle('collapsed');
	
	if (isCollapsed) {
		icon.textContent = '👁️‍🗨️';
		text.textContent = 'Unhide Panel';
		} else {
		icon.textContent = '👁️';
		text.textContent = 'Hide Panel';
	}
}

function toggleDefenseDeck() {
	const deck = document.getElementById('defense-deck');
	const icon = document.getElementById('defense-toggle-icon');
	const text = document.getElementById('defense-toggle-text');
	
	const isCollapsed = deck.classList.toggle('collapsed');
	
	if (isCollapsed) {
		icon.textContent = '👁️‍🗨️';
		text.textContent = 'Unhide Matrix';
		} else {
		icon.textContent = '👁️';
		text.textContent = 'Hide Matrix';
	}
}

// --- INIT & GLOBAL EVENT LISTENERS ---
async function init() {
	const batchNatureSelect = document.getElementById('batch-nature');
	if (batchNatureSelect) batchNatureSelect.innerHTML = NATURES.map(n => `<option value="${n}">${n}</option>`).join('');
	
	try {
		const data = await fetch('https://pokeapi.co/api/v2/pokemon-species?limit=649').then(r => r.json());
		const baseList = data.results.map((item, idx) => ({ id: idx + 1, name: item.name, displayName: fmtName(item.name), gen: getGen(idx + 1) }));
		speciesIndex = [...baseList, ...GEN_1_5_EXTRA_FORMS];
	} catch (e) { console.error("Index load failed", e); }
	refreshUI();
}

document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('pokedex-sheet-btn').addEventListener('click', () => { renderPokedexGrid(); document.getElementById('dex-modal').style.display = 'flex'; });
	document.getElementById('close-dex-btn').addEventListener('click', () => document.getElementById('dex-modal').style.display = 'none');
	document.getElementById('batch-edit-btn').addEventListener('click', () => document.getElementById('batch-modal').style.display = 'flex');
	document.getElementById('close-batch-btn').addEventListener('click', () => document.getElementById('batch-modal').style.display = 'none');
	document.getElementById('dex-search-input').addEventListener('input', renderPokedexGrid);
	document.getElementById('dex-gen-filter').addEventListener('change', renderPokedexGrid);
	
	document.getElementById('export-btn').addEventListener('click', () => {
		let exportText = "";
		teamState.forEach(slot => {
			if (!slot.pokemon) return;
			const speciesName = fmtName(slot.pokemon.name);
			exportText += `${slot.nickname ? `${slot.nickname} (${speciesName})` : speciesName}${slot.gender === 'F' ? ' (F)' : slot.gender === 'M' ? ' (M)' : ''} ${slot.item ? `@ ${slot.item}` : ''}\n`;
			exportText += `Ability: ${slot.ability}\nLevel: ${slot.level}\n`;
			if (slot.shiny) exportText += `Shiny: Yes\n`;
			if (slot.friendship !== 255) exportText += `Happiness: ${slot.friendship}\n`;
			exportText += `${slot.nature} Nature\n`;
			
			const evsArr = STAT_NAMES.map(s => slot.evs[s.key] > 0 ? `${slot.evs[s.key]} ${s.label}` : null).filter(Boolean);
			if (evsArr.length) exportText += `EVs: ${evsArr.join(' / ')}\n`;
			
			const ivsArr = STAT_NAMES.map(s => slot.ivs[s.key] < 31 ? `${slot.ivs[s.key]} ${s.label}` : null).filter(Boolean);
			if (ivsArr.length) exportText += `IVs: ${ivsArr.join(' / ')}\n`;
			
			slot.moves.forEach(m => { if (m) exportText += `- ${m}\n`; });
			exportText += `\n`;
		});
		
		document.getElementById('export-text').value = exportText || "No Pokémon added to team yet!";
		document.getElementById('export-modal').style.display = 'flex';
	});
	
	document.getElementById('close-slot-modal-btn').addEventListener('click', () => document.getElementById('slot-select-modal').style.display = 'none');
	document.getElementById('close-modal-btn').addEventListener('click', () => document.getElementById('export-modal').style.display = 'none');
	
	// --- UPDATED CLEAR BUTTON ---
	document.getElementById('clear-btn').addEventListener('click', () => { 
		teamState = Array.from({ length: maxTeamSlots }, createEmptySlot); 
		refreshUI(); 
	});
	
	// --- NEW TEAM SIZE SELECTOR LISTENER ---
	const slotSelect = document.getElementById('max-slots-select');
	if (slotSelect) {
		slotSelect.addEventListener('change', (e) => setTeamSize(e.target.value));
	}
	
	document.getElementById('save-team-btn').addEventListener('click', saveTeamToLocalStorage);
	document.getElementById('load-team-btn').addEventListener('click', loadTeamFromLocalStorage);
	document.getElementById('export-json-btn').addEventListener('click', exportTeamJSON);
	
	const jsonInput = document.getElementById('json-file-input');
	document.getElementById('import-json-btn').addEventListener('click', () => jsonInput.click());
	jsonInput.addEventListener('change', importTeamJSON);
	
	init();
});
