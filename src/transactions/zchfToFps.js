import { FRANKENCOIN_ABI, addresses } from '@/contracts/dictionnary';

import config from '@/config';

import useContract from '@/composables/useContract';
import useNotification from '@/composables/useNotification';
import useTransaction from '@/composables/useTransaction';

import { floatToDec18, dec18ToFloat } from '@/utils/math';
import { formatCurrency } from '@/utils/formatNumber';

export default async (amount) => {
  const { executeTransaction } = useTransaction();
  const { addNotification } = useNotification();
  const { contract } = useContract(addresses.frankencoin, FRANKENCOIN_ABI);

  const dAmount = floatToDec18(amount.value);

  const transaction = async () =>
    await contract.transferAndCall(addresses.equity, dAmount, 0);

  const tx = await executeTransaction(transaction);

  if (!tx.error) {
    const txReceipt = await config.provider.getTransactionReceipt(tx.hash);

    const received = formatCurrency(dec18ToFloat(txReceipt.logs[1].data), 5);

    addNotification({
      type: 'success',
      title: `+ ${received} FPS`,
      linkUrl: `${config.etherscanUrl}/tx/${tx.hash}`,
      linkLabel: 'See transaction',
    });
  }

  return tx;
};
