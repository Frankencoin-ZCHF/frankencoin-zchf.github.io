import { STABLECOINBRIDGE_ABI, addresses } from '@/contracts/dictionnary';
import config from '@/config';
import useContract from '@/composables/useContract';
import useNotification from '@/composables/useNotification';
import useTransaction from '@/composables/useTransaction';
import { stringToDec18 } from '@/utils/math';

export default async (amount) => {
  const { executeTransaction } = useTransaction();
  const { addNotification } = useNotification();
  const { contract } = useContract(addresses.bridge, STABLECOINBRIDGE_ABI);

  const dAmount = stringToDec18(amount.value);

  const transaction = async () => await contract['burn(uint256)'](dAmount);
  const tx = await executeTransaction(transaction);

  if (!tx.error) {
    addNotification({
      type: 'success',
      title: `+ ${amount.value} ZCHF`,
      linkUrl: `${config.etherscanUrl}/tx/${tx.hash}`,
      linkLabel: 'See transaction',
    });
  }

  return tx;
};
