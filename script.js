// --- CONSTANTS & CONFIG ---
const NATURE_MODIFIERS = {
  Adamant: { boost: "attack", nerf: "special-attack" },
  Bold: { boost: "defense", nerf: "attack" },
  Brave: { boost: "attack", nerf: "speed" },
  Calm: { boost: "special-defense", nerf: "attack" },
  Careful: { boost: "special-defense", nerf: "special-attack" },
  Gentle: { boost: "special-defense", nerf: "defense" },
  Hasty: { boost: "speed", nerf: "defense" },
  Impish: { boost: "defense", nerf: "special-attack" },
  Jolly: { boost: "speed", nerf: "special-attack" },
  Lax: { boost: "defense", nerf: "special-defense" },
  Lonely: { boost: "attack", nerf: "defense" },
  Mild: { boost: "special-attack", nerf: "defense" },
  Modest: { boost: "special-attack", nerf: "attack" },
  Naive: { boost: "speed", nerf: "special-defense" },
  Naughty: { boost: "attack", nerf: "special-defense" },
  Quiet: { boost: "special-attack", nerf: "speed" },
  Rash: { boost: "special-attack", nerf: "special-defense" },
  Relaxed: { boost: "defense", nerf: "speed" },
  Sassy: { boost: "special-defense", nerf: "speed" },
  Timid: { boost: "speed", nerf: "attack" }
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

// --- STATE & CACHE ---
const createEmptySlot = () => ({
  pokemon: null, species: null, level: 100, shiny: false, showBack: false, nature: "Hardy",
  gender: "M", friendship: 255, ability: "", item: "", moves: ["", "", "", ""],
  ivs: { hp: 31, attack: 31, defense: 31, 'special-attack': 31, 'special-defense': 31, speed: 31 },
  evs: { hp: 0, attack: 0, defense: 0, 'special-attack': 0, 'special-defense': 0, speed: 0 }
});

let teamState = Array.from({ length: 6 }, createEmptySlot);
let speciesIndex = [];
const moveCache = {}, abilityCache = {};

// --- UTILS ---
const getGen = id => id <= 151 ? 1 : id <= 251 ? 2 : id <= 386 ? 3 : id <= 493 ? 4 : 5;
const fmtName = name => name.replace(/-/g, ' ');

function refreshUI() {
  // 1. Find which slot drawers are currently open
  const openDrawerIndices = [];
  document.querySelectorAll('.grid .card').forEach((card, idx) => {
    if (card.classList.contains('drawer-open')) {
      openDrawerIndices.push(idx);
    }
  });

  // 2. Re-render HTML slots
  renderTeamSlots();
  renderAnalysis();

  // 3. Restore the open drawer state
  openDrawerIndices.forEach(idx => {
    const card = document.querySelectorAll('.grid .card')[idx];
    if (card) card.classList.add('drawer-open');
  });
}

function playCry(url) {
  if (!url) return;
  const audio = new Audio(url);
  audio.volume = 0.5;
  audio.play().catch(() => {});
}

function getPokemonSprite(pokemon, isShiny, isFemale, showBack) {
  const g5 = pokemon.sprites?.versions?.['generation-v']?.['black-white']?.animated;
  const dir = showBack ? 'back' : 'front';
  const shiny = isShiny ? '_shiny' : '_default';
  const female = isFemale ? '_female' : '';

  return g5?.[`${dir}${shiny}${female}`] || g5?.[`${dir}${shiny}`] 
      || pokemon.sprites?.[`${dir}${shiny}${female}`] || pokemon.sprites?.[`${dir}${shiny}`] 
      || pokemon.sprites?.other?.['official-artwork']?.front_default;
}

function calculateStat(base, iv, ev, level, statKey, nature) {
  if (statKey === 'hp') return base === 1 ? 1 : Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
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
      const isFemale = gender === 'F';
      const spriteUrl = getPokemonSprite(pokemon, isShiny, isFemale, showBack);
      const cryUrl = pokemon.cries?.latest || pokemon.cries?.legacy;
      const gRate = species.gender_rate;

      const genderBadge = gRate === -1 ? `<span class="gender-icon gender-genderless">∅</span>` : 
                          isFemale ? `<span class="gender-icon gender-female">♀</span>` : `<span class="gender-icon gender-male">♂</span>`;

      const friendInfo = getFriendshipDetails(slot.friendship);
      const natureDesc = getNatureDetails(slot.nature);
      const activeAbility = abilityCache[slot.ability];

      const calculatedStats = STAT_NAMES.map(s => {
        const base = pokemon.stats.find(p => p.stat.name === s.key)?.base_stat || 0;
        const res = calculateStat(base, slot.ivs[s.key] ?? 31, slot.evs[s.key] ?? 0, slot.level, s.key, slot.nature);
        return { ...s, base, val: typeof res === 'object' ? res.value : res, mult: res.multiplier || 1.0 };
      });

      slotWrapper.innerHTML = `
        <div class="slot-top-bar">
          <div style="display:flex; align-items:center; gap:4px;">
            ${index > 0 ? `<button class="bar-btn-tag" onclick="moveSlot(${index}, -1)" title="Move Left">◄</button>` : ''}
            ${index < 5 ? `<button class="bar-btn-tag" onclick="moveSlot(${index}, 1)" title="Move Right">►</button>` : ''}
            ${isLead ? `<span class="leader-badge">👑</span>` : `<span class="card-id">#${String(species.id).padStart(4, '0')}</span>`}
          </div>
          <div style="display:flex; gap:4px; align-items:center;">
            <button class="bar-btn-tag flip-btn-tag ${showBack ? 'active' : ''}" onclick="updateSlot(${index}, 'showBack', ${!showBack})" title="Toggle Front/Back Sprite">🔄</button>
            <button class="bar-btn-tag shiny-btn-tag ${isShiny ? 'active' : ''}" onclick="updateSlot(${index}, 'shiny', ${!isShiny})" title="Toggle Shiny Sprite">✨</button>
            <button class="bar-btn-tag" onclick="toggleDrawer(${index})" title="Edit Pokémon Stats/Moves">⚙️</button>
            <button class="bar-btn-tag" onclick="exportSlotAsImage(${index})" title="Export Pokémon as Image">📸</button>
            <button class="btn-danger-sm" onclick="removePokemon(${index})" title="Remove Pokémon">🗑️</button>
          </div>
        </div>

        <div class="card ${isShiny ? 'is-shiny' : ''} ${isLead ? 'lead-slot' : ''}">
          <div class="card-header">
            <span class="card-name">${fmtName(pokemon.name)}</span>
            <span class="header-gen-badge">Gen ${getGen(species.id)}</span>
            <span class="level-badge">Lv.${slot.level}</span>
            ${genderBadge}
          </div>
          <div class="types">${pokemon.types.map(t => `<span class="type-badge ${t.type.name}">${t.type.name}</span>`).join('')}</div>
          <div class="sprite-container"><img src="${spriteUrl}" alt="${pokemon.name}"></div>

          <div class="meta-badges-container">
            <div class="pill-badge pill-nature" title="${natureDesc}">⚡ ${slot.nature}</div>
            <div class="pill-badge pill-friend" title="${friendInfo.desc}">♥ ${slot.friendship}/255</div>
            ${slot.item ? `<div class="pill-badge pill-item" title="${ITEM_DESCRIPTIONS[slot.item] || ''}">🎒 ${slot.item}</div>` : ''}
            ${slot.ability ? `<div class="pill-badge pill-ability" title="${activeAbility?.desc || 'Loading...'}">🌀 ${fmtName(slot.ability)}</div>` : ''}
          </div>

          <div class="moveset-card">
            ${slot.moves.map(mName => {
              const move = moveCache[mName];
              const icon = move?.damageClass === 'physical' ? '💥' : move?.damageClass === 'special' ? '🔮' : move ? '🛡️' : '';
              return `<div class="move-slot ${!mName ? 'empty' : ''}">${icon ? `<span>${icon}</span>` : ''}<span>${mName ? fmtName(mName) : '—'}</span></div>`;
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

          <!-- Slide-up Edit Drawer Overlay -->
          <div class="controls-drawer" id="drawer-${index}">
            <div class="drawer-header">
              <span class="drawer-title">Edit ${fmtName(pokemon.name)}</span>
              <button class="action-btn-sm" style="padding:4px 10px;" onclick="toggleDrawer(${index})">Done</button>
            </div>
            <div class="slot-controls">
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

function updateSlot(index, field, value) {
  teamState[index][field] = value;
  refreshUI();
}

function moveSlot(fromIndex, direction) {
  const toIndex = fromIndex + direction;
  if (toIndex < 0 || toIndex >= teamState.length) return;

  const temp = teamState[fromIndex];
  teamState[fromIndex] = teamState[toIndex];
  teamState[toIndex] = temp;

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
  refreshUI(); // Changed from renderTeamSlots()
}

function applyBulkField(field, value) {
  teamState.forEach(slot => { if (slot.pokemon) slot[field] = value; });
  refreshUI();
}

function applyBulkIvPreset(presetType) {
  teamState.forEach(slot => {
    if (slot.pokemon) slot.ivs = presetType === 'trickroom' ? { hp: 31, attack: 31, defense: 31, 'special-attack': 31, 'special-defense': 31, speed: 0 } 
                                                          : { hp: 31, attack: 31, defense: 31, 'special-attack': 31, 'special-defense': 31, speed: 31 };
  });
  renderTeamSlots();
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
  refreshUI(); // Changed from renderTeamSlots()
}

async function handleMoveSelect(slotIdx, moveIdx, moveName) {
  teamState[slotIdx].moves[moveIdx] = moveName;
  await fetchMoveDetails(moveName);
  refreshUI(); // Changed from renderTeamSlots()
}

async function selectPokemon(index, name) {
  try {
    const [pokemon, species] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(r => r.json()),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`).then(r => r.json())
    ]);

    const defaultAbility = pokemon.abilities[0]?.ability.name || "";
    teamState[index] = {
      ...createEmptySlot(),
      pokemon, species,
      gender: species.gender_rate === -1 ? 'N' : species.gender_rate === 8 ? 'F' : 'M',
      friendship: species.base_happiness ?? 70,
      ability: defaultAbility
    };

    if (defaultAbility) await fetchAbilityDetails(defaultAbility);
    refreshUI();
  } catch (e) { console.error("Setting Pokémon failed", e); }
}

function removePokemon(index) {
  teamState[index] = createEmptySlot();
  refreshUI();
}

function updateDashboard() {
  const active = teamState.filter(s => s.pokemon !== null);
  document.getElementById('team-counter').textContent = `${active.length} / 6`;
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
      slot.pokemon.types.forEach(t => { if (TYPE_CHART[type]?.[t.type.name] !== undefined) mult *= TYPE_CHART[type][t.type.name]; });
      if (mult > 1.0) weaknesses++; else if (mult === 0) immunities++; else if (mult < 1.0) resistances++;
    });

    return `
      <div class="analysis-card">
        <span class="type-badge ${type}">${type.slice(0, 3)}</span>
        <span class="analysis-count count-weak">-${weaknesses}</span>
        <span class="analysis-count count-resist">+${resistances}</span>
        ${immunities > 0 ? `<span class="analysis-count count-immune">x${immunities}</span>` : ''}
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
      const matches = speciesIndex.filter(s => s.name.includes(query)).slice(0, 8);
      if (!matches.length) return (list.style.display = 'none');

      list.innerHTML = matches.map(m => `<div class="suggestion-item" onclick="selectPokemon(${index}, '${m.name}')">${fmtName(m.name)}</div>`).join('');
      list.style.display = 'block';
    });
  });
}

function renderPokedexGrid() {
  const container = document.getElementById('dex-grid-container');
  const query = document.getElementById('dex-search-input').value.toLowerCase().trim();
  const genFilter = document.getElementById('dex-gen-filter').value;

  const filtered = speciesIndex.filter(i => (i.name.includes(query) || String(i.id).includes(query)) && (genFilter === 'all' || i.gen === parseInt(genFilter)));
  document.getElementById('dex-results-count').textContent = `Showing ${filtered.length} Pokémon`;

  container.innerHTML = filtered.map(item => `
    <div class="dex-card" onclick="promptSlotSelection('${item.name}')">
      <div class="dex-meta-row"><span class="dex-number">#${String(item.id).padStart(3, '0')}</span><span class="gen-badge">Gen ${item.gen}</span></div>
      <img class="dex-thumb" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png" alt="${item.name}" loading="lazy">
      <span class="dex-name">${fmtName(item.name)}</span>
    </div>`).join('');
}

let pendingPokemonSelection = null;

function promptSlotSelection(name) {
  pendingPokemonSelection = name;
  
  // Hide the Pokédex directory temporarily while selecting slot
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

// --- EXPORT SLOT AS IMAGE ---
async function exportSlotAsImage(index) {
  const slotNode = document.querySelectorAll('.grid .slot-wrapper')[index];
  if (!slotNode || !teamState[index].pokemon) return;

  const pokemonName = teamState[index].pokemon.name;

  try {
    const cardElement = slotNode.querySelector('.card');
    const canvas = await html2canvas(cardElement, {
      backgroundColor: null,
      scale: 2,
      useCORS: true
    });

    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `${pokemonName}-card.png`;
    link.click();
  } catch (err) {
    console.error("Failed to render card image:", err);
    alert("Could not export image.");
  }
}

// --- LOCALSTORAGE & JSON EXPORT/IMPORT ---

function saveTeamToLocalStorage() {
  const existingSave = localStorage.getItem('pokemon_team_builder_save');

  // If a save already exists, ask for confirmation before overwriting
  if (existingSave) {
    const confirmOverwrite = confirm("A saved team already exists in browser storage. Do you want to overwrite it?");
    if (!confirmOverwrite) return;
  }

  localStorage.setItem('pokemon_team_builder_save', JSON.stringify(teamState));
  // Removed success alert
}

function loadTeamFromLocalStorage() {
  const saved = localStorage.getItem('pokemon_team_builder_save');
  
  // Kept alert for when no saved team exists
  if (!saved) {
    alert('No saved team found in browser storage.');
    return;
  }
  
  try {
    teamState = JSON.parse(saved);
    refreshUI();
    // Removed success alert
  } catch (e) {
    alert('Failed to load saved team.');
  }
}

function exportTeamJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(teamState, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", "pokemon_team.json");
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  dlAnchor.remove();
}

function importTeamJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedState = JSON.parse(e.target.result);
      if (Array.isArray(importedState) && importedState.length === 6) {
        teamState = importedState;
        refreshUI();
        alert('Team imported successfully!');
      } else {
        alert('Invalid JSON structure. Must be a 6-slot team configuration.');
      }
    } catch (err) {
      alert('Error parsing JSON file.');
    }
  };
  reader.readAsText(file);
}

// --- INIT & GLOBAL EVENT LISTENERS ---
async function init() {
  const batchNatureSelect = document.getElementById('batch-nature');
  if (batchNatureSelect) batchNatureSelect.innerHTML = NATURES.map(n => `<option value="${n}">${n}</option>`).join('');

  try {
    const data = await fetch('https://pokeapi.co/api/v2/pokemon-species?limit=649').then(r => r.json());
    speciesIndex = data.results.map((item, idx) => ({ id: idx + 1, name: item.name, gen: getGen(idx + 1) }));
  } catch (e) { console.error("Index load failed", e); }
  refreshUI();
}

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
    const genderStr = slot.gender === 'F' ? ' (F)' : slot.gender === 'M' ? ' (M)' : '';
    exportText += `${slot.pokemon.name}${genderStr} ${slot.item ? `@ ${slot.item}` : ''}\nAbility: ${slot.ability}\nLevel: ${slot.level}\n`;
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

document.getElementById('close-slot-modal-btn').addEventListener('click', () => {
  document.getElementById('slot-select-modal').style.display = 'none';
});

document.getElementById('close-modal-btn').addEventListener('click', () => document.getElementById('export-modal').style.display = 'none');
document.getElementById('clear-btn').addEventListener('click', () => { teamState = Array.from({ length: 6 }, createEmptySlot); refreshUI(); });

document.getElementById('save-team-btn').addEventListener('click', saveTeamToLocalStorage);
document.getElementById('load-team-btn').addEventListener('click', loadTeamFromLocalStorage);
document.getElementById('export-json-btn').addEventListener('click', exportTeamJSON);

const jsonInput = document.getElementById('json-file-input');
document.getElementById('import-json-btn').addEventListener('click', () => jsonInput.click());
jsonInput.addEventListener('change', importTeamJSON);

init();
