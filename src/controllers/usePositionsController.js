import useAuth from '@/auth';
import { addresses } from '@/contracts/dictionnary';
import useCollateralFetcher from '@/fetchers/useCollateralFetcher';
import useFrankencoinFetcher from '@/fetchers/useFrankencoinFetcher';
import usePositionFetcher from '@/fetchers/usePositionFetcher';
import useCollateralsRepository from '@/repositories/useCollateralsRepository';
import usePositionsRepository from '@/repositories/usePositionsRepository';
import useUsersRepository from '@/repositories/useUsersRepository';
import { addressCompare } from '@/utils/helpers';
import fetchInfura from '@/utils/infura';
import { ethers } from 'ethers';

export default () => {
  const positionsRepository = usePositionsRepository();
  const collateralsRepository = useCollateralsRepository();
  const usersRepository = useUsersRepository();

  const frankencoinFetcher = useFrankencoinFetcher();

  const auth = useAuth();

  // Init all positions
  const initList = async () => {
    const requestedPositions = await fetchInfura('Position');

    requestedPositions.result.forEach((result) => {
      const owner = '0x' + result.topics[1].slice(26, 66);
      init(result.address, ethers.utils.getAddress(owner));
    });
  };

  // Init one position by address
  const init = async (address, owner = null) => {
    address = ethers.utils.getAddress(address);

    // if (!positionsRepository.find(address) || refresh)

    const positionFetcher = usePositionFetcher(address);
    const hub = await positionFetcher.hub();

    // Check if created from the right mintingHub
    if (!addressCompare(hub, addresses.mintingHub)) return;

    const expiration = await positionFetcher.expiration();
    if (!expiration.isValid) return;

    positionsRepository.save({ address: address, expiration: expiration });

    // Handle position owner
    owner = await positionFetcher.owner(owner);
    usersRepository.save({ address: owner });

    positionsRepository
      .where('address', address)
      .update({ ownerAddress: owner });

    // Handle position collateral
    const collateralAddress = await positionFetcher.collateral();

    // Save the collateral address in the position
    positionsRepository
      .where('address', address)
      .update({ collateralAddress: collateralAddress });

    // Initiate collateral
    const collateralFetcher = useCollateralFetcher(collateralAddress);

    let refresh = true;

    if (!collateralsRepository.find(collateralAddress) || refresh) {
      refresh = false;

      const data = await collateralFetcher.all();

      collateralsRepository.save({ address: collateralAddress, ...data });

      if (auth.isConnected) {
        const balance = await collateralFetcher.getBalance(auth.wallet);

        usersRepository.setToken(
          auth.wallet,
          collateralAddress,
          data.symbol,
          balance
        );

        const allowance = await collateralFetcher.allowance(
          auth.wallet,
          address
        );

        usersRepository.setAllowance(auth.wallet, address, allowance);

        data.allowedAmountMintingHub = await collateralFetcher.allowance(
          auth.wallet,
          addresses.mintingHub
        );
      }

      collateralsRepository.save({ address: collateralAddress, ...data });
    }

    const positionData = await positionFetcher.all();

    positionData.retainedReserve =
      await frankencoinFetcher.positionAssignedReserve(
        positionData.minted,
        positionData.reserveContribution
      );

    // Load position data
    positionsRepository.where('address', address).update(positionData);

    // Load collateral balance for position
    positionsRepository.where('address', address).update({
      collateralBalance: await collateralFetcher.getBalance(address),
    });

    // Load collateral balance for position
    positionsRepository.where('address', address).update({
      collateralBalance: await collateralFetcher.getBalance(address),
    });
  };

  return { initList, init };
};
