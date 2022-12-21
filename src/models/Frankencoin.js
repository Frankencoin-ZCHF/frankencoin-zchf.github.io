import Token from './Token';
import { fixedNumberOperate } from '../utils/math';

export default class Frankencoin extends Token {
  static entity = 'frankencoin';
  static primaryKey = 'address';

  static fields() {
    return {
      ...super.fields(),

      minterReserve: this.string(null),
      equity: this.string(null),
      totalSupply: this.string(null),
    };
  }

  get totalReserve() {
    if (this.minterReserve === null && this.equity === null) return null;

    return fixedNumberOperate('*', this.minterReserve, this.equity);
  }
}
