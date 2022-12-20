import { provide, computed, watch } from 'vue';
import { addresses } from '@/contracts/dictionnary';
import blockchain from '@/config';

import usePositionsController from '@/controllers/usePositionsController';
import useChallengesController from '@/controllers/useChallengesController';

import useFrankencoinFetcher from '@/fetchers/useFrankencoinFetcher';
import useEquityFetcher from '@/fetchers/useEquityFetcher';
import useStablecoinFetcher from '@/fetchers/useStablecoinFetcher';
import useBridgeFetcher from '@/fetchers/useBridgeFetcher';

import useFrankencoinRepository from '@/repositories/useFrankencoinRepository';
import useEquityRepository from '@/repositories/useEquityRepository';
import useStablecoinRepository from '@/repositories/useStablecoinRepository';
import useUsersRepository from '@/repositories/useUsersRepository';

import useAuth from '@/auth';

export default () => {
  const auth = useAuth();

  const wrongChain = computed(
    () => auth.isConnected && auth.chainId != blockchain.targetChainId
  );

  const frankencoinRepository = useFrankencoinRepository();
  const equityRepository = useEquityRepository();
  const stablecoinRepository = useStablecoinRepository();

  const frankencoinFetcher = useFrankencoinFetcher();
  const equityFetcher = useEquityFetcher();
  const stablecoinFetcher = useStablecoinFetcher();
  const bridgeFetcher = useBridgeFetcher();

  frankencoinRepository.init();
  equityRepository.init();
  stablecoinRepository.init();

  const load = async () => {
    const usersRepository = useUsersRepository();

    const frankencoinData = await frankencoinFetcher.all();
    const equityData = await equityFetcher.all();
    const stablecoinData = {};

    frankencoinRepository.update(frankencoinData);
    equityRepository.update(equityData);

    stablecoinData.bridgeBalance = await stablecoinFetcher.balance(
      addresses.bridge
    );

    stablecoinData.bridgeLimit = await bridgeFetcher.limit();

    stablecoinRepository.update(stablecoinData);

    if (!wrongChain.value) {
      usePositionsController().initList();
      useChallengesController().initList();

      if (auth.isConnected) {
        usersRepository.save({ address: auth.wallet });
        usersRepository.setAmountForAllCollaterals(auth.wallet);
      }
    }
  };

  const frankencoin = computed(() => frankencoinRepository.get());
  const equity = computed(() => equityRepository.get());
  const stablecoin = computed(() => stablecoinRepository.get());

  const connected = computed(() => auth.isConnected);

  load();

  watch(connected, () => {
    if (connected.value) load();
  });

  provide('frankencoin', frankencoin);
  provide('equity', equity);
  provide('stablecoin', stablecoin);
  provide('reload', load);
};
