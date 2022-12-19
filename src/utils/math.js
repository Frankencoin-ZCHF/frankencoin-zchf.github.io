import { ethers, BigNumber } from 'ethers';

export function floatToDec18(value) {
  return BigNumber.from(BigInt(value * 1e18));
}

export function dec18ToFloat(value) {
  return Number(ethers.utils.formatEther(value));
}
