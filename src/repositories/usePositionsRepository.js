import useAuth from '@/auth';
import Position from '@/models/Position';
import { Repository, useRepo } from 'pinia-orm';

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
    if (this.auth.isConnected) {
      return this.where('ownerAddress', (value) => {
        return value != this.auth.wallet;
      })
        .with('collateral')
        .get();
    } else {
      return this.with('collateral').get();
    }
  }
}

export default () => {
  return useRepo(PositionsRepository);
};
