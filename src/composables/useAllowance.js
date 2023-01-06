import useNotification from '@/composables/useNotification';
import useTransaction from '@/composables/useTransaction';
import { stringToDec18 } from '@/utils/math';

export default async (contract, spender, amount, decimals) => {
  const { executeTransaction } = useTransaction();
  const { addNotification } = useNotification();

  const dAmount = stringToDec18(amount, decimals);

  const transaction = async () => await contract.approve(spender, dAmount);

  const tx = await executeTransaction(transaction);

  if (!tx.error)
    addNotification({
      type: 'success',
      title: 'Approved!',
    });

  return tx;
};
