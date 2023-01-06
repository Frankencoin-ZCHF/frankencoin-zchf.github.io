import { fixedNumberOperate } from '@/utils/math';

import Token from './Token';

export default class Stablecoin extends Token {
  static entity = 'stablecoin';
  static primaryKey = 'address';

  static fields() {
    return {
      ...super.fields(),

      bridgeBalance: this.string(null),
      bridgeLimit: this.string(null),
    };
  }

  get available() {
    return this.bridgeLimit === null || this.bridgeBalance === null
      ? null
      : fixedNumberOperate('-', this.bridgeLimit, this.bridgeBalance);
  }
}
