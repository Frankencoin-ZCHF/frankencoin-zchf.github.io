import { FRANKENCOIN_ABI, addresses } from '@/contracts/dictionnary';

import config from '@/config';
import useAuth from '@/auth';

import useContract from '@/composables/useContract';
import useNotification from '@/composables/useNotification';
import useTransaction from '@/composables/useTransaction';

import { floatToDec18 } from '@/utils/math';
import { formatCurrency } from '@/utils/formatNumber';

export default async (amount, reload) => {
  const auth = useAuth();

  const { executeTransaction } = useTransaction();
  const { addNotification } = useNotification();
  const { contract } = useContract(addresses.frankencoin, FRANKENCOIN_ABI);

  const dAmount = floatToDec18(amount.value);

  const userFPS = auth.user.FPS;

  const transaction = async () =>
    await contract.transferAndCall(addresses.equity, dAmount, 0);

  const tx = await executeTransaction(transaction);

  if (!tx.error) {
    await reload();

    const received = formatCurrency(auth.user.FPS - userFPS, 5);

    addNotification({
      type: 'success',
      title: `+ ${received} FPS`,
      linkUrl: `${config.etherscanUrl}/tx/${tx.hash}`,
      linkLabel: 'See transaction',
    });
  }

  return tx;
};
