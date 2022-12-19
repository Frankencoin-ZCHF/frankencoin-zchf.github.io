import { ethers } from 'ethers';

import useAuth from '@/auth';

import config from '@/config';

export default (address, abi) => {
  const auth = useAuth();

  const contract = new ethers.Contract(
    address,
    abi,
    auth.isConnected && auth.getSigner() ? auth.getSigner() : config.provider
  );

  return { contract };
};
