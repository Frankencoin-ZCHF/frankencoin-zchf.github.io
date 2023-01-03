import useAllowance from '@/composables/useAllowance';
import useContract from '@/composables/useContract';
import { addresses, FRANKENCOIN_ABI } from '@/contracts/dictionnary';

export default async (spender, amount) => {
  const { contract } = useContract(addresses.frankencoin, FRANKENCOIN_ABI);
  const { allowance } = await useAllowance(contract, spender, amount);

  return allowance;
};
