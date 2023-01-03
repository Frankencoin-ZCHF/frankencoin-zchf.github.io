import useAuth from '@/auth';
import useContract from '@/composables/useContract';
import useNotification from '@/composables/useNotification';
import useTransaction from '@/composables/useTransaction';
import config from '@/config';
import { addresses, EQUITY_ABI } from '@/contracts/dictionnary';
import { formatCurrency } from '@/utils/formatNumber';
import { dec18ToString, stringToDec18 } from '@/utils/math';

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
