import useContract from '@/composables/useContract';
import useNotification from '@/composables/useNotification';
import useTransaction from '@/composables/useTransaction';
import { POSITION_ABI } from '@/contracts/dictionnary';
import { stringToDec18 } from '@/utils/math';
import { BigNumber } from 'ethers';

import { fixedNumberOperate } from '../utils/math';

export default async (
  positionAddress,
  minted,
  collateral,
  collateralDecimals,
  liquidationPriceInput
) => {
  const { executeTransaction } = useTransaction();
  const { addNotification } = useNotification();
  const { contract } = useContract(positionAddress, POSITION_ABI);

  const dMinted = stringToDec18(minted.value);
  const dCollateral = stringToDec18(collateral.value, collateralDecimals);

  const fprice = fixedNumberOperate(
    '*',
    liquidationPriceInput.value,
    BigNumber.from(10).pow(36 - collateralDecimals)
  );
  const dPrice = BigNumber.from(fprice);
  console.log(
    'Adjusting to ' +
      dMinted +
      ' and ' +
      dCollateral +
      ', scaled price ' +
      dPrice
  );

  const transaction = async () =>
    await contract.adjust(dMinted, dCollateral, dPrice);

  const tx = await executeTransaction(transaction);

  if (!tx.error)
    addNotification({
      type: 'success',
      title: `Position adjusted!`,
    });

  return tx;
};
