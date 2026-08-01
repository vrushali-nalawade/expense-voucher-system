export const formatCurrency = (amount, currency = 'INR', locale = 'en-IN') => {
  const numericValue = typeof amount === 'number' ? amount : parseFloat(amount);

  if (isNaN(numericValue)) return '₹0.00';

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(numericValue);
  } catch (error) {
    return `₹${numericValue.toFixed(2)}`;
  }
};

export default formatCurrency;