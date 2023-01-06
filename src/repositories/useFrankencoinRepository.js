import { addresses } from '@/contracts/dictionnary';
import Frankencoin from '@/models/Frankencoin';
import { ethers } from 'ethers';
import { Repository, useRepo } from 'pinia-orm';

class FrankencoinRepository extends Repository {
  use = Frankencoin;

  frankencoinAddress = ethers.utils.getAddress(addresses.frankencoin);

  init() {
    this.save({
      address: this.frankencoinAddress,
      symbol: 'ZCHF',
      name: 'Frankencoin',
    });
  }

  update(data) {
    this.where('address', this.frankencoinAddress).update(data);
  }

  get() {
    if (!this.where('address', this.frankencoinAddress).get())
      return new Frankencoin();
    return this.where('address', this.frankencoinAddress).first();
  }
}

export default () => {
  return useRepo(FrankencoinRepository);
};
