import { addresses } from '@/contracts/dictionnary';
import Stablecoin from '@/models/Stablecoin';
import { ethers } from 'ethers';
import { Repository, useRepo } from 'pinia-orm';

class StablecoinRepository extends Repository {
  use = Stablecoin;

  stablecoinAddress = ethers.utils.getAddress(addresses.stableCoin);

  init() {
    this.save({
      address: this.stablecoinAddress,
      symbol: 'XCHF',
      name: 'Stablecoin',
    });
  }

  update(data) {
    this.where('address', this.stablecoinAddress).update(data);
  }

  get() {
    if (!this.where('address', this.stablecoinAddress).get())
      return new Stablecoin();
    return this.where('address', this.stablecoinAddress).first();
  }
}

export default () => {
  return useRepo(StablecoinRepository);
};
