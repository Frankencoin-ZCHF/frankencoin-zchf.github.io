import { ethers } from 'ethers';
import useAuth from '@/auth';
import blockchain from '@/config';
import WalletConnectProvider from '@walletconnect/web3-provider';

export default () => {
  const auth = useAuth();

  let walletProvider;

  async function login(connector) {
    let web3Provider;

    if (connector == 'walletConnect') {
      const config = {
        infuraId: blockchain.infuraId,
        rpc: {},
      };

      config.rpc[blockchain.targetChainId] = blockchain.nodeUrl;

      walletProvider = new WalletConnectProvider(config);

      await walletProvider.enable();
    } else {
      walletProvider = window.ethereum;
      await walletProvider.enable();
    }

    web3Provider = new ethers.providers.Web3Provider(walletProvider);

    const { chainId } = await web3Provider.getNetwork();

    const signer = web3Provider.getSigner();
    const wallet = ethers.utils.getAddress(await signer.getAddress());

    auth.connect(
      {
        chainId: chainId,
        wallet: wallet,
        connector: connector,
      },
      signer
    );

    walletProvider.on('chainChanged', () => {
      window.location.reload();
    });

    walletProvider.on('accountsChanged', () => {
      window.location.reload();
    });
  }

  const logout = async function () {
    if (auth.connector == 'walletConnect') {
      await walletProvider.disconnect();
    }

    auth.disconnect();
  };

  if (auth.isConnected) {
    login(auth.connector);
  }

  return {
    login,
    logout,
  };
};
