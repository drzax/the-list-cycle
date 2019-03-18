// Subtracts one from a number represented as a string of digits.
module.exports = function strDecrement(str) {
  var i,
    numbers = str.split("");

  // zero special case
  if (numbers.reduce((t, d) => +d + t, 0) === 0) {
    return "-1";
  }

  // one special case
  if (
    +numbers[numbers.length - 1] === 1 &&
    numbers.reduce((t, d) => +d + t, 0) === 1
  ) {
    return "0";
  }

  for (i = numbers.length; --i >= 0; ) {
    if (+numbers[i] === 0) {
      numbers[i] = 9;
    } else {
      numbers[i] = numbers[i] - 1;
      if (i === 0 && +numbers[i] === 0) {
        numbers.shift();
      }
      break;
    }
  }
  return numbers.join("");
};
