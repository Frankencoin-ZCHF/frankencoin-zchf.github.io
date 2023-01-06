import useAuth from '@/auth';
import blockchain from '@/config';
import { addresses } from '@/contracts/dictionnary';
import useChallengesController from '@/controllers/useChallengesController';
import usePositionsController from '@/controllers/usePositionsController';
import useBridgeFetcher from '@/fetchers/useBridgeFetcher';
import useEquityFetcher from '@/fetchers/useEquityFetcher';
import useFrankencoinFetcher from '@/fetchers/useFrankencoinFetcher';
import useStablecoinFetcher from '@/fetchers/useStablecoinFetcher';
import useEquityRepository from '@/repositories/useEquityRepository';
import useFrankencoinRepository from '@/repositories/useFrankencoinRepository';
import useStablecoinRepository from '@/repositories/useStablecoinRepository';
import useUsersRepository from '@/repositories/useUsersRepository';
import { computed, provide, watch } from 'vue';

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
