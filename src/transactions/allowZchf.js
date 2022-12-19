import { FRANKENCOIN_ABI, addresses } from '@/contracts/dictionnary';

import useContract from '@/composables/useContract';
import useAllowance from '@/composables/useAllowance';

export default async (spender, amount) => {
  const { contract } = useContract(addresses.frankencoin, FRANKENCOIN_ABI);
  const { allowance } = await useAllowance(contract, spender, amount);

  return allowance;
};
