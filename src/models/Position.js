import { Model } from 'pinia-orm';
import Collateral from './Collateral';
import Challenge from './Challenge';
import User from './User';
import { dateFormatter } from '@/utils/date';
import useAuth from '@/auth';

export default class Position extends Model {
  static entity = 'positions';
  static primaryKey = 'address';

  static fields() {
    return {
      address: this.uid(),

      ownerAddress: this.string(null),
      collateralAddress: this.string(null),

      limit: this.number(null),
      minted: this.number(null),
      price: this.number(null),
      expiration: this.attr(null),
      mintingFeePPM: this.number(null),
      reserveContribution: this.number(null),
      minimumCollateral: this.number(null),
      retainedReserve: this.number(null),
      challengePeriod: this.number(null),
      challengedAmount: this.number(null),
      collateralBalance: this.number(null),
      allowedAmount: this.number(null),

      owner: this.belongsTo(User, 'ownerAddress'),
      collateral: this.belongsTo(Collateral, 'collateralAddress'),
      challenges: this.hasMany(Challenge, 'positionAddress'),
    };
  }

  get isOwningPosition() {
    const auth = useAuth();
    return auth.wallet == this.ownerAddress;
  }

  get expirationDate() {
    return dateFormatter(this.expiration);
  }

  get priceXminted() {
    return this.mintingFeePPM * this.reserveContribution;
  }

  get available() {
    if (this.limit === null || this.minted === null) return null;
    return this.limit - this.minted;
  }
}
