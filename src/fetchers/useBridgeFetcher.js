import useFetcher from '@/composables/useFetcher';
import { addresses, STABLECOINBRIDGE_ABI } from '@/contracts/dictionnary';

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
