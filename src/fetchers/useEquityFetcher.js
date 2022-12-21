import { EQUITY_ABI, addresses } from '@/contracts/dictionnary';
import useFetcher from '@/composables/useFetcher';
import { stringToDec18 } from '@/utils/math';

export default () => {
  const fetcher = useFetcher(addresses.equity, EQUITY_ABI);

  const all = async () => {
    const requests = {
      price: {
        method: 'price',
        formatter: 'amount',
      },
      totalSupply: {
        method: 'totalSupply',
        formatter: 'amount',
      },
      totalVotes: {
        method: 'totalVotes',
        formatter: 'amount',
      },
    };

    return await fetcher.all(requests);
  };

  const balance = async (address) => {
    return await fetcher.one({
      method: 'balanceOf',
      formatter: 'amount',
      params: [address],
    });
  };

  const calculateProceeds = async (amount) => {
    const dAmount = stringToDec18(amount.value);
    return await fetcher.one(
      {
        method: 'calculateProceeds',
        formatter: 'amount',
        params: [dAmount],
      },
      true
    );
  };

  const calculateShares = async (amount) => {
    const dAmount = stringToDec18(amount.value);
    return await fetcher.one(
      {
        method: 'calculateShares',
        formatter: 'amount',
        params: [dAmount],
      },
      true
    );
  };

  const votes = async (address) => {
    return await fetcher.one({
      method: 'votes',
      formatter: 'amount',
      params: [address],
    });
  };

  return { all, balance, votes, calculateProceeds, calculateShares };
};
