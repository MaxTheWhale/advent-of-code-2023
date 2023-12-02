import { printDay, printSolution, readInputAsLines } from "../shared/io.js";
import { sum, max, multiply } from "ramda";

const gameRegex = /Game (\d+): (.*)$/;

type ColourAmounts = Record<string, number>;
type GameResult = Array<ColourAmounts>;

type Game = {
  id: number
  result: GameResult
};

const parseColourAmounts = (colourAmountsString: string): ColourAmounts => {
  const colourAmountStrings = colourAmountsString.split(", ");
  return Object.fromEntries(colourAmountStrings.map(colourAmountString => {
    const [amountString, colour] = colourAmountString.split(" ");
    return [colour, parseInt(amountString)];
  }));
}

const parseGameResult = (gameResultString: string): GameResult => {
  const colourAmountsStrings = gameResultString.split("; ");
  return colourAmountsStrings.map(parseColourAmounts);
}

const parseGame = (gameString: string): Game => {
  const gameRegexMatch = gameString.match(gameRegex);
  if (gameRegexMatch == null) {
    throw new Error("Not a valid game string");
  }

  const gameId = parseInt(gameRegexMatch[1]);
  const gameResult = parseGameResult(gameRegexMatch[2]);

  return {
    id: gameId,
    result: gameResult
  };
}

const doesCubeAmountsContainBagDraw = (cubeAmounts: ColourAmounts, bagDraw: ColourAmounts) => {
  const coloursAvailable = Object.keys(cubeAmounts);
  const coloursInBagDraw = Object.keys(bagDraw);
  if (coloursInBagDraw.some(colour => !coloursAvailable.includes(colour))) {
    return false;
  }

  return coloursAvailable.every(colour => (bagDraw[colour] ?? 0) <= cubeAmounts[colour]);
}

const isGamePossibleGivenCubeAmounts = (cubeAmounts: ColourAmounts, game: Game) =>
  game.result.every(gameBagDraw => doesCubeAmountsContainBagDraw(cubeAmounts, gameBagDraw));

const getMinimumAmountsNeededForGame = (game: Game): ColourAmounts =>
  game.result.reduce(
    (previousAmounts: ColourAmounts, currentAmounts) => {
      const allColours = Object.keys({ ...previousAmounts, ...currentAmounts });
      return Object.fromEntries(
        allColours.map(colour =>
          [colour, max(previousAmounts[colour] ?? 0, currentAmounts[colour] ?? 0)]
        )
      );
    },
    {}
  );

const getPowerForGame = (game: Game) => {
  const minimumAmounts = getMinimumAmountsNeededForGame(game);
  const amountsList = Object.values(minimumAmounts);
  return amountsList.reduce(multiply, 1);
}

const amountOfCubes: ColourAmounts = {
  "red": 12,
  "green": 13,
  "blue": 14
};


printDay(2);
const inputLines = await readInputAsLines();

const games = inputLines.map(parseGame);
const possibleGames = games.filter(game => isGamePossibleGivenCubeAmounts(amountOfCubes, game));

const possibleIdsSum = sum(possibleGames.map(game => game.id));
const gamePowersSum = sum(games.map(getPowerForGame));

printSolution(1, "Sum of possible game IDs", possibleIdsSum);
printSolution(2, "Sum of all game powers", gamePowersSum);
