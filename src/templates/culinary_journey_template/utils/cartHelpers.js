export function createCartItem(menuItem, quantity) {
  // Convert price to number if it's a string
  const price = typeof menuItem.price === 'string' 
    ? parseFloat(menuItem.price.replace(/[^\d.-]/g, '')) 
    : menuItem.price;
    
  return {
    ...menuItem,
    price,
    quantity
  };
}

export function calculateCartTotal(items) {
  return items.reduce((total, item) => {
    // Ensure price is a number
    const itemPrice = typeof item.price === 'string' 
      ? parseFloat(item.price.replace(/[^\d.-]/g, '')) 
      : item.price;
    return total + (itemPrice * item.quantity);
  }, 0);
}

export function formatCartTotal(total) {
  return `$${total?.toFixed(2)}`;
}
