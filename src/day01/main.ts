import { printDay, printSolution, readInputAsLines } from "../shared/io.js";
import { head, last, sum } from "ramda";

// In order to match overlapping digit words, use a
// lookahead group rather than consuming the input string
const digitRegex = /(?=([0-9]))/g;
const digitsAndWrittenDigitsRegex = /(?=([0-9]|one|two|three|four|five|six|seven|eight|nine))/g;

const parseDigitStringPart1 = (digitString: string) =>
  parseInt(digitString);

const parseDigitStringPart2 = (digitString: string) => {
  switch (digitString) {
    case "one": return 1;
    case "two": return 2;
    case "three": return 3;
    case "four": return 4;
    case "five": return 5;
    case "six": return 6;
    case "seven": return 7;
    case "eight": return 8;
    case "nine": return 9;
    default: return parseInt(digitString);
  }
}

const getValueFromLine = (
  line: string,
  digitRegex: RegExp,
  digitParser: (digitString: string
) => number) => {
  const digitMatches = [...line.matchAll(digitRegex)];

  const firstDigitMatch = head(digitMatches);
  const secondDigitMatch = last(digitMatches);
  if (firstDigitMatch == null || secondDigitMatch == null) {
    throw new Error("Couldn't find digits in input string");
  }

  const firstDigit = digitParser(firstDigitMatch[1]);
  const secondDigit = digitParser(secondDigitMatch[1]);

  return parseInt(`${firstDigit}${secondDigit}`);
}


printDay(1);
const inputLines = await readInputAsLines();

const part1Values = inputLines.map(line =>
  getValueFromLine(line, digitRegex, parseDigitStringPart1)
);
const part1Sum = sum(part1Values);

const part2Values = inputLines.map(line =>
  getValueFromLine(line, digitsAndWrittenDigitsRegex, parseDigitStringPart2)
);
const part2Sum = sum(part2Values);

printSolution(1, "Sum of all calibration values", part1Sum);
printSolution(2, "Sum of all calibration values", part2Sum);
