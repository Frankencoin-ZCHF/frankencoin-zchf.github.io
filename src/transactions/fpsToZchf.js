import { EQUITY_ABI, addresses } from '@/contracts/dictionnary';

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
  const { contract } = useContract(addresses.equity, EQUITY_ABI);

  const dAmount = floatToDec18(amount.value);

  const userZCHF = auth.user.ZCHF;

  const transaction = async () => await contract.redeem(auth.wallet, dAmount);

  const tx = await executeTransaction(transaction);

  if (!tx.error) {
    await reload();

    const received = formatCurrency(auth.user.ZCHF - userZCHF, 5);

    addNotification({
      type: 'success',
      title: `+ ${received} ZCHF`,
      linkUrl: `${config.etherscanUrl}/tx/${tx.hash}`,
      linkLabel: 'See transaction',
    });
  }

  return tx;
};
