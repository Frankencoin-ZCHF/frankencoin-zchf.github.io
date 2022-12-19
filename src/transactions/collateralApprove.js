import { IERC20_ABI } from '@/contracts/dictionnary';

import useContract from '@/composables/useContract';
import useAllowance from '@/composables/useAllowance';

export default async (collateralAddress, spender, amount) => {
  const { contract } = useContract(collateralAddress, IERC20_ABI);
  const { allowance } = await useAllowance(contract, spender, amount);

  return allowance;
};
