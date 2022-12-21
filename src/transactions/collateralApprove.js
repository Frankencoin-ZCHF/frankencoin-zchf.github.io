import { IERC20_ABI } from '@/contracts/dictionnary';

import useContract from '@/composables/useContract';
import useAllowance from '@/composables/useAllowance';

import { stringToDec18 } from '@/utils/math';

export default async (collateralAddress, spender, amount) => {
  const dAmount = stringToDec18(amount);

  const { contract } = useContract(collateralAddress, IERC20_ABI);
  const { allowance } = await useAllowance(contract, spender, dAmount);

  return allowance;
};
