import { MINTINGHUB_ABI, addresses } from '@/contracts/dictionnary';
import { floatToDec18 } from '@/utils/math';

import config from '@/config';

import useContract from '@/composables/useContract';
import useNotification from '@/composables/useNotification';
import useTransaction from '@/composables/useTransaction';

export default async (challengeNumber, amount, size) => {
  const { executeTransaction } = useTransaction();
  const { addNotification } = useNotification();
  const { contract } = useContract(addresses.mintingHub, MINTINGHUB_ABI);

  const dAmount = floatToDec18(amount.value);
  const dSize = floatToDec18(size);

  const transaction = async () =>
    await contract.bid(challengeNumber, dAmount, dSize);

  const tx = await executeTransaction(transaction);

  if (!tx.error) {
    addNotification({
      type: 'success',
      title: 'Bid placed!',
      linkUrl: `${config.etherscanUrl}/tx/${tx.hash}`,
      linkLabel: 'See transaction',
    });
  }

  return tx;
};
