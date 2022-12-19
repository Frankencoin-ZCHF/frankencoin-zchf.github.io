import { MOCKXCHFTOKEN_ABI, addresses } from '@/contracts/dictionnary';
import useFetcher from '@/composables/useFetcher';

export default () => {
  const fetcher = useFetcher(addresses.stableCoin, MOCKXCHFTOKEN_ABI);

  const allowance = async (owner, spender) => {
    const request = {
      method: 'allowance',
      formatter: 'amount',
      params: [owner, spender],
    };

    return await fetcher.one(request);
  };

  const balance = async (address) => {
    const request = {
      method: 'balanceOf',
      formatter: 'amount',
      params: [address],
    };

    return await fetcher.one(request);
  };

  return { allowance, balance };
};
