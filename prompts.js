import inquirer from "inquirer";
import fetchPokemon from "./fetchPokemon.js";
import path from "path";
import { createFolder, saveImage } from "./save.js";

const askForPokemon = async () => {
  return await inquirer.prompt([
    {
      type: "input",
      name: "pokemonName",
      message: "Enter a Pokemon name: ",
    },
  ]);
};

const askForDownload = async () => {
  return await inquirer.prompt([
    {
      type: "checkbox",
      name: "downloadChoices",
      message: "Pokemon infos to download: ",
      choices: ["Stats", "Sprites", "Artwork"],
    },
  ]);
};

const askContinue = async () => {
  return await inquirer.prompt([
    {
      type: "confirm",
      name: "continue",
      message: "Would you like to search for another pokemon?",
      default: false,
    },
  ]);
};

const handleChoices = (choiceList, pokemon) => {
  const taskPool = choiceList
    .map((choice) => {
      switch (choice) {
        case "Stats":
          // TODO: IMPLEMENT SAVESTATS FUNC
          const stats = pokemon.stats;
          console.log(stats[0].base_stat);
          console.log(stats[0].stat.name);
          console.log(Object.entries(stats));
          break;

        case "Sprites":
          //TODO: IMPLEMENT SPRITES FUNC
          const spritesTaskQueue = [];
          const sprites = pokemon.sprites;
          for (const [fileName, imageAddress] of Object.entries(sprites)) {
            const filepath = path.join(pokemon.name, fileName) + ".png";
            spritesTaskQueue.push(saveImage(filepath, imageAddress));
          }
          return spritesTaskQueue;

        case "Artwork":
          // Iterating through the artworks and calling saveImage each time
          const artworkTaskQueue = [];
          const artwork = pokemon.sprites.other["official-artwork"];
          for (const [fileName, imageAddress] of Object.entries(artwork)) {
            const filepath = path.join(pokemon.name, fileName) + ".png";
            artworkTaskQueue.push(saveImage(filepath, imageAddress));
          }
          return artworkTaskQueue;
      }
    })
    .flat();
  console.log(taskPool);

  // }
};

const main = async () => {
  console.log("============= POKEMON DOWNLOADER =============");
  // fetchPokemon is set to return null if any error is thrown during the process
  // We keep asking a pokemon name until a request is succesfull
  let pokemon = null;
  let pokemonName = "";
  while (!pokemon) {
    try {
      const answerName = await askForPokemon();
      pokemonName = answerName.pokemonName.toLowerCase();
      pokemon = await fetchPokemon(pokemonName);
    } catch (error) {
      console.error(error);
    }
  }

  createFolder(pokemonName);
  // Ask what to download and retrieve the choice as a list
  const answerDownload = await askForDownload();
  const userChoices = answerDownload.downloadChoices;

  await handleChoices(userChoices, pokemon);
};

export { askForPokemon, askForDownload, askContinue, main };
