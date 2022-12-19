import { MOCKXCHFTOKEN_ABI, addresses } from '@/contracts/dictionnary';

import useContract from '@/composables/useContract';
import useAllowance from '@/composables/useAllowance';

export default async (spender, amount) => {
  const { contract } = useContract(addresses.stableCoin, MOCKXCHFTOKEN_ABI);
  const { allowance } = await useAllowance(contract, spender, amount);

  return allowance;
};
