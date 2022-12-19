import useEquityFetcher from '@/fetchers/useEquityFetcher';

export default async (amount) => {
  const equityFetcher = useEquityFetcher();

  if (amount.value) {
    return await equityFetcher.calculateProceeds(amount);
  } else {
    return 0;
  }
};
