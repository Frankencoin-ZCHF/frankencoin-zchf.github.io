import useContract from '@/composables/useContract';
import useNotification from '@/composables/useNotification';
import useTransaction from '@/composables/useTransaction';
import config from '@/config';
import { addresses, MINTINGHUB_ABI } from '@/contracts/dictionnary';
import { shortenAddress } from '@/utils/address';
import { stringToDec18 } from '@/utils/math';

export default async (
  positionAddress,
  initialCollateral,
  collateralDecimals,
  initialMint
) => {
  const { executeTransaction } = useTransaction();
  const { contract } = useContract(addresses.mintingHub, MINTINGHUB_ABI);

  const { addNotification } = useNotification();

  const transaction = async () =>
    await contract.clonePosition(
      positionAddress,
      stringToDec18(initialCollateral.value, collateralDecimals),
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
