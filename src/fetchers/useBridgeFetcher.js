import { STABLECOINBRIDGE_ABI, addresses } from '@/contracts/dictionnary';
import useFetcher from '@/composables/useFetcher';

export default () => {
  const fetcher = useFetcher(addresses.bridge, STABLECOINBRIDGE_ABI);

  const limit = async () => {
    const request = {
      method: 'limit',
      formatter: 'amount',
    };

    return await fetcher.one(request);
  };

  return { limit };
};
