import { POSITION_ABI } from '@/contracts/dictionnary';

import useContract from '@/composables/useContract';
import useNotification from '@/composables/useNotification';
import useTransaction from '@/composables/useTransaction';

import { floatToDec18 } from '@/utils/math';

export default async (positionAddress, minted, collateral, price) => {
  const { executeTransaction } = useTransaction();
  const { addNotification } = useNotification();
  const { contract } = useContract(positionAddress, POSITION_ABI);

  const dMinted = floatToDec18(minted.value);
  const dCollateral = floatToDec18(collateral.value);
  const dPrice = floatToDec18(price.value);

  const transaction = async () =>
    await contract.adjust(dMinted, dCollateral, dPrice);

  const tx = await executeTransaction(transaction);

  if (!tx.error)
    addNotification({
      type: 'success',
      title: `Position adjusted!`,
    });

  return tx;
};
