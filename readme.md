# FrankenCoin Frontend MVP

This frontent allows you to interact with the FrankenCoin set of smartcontracts.

## Stack

- [Vite](https://vitejs.dev/)
- [Vue 3](https://vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Pinia](https://pinia.vuejs.org/)
- [Pinia ORM](https://pinia-orm.codedredd.de/)
- [Ethers.js](https://docs.ethers.org/v5/)

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur)

## Requirements

```sh
Node 16
```

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Validate code with eslint, stylelint and prettier

```sh
npm run validate
```

## Setup blockchain and addresses

To set up the blockchain and addresses, you can modify the target network and addresses of the smart contracts in the `.env` file. The `.env.sepolia` file contains the URL pointing to the `Sepolia test net`, while the `.env` file points to the `Ethereum main net`.

```sh
VITE_APP_TARGET_CHAIN_ID=11155111
VITE_APP_TARGET_CHAIN_NAME=SEPOLIA TEST NET
VITE_APP_TARGET_CHAIN_SHORT=SEP
VITE_APP_NODE_URL=https://rpc.sepolia.org
VITE_APP_ETHERSCAN_URL=https://sepolia.etherscan.io

VITE_APP_INFURA_ID=6611ca8fa40a42df970ce154db25a2a2

VITE_APP_ADDRESS_MINTINGHUB=0x85DbAfAc987B1e8D58058680976E1c6D609b3C37
VITE_APP_ADDRESS_XCHF=0xb6d3b7d819cdff7dc6838349314d8d40c284b117
VITE_APP_ADDRESS_BRIDGE=0x6E45F944a77D4e72D13bDa04221DF588b72a03Df
VITE_APP_ADDRESS_FRANKENCOIN=0xEef1CaCe8eaEae155a6E4b834261F44aC6de21EE
VITE_APP_ADDRESS_EQUITY=0xB22906A0BF25547CFF6e8ce6E2b7a3B2B39b8197
```

If needed, also update the ABI in the `/src/contract/abi` folder.

## Deployment

The Frankencoin project is hosted on [frankencoin.com](https://http://frankencoin.com/) using GitHub Pages. It is served automatically from the `gh_pages` branch, and the build process is triggered automatically whenever a commit is made to the `main` branch. The build process includes the following steps:

1. `npm install`
2. `npm run validate`
3. `npm run build`
4. `cp dist/index.html dist/404.html` (This step ensures that virtual routing works correctly with GitHub Pages.)

## This project is under active developement

Fill free to contribute, report bugs, suggest ideas...
