import { addresses, MINTINGHUB_ABI } from '@/contracts/dictionnary';
import useMintingHubFetcher from '@/fetchers/useMintingHubFetcher';
import useChallengesRepository from '@/repositories/useChallengesRepository';
import usePositionsRepository from '@/repositories/usePositionsRepository';
import useUsersRepository from '@/repositories/useUsersRepository';
import { dateFormatter } from '@/utils/date';
import { addressCompare } from '@/utils/helpers';
import fetchInfura from '@/utils/infura';
import { dec18ToString } from '@/utils/math';
import { until } from '@vueuse/core';
import { ethers } from 'ethers';
import { computed } from 'vue';

export default () => {
  const challengesRepository = useChallengesRepository();
  const usersRepository = useUsersRepository();

  // INIT CHALLENGES
  const initList = async () => {
    challengesRepository.flush();

    const event = 'ChallengeStarted';
    const requestedChallenges = await fetchInfura(event);

    requestedChallenges.result.forEach((result) => {
      init(event, result);
    });
  };

  const init = async (event, result) => {
    const iface = new ethers.utils.Interface(MINTINGHUB_ABI);
    try {
      const decodedLogs = iface.decodeEventLog(
        event,
        result.data,
        result.topics
      );
      const index = Number(decodedLogs.number);
      const mintingHubFetcher = useMintingHubFetcher();

      if (!addressCompare(result.address, addresses.mintingHub)) return;

      const challenge = await mintingHubFetcher.challenges(index);

      const positionsRepository = usePositionsRepository();
      const position = computed(() =>
        positionsRepository.getOne(challenge.position)
      );

      await until(position).not.toBeNull();

      const collateralDecimals = computed(
        () => position.value.collateral.decimals
      );

      challengesRepository.save({
        index,
        size: dec18ToString(challenge.size, collateralDecimals.value),
        bid: dec18ToString(challenge.bid, collateralDecimals.value),
        end: dateFormatter(challenge.end),
        bidderAddress: ethers.utils.getAddress(challenge.bidder),
        challengerAddress: ethers.utils.getAddress(challenge.challenger),
        positionAddress: ethers.utils.getAddress(challenge.position),
      });

      usersRepository.save({
        address: ethers.utils.getAddress(challenge.bidder),
      });

      usersRepository.save({
        address: ethers.utils.getAddress(challenge.challenger),
      });
    } catch (e) {
      console.log(e);
    }
  };

  return { initList };
};
