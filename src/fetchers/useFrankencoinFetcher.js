import { FRANKENCOIN_ABI, addresses } from '@/contracts/dictionnary';
import useFetcher from '@/composables/useFetcher';

import { stringToDec18 } from '@/utils/math';

export default () => {
  const fetcher = useFetcher(addresses.frankencoin, FRANKENCOIN_ABI);

  const all = async () => {
    const requests = {
      minterReserve: {
        method: 'minterReserve',
        formatter: 'amount',
      },
      equity: {
        method: 'equity',
        formatter: 'amount',
      },
      totalSupply: {
        method: 'totalSupply',
        formatter: 'amount',
      },
    };

    return await fetcher.all(requests);
  };

  const positionAssignedReserve = async (minted, reserveContribution) => {
    return await fetcher.one({
      method: 'calculateAssignedReserve',
      formatter: 'amount',
      params: [stringToDec18(minted), reserveContribution],
    });
  };

  const allowance = async (owner, spender) => {
    return await fetcher.one({
      method: 'allowance',
      formatter: 'amount',
      params: [owner, spender],
    });
  };

  const balance = async (address) => {
    return await fetcher.one({
      method: 'balanceOf',
      formatter: 'amount',
      params: [address],
    });
  };

  return { all, positionAssignedReserve, balance, allowance };
};
