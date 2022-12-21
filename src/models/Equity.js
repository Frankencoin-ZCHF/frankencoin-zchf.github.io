import Token from './Token';
import { fixedNumberOperate } from '../utils/math';

export default class Equity extends Token {
  static entity = 'equity';
  static primaryKey = 'address';

  static fields() {
    return {
      ...super.fields(),

      price: this.string(null),
      totalSupply: this.string(null),
      totalVotes: this.string(null),
    };
  }

  get marketCap() {
    if (this.totalSupply === null || this.price === null) return null;

    return fixedNumberOperate('*', this.totalSupply, this.price);
  }
}
