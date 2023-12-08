export const isDigit = (char: string) => {
  if (char.length !== 1) {
    throw new Error(`Expected a single character, found string with length ${char.length}`);
  }
  switch (char) {
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
      return true;
    default:
      return false;
  }
}
