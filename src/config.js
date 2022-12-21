import { ethers } from 'ethers';

const nodeUrl = `${import.meta.env.VITE_APP_INFURA_URL}/${
  import.meta.env.VITE_APP_INFURA_ID
}`;

export default {
  etherscanUrl: import.meta.env.VITE_APP_ETHERSCAN_URL,
  targetChainId: import.meta.env.VITE_APP_TARGET_CHAIN_ID,
  targetChainName: import.meta.env.VITE_APP_TARGET_CHAIN_NAME,
  targetChainShortName: import.meta.env.VITE_APP_TARGET_CHAIN_SHORT,
  nodeUrl: nodeUrl,
  infuraId: import.meta.env.VITE_APP_INFURA_ID,
  provider: new ethers.providers.JsonRpcProvider(nodeUrl),
};
