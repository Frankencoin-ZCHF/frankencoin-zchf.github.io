import useFetcher from '@/composables/useFetcher';
import { POSITION_ABI } from '@/contracts/dictionnary';

export default (address) => {
  const fetcher = useFetcher(address, POSITION_ABI);

  address = address.toUpperCase();

  const hub = async () => {
    return await fetcher.one({ method: 'hub', formatter: 'address' });
  };

  const expiration = async () => {
    return await fetcher.one({ method: 'expiration', formatter: 'date' });
  };

  const owner = async (ownerAddress = null) => {
    if (!ownerAddress) {
      return await fetcher.one({ method: 'owner', formatter: 'address' });
    }

    return ownerAddress;
  };

  const collateral = async () => {
    return await fetcher.one({ method: 'collateral', formatter: 'address' });
  };

  const all = async () => {
    const requests = {
      limit: {
        method: 'limit',
        formatter: 'amount',
      },
      minted: {
        method: 'minted',
        formatter: 'amount',
      },
      price: {
        method: 'price',
        formatter: 'amount',
      },
      mintingFeePPM: {
        method: 'mintingFeePPM',
        formatter: 'number',
      },
      challengePeriod: {
        method: 'challengePeriod',
        formatter: 'amount',
      },
      challengedAmount: {
        method: 'challengedAmount',
        formatter: 'amount',
      },
      reserveContribution: {
        method: 'reserveContribution',
        formatter: 'number',
      },
      minimumCollateral: {
        method: 'minimumCollateral',
        formatter: 'amount',
      },
    };

    return await fetcher.all(requests);
  };

  return { all, hub, expiration, collateral, owner };
};
