import Token from './Token';

export default class Frankencoin extends Token {
  static entity = 'frankencoin';
  static primaryKey = 'address';

  static fields() {
    return {
      ...super.fields(),

      minterReserve: this.number(null),
      equity: this.number(null),
      totalSupply: this.number(null),
    };
  }

  get totalReserve() {
    return this.minterReserve === null && this.equity === null
      ? null
      : this.minterReserve + this.equity;
  }
}
