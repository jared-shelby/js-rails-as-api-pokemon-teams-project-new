const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const main = document.querySelector("main");

// display all trainers
fetch(TRAINERS_URL)
    .then(response => response.json())
    .then(data => {
        main.innerHTML = 
        data.map(trainer => {
            return `<div class="card" data-id="${trainer.id}"><p>${trainer.name}</p>
            <button data-trainer-id="${trainer.id}">Add Pokemon</button>
            <ul>
                ${pokemonList(trainer)}
            </ul>
            </div>`
        }).join("")
    });

function pokemonList(trainer) {
    return trainer.pokemons.map(pokemon => `<li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`).join("");
}

// add new pokemon to trainer
main.addEventListener("click", event => {
    if (event.target.dataset.trainerId) {
        getTrainer(event.target.dataset.trainerId)
            .then(trainer => {
                if (trainer.pokemons.length < 6) {
                    addPokemon(trainer.id)
                        .then(pokemon => {
                            let newNode = document.createElement("li");
                            newNode.innerHTML= `${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button>`;
                            event.target.parentNode.querySelector("ul").appendChild(newNode);
                        })
                }
            })
    } else if (event.target.dataset.pokemonId) {
        deletePokemon(event.target.dataset.pokemonId)
            .then(pokemon => event.target.parentNode.remove());
    }
})

function getTrainer(trainerID) {
    return fetch(`${TRAINERS_URL}/${trainerID}`)
            .then(response => response.json());
}

function addPokemon(trainerId) {
    return fetch(POKEMONS_URL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({"trainer_id": trainerId})
    }).then(response => response.json());
}

function deletePokemon(pokemonId) {
    return fetch(`${POKEMONS_URL}/${pokemonId}`, {
        method: "DELETE"
    }).then(response => response.json());
}