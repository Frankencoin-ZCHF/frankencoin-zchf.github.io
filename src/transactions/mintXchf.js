import { STABLECOINBRIDGE_ABI, addresses } from '@/contracts/dictionnary';
import useContract from '@/composables/useContract';
import useNotification from '@/composables/useNotification';
import useTransaction from '@/composables/useTransaction';
import { floatToDec18 } from '@/utils/math';

export default async (amount) => {
  const { executeTransaction } = useTransaction();
  const { addNotification } = useNotification();
  const { contract } = useContract(addresses.bridge, STABLECOINBRIDGE_ABI);

  const dAmount = floatToDec18(amount.value);

  const transaction = async () => await contract['burn(uint256)'](dAmount);

  const callback = () => {
    addNotification({
      type: 'success',
      title: `Minted ${amount.value} XCHF`,
    });
  };

  return await executeTransaction(transaction, callback);
};
