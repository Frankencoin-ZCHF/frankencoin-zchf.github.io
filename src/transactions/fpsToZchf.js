import { EQUITY_ABI, addresses } from '@/contracts/dictionnary';

import config from '@/config';
import useAuth from '@/auth';

import useContract from '@/composables/useContract';
import useNotification from '@/composables/useNotification';
import useTransaction from '@/composables/useTransaction';

import { stringToDec18, dec18ToString } from '@/utils/math';
import { formatCurrency } from '@/utils/formatNumber';

export default async (amount) => {
  const auth = useAuth();

  const { executeTransaction } = useTransaction();
  const { addNotification } = useNotification();
  const { contract } = useContract(addresses.equity, EQUITY_ABI);

  const dAmount = stringToDec18(amount.value);

  const transaction = async () => await contract.redeem(auth.wallet, dAmount);

  const tx = await executeTransaction(transaction);

  if (!tx.error) {
    const txReceipt = await config.provider.getTransactionReceipt(tx.hash);

    const received = formatCurrency(dec18ToString(txReceipt.logs[1].data), 5);

    addNotification({
      type: 'success',
      title: `+ ${received} ZCHF`,
      linkUrl: `${config.etherscanUrl}/tx/${tx.hash}`,
      linkLabel: 'See transaction',
    });
  }

  return tx;
};
