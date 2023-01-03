import useAuth from '@/auth';
import config from '@/config';
import { ethers } from 'ethers';

export default (address, abi) => {
  const auth = useAuth();

  const contract = new ethers.Contract(
    address,
    abi,
    auth.isConnected && auth.getSigner() ? auth.getSigner() : config.provider
  );

  return { contract };
};
