import { formatCurrency } from '@/utils/formatNumber';
import { ethers } from 'ethers';

export const formatDecimals = (value) => {
  const formatted = value.endsWith('.0') ? value.replace('.0', '') : value;

  return formatted;
};

export const amountFormatter = (value) => {
  const hString = formatDecimals(ethers.utils.formatEther(value));
  const formatted = formatCurrency(hString);
  const bigInt = BigInt(value.toString());
  const bigNumber = value.toHexString();

  const replacerFn = (key, value) => {
    if (key === 'bigInt') {
      return value.toString();
    }

    return value;
  };

  return JSON.stringify(
    {
      hString: hString,
      formatted: formatted,
      bigInt: bigInt,
      bigNumber: bigNumber,
    },
    replacerFn
  );
};

export const renderAmount = (json, value) => {
  const reviverFn = (key, value) => {
    if (key === 'bigInt') {
      return BigInt(value);
    }

    if (key === 'bigNumber') {
      return ethers.BigNumber.from(value);
    }

    return value;
  };

  if (!json || !value) return;

  const object = JSON.parse(json, reviverFn);
  return object[value];
};
