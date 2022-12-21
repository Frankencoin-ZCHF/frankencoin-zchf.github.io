import { Model } from 'pinia-orm';
import { computed } from 'vue';
import Position from './Position';
import Challenge from './Challenge';
import { contractUrl, shortenAddress } from '@/utils/address.js';
import { addresses } from '@/contracts/dictionnary';
import useEquityRepository from '@/repositories/useEquityRepository';
import { fixedNumberOperate } from '../utils/math';

export default class User extends Model {
  static entity = 'users';
  static primaryKey = 'address';

  static fields() {
    return {
      address: this.string(null),

      ZCHFMintingHubAllowance: this.string(null),
      XCHFBridgeAllowance: this.string(null),

      votes: this.string(null),

      tokens: this.attr({}),
      allowances: this.attr({}),

      positions: this.hasMany(Position, 'ownerAddress'),
      challenges: this.hasMany(Challenge, 'challengerAddress'),
    };
  }

  get ZCHF() {
    return this.tokens[addresses.frankencoin]?.amount;
  }

  get FPS() {
    return this.tokens[addresses.equity]?.amount;
  }

  get FPSValue() {
    const equityRepository = useEquityRepository();
    const equity = computed(() => equityRepository.find(addresses.equity));

    if (equity.value.price === null || this.tokens[addresses.equity] === null)
      return null;

    return fixedNumberOperate(
      '*',
      this.tokens[addresses.equity]?.amount,
      equity.value.price
    );
  }

  get votingPower() {
    const equityRepository = useEquityRepository();
    const equity = computed(() => equityRepository.find(addresses.equity));

    if (this.votes === null || equity.value.totalVotes === null) return null;

    const votingPower = fixedNumberOperate(
      '/',
      this.votes,
      fixedNumberOperate('/', equity.value.totalVotes, 100)
    );

    return votingPower;
  }

  get XCHF() {
    return this.tokens[addresses.stableCoin]?.amount;
  }

  get url() {
    return contractUrl(this.address);
  }

  get shortenAddress() {
    return shortenAddress(this.address);
  }
}
