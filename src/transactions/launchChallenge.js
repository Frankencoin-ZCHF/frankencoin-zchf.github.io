import { MINTINGHUB_ABI, addresses } from '@/contracts/dictionnary';
import { floatToDec18 } from '@/utils/math';

import config from '@/config';

import useContract from '@/composables/useContract';
import useNotification from '@/composables/useNotification';
import useTransaction from '@/composables/useTransaction';

export default async (positionAddress, amount) => {
  const { executeTransaction } = useTransaction();
  const { addNotification } = useNotification();
  const { contract } = useContract(addresses.mintingHub, MINTINGHUB_ABI);

  const dAmount = floatToDec18(amount.value);

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
