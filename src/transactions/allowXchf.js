import useAllowance from '@/composables/useAllowance';
import useContract from '@/composables/useContract';
import { addresses, MOCKXCHFTOKEN_ABI } from '@/contracts/dictionnary';

export default async (spender, amount) => {
  const { contract } = useContract(addresses.stableCoin, MOCKXCHFTOKEN_ABI);
  const { allowance } = await useAllowance(contract, spender, amount);

  return allowance;
};
