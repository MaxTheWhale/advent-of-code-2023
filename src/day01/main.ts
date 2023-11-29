import { printDay, printSolution, readInputAsLines } from "../shared/io.js";
import { splitWhenever, sum } from "ramda";

printDay(1);

const inputLines = await readInputAsLines();
const elfGroups = splitWhenever(line => line === "", inputLines);
const elfTotals = elfGroups.map(calorieStrings => sum(calorieStrings.map(calorieString => parseInt(calorieString))));
const maximumCalories = Math.max(...elfTotals);

printSolution(1, "Highest total calories carried by a single elf", maximumCalories);
