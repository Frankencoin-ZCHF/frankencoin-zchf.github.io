import { addresses, MINTINGHUB_ABI } from '@/contracts/dictionnary';
import useMintingHubFetcher from '@/fetchers/useMintingHubFetcher';
import useChallengesRepository from '@/repositories/useChallengesRepository';
import useUsersRepository from '@/repositories/useUsersRepository';
import { dateFormatter } from '@/utils/date';
import { addressCompare } from '@/utils/helpers';
import fetchInfura from '@/utils/infura';
import { ethers } from 'ethers';

import { dec18ToString } from '../utils/math';

export default () => {
  const challengesRepository = useChallengesRepository();
  const usersRepository = useUsersRepository();

  // INIT CHALLENGES
  const initList = async () => {
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

      challengesRepository.save({
        index,
        size: dec18ToString(challenge.size),
        bid: dec18ToString(challenge.bid),
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
