/**
 * Formats a number into a human-readable string with suffixes (e.g., 1K, 1.5M).
 * @param {number} num - The number to format.
 * @returns {string} - The formatted number as a string with NPR symbol.
 */
const formatNumber = (num) => {
  const nprSymbol = 'NPR ';
  if (num >= 1e9) {
    return nprSymbol + (num / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (num >= 1e6) {
    return nprSymbol + (num / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1e3) {
    return nprSymbol + (num / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return nprSymbol + num.toString();
};

export default formatNumber;
