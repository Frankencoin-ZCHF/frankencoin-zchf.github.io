const ethers = require('ethers');
const fs = require('fs');
require('dotenv').config();

const MINTINGHUB_ABI = require('./src/contracts/abi/MintingHub.json');
const FRANKENCOIN_ABI = require('./src/contracts/abi/Frankencoin.json');

const provider = new ethers.providers.JsonRpcProvider(
  process.env.VITE_APP_NODE_URL
);

const addresses = {
  mintingHub: '0x85DbAfAc987B1e8D58058680976E1c6D609b3C37',
  stableCoin: '0xb6d3b7d819cdff7dc6838349314d8d40c284b117',
  bridge: '0x6E45F944a77D4e72D13bDa04221DF588b72a03Df',
};

(async () => {
  const contractMintingHub = new ethers.Contract(
    addresses.mintingHub,
    MINTINGHUB_ABI,
    provider
  );

  addresses.frankencoin = await contractMintingHub.zchf();

  const contractFrankencoin = new ethers.Contract(
    addresses.frankencoin,
    FRANKENCOIN_ABI,
    provider
  );

  addresses.equity = await contractFrankencoin.reserve();

  let data = JSON.stringify(addresses);

  fs.writeFileSync('./src/contracts/addresses.json', data);
})();
