import useFetcher from '@/composables/useFetcher';
import { addresses, MINTINGHUB_ABI } from '@/contracts/dictionnary';

export default () => {
  const fetcher = useFetcher(addresses.mintingHub, MINTINGHUB_ABI);

  const challenges = async (index) => {
    return await fetcher.one({
      method: 'challenges',
      params: [index],
    });
  };

  return { challenges };
};
