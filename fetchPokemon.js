const POKEMONENDPOINT = "https://pokeapi.co/api/v2/pokemon/";
const NODIGIT = /^\D*$/;

const fetchPokemon = async (name) => {
  try {
    //Testing if no numbers are present in the name, avoiding to query by mistake a pokemon by id
    if (!NODIGIT.test(name)) {
      throw new Error("Name cannot includes any digits");
    }

    const response = await fetch(POKEMONENDPOINT + name);

    // IF API request fails
    if (response.status === 404) {
      throw new Error(`Pokemon ${name} not found !`);
    }

    // If json has no property name => no usable data retrieved
    const pokemon = await response.json();
    if (!pokemon.name) {
      throw new Error(`${name} Pokemon data couldn't be retrieved`);
    }

    return pokemon;
  } catch (error) {
    return null;
  }
};

export default fetchPokemon;
