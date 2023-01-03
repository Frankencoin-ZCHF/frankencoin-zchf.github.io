import useContract from '@/composables/useContract';
import useNotification from '@/composables/useNotification';
import useTransaction from '@/composables/useTransaction';
import { POSITION_ABI } from '@/contracts/dictionnary';
import { stringToDec18 } from '@/utils/math';

export default async (positionAddress, minted, collateral, price) => {
  const { executeTransaction } = useTransaction();
  const { addNotification } = useNotification();
  const { contract } = useContract(positionAddress, POSITION_ABI);

  const dMinted = stringToDec18(minted.value);
  const dCollateral = stringToDec18(collateral.value);
  const dPrice = stringToDec18(price.value);

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
