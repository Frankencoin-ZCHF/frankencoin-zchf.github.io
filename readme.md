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

- [VSCode](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

To automatically format the file on save, In Visual Studio Code, press Control + Shift + P or Command + Shift + P (Mac) to open the command palette and type setting and then select Preferences: Open User Settings option.
Search for format on save setting and check the checkbox.

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
VITE_APP_TARGET_CHAIN_ID=1
VITE_APP_TARGET_CHAIN_NAME=ETHEREUM MAINNET
VITE_APP_TARGET_CHAIN_SHORT=ETH
VITE_APP_ETHERSCAN_URL=https://etherscan.io

VITE_APP_INFURA_ID=2920e698d02f40ca8724daa8a19a91e7
VITE_APP_INFURA_URL=https://mainnet.infura.io/v3

VITE_APP_ADDRESS_MINTINGHUB=0x5F8a6244ca00466a38b6d2891685bBB6400e7f5a
VITE_APP_ADDRESS_XCHF=0xb4272071ecadd69d933adcd19ca99fe80664fc08
VITE_APP_ADDRESS_BRIDGE=0x4285b42Fbee8994192fe5E20E0e1881B9b232De5
VITE_APP_ADDRESS_FRANKENCOIN=0xB50808dEa4Dd28A336D69f4b70AA13c97364B3Fb
VITE_APP_ADDRESS_EQUITY=0x98643e88356deABb28Af0a9f4f92154eA20966BE

VITE_APP_TOPIC_POSITION=0x591ede549d7e337ac63249acd2d7849532b0a686377bbf0b0cca6c8abd9552f2
VITE_APP_CHALLENGE_STARTED=0xc4b384b2c5ca32c8e77081f4083be594a1ea9ba34f208a9f9a458f70608585f5
VITE_APP_CHALLENGE_SUCCEEDED=0x05f9cc3345665aee5729d9564c27530d8b2ad3b4eb7e5d2503b15dc98498e726
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
