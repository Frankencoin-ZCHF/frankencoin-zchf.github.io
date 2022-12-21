import { ethers } from 'ethers';

export const formatCurrency = (value, digits = 2) => {
  const amount = parseFloat(value);

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

export const shrinkDecimals = (value) => {
  let string = String(value);
  const patterns = ['.0', '.'];

  patterns.forEach((pattern) => {
    string = string.endsWith(pattern) ? string.replace(pattern, '') : string;
  });

  return string;
};

export const formatCommify = (amount) => {
  const shrinked = shrinkDecimals(amount);
  const formatted = ethers.utils.commify(shrinked);

  return formatted;
};
