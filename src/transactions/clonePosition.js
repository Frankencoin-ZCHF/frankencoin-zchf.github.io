import { MINTINGHUB_ABI, addresses } from '@/contracts/dictionnary';

import config from '@/config';
import { shortenAddress } from '@/utils/address';

import useContract from '@/composables/useContract';
import useNotification from '@/composables/useNotification';
import useTransaction from '@/composables/useTransaction';

import { stringToDec18 } from '@/utils/math';

export default async (positionAddress, initialCollateral, initialMint) => {
  const { executeTransaction } = useTransaction();
  const { contract } = useContract(addresses.mintingHub, MINTINGHUB_ABI);

  const { addNotification } = useNotification();

  const transaction = async () =>
    await contract.clonePosition(
      positionAddress,
      stringToDec18(initialCollateral.value),
      stringToDec18(initialMint.value)
    );

  const tx = await executeTransaction(transaction);

  if (!tx.error) {
    addNotification({
      type: 'success',
      title: `Position ${shortenAddress(positionAddress)} Cloned!`,
      linkUrl: `${config.etherscanUrl}/tx/${tx.hash}`,
      linkLabel: 'See transaction',
    });
  }

  return tx;
};
