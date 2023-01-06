import Position from '@/models/Position';
import User from '@/models/User';
import { fixedNumberOperate } from '@/utils/math';
import { Model } from 'pinia-orm';

export default class Challenge extends Model {
  static entity = 'challenges';
  static primaryKey = 'index';

  static fields() {
    return {
      index: this.uid(),
      size: this.string(null),
      bid: this.string(null),
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
    if (this.position) {
      return fixedNumberOperate('*', this.position.price, this.size);
    }

    return null;
  }

  get ratio() {
    return fixedNumberOperate('/', this.bid, this.size);
  }
}
