import Token from './Token';

export default class Equity extends Token {
  static entity = 'equity';
  static primaryKey = 'address';

  static fields() {
    return {
      ...super.fields(),

      price: this.number(null),
      totalSupply: this.number(null),
      totalVotes: this.number(null),
    };
  }

  get marketCap() {
    return this.totalSupply === null || this.price === null
      ? null
      : this.totalSupply * this.price;
  }
}
