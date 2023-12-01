import { readFile } from "fs/promises";
import { dropLast, last } from "ramda";

const inputFilename = "input.txt";
const adventOfCodeYear = 2023;

const newLineRegex = /\r\n|\r|\n/g;

const normaliseNewlines = (text: string) => text.replace(newLineRegex, "\n");

export const readInputAsString = async () => {
  try {
    const fileText = await readFile(inputFilename, { encoding: "utf-8" });
    return normaliseNewlines(fileText);
  } catch (error) {
    throw new Error(`Failed to open ${inputFilename}: Have you downloaded today's input to the day directory?`)
  }
}

export const readInputAsLines = async () => {
  const inputString = await readInputAsString();
  const inputLines = inputString.split("\n");
  if (last(inputLines) === "") {
    return dropLast(1, inputLines);
  }
  return inputLines;
}

export const printDay = (day: number) => {
  console.log(`Advent of code ${adventOfCodeYear}, Day ${day}\n`);
}

export const printSolution = (questionPart: 1 | 2, valueDescription: string, value: string | number) => {
  console.log(`Part ${questionPart}`)
  console.log(`${valueDescription}: ${value}\n`);
}
