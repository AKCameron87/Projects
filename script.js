// ---------- DOM ELEMENTS ----------
const themeToggle = document.querySelector("#theme-toggle");
const dealButton = document.querySelector("#deal-button");
const statSelect = document.querySelector("#stat-select");
const messageDiv = document.querySelector("#message");
const loader = document.querySelector("#loader");

const playerDeckDiv = document.querySelector("#player-deck");
const computerDeckDiv = document.querySelector("#computer-deck");
const roundResultsList = document.querySelector("#round-results");
const finalResultP = document.querySelector("#final-result");

// ---------- CONSTANTS ----------
const DECK_SIZE = 5;
// You can adjust this max ID. 898 is safe for many gens.
const MAX_POKEMON_ID = 898;

// ---------- THEME TOGGLE ----------
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeToggle.textContent = "☀️ Light Mode";
    } else {
        themeToggle.textContent = "🌙 Dark Mode";
    }
});

// ---------- MESSAGE & LOADER HELPERS ----------
function showMessage(text, isError = false) {
    messageDiv.textContent = text;
    messageDiv.style.color = isError ? "red" : "var(--text-color)";
}

function showLoader() {
    loader.classList.remove("hidden");
}

function hideLoader() {
    loader.classList.add("hidden");
}

// ---------- API HELPERS ----------
function getRandomPokemonId() {
    return Math.floor(Math.random() * MAX_POKEMON_ID) + 1;
}

async function fetchPokemonById(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch Pokémon with ID ${id}`);
    }

    const data = await response.json();
    return data;
}

async function buildRandomDeck(size) {
    const deck = [];

    for (let i = 0; i < size; i++) {
        const id = getRandomPokemonId();
        const pokemon = await fetchPokemonById(id);
        deck.push(pokemon);
    }

    return deck;
}

// ---------- STATS HELPERS ----------
function getStatValue(pokemon, statName) {
    // API stat names: hp, attack, defense, special-attack, special-defense, speed
    const statObj = pokemon.stats.find((s) => s.stat.name === statName);
    return statObj ? statObj.base_stat : 0;
}

function summarizeStats(pokemon) {
    const stats = pokemon.stats;
    const get = (name) =>
        stats.find((s) => s.stat.name === name)?.base_stat ?? "?";

    return `HP: ${get("hp")} | Atk: ${get("attack")} | Def: ${get(
        "defense"
    )} | SpA: ${get("special-attack")} | SpD: ${get(
        "special-defense"
    )} | Spe: ${get("speed")}`;
}

function renderDeck(deck, container) {
    container.innerHTML = "";

    deck.forEach((pokemon, index) => {
        const name = pokemon.name;
        const id = pokemon.id;
        const sprite = pokemon.sprites.front_default;
        const types = pokemon.types.map((t) => t.type.name).join(", ");
        const statsText = summarizeStats(pokemon);

        const cardDiv = document.createElement("div");
        cardDiv.classList.add("pokemon-card");

        // Stagger animation: each card flips 0.1s after the previous one
        cardDiv.style.setProperty("--delay", `${index * 0.12}s`);

        cardDiv.innerHTML = `
      <div class="card-image">
        ${
            sprite
                ? `<img src="${sprite}" alt="${name}" />`
                : "<div>No image</div>"
        }
      </div>
      <div class="card-info">
        <div class="pokemon-name">${index + 1}. ${name} (#${id})</div>
        <div class="pokemon-types">Type: ${types}</div>
        <div class="pokemon-stats">${statsText}</div>
      </div>
    `;

        container.appendChild(cardDiv);
    });
}

function renderBattleResults(rounds, playerWins, computerWins) {
    roundResultsList.innerHTML = "";

    rounds.forEach((round, index) => {
        const li = document.createElement("li");
        let cssClass = "round-draw";

        if (round.result === "player") cssClass = "round-win";
        if (round.result === "computer") cssClass = "round-lose";

        li.classList.add(cssClass);
        li.textContent = `Round ${index + 1}: You ${round.playerValue} vs Computer ${round.computerValue} → ${
            round.result === "player"
                ? "You win"
                : round.result === "computer"
                    ? "Computer wins"
                    : "Draw"
        }`;
        roundResultsList.appendChild(li);
    });

    if (playerWins > computerWins) {
        finalResultP.textContent = `Final Result: You win ${playerWins} - ${computerWins}! 🎉`;
        finalResultP.style.color = "var(--win-color)";
    } else if (computerWins > playerWins) {
        finalResultP.textContent = `Final Result: Computer wins ${computerWins} - ${playerWins}. 😈`;
        finalResultP.style.color = "var(--lose-color)";
    } else {
        finalResultP.textContent = `Final Result: It's a draw, ${playerWins} - ${computerWins}.`;
        finalResultP.style.color = "var(--draw-color)";
    }
}

// ---------- MAIN GAME LOGIC ----------
async function dealAndBattle() {
    const statName = statSelect.value; // e.g. "attack", "hp", etc.

    showMessage(`Dealing ${DECK_SIZE} random Pokémon to each side...`);
    finalResultP.textContent = "";
    roundResultsList.innerHTML = "";
    playerDeckDiv.innerHTML = "";
    computerDeckDiv.innerHTML = "";
    showLoader();

    try {
        // Build both decks
        const [playerDeck, computerDeck] = await Promise.all([
            buildRandomDeck(DECK_SIZE),
            buildRandomDeck(DECK_SIZE),
        ]);

        // Render decks
        renderDeck(playerDeck, playerDeckDiv);
        renderDeck(computerDeck, computerDeckDiv);

        // Battle per card
        const rounds = [];
        let playerWins = 0;
        let computerWins = 0;

        for (let i = 0; i < DECK_SIZE; i++) {
            const pMon = playerDeck[i];
            const cMon = computerDeck[i];

            const pValue = getStatValue(pMon, statName);
            const cValue = getStatValue(cMon, statName);

            let result = "draw";
            if (pValue > cValue) {
                result = "player";
                playerWins++;
            } else if (cValue > pValue) {
                result = "computer";
                computerWins++;
            }

            rounds.push({
                playerValue: pValue,
                computerValue: cValue,
                result,
            });
        }

        renderBattleResults(rounds, playerWins, computerWins);
        showMessage(
            `Battle complete using stat: ${statName.replace("-", " ").toUpperCase()}`
        );
    } catch (error) {
        console.error(error);
        showMessage("Something went wrong while dealing decks.", true);
    } finally {
        hideLoader();
    }
}

// ---------- EVENT LISTENERS ----------
dealButton.addEventListener("click", () => {
    dealAndBattle();
});