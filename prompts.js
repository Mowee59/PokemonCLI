import inquirer from "inquirer";
import fetchPokemon from "./fetchPokemon.js";
import path from "path";
import { createFolder, saveImage, writeStats } from "./save.js";

const askForPokemon = async () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "pokemonName",
      message: "Enter a Pokemon name: ",
    },
  ]);
};

const askForDownload = async () => {
  return inquirer.prompt([
    {
      type: "checkbox",
      name: "downloadChoices",
      message: "Pokemon infos to download: ",
      choices: ["Stats", "Sprites", "Artwork"],
    },
  ]);
};

const askContinue = async () => {
  return inquirer.prompt([
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
          // In case Stats are select to be saved
          const stats = pokemon.stats;
          const filepath = path.join(pokemon.name, "stats.txt");
          return writeStats(filepath, stats);

        case "Sprites":
          // In case Sprites are select to be saved
          // We return a list of pending promises to save the sprites
          const spritesTaskQueue = [];
          const sprites = pokemon.sprites;
          for (const [fileName, imageAddress] of Object.entries(sprites)) {
            const filepath = path.join(pokemon.name, fileName) + ".png";
            spritesTaskQueue.push(saveImage(filepath, imageAddress));
          }
          return spritesTaskQueue;

        case "Artwork":
          // In case artwork are select to be saved
          // We return a list of pending promises to save the artworks

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
  return taskPool;
};

const main = async () => {
  let continueExecution = true;
  console.log("============= POKEMON DOWNLOADER =============");
  while (continueExecution) {
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

    // As soon as we get a succesful request, we create a folder

    // Ask what to download and retrieve the choice as a list
    const answerDownload = await askForDownload();
    await createFolder(pokemonName);
    const userChoices = answerDownload.downloadChoices;
    const tasks = handleChoices(userChoices, pokemon);
    await Promise.all(tasks);
    const answerContinue = await askContinue();
    continueExecution = answerContinue.continue;
  }
};

export { askForPokemon, askForDownload, askContinue, main };
