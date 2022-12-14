import useContract from '@/composables/useContract';
import useNotification from '@/composables/useNotification';
import useTransaction from '@/composables/useTransaction';
import config from '@/config';
import { addresses, MINTINGHUB_ABI } from '@/contracts/dictionnary';
import { stringToDec18 } from '@/utils/math';

export default async (positionAddress, amount, collateralDecimals) => {
  const { executeTransaction } = useTransaction();
  const { addNotification } = useNotification();
  const { contract } = useContract(addresses.mintingHub, MINTINGHUB_ABI);

  const dAmount = stringToDec18(amount.value, collateralDecimals);

  const transaction = async () =>
    await contract.launchChallenge(positionAddress, dAmount);

  const tx = await executeTransaction(transaction);

  if (!tx.error) {
    addNotification({
      type: 'success',
      title: 'Challenge placed!',
      linkUrl: `${config.etherscanUrl}/tx/${tx.hash}`,
      linkLabel: 'See transaction',
    });
  }

  return tx;
};
