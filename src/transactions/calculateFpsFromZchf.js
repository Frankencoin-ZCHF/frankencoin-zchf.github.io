import useEquityFetcher from '@/fetchers/useEquityFetcher';

export default async (amount) => {
  const equityFetcher = useEquityFetcher();

  if (amount.value) {
    return await equityFetcher.calculateShares(amount);
  } else {
    return '0';
  }
};
