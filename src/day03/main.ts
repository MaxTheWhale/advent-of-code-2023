import { printDay, printSolution, readInputAsLines } from "../shared/io.js";
import { isDigit } from "../shared/utils.js";
import { sum } from "ramda";

type Coordinates = {
  x: number
  y: number
}

type GridNumber = {
  value: number
  length: number
  firstDigitLocation: Coordinates
}

const numberRegex = /\d+/g;
const gearRegex = /\*/g;

const parseNumbersOnRow = (row: string, rowYCoordinate: number): GridNumber[] => {
  const numberMatches = [...row.matchAll(numberRegex)];
  return numberMatches.map(numberMatch => ({
    value: parseInt(numberMatch[0]),
    length: numberMatch[0].length,
    firstDigitLocation: { x: numberMatch.index ?? 0, y: rowYCoordinate }
  }))
}

const getSurroundingCoordinatesForNumber = (gridNumber: GridNumber, grid: string[]): Coordinates[] => {
  const coordinatesToReturn: Coordinates[] = [];
  const gridHeight = grid.length;
  for (let y = gridNumber.firstDigitLocation.y - 1; y <= gridNumber.firstDigitLocation.y + 1; y++) {
    if (y < 0 || y >= gridHeight) {
      continue;
    }
    const rowLength = grid[y].length;
    for (let x = gridNumber.firstDigitLocation.x - 1; x < gridNumber.firstDigitLocation.x + gridNumber.length + 1; x++) {
      if (x < 0 || x >= rowLength) {
        continue;
      }
      coordinatesToReturn.push({ x, y });
    }
  }
  return coordinatesToReturn;
}

const doesNumberTouchSymbol = (gridNumber: GridNumber, grid: string[]) => {
  const coordinatesToCheck = getSurroundingCoordinatesForNumber(gridNumber, grid);
  for (const coordinate of coordinatesToCheck) {
    const charAtCoordinate = grid[coordinate.y][coordinate.x];
    if (!isDigit(charAtCoordinate) && charAtCoordinate !== '.') {
      return true;
    }
  }
  return false;
}

const getAllGearCoordinates = (grid: string[]): Coordinates[] =>
  grid.flatMap((row, yCoordinate) => {
    const gearMatches = [...row.matchAll(gearRegex)];
    return gearMatches.map(gearMatch => ({
      x: gearMatch.index ?? 0,
      y: yCoordinate
    }));
  });

const doesNumberTouchGear = (gridNumber: GridNumber, gearCoordinates: Coordinates, grid: string[]) => {
  const surroundingCoordinates = getSurroundingCoordinatesForNumber(gridNumber, grid);
  return surroundingCoordinates.some(coordinates =>
    coordinates.x === gearCoordinates.x && coordinates.y === gearCoordinates.y
  );
}

const getSurroundingNumbersForGear = (
  gridNumbers: GridNumber[],
  gearCoordinates: Coordinates,
  grid: string[]
): GridNumber[] =>
  gridNumbers.filter(gridNumber => doesNumberTouchGear(gridNumber, gearCoordinates, grid));

const getGearRatio = (
  gridNumbers: GridNumber[],
  gearCoordinates: Coordinates,
  grid: string[]
) => {
  const surroundingNumbers = getSurroundingNumbersForGear(gridNumbers, gearCoordinates, grid);
  if (surroundingNumbers.length === 2) {
    return surroundingNumbers[0].value * surroundingNumbers[1].value;
  }
  return 0;
}

printDay(3);
const grid = await readInputAsLines();

const numbersOnGrid = grid.flatMap(parseNumbersOnRow);
const numbersThatTouchSymbols = numbersOnGrid.filter(gridNumber => doesNumberTouchSymbol(gridNumber, grid))
const sumOfPartNumbers = sum(numbersThatTouchSymbols.map(gridNumber => gridNumber.value));

const gears = getAllGearCoordinates(grid);
const sumOfGearRatios = sum(gears.map(gear => getGearRatio(numbersThatTouchSymbols, gear, grid)));

printSolution(1, "Sum of part numbers", sumOfPartNumbers);
printSolution(2, "Sum of gear ratios", sumOfGearRatios);
