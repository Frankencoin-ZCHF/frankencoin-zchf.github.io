import { Repository, useRepo } from 'pinia-orm';
import Position from '@/models/Position';
import useAuth from '@/auth';

class PositionsRepository extends Repository {
  use = Position;

  auth = useAuth();

  getOne(address) {
    return this.where('address', address)
      .whereHas('collateral')
      .whereHas('owner')
      .with('collateral')
      .with('challenges', (query) => {
        query.with('challenger').with('bidder');
      })
      .with('owner')
      .first();
  }

  getMyPositions() {
    return this.where('ownerAddress', this.auth.wallet)
      .with('collateral')
      .get();
  }

  getAllPositions() {
    return this.where('ownerAddress', (value) => {
      return value != this.auth.wallet;
    })
      .with('collateral')
      .get();
  }
}

export default () => {
  return useRepo(PositionsRepository);
};
