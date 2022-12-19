import { Model } from 'pinia-orm';
import Position from './Position';
import User from './User';

export default class Challenge extends Model {
  static entity = 'challenges';
  static primaryKey = 'index';

  static fields() {
    return {
      index: this.uid(),
      size: this.number(null),
      bid: this.number(null),
      end: this.attr(null),

      bidderAddress: this.string(null),
      challengerAddress: this.string(null),
      positionAddress: this.string(null),

      bidder: this.belongsTo(User, 'bidderAddress'),
      challenger: this.belongsTo(User, 'challengerAddress'),
      position: this.belongsTo(Position, 'positionAddress'),
    };
  }

  get buyNowPrice() {
    if (this.position) return this.position.price * this.size;
    return null;
  }

  get ratio() {
    return this.bid / this.size;
  }
}
