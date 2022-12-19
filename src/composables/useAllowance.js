import useNotification from '@/composables/useNotification';
import useTransaction from '@/composables/useTransaction';

import { floatToDec18 } from '@/utils/math';

export default async (contract, spender, amount) => {
  const { executeTransaction } = useTransaction();
  const { addNotification } = useNotification();

  const dAmount = floatToDec18(amount);

  const transaction = async () => await contract.approve(spender, dAmount);

  const tx = await executeTransaction(transaction);

  if (!tx.error)
    addNotification({
      type: 'success',
      title: 'Approved!',
    });

  return tx;
};
