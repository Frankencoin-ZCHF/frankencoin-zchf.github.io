import useAuth from '@/auth';
import { dateFormatter } from '@/utils/date';
import { addressCompare } from '@/utils/helpers';
import { Model } from 'pinia-orm';

import { fixedNumberOperate } from '../utils/math';
import Challenge from './Challenge';
import Collateral from './Collateral';
import User from './User';

export default class Position extends Model {
  static entity = 'positions';
  static primaryKey = 'address';

  static fields() {
    return {
      address: this.uid(),

      ownerAddress: this.string(null),
      collateralAddress: this.string(null),

      limit: this.string(null),
      minted: this.string(null),
      price: this.string(null),
      expiration: this.attr(null),
      mintingFeePPM: this.number(null),
      reserveContribution: this.number(null),
      minimumCollateral: this.string(null),
      retainedReserve: this.string(null),
      challengePeriod: this.string(null),
      challengedAmount: this.string(null),
      collateralBalance: this.string(null),
      allowedAmount: this.string(null),

      owner: this.belongsTo(User, 'ownerAddress'),
      collateral: this.belongsTo(Collateral, 'collateralAddress'),
      challenges: this.hasMany(Challenge, 'positionAddress'),
    };
  }

  get isOwningPosition() {
    const auth = useAuth();
    return addressCompare(auth.wallet, this.ownerAddress);
  }

  get expirationDate() {
    return dateFormatter(this.expiration);
  }

  get priceXminted() {
    return fixedNumberOperate(
      '*',
      this.mintingFeePPM,
      this.reserveContribution
    );
  }

  get available() {
    if (this.limit === null || this.minted === null) return null;

    return fixedNumberOperate('-', this.limit, this.minted);
  }
}
