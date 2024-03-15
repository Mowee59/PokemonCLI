import { error } from "console";
import fs from "fs/promises";
import path from "path";

export const createFolder = async (name) => {
  try {
    // Recursive is set to true so we don't throw an error is directory already exists
    await fs.mkdir(name, { recursive: true });
    console.log(`${name} directory created`);
  } catch (err) {
    console.error(err);
  }
};

export const writeStats = async (filePath, stats) => {
  try {
    await fs.writeFile(filePath, data);
  } catch (error) {}
};
export const saveImage = async (filePath, imageAddress) => {
  try {
    //Fetching data, converting it to an Array buffer, then to a buffer in order to save it wi fs.writefile
    const responseData = await fetch(imageAddress);
    const arrayBuffer = await responseData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);
    console.log(`Image saved at ${filePath}`);
  } catch (err) {
    if (err.message === "Failed to parse URL from [object Object]") {
      console.log(`No image found for ${filePath}`);
    } else console.log(error);
  }
};
