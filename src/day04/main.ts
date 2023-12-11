import { printDay, printSolution, readInputAsLines } from "../shared/io.js";
import { indexBy, range, sum } from "ramda";

type Card = {
  cardNumber: number
  winningNumbers: number[]
  ownNumbers: number[]
};

const cardRegex = /Card +(\d+): (.*) \| (.*)$/;

const parseNumbersList = (numbersListString: string) => {
  const numberStrings = numbersListString.split(' ').filter(string => string.trim().length > 0);
  return numberStrings.map(numberString => parseInt(numberString));
}

const parseCard = (cardString: string): Card => {
  const cardMatch = cardString.match(cardRegex);
  if (!cardMatch) {
    throw new Error("Not a valid card string")
  }

  const cardNumberString = cardMatch[1];
  const winningNumbersString = cardMatch[2];
  const ownNumbersString = cardMatch[3];

  return {
    cardNumber: parseInt(cardNumberString),
    winningNumbers: parseNumbersList(winningNumbersString),
    ownNumbers: parseNumbersList(ownNumbersString)
  };
}

const calculateCardScore = (card: Card) => {
  const matchingNumbers = card.ownNumbers.filter(number => card.winningNumbers.includes(number));
  if (matchingNumbers.length === 0) {
    return 0;
  }
  return Math.pow(2, matchingNumbers.length - 1);
}

const calculateNumberOfCards = (cardsByNumber: Record<number, Card>, currentCard: Card): number => {
  const matchingNumbers = currentCard.ownNumbers.filter(number => currentCard.winningNumbers.includes(number));
  if (matchingNumbers.length === 0) {
    return 1;
  }
  const cardRange = range(currentCard.cardNumber + 1, currentCard.cardNumber + 1 + matchingNumbers.length);
  return 1 + sum(
    cardRange.map(cardNumber =>
      calculateNumberOfCards(cardsByNumber, cardsByNumber[cardNumber])
    )
  );
}

printDay(4);
const inputLines = await readInputAsLines();

const cards = inputLines.map(parseCard);
const sumOfCardScores = sum(cards.map(calculateCardScore));

const cardsByNumber = indexBy(card => card.cardNumber, cards);
const totalNumberOfCards = sum(cards.map(card => calculateNumberOfCards(cardsByNumber, card)));

printSolution(1, "Sum of card scores", sumOfCardScores);
printSolution(2, "Total number of cards", totalNumberOfCards);
