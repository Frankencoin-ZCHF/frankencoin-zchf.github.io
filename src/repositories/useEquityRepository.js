import { Repository, useRepo } from 'pinia-orm';
import { ethers } from 'ethers';
import { addresses } from '@/contracts/dictionnary';

import Equity from '@/models/Equity';

class EquityRepository extends Repository {
  use = Equity;

  equityAddress = ethers.utils.getAddress(addresses.equity);

  init() {
    this.save({
      address: this.equityAddress,
      symbol: 'FPS',
      name: 'Frankencoin Pool Share',
    });
  }

  update(data) {
    this.where('address', this.equityAddress).update(data);
  }

  get() {
    if (!this.where('address', this.equityAddress).get()) return new Equity();
    return this.where('address', this.equityAddress).first();
  }
}

export default () => {
  return useRepo(EquityRepository);
};
