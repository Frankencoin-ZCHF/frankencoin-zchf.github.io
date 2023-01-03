import { shrinkDecimals } from '@/utils/formatNumber';
import { BigNumber, ethers, FixedNumber } from 'ethers';

export const stringToDec18 = (value) => {
  const string = String(value);

  return ethers.utils.parseEther(string);
};

export const dec18ToString = (value) => {
  return ethers.utils.formatEther(value);
};

export const bigNumberSanitize = (value) => {
  return BigNumber.isBigNumber(value) ? value : stringToDec18(value);
};

export const fixedNumberSanitize = (value) => {
  return FixedNumber.isFixedNumber(value)
    ? value
    : FixedNumber.fromString(String(value));
};

export const isNotValidOperand = (value) => {
  return value === null || value === undefined || value === '';
};

export const bigNumberCompare = (operation, operand1, operand2) => {
  if (isNotValidOperand(operand1) || isNotValidOperand(operand2)) return null;

  const sanitizedOperand1 = bigNumberSanitize(operand1);
  const sanitizedOperand2 = bigNumberSanitize(operand2);

  switch (operation) {
    case '=':
      return sanitizedOperand1.eq(sanitizedOperand2);
    case '<':
      return sanitizedOperand1.lt(sanitizedOperand2);
    case '<=':
      return sanitizedOperand1.lte(sanitizedOperand2);
    case '>':
      return sanitizedOperand1.gt(sanitizedOperand2);
    case '>=':
      return sanitizedOperand1.gte(sanitizedOperand2);
  }
};

export const bigNumberOperate = (operation, operand1, operand2) => {
  if (isNotValidOperand(operand1) || isNotValidOperand(operand2)) return null;

  const sanitizedOperand1 = bigNumberSanitize(operand1);
  const sanitizedOperand2 = bigNumberSanitize(operand2);

  let result;

  switch (operation) {
    case '+':
      result = sanitizedOperand1.add(sanitizedOperand2);
      break;
    case '-':
      result = sanitizedOperand1.sub(sanitizedOperand2);
      break;
    case '*':
      result = sanitizedOperand1.mul(sanitizedOperand2);
      break;
    case '/':
      result = sanitizedOperand1.div(sanitizedOperand2);
      break;
  }

  return ethers.utils.formatEther(result);
};

export const fixedNumberOperate = (operation, operand1, operand2) => {
  const sanitizedOperand1 = fixedNumberSanitize(operand1);
  const sanitizedOperand2 = fixedNumberSanitize(operand2);

  let result;

  switch (operation) {
    case '+':
      result = sanitizedOperand1.addUnsafe(sanitizedOperand2);
      break;
    case '-':
      result = sanitizedOperand1.subUnsafe(sanitizedOperand2);
      break;
    case '*':
      result = sanitizedOperand1.mulUnsafe(sanitizedOperand2);
      break;
    case '/':
      result = sanitizedOperand1.divUnsafe(sanitizedOperand2);
      break;
  }

  result = result.toString();
  const shrinked = shrinkDecimals(result);

  return shrinked;
};

export const bigNumberAbs = (value) => {
  const sanitizedValue = bigNumberSanitize(value);

  return ethers.utils.formatEther(sanitizedValue.abs());
};

export const bigNumberMax = (operand1, operand2) => {
  if (isNotValidOperand(operand1) || isNotValidOperand(operand2)) return null;

  const sanitizedOperand1 = bigNumberSanitize(operand1);
  const sanitizedOperand2 = bigNumberSanitize(operand2);
  let max;

  if (bigNumberCompare('>', sanitizedOperand1, sanitizedOperand2)) {
    max = sanitizedOperand1;
  } else {
    max = sanitizedOperand2;
  }

  max = ethers.utils.formatEther(max);
  const shrinked = shrinkDecimals(max);

  return shrinked;
};

export const bigNumberMin = (operand1, operand2) => {
  if (isNotValidOperand(operand1) || isNotValidOperand(operand2)) return null;

  const sanitizedOperand1 = bigNumberSanitize(operand1);
  const sanitizedOperand2 = bigNumberSanitize(operand2);
  let min;

  if (bigNumberCompare('<', sanitizedOperand1, sanitizedOperand2)) {
    min = sanitizedOperand1;
  } else {
    min = sanitizedOperand2;
  }

  min = ethers.utils.formatEther(min);
  const shrinked = shrinkDecimals(min);

  return shrinked;
};
