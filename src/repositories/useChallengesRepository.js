import { Repository, useRepo } from 'pinia-orm';
import Challenge from '@/models/Challenge';
import useAuth from '@/auth';

class ChallengesRepository extends Repository {
  use = Challenge;

  auth = useAuth();

  getMyChallenges() {
    return this.where('challengerAddress', this.auth.wallet)
      .whereHas('position', (nestedQuery) => {
        nestedQuery.whereHas('collateral');
      })
      .with('challenger')
      .with('bidder')
      .with('position', (query) => {
        query.with('collateral');
      })
      .get();
  }

  getAllChallenges() {
    return this.where('challengerAddress', (value) => {
      return value != this.auth.wallet;
    })
      .whereHas('position', (nestedQuery) => {
        nestedQuery.whereHas('collateral');
      })
      .with('challenger')
      .with('bidder')
      .with('position', (query) => {
        query.with('collateral');
      })
      .get();
  }

  getByPosition(address) {
    return this.where('positionAddress', address)
      .whereHas('position', (nestedQuery) => {
        nestedQuery.whereHas('collateral');
      })
      .with('challenger')
      .with('bidder')
      .with('position', (query) => {
        query.with('collateral');
      })
      .get();
  }

  getByIndex(index) {
    return this.where('index', index)
      .whereHas('position', (nestedQuery) => {
        nestedQuery.whereHas('collateral');
      })
      .with('challenger')
      .with('bidder')
      .with('position', (query) => {
        query.with('collateral');
      })
      .first();
  }
}

export default () => {
  return useRepo(ChallengesRepository);
};
