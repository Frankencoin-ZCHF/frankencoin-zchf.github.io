import { IERC20_ABI } from '@/contracts/dictionnary';
import useFetcher from '@/composables/useFetcher';

export default (address) => {
  const fetcher = useFetcher(address, IERC20_ABI);

  const all = async () => {
    const requests = {
      name: {
        method: 'name',
        formatter: 'text',
      },
      symbol: {
        method: 'symbol',
        formatter: 'text',
      },
    };

    return await fetcher.all(requests);
  };

  const getBalance = async (address) => {
    return await fetcher.one({
      method: 'balanceOf',
      formatter: 'amount',
      params: [address],
    });
  };

  const allowance = async (owner, spender) => {
    return await fetcher.one({
      method: 'allowance',
      formatter: 'amount',
      params: [owner, spender],
    });
  };

  return { all, getBalance, allowance };
};
