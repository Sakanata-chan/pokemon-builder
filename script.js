async function selectPokemon(index, name) {
  try {
    // 1. Convert display string or name to a slug (e.g. "Unfezant (Female)" -> "unfezant-female")
    let apiKey = name.toLowerCase().trim().replace(/ \([^)]*\)/g, '').replace(/ /g, '-');

    // Handle names that were formatted like "unfezant female"
    if (name.toLowerCase().includes('female') && !apiKey.endsWith('-female')) {
      apiKey = `${apiKey.replace('-female', '')}-female`;
    }

    let pokemon = null;

    // 2. Try fetching the specific form endpoint (e.g. rotom-wash, frillish-female)
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${apiKey}`);
      if (res.ok) {
        pokemon = await res.json();
      }
    } catch (e) { /* Fallback below */ }

    // 3. Fallback: If specific form doesn't exist (e.g., unfezant-female), fetch the base species
    let isGenderFallback = false;
    if (!pokemon) {
      const baseSlug = apiKey.replace(/-female$/, '').replace(/-male$/, '');
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${baseSlug}`);
      if (!res.ok) throw new Error("Pokemon API error");
      pokemon = await res.json();
      isGenderFallback = true;
    }

    // 4. Fetch base species endpoint cleanly
    const speciesSlug = pokemon.species?.name || apiKey.split('-')[0];
    const species = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${speciesSlug}`).then(r => r.ok ? r.json() : null);

    // 5. Setup default gender logic
    let defaultGender = 'M';
    if (apiKey.endsWith('-female') || name.toLowerCase().includes('female')) {
      defaultGender = 'F';
    } else if (species) {
      defaultGender = species.gender_rate === -1 ? 'N' : species.gender_rate === 8 ? 'F' : 'M';
    }

    const defaultAbility = pokemon.abilities[0]?.ability.name || "";
    
    teamState[index] = {
      ...createEmptySlot(),
      pokemon,
      species: species || { id: pokemon.id, gender_rate: -1, base_happiness: 70 },
      gender: defaultGender,
      friendship: species?.base_happiness ?? 70,
      ability: defaultAbility
    };

    if (defaultAbility) await fetchAbilityDetails(defaultAbility);
    refreshUI();

  } catch (e) {
    console.error("Setting Pokémon failed:", e);
    alert(`Could not load details for ${fmtName(name)}.`);
  }
}
