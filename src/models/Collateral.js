import Position from './Position';
import Token from './Token';

export default class Collateral extends Token {
  static entity = 'collaterals';
  static primaryKey = 'address';

  static fields() {
    return {
      ...super.fields(),

      decimals: this.number(null),
      allowedAmountMintingHub: this.string(null),
      positions: this.hasMany(Position, 'collateralAddress'),
    };
  }
}
