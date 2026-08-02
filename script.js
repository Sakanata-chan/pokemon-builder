const NATURE_MODIFIERS = {
  "Adamant": { boost: "attack", nerf: "special-attack" },
  "Bold": { boost: "defense", nerf: "attack" },
  "Brave": { boost: "attack", nerf: "speed" },
  "Calm": { boost: "special-defense", nerf: "attack" },
  "Careful": { boost: "special-defense", nerf: "special-attack" },
  "Gentle": { boost: "special-defense", nerf: "defense" },
  "Hasty": { boost: "speed", nerf: "defense" },
  "Impish": { boost: "defense", nerf: "special-attack" },
  "Jolly": { boost: "speed", nerf: "special-attack" },
  "Lax": { boost: "defense", nerf: "special-defense" },
  "Lonely": { boost: "attack", nerf: "defense" },
  "Mild": { boost: "special-attack", nerf: "defense" },
  "Modest": { boost: "special-attack", nerf: "attack" },
  "Naive": { boost: "speed", nerf: "special-defense" },
  "Naughty": { boost: "attack", nerf: "special-defense" },
  "Quiet": { boost: "special-attack", nerf: "speed" },
  "Rash": { boost: "special-attack", nerf: "special-defense" },
  "Relaxed": { boost: "defense", nerf: "speed" },
  "Sassy": { boost: "special-defense", nerf: "speed" },
  "Timid": { boost: "speed", nerf: "attack" }
};
const NATURES = ["Bashful", "Docile", "Hardy", "Quirky", "Serious", ...Object.keys(NATURE_MODIFIERS)];

const ITEM_DESCRIPTIONS = {
  "Leftovers": "Restores 1/16th of maximum HP at the end of each turn.",
  "Choice Scarf": "Boosts Speed by 50%, but locks the holder into using the first selected move.",
  "Choice Band": "Boosts Attack by 50%, but locks the holder into using the first selected move.",
  "Choice Specs": "Boosts Sp. Atk by 50%, but locks the holder into using the first selected move.",
  "Life Orb": "Boosts damage of moves by 30%, but drains 10% max HP per attack.",
  "Focus Sash": "Allows user to survive any single lethal hit from full HP with 1 HP remaining.",
  "Eviolite": "Boosts Defense and Sp. Def by 50% if the holder can still evolve.",
  "Rocky Helmet": "Damages physical attackers for 1/6th of their max HP on contact.",
  "Sitrus Berry": "Restores 25% max HP when falling below 50% HP.",
  "Lum Berry": "Instantly cures any status condition (Paralyze, Burn, Poison, Sleep, Freeze).",
  "Expert Belt": "Boosts the power of super-effective moves by 20%.",
  "Air Balloon": "Grants immunity to Ground-type attacks and entry hazards until popped by an attack."
};

const HELD_ITEMS = Object.keys(ITEM_DESCRIPTIONS);
const ALL_TYPES = ["normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "steel", "dark"];

const STAT_NAMES = [
  { key: 'hp', name: 'hp', label: 'HP', maxPossible: 714 },
  { key: 'attack', name: 'attack', label: 'Atk', maxPossible: 526 },
  { key: 'defense', name: 'defense', label: 'Def', maxPossible: 614 },
  { key: 'special-attack', name: 'spAtk', label: 'SpA', maxPossible: 535 },
  { key: 'special-defense', name: 'spDef', label: 'SpD', maxPossible: 614 },
  { key: 'speed', name: 'speed', label: 'Spe', maxPossible: 504 }
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

let teamState = Array(6).fill(null).map(() => createEmptySlot());

function createEmptySlot() {
  return {
    pokemon: null, species: null, level: 100, shiny: false, showBack: false, nature: "Hardy",
    gender: "M", friendship: 255, ability: "", item: "", moves: ["", "", "", ""],
    ivs: { hp: 31, attack: 31, defense: 31, 'special-attack': 31, 'special-defense': 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, 'special-attack': 0, 'special-defense': 0, speed: 0 }
  };
}

let speciesIndex = [];
const moveCache = {}; 
const abilityCache = {}; 

function getGenerationById(id) {
  if (id <= 151) return 1;
  if (id <= 251) return 2;
  if (id <= 386) return 3;
  if (id <= 493) return 4;
  return 5;
}

async function init() {
  // Dynamically populate Batch Edit Nature options
  const batchNatureSelect = document.getElementById('batch-nature');
  if (batchNatureSelect) {
    batchNatureSelect.innerHTML = NATURES.map(n => `<option value="${n}">${n}</option>`).join('');
  }

  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon-species?limit=649');
    const data = await response.json();
    speciesIndex = data.results.map((item, idx) => {
      const id = idx + 1;
      return { id, name: item.name, gen: getGenerationById(id) };
    });
  } catch (e) { console.error("Index load failed", e); }
  renderTeamSlots();
  renderAnalysis();
}

function playCry(url) {
  if (!url) return;
  const audio = new Audio(url); audio.volume = 0.5;
  audio.play().catch(e => console.log('Audio playback prevented:', e));
}

function getPokemonSprite(pokemon, isShiny, isFemale, showBack = false) {
  const gen5Animated = pokemon.sprites?.versions?.['generation-v']?.['black-white']?.animated;
  const official = pokemon.sprites?.other?.['official-artwork'];

  if (showBack) {
    if (gen5Animated) {
      if (isFemale) {
        if (isShiny && gen5Animated.back_shiny_female) return gen5Animated.back_shiny_female;
        if (!isShiny && gen5Animated.back_female) return gen5Animated.back_female;
      }
      if (isShiny && gen5Animated.back_shiny) return gen5Animated.back_shiny;
      if (!isShiny && gen5Animated.back_default) return gen5Animated.back_default;
    }

    if (isFemale) {
      if (isShiny && pokemon.sprites?.back_shiny_female) return pokemon.sprites.back_shiny_female;
      if (!isShiny && pokemon.sprites?.back_female) return pokemon.sprites.back_female;
    }

    return isShiny 
      ? (pokemon.sprites?.back_shiny || pokemon.sprites?.front_shiny || official?.front_shiny) 
      : (pokemon.sprites?.back_default || pokemon.sprites?.front_default || official?.front_default);
  }

  if (gen5Animated) {
    if (isFemale) {
      if (isShiny && gen5Animated.front_shiny_female) return gen5Animated.front_shiny_female;
      if (!isShiny && gen5Animated.front_female) return gen5Animated.front_female;
    }
    if (isShiny && gen5Animated.front_shiny) return gen5Animated.front_shiny;
    if (!isShiny && gen5Animated.front_default) return gen5Animated.front_default;
  }

  if (isFemale) {
    if (isShiny && pokemon.sprites?.front_shiny_female) return pokemon.sprites.front_shiny_female;
    if (!isShiny && pokemon.sprites?.front_female) return pokemon.sprites.front_female;
  }

  return isShiny ? (pokemon.sprites?.front_shiny || official?.front_shiny) : (pokemon.sprites?.front_default || official?.front_default);
}

function calculateStat(base, iv, ev, level, statKey, nature) {
  if (statKey === 'hp') {
    if (base === 1) return 1; 
    return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
  }

  const raw = Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5;
  const natMod = NATURE_MODIFIERS[nature];
  let multiplier = 1.0;

  if (natMod) {
    if (natMod.boost === statKey) multiplier = 1.1;
    if (natMod.nerf === statKey) multiplier = 0.9;
  }

  return {
    value: Math.floor(raw * multiplier),
    multiplier,
    raw
  };
}

function getFriendshipDetails(val) {
  let status = "Neutral";
  if (val === 0) status = "Hates you";
  else if (val < 50) status = "Wary";
  else if (val < 100) status = "Neutral";
  else if (val < 150) status = "Friendly";
  else if (val < 200) status = "Trusts you";
  else if (val < 255) status = "Loves you";
  else status = "Unbreakable Bond";

  const returnPwr = Math.floor(val / 2.5);
  const frustPwr = Math.floor((255 - val) / 2.5);

  return {
    status,
    desc: `Bond: ${status} (${val}/255).\n• Return Base Power: ${returnPwr}\n• Frustration Base Power: ${frustPwr}`
  };
}

function getNatureDetails(nature) {
  const mod = NATURE_MODIFIERS[nature];
  if (!mod) return `${nature} Nature: Neutral (No stat modifications).`;
  return `${nature} Nature:\n• Increases: ${mod.boost.toUpperCase()} (+10%)\n• Decreases: ${mod.nerf.toUpperCase()} (-10%)`;
}

async function fetchMoveDetails(moveName) {
  if (!moveName) return null;
  if (moveCache[moveName]) return moveCache[moveName];

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/move/${moveName}`);
    const data = await res.json();
    
    const flavor = data.flavor_text_entries.find(f => f.language.name === 'en')?.flavor_text || 
                   data.effect_entries.find(e => e.language.name === 'en')?.short_effect || 'No description available.';

    const details = {
      name: data.name,
      type: data.type.name,
      damageClass: data.damage_class.name,
      power: data.power ?? '—',
      accuracy: data.accuracy ? `${data.accuracy}%` : '100%',
      pp: data.pp ?? '—',
      desc: flavor.replace(/[\r\n\f]/g, ' ')
    };

    moveCache[moveName] = details;
    return details;
  } catch (e) { return null; }
}

async function fetchAbilityDetails(abilityName) {
  if (!abilityName) return null;
  if (abilityCache[abilityName]) return abilityCache[abilityName];

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/ability/${abilityName}`);
    const data = await res.json();

    const flavor = data.flavor_text_entries.find(f => f.language.name === 'en')?.flavor_text || 
                   data.effect_entries.find(e => e.language.name === 'en')?.short_effect || 'No description available.';

    const details = {
      name: data.name,
      desc: flavor.replace(/[\r\n\f]/g, ' ')
    };

    abilityCache[abilityName] = details;
    return details;
  } catch (e) { return null; }
}

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
        </div>
      `;
    } else {
      const { pokemon, species } = slot;
      const isShiny = slot.shiny;
      const isFemale = slot.gender === 'F';
      const showBack = slot.showBack;

      const spriteUrl = getPokemonSprite(pokemon, isShiny, isFemale, showBack);
      const cryUrl = pokemon.cries?.latest || pokemon.cries?.legacy;

      const gRate = species.gender_rate;
      let genderBadge = '';
      if (gRate === -1) {
        genderBadge = `<span class="gender-icon gender-genderless" title="Genderless">∅</span>`;
      } else if (slot.gender === 'F') {
        genderBadge = `<span class="gender-icon gender-female" title="Female">♀</span>`;
      } else {
        genderBadge = `<span class="gender-icon gender-male" title="Male">♂</span>`;
      }

      const friendInfo = getFriendshipDetails(slot.friendship);
      const natureDesc = getNatureDetails(slot.nature);
      const itemDesc = slot.item ? ITEM_DESCRIPTIONS[slot.item] || 'Equipped held item.' : '';
      const activeAbilityDetails = abilityCache[slot.ability];

      // Direct metric values
      const heightM = (pokemon.height / 10).toFixed(1);
      const weightKg = (pokemon.weight / 10).toFixed(1);

      const pokemonGen = getGenerationById(species.id);

      // Calculate all 6 battle stats
      const calculatedStats = STAT_NAMES.map(s => {
        const baseObj = pokemon.stats.find(pStat => pStat.stat.name === s.key);
        const base = baseObj ? baseObj.base_stat : 0;
        const iv = slot.ivs[s.key] ?? 31;
        const ev = slot.evs[s.key] ?? 0;

        if (s.key === 'hp') {
          const hpVal = calculateStat(base, iv, ev, slot.level, 'hp', slot.nature);
          return { ...s, base, iv, ev, val: hpVal, mult: 1.0 };
        } else {
          const res = calculateStat(base, iv, ev, slot.level, s.key, slot.nature);
          return { ...s, base, iv, ev, val: res.value, mult: res.multiplier };
        }
      });

      slotWrapper.innerHTML = `
        <!-- Dedicated Top Action Bar -->
        <div class="slot-top-bar">
          <div style="display:flex; align-items:center; gap:4px;">
            ${isLead ? `<span class="leader-badge">👑</span>` : `<span class="card-id">#${String(species.id).padStart(4, '0')}</span>`}
          </div>
          <div style="display:flex; gap:4px; align-items:center;">
            <button class="bar-btn-tag flip-btn-tag ${showBack ? 'active' : ''}" onclick="updateSlot(${index}, 'showBack', ${!showBack})" title="Toggle Front/Back Sprite">
              🔄 ${showBack ? 'Back' : 'Front'}
            </button>
            <button class="bar-btn-tag shiny-btn-tag ${isShiny ? 'active' : ''}" onclick="updateSlot(${index}, 'shiny', ${!isShiny})" title="Toggle Shiny Artwork">
              ✨ Shiny
            </button>
            <button class="bar-btn-tag" onclick="toggleDrawer(${index})" title="Edit Pokémon Slot">
              ⚙️ Edit
            </button>
            <button class="btn-danger-sm" onclick="removePokemon(${index})" title="Remove Pokémon">
              🗑️
            </button>
          </div>
        </div>

        <!-- Main Card Content Body -->
        <div class="card ${isShiny ? 'is-shiny' : ''} ${isLead ? 'lead-slot' : ''}">
          <!-- Identity Bar with Gen Badge around Name -->
          <div class="card-header">
            <span class="card-name">${pokemon.name.replace(/-/g, ' ')}</span>
            <span class="header-gen-badge">Gen ${pokemonGen}</span>
            <span class="level-badge">Lv.${slot.level}</span>
            ${genderBadge}
          </div>

          <div class="types">${pokemon.types.map(t => `<span class="type-badge ${t.type.name}">${t.type.name}</span>`).join('')}</div>
          
          <!-- Pokémon Sprite Image with Spacing Top & Bottom -->
          <div class="sprite-container">
            <img src="${spriteUrl}" alt="${pokemon.name}">
          </div>

          <div class="meta-badges-container">
            <div class="pill-badge pill-nature" title="${natureDesc}">⚡ ${slot.nature} <i class="help-icon">❓</i></div>
            <div class="pill-badge pill-friend" title="${friendInfo.desc}">♥ ${slot.friendship}/255 <i class="help-icon">❓</i></div>
            ${slot.item ? `<div class="pill-badge pill-item" title="${itemDesc}">🎒 ${slot.item} <i class="help-icon">❓</i></div>` : ''}
            ${slot.ability ? `<div class="pill-badge pill-ability" title="${activeAbilityDetails ? activeAbilityDetails.desc : 'Loading ability info...'}">🌀 ${slot.ability.replace(/-/g, ' ')} <i class="help-icon">❓</i></div>` : ''}
          </div>

          <!-- Moveset Configuration Section -->
          <div class="moveset-card">
            ${[0, 1, 2, 3].map(mIdx => {
              const moveName = slot.moves[mIdx];
              const moveData = moveCache[moveName];
              let classIcon = '';
              let moveTooltip = 'Empty Move Slot';
              
              if (moveData) {
                if (moveData.damageClass === 'physical') classIcon = '💥';
                else if (moveData.damageClass === 'special') classIcon = '🔮';
                else classIcon = '🛡️';

                moveTooltip = `${moveName.replace(/-/g, ' ').toUpperCase()} (${moveData.type.toUpperCase()})\n• Class: ${moveData.damageClass.toUpperCase()}\n• Power: ${moveData.power} | Acc: ${moveData.accuracy} | PP: ${moveData.pp}\n• Effect: ${moveData.desc}`;
              }

              return `
                <div class="move-slot ${!moveName ? 'empty' : ''}" title="${moveTooltip}">
                  ${classIcon ? `<span>${classIcon}</span>` : ''}
                  <span>${moveName ? moveName.replace(/-/g, ' ') : '—'}</span>
                  ${moveName ? `<i class="help-icon">❓</i>` : ''}
                </div>
              `;
            }).join('')}
          </div>

          <!-- Real-Time Stat Bar Graphs Below Moveset -->
          <div class="stats-graph-container">
            ${calculatedStats.map(st => {
              let statClass = '';
              let fillClass = '';
              let multText = '1.0x (Neutral)';
              
              if (st.mult === 1.1) { statClass = 'stat-boost'; fillClass = 'fill-boost'; multText = '1.1x (Nature Boost)'; }
              if (st.mult === 0.9) { statClass = 'stat-nerf'; fillClass = 'fill-nerf'; multText = '0.9x (Nature Nerf)'; }

              const pct = Math.min(100, Math.max(8, Math.round((st.val / st.maxPossible) * 100)));
              const statTooltip = `${st.label} Breakdown (Lv.${slot.level}):\n• Calculated Stat: ${st.val}\n• Base: ${st.base}\n• IV: ${st.iv}/31 | EV: ${st.ev}/252\n• Nature Mod: ${multText}`;

              return `
                <div class="stat-graph-row" title="${statTooltip}">
                  <span class="stat-graph-lbl">${st.label}</span>
                  <span class="stat-graph-val ${statClass}">${st.val}</span>
                  <div class="stat-bar-track">
                    <div class="stat-bar-fill ${fillClass}" style="width: ${pct}%;"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Cleaned Miscellaneous Info Section (Height & Weight Only) -->
          <div class="misc-info-container">
            <div class="misc-grid">
              <div class="misc-item">
                <span class="misc-lbl">📏 Height</span>
                <span class="misc-val">${heightM} m</span>
              </div>
              <div class="misc-item">
                <span class="misc-lbl">⚖️ Weight</span>
                <span class="misc-val">${weightKg} kg</span>
              </div>
            </div>
          </div>

          <!-- Slide-up Edit Drawer Overlay -->
          <div class="controls-drawer" id="drawer-${index}">
            <div class="drawer-header">
              <span class="drawer-title">Edit ${pokemon.name.replace(/-/g, ' ')}</span>
              <button class="action-btn-sm" style="padding:4px 10px; font-size:0.75rem;" onclick="toggleDrawer(${index})">Done</button>
            </div>

            <div class="slot-controls">
              <div class="field-group">
                <label>Level</label>
                <input type="number" min="1" max="100" value="${slot.level}" onchange="updateSlot(${index}, 'level', parseInt(this.value))">
              </div>
              <div class="field-group">
                <label>Gender</label>
                <select onchange="updateSlot(${index}, 'gender', this.value)" ${gRate === -1 ? 'disabled' : ''}>
                  ${gRate === -1 ? `<option value="N">Genderless</option>` : ''}
                  ${gRate !== -1 && gRate !== 8 ? `<option value="M" ${slot.gender === 'M' ? 'selected' : ''}>Male (♂)</option>` : ''}
                  ${gRate !== -1 && gRate !== 0 ? `<option value="F" ${slot.gender === 'F' ? 'selected' : ''}>Female (♀)</option>` : ''}
                </select>
              </div>
              <div class="field-group">
                <label>Shiny Mode</label>
                <select onchange="updateSlot(${index}, 'shiny', this.value === 'true')">
                  <option value="false" ${!isShiny ? 'selected' : ''}>No</option>
                  <option value="true" ${isShiny ? 'selected' : ''}>Yes</option>
                </select>
              </div>
              <div class="field-group">
                <label>Nature</label>
                <select onchange="updateSlot(${index}, 'nature', this.value)">
                  ${NATURES.map(n => `<option value="${n}" ${slot.nature === n ? 'selected' : ''}>${n}</option>`).join('')}
                </select>
              </div>
              <div class="field-group">
                <label>Friendship (0-255)</label>
                <input type="number" min="0" max="255" value="${slot.friendship}" onchange="updateSlot(${index}, 'friendship', Math.min(255, Math.max(0, parseInt(this.value) || 0)))">
              </div>
              <div class="field-group">
                <label>Held Item</label>
                <select onchange="updateSlot(${index}, 'item', this.value)">
                  <option value="">None</option>
                  ${HELD_ITEMS.map(i => `<option value="${i}" ${slot.item === i ? 'selected' : ''}>${i}</option>`).join('')}
                </select>
              </div>
            </div>

            <!-- EV & IV Fine Tuning Controls -->
            <div class="field-group" style="width:100%; margin:2px 0;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <label>EV & IV Customizer</label>
                <span style="font-size:0.65rem; color:var(--primary-yellow); font-weight:bold;">Total EVs: ${Object.values(slot.evs).reduce((a,b)=>a+b,0)} / 510</span>
              </div>
              <div class="ev-iv-grid">
                <div class="ev-iv-row-header">Stat</div>
                <div class="ev-iv-row-header">IV (0-31)</div>
                <div class="ev-iv-row-header">EV (0-252)</div>
                ${STAT_NAMES.map(s => `
                  <span style="font-size:0.7rem; font-weight:bold; color:var(--text-color); align-self:center;">${s.label}</span>
                  <input type="number" min="0" max="31" value="${slot.ivs[s.key]}" onchange="updateIvEv(${index}, 'ivs', '${s.key}', this.value)">
                  <input type="number" min="0" max="252" value="${slot.evs[s.key]}" onchange="updateIvEv(${index}, 'evs', '${s.key}', this.value)">
                `).join('')}
              </div>
            </div>

            <!-- Nature Info Card in Drawer -->
            <div class="info-edit-card">
              <span style="font-size:0.75rem; font-weight:bold; color:var(--primary-yellow);">⚡ Nature Summary</span>
              <div class="info-desc-text">${natureDesc}</div>
            </div>

            <!-- Ability Selector with Detailed Info Card -->
            <div class="field-group" style="width:100%; margin:4px 0;">
              <label>Ability Selection</label>
              <select onchange="handleAbilitySelect(${index}, this.value)">
                ${pokemon.abilities.map(a => `<option value="${a.ability.name}" ${slot.ability === a.ability.name ? 'selected' : ''}>${a.ability.name.replace(/-/g, ' ')} ${a.is_hidden ? '(Hidden)' : ''}</option>`).join('')}
              </select>
              ${slot.ability ? `
                <div class="info-edit-card">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:0.75rem; font-weight:bold; color:var(--primary-yellow); text-transform:capitalize;">🌀 ${slot.ability.replace(/-/g, ' ')}</span>
                    ${pokemon.abilities.find(a => a.ability.name === slot.ability)?.is_hidden ? `<span class="hidden-ability-badge">✨ Hidden Ability</span>` : ''}
                  </div>
                  <div class="info-desc-text">${activeAbilityDetails ? activeAbilityDetails.desc : 'Loading ability description...'}</div>
                </div>
              ` : ''}
            </div>

            <div class="field-group" style="width:100%;">
              <label>Moveset Configuration</label>
              <div class="drawer-moves-container">
                ${[0, 1, 2, 3].map(mIdx => {
                  const currentMove = slot.moves[mIdx];
                  const details = moveCache[currentMove];

                  let catClass = 'cat-status';
                  let catLabel = '🛡️ Status';
                  if (details?.damageClass === 'physical') { catClass = 'cat-physical'; catLabel = '💥 Physical'; }
                  else if (details?.damageClass === 'special') { catClass = 'cat-special'; catLabel = '🔮 Special'; }

                  return `
                    <div class="move-edit-card">
                      <select onchange="handleMoveSelect(${index}, ${mIdx}, this.value)">
                        <option value="">- Select Move ${mIdx + 1} -</option>
                        ${pokemon.moves.map(m => `<option value="${m.move.name}" ${currentMove === m.move.name ? 'selected' : ''}>${m.move.name.replace(/-/g, ' ')}</option>`).join('')}
                      </select>
                      ${details ? `
                        <div class="move-detail-row">
                          <span class="type-badge ${details.type}">${details.type}</span>
                          <span class="move-cat-badge ${catClass}">${catLabel}</span>
                          <span class="move-stat-badge">PWR: ${details.power}</span>
                          <span class="move-stat-badge">ACC: ${details.accuracy}</span>
                          <span class="move-stat-badge">PP: ${details.pp}</span>
                        </div>
                        <div class="info-desc-text">${details.desc}</div>
                      ` : ''}
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        </div>
      `;

      const spriteImg = slotWrapper.querySelector('.sprite-container img');
      const spriteContainer = slotWrapper.querySelector('.sprite-container');

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

function toggleDrawer(index) {
  const card = document.querySelectorAll('.grid .card')[index];
  if (card) card.classList.toggle('drawer-open');
}

function attachSearchListeners() {
  document.querySelectorAll('.search-input').forEach(input => {
    if(input.id === 'dex-search-input') return;
    input.addEventListener('input', (e) => {
      const index = e.target.dataset.index;
      const query = e.target.value.toLowerCase().trim();
      const list = document.getElementById(`suggestions-${index}`);

      if (!query) { list.style.display = 'none'; return; }
      const matches = speciesIndex.filter(s => s.name.includes(query)).slice(0, 8);
      if (matches.length === 0) { list.style.display = 'none'; return; }

      list.innerHTML = matches.map(m => `<div class="suggestion-item" onclick="selectPokemon(${index}, '${m.name}')">${m.name.replace(/-/g, ' ')}</div>`).join('');
      list.style.display = 'block';
    });
  });
}

async function selectPokemon(index, name) {
  try {
    const [pokemon, species] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(r => r.json()),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`).then(r => r.json())
    ]);

    let defaultGender = 'M';
    if (species.gender_rate === -1) defaultGender = 'N';
    else if (species.gender_rate === 8) defaultGender = 'F';

    const defaultAbility = pokemon.abilities[0]?.ability.name || "";

    teamState[index] = {
      pokemon, species, level: 100, shiny: false, showBack: false, nature: "Hardy",
      gender: defaultGender, friendship: species.base_happiness ?? 70, 
      ability: defaultAbility, item: "", moves: ["", "", "", ""],
      ivs: { hp: 31, attack: 31, defense: 31, 'special-attack': 31, 'special-defense': 31, speed: 31 },
      evs: { hp: 0, attack: 0, defense: 0, 'special-attack': 0, 'special-defense': 0, speed: 0 }
    };

    if (defaultAbility) {
      await fetchAbilityDetails(defaultAbility);
    }

    renderTeamSlots();
    renderAnalysis();
  } catch (e) { console.error("Error setting Pokémon:", e); }
}

function removePokemon(index) {
  teamState[index] = createEmptySlot();
  renderTeamSlots();
  renderAnalysis();
}

function updateSlot(index, field, value) {
  teamState[index][field] = value;
  renderTeamSlots();
  renderAnalysis();
}

function updateIvEv(slotIdx, type, statKey, val) {
  let parsed = parseInt(val) || 0;
  if (type === 'ivs') {
    parsed = Math.min(31, Math.max(0, parsed));
    teamState[slotIdx].ivs[statKey] = parsed;
  } else if (type === 'evs') {
    parsed = Math.min(252, Math.max(0, parsed));
    
    const currentOtherEvTotal = Object.keys(teamState[slotIdx].evs)
      .filter(k => k !== statKey)
      .reduce((sum, k) => sum + teamState[slotIdx].evs[k], 0);

    if (currentOtherEvTotal + parsed > 510) {
      parsed = 510 - currentOtherEvTotal;
    }

    teamState[slotIdx].evs[statKey] = parsed;
  }
  renderTeamSlots();
}

/* Bulk / Batch Action Handlers */
function applyBulkField(field, value) {
  let appliedCount = 0;
  teamState.forEach(slot => {
    if (slot.pokemon) {
      slot[field] = value;
      appliedCount++;
    }
  });
  if (appliedCount > 0) {
    renderTeamSlots();
    renderAnalysis();
  }
}

function applyBulkIvPreset(presetType) {
  teamState.forEach(slot => {
    if (!slot.pokemon) return;
    if (presetType === 'max') {
      slot.ivs = { hp: 31, attack: 31, defense: 31, 'special-attack': 31, 'special-defense': 31, speed: 31 };
    } else if (presetType === 'trickroom') {
      slot.ivs = { hp: 31, attack: 31, defense: 31, 'special-attack': 31, 'special-defense': 31, speed: 0 };
    }
  });
  renderTeamSlots();
}

function applyBulkEvPreset(presetType) {
  teamState.forEach(slot => {
    if (!slot.pokemon) return;
    if (presetType === 'reset') {
      slot.evs = { hp: 0, attack: 0, defense: 0, 'special-attack': 0, 'special-defense': 0, speed: 0 };
    } else if (presetType === 'physical') {
      slot.evs = { hp: 4, attack: 252, defense: 0, 'special-attack': 0, 'special-defense': 0, speed: 252 };
    } else if (presetType === 'special') {
      slot.evs = { hp: 4, attack: 0, defense: 0, 'special-attack': 252, 'special-defense': 0, speed: 252 };
    } else if (presetType === 'bulky') {
      slot.evs = { hp: 252, attack: 0, defense: 128, 'special-attack': 0, 'special-defense': 128, speed: 0 };
    }
  });
  renderTeamSlots();
}

async function handleAbilitySelect(slotIdx, abilityName) {
  teamState[slotIdx].ability = abilityName;
  if (abilityName && !abilityCache[abilityName]) {
    await fetchAbilityDetails(abilityName);
  }
  renderTeamSlots();
}

async function handleMoveSelect(slotIdx, moveIdx, moveName) {
  teamState[slotIdx].moves[moveIdx] = moveName;
  if (moveName && !moveCache[moveName]) {
    await fetchMoveDetails(moveName);
  }
  renderTeamSlots();
}

function updateDashboard() {
  const activeMembers = teamState.filter(s => s.pokemon !== null);
  document.getElementById('team-counter').textContent = `${activeMembers.length} / 6`;
  document.getElementById('shiny-counter').textContent = activeMembers.filter(s => s.shiny).length;
  
  if (activeMembers.length > 0) {
    const avg = Math.round(activeMembers.reduce((acc, curr) => acc + curr.level, 0) / activeMembers.length);
    document.getElementById('avg-level-counter').textContent = `Lv. ${avg}`;
  } else {
    document.getElementById('avg-level-counter').textContent = `--`;
  }
}

function renderAnalysis() {
  const container = document.getElementById('type-matrix');
  container.innerHTML = '';

  ALL_TYPES.forEach(type => {
    let weaknesses = 0, resistances = 0, immunities = 0;

    teamState.forEach(slot => {
      if (!slot.pokemon) return;
      let multiplier = 1.0;
      slot.pokemon.types.forEach(t => {
        const defType = t.type.name;
        if (TYPE_CHART[type] && TYPE_CHART[type][defType] !== undefined) {
          multiplier *= TYPE_CHART[type][defType];
        }
      });

      if (multiplier > 1.0) weaknesses++;
      else if (multiplier === 0) immunities++;
      else if (multiplier < 1.0) resistances++;
    });

    const card = document.createElement('div');
    card.className = 'analysis-card';
    card.innerHTML = `
      <span class="type-badge ${type}">${type.slice(0, 3)}</span>
      <span class="analysis-count count-weak" title="Weakness">-${weaknesses}</span>
      <span class="analysis-count count-resist" title="Resistance">+${resistances}</span>
      ${immunities > 0 ? `<span class="analysis-count count-immune" title="Immunity">x${immunities}</span>` : ''}
    `;
    container.appendChild(card);
  });
}

/* Pokédex Directory Sheet Functions */
function renderPokedexGrid() {
  const container = document.getElementById('dex-grid-container');
  const query = document.getElementById('dex-search-input').value.toLowerCase().trim();
  const genFilter = document.getElementById('dex-gen-filter').value;
  
  container.innerHTML = '';

  const filtered = speciesIndex.filter(item => {
    const matchesQuery = item.name.includes(query) || String(item.id).includes(query);
    const matchesGen = genFilter === 'all' || item.gen === parseInt(genFilter);
    return matchesQuery && matchesGen;
  });

  document.getElementById('dex-results-count').textContent = `Showing ${filtered.length} Pokémon`;

  filtered.forEach(item => {
    const thumbUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png`;
    
    const card = document.createElement('div');
    card.className = 'dex-card';
    card.innerHTML = `
      <div class="dex-meta-row">
        <span class="dex-number">#${String(item.id).padStart(3, '0')}</span>
        <span class="gen-badge">Gen ${item.gen}</span>
      </div>
      <img class="dex-thumb" src="${thumbUrl}" alt="${item.name}" loading="lazy">
      <span class="dex-name">${item.name.replace(/-/g, ' ')}</span>
    `;

    card.addEventListener('click', () => {
      promptSlotSelection(item.name);
    });

    container.appendChild(card);
  });
}

function promptSlotSelection(name) {
  const emptyIdx = teamState.findIndex(s => s.pokemon === null);
  const targetSlot = emptyIdx !== -1 ? emptyIdx : 0;
  
  const choice = prompt(`Add ${name.toUpperCase()} to team:\nEnter Slot number (1-6):`, targetSlot + 1);
  if (choice) {
    const slotNum = parseInt(choice);
    if (slotNum >= 1 && slotNum <= 6) {
      selectPokemon(slotNum - 1, name);
      document.getElementById('dex-modal').style.display = 'none';
    } else {
      alert('Invalid slot number. Please choose 1 - 6.');
    }
  }
}

document.getElementById('pokedex-sheet-btn').addEventListener('click', () => {
  renderPokedexGrid();
  document.getElementById('dex-modal').style.display = 'flex';
});

document.getElementById('close-dex-btn').addEventListener('click', () => {
  document.getElementById('dex-modal').style.display = 'none';
});

document.getElementById('batch-edit-btn').addEventListener('click', () => {
  document.getElementById('batch-modal').style.display = 'flex';
});

document.getElementById('close-batch-btn').addEventListener('click', () => {
  document.getElementById('batch-modal').style.display = 'none';
});

document.getElementById('dex-search-input').addEventListener('input', renderPokedexGrid);
document.getElementById('dex-gen-filter').addEventListener('change', renderPokedexGrid);

document.getElementById('export-btn').addEventListener('click', () => {
  let exportText = "";
  teamState.forEach(slot => {
    if (!slot.pokemon) return;
    let genderStr = slot.gender === 'F' ? ' (F)' : slot.gender === 'M' ? ' (M)' : '';
    exportText += `${slot.pokemon.name}${genderStr} ${slot.item ? `@ ${slot.item}` : ''}\n`;
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

document.getElementById('close-modal-btn').addEventListener('click', () => {
  document.getElementById('export-modal').style.display = 'none';
});

document.getElementById('clear-btn').addEventListener('click', () => {
  teamState = Array(6).fill(null).map(() => createEmptySlot());
  renderTeamSlots();
  renderAnalysis();
});

document.getElementById('theme-btn').addEventListener('click', () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  if (isLight) {
    document.documentElement.removeAttribute('data-theme');
    document.getElementById('theme-icon').textContent = '🌙';
    document.getElementById('theme-text').textContent = 'Dark Mode';
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    document.getElementById('theme-icon').textContent = '☀️';
    document.getElementById('theme-text').textContent = 'Light Mode';
  }
});

init();
