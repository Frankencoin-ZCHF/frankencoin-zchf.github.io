import { contractUrl, shortenAddress } from '@/utils/address.js';
import { Model } from 'pinia-orm';

export default class Token extends Model {
  static entity = 'tokens';
  static primaryKey = 'address';

  static fields() {
    return {
      address: this.uid(null),
      symbol: this.string(null),
      name: this.string(null),
    };
  }

  get url() {
    return contractUrl(this.address);
  }

  get shortenAddress() {
    return shortenAddress(this.address);
  }
}
