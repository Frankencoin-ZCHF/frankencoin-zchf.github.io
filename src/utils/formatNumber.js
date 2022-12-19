export const formatCurrency = (amount, digits = 2) => {
  if (amount === null || !!isNaN(amount)) return null;

  if (amount < 0.01 && amount > 0 && digits) {
    return '< 0.01';
  }

  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits ? digits : 18,
    minimumFractionDigits: 0,
  });

  return formatter.format(amount);
};
