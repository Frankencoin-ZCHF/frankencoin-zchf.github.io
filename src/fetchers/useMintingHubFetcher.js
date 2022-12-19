import { MINTINGHUB_ABI, addresses } from '@/contracts/dictionnary';
import useFetcher from '@/composables/useFetcher';

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
