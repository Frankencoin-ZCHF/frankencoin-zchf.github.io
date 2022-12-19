const etherscanUrl = import.meta.env.VITE_APP_ETHERSCAN_URL;

export const shortenAddress = (address) => {
  if (address) {
    return `${address.substr(0, 4)} ... ${address.substr(address.length - 4)}`;
  } else {
    false;
  }
};

export const contractUrl = (address) => {
  return `${etherscanUrl}/address/${address}`;
};
