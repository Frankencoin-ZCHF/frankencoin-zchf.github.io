import Token from './Token';

export default class Stablecoin extends Token {
  static entity = 'stablecoin';
  static primaryKey = 'address';

  static fields() {
    return {
      ...super.fields(),

      bridgeBalance: this.number(null),
      bridgeLimit: this.number(null),
    };
  }

  get available() {
    return this.bridgeLimit === null || this.bridgeBalance === null
      ? null
      : this.bridgeLimit - this.bridgeBalance;
  }
}
