/**
 * Format currency utility function
 * @param productPrice - The price value to format (can be string or number)
 * @param symbol - The currency symbol to use (default: "$")
 * @returns Formatted price as string with 2 decimal places
 */
export const formatCurrency = (productPrice: string | number | undefined | null, symbol: string = "$"): string => {
  let price = 0;

  // Convert productPrice to string for processing
  const priceStr = productPrice ? String(productPrice).trim() : '';

  if (priceStr) {
    // If it already includes the symbol, remove it
    let cleanedStr = priceStr.replace(symbol, '');

    // Extract numeric value using regex
    const match = cleanedStr.match(/[\d,.]+/);
    if (match) {
      // Replace comma with empty if the format is like 1,000.50
      const numericStr = match[0].replace(/,/g, '');
      price = Number(numericStr);
    }
  }

  return isNaN(price) ? '0.00' : price.toFixed(2);
};

export default formatCurrency;
