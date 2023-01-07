import useFetcher from '@/composables/useFetcher';
import { IERC20_ABI } from '@/contracts/dictionnary';
import { ref } from 'vue';

export default (address) => {
  const fetcher = useFetcher(address, IERC20_ABI);
  const tokenAddress = address;
  let decimals = ref(18);

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
      decimals: {
        method: 'decimals',
        formatter: 'number',
      },
    };

    const data = await fetcher.all(requests);
    console.log('Setting decimals of ' + tokenAddress + ' to ' + data.decimals);
    decimals.value = data.decimals;
    return data;
  };

  const getBalance = async (address) => {
    console.log(
      'Getting balance for address ' +
        address +
        ' on token ' +
        tokenAddress +
        ' with ' +
        decimals.value +
        ' decimals'
    );
    return await fetcher.one({
      method: 'balanceOf',
      formatter: 'amount',
      decimals: decimals,
      params: [address],
    });
  };

  const allowance = async (owner, spender) => {
    return await fetcher.one({
      method: 'allowance',
      formatter: 'amount',
      decimals: decimals,
      params: [owner, spender],
    });
  };

  return { all, getBalance, allowance };
};
