import useContract from '@/composables/useContract';
import useNotification from '@/composables/useNotification';
import useTransaction from '@/composables/useTransaction';
import config from '@/config';
import { addresses, MINTINGHUB_ABI } from '@/contracts/dictionnary';

export default async (index) => {
  const { executeTransaction } = useTransaction();
  const { addNotification } = useNotification();
  const { contract } = useContract(addresses.mintingHub, MINTINGHUB_ABI);

  const transaction = async () => await contract.end(index);

  const tx = await executeTransaction(transaction);

  if (!tx.error) {
    addNotification({
      type: 'success',
      title: 'Challenge closed!',
      linkUrl: `${config.etherscanUrl}/tx/${tx.hash}`,
      linkLabel: 'See transaction',
    });
  }

  return tx;
};
