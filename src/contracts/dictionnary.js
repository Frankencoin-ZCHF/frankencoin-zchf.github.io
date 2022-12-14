/* 
Abi should be copied from here:
https://github.com/Frankencoin-ZCHF/FrankenCoin/tree/main/abi
*/

export { default as EQUITY_ABI } from './abi/Equity.json';
export { default as ERC2_ABI } from './abi/ERC20.json';
export { default as FRANKENCOIN_ABI } from './abi/Frankencoin.json';
export { default as IERC20_ABI } from './abi/IERC20.json';
export { default as POSITION_ABI } from './abi/Position.json';
export { default as MINTINGHUB_ABI } from './abi/MintingHub.json';
export { default as MOCKXCHFTOKEN_ABI } from './abi/MockXCHFToken.json';
export { default as STABLECOINBRIDGE_ABI } from './abi/StablecoinBridge.json';

export const addresses = {
  mintingHub: import.meta.env.VITE_APP_ADDRESS_MINTINGHUB,
  stableCoin: import.meta.env.VITE_APP_ADDRESS_XCHF,
  bridge: import.meta.env.VITE_APP_ADDRESS_BRIDGE,
  frankencoin: import.meta.env.VITE_APP_ADDRESS_FRANKENCOIN,
  equity: import.meta.env.VITE_APP_ADDRESS_EQUITY,
};
