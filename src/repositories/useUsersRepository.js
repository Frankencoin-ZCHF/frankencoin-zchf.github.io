import { Repository, useRepo } from 'pinia-orm';
import { addresses } from '@/contracts/dictionnary';
import User from '@/models/User';
import useFrankencoinFetcher from '@/fetchers/useFrankencoinFetcher';
import useEquityFetcher from '@/fetchers/useEquityFetcher';
import useStablecoinFetcher from '@/fetchers/useStablecoinFetcher';
import useCollateralFetcher from '@/fetchers/useCollateralFetcher';
import useCollateralsRepository from '@/repositories/useCollateralsRepository';

class UsersRepository extends Repository {
  frankencoinFetcher = useFrankencoinFetcher();
  equityFetcher = useEquityFetcher();
  stablecoinFetcher = useStablecoinFetcher();

  collateralRepository = useCollateralsRepository();
  use = User;

  getAll() {
    return this.with('positions').with('challenges').get();
  }

  getByPosition(address) {
    if (!this.where('address', address).first()) return new User();

    return this.where('address', address)
      .with('positions')
      .with('challenges')
      .first();
  }

  async setToken(userAddress, tokenAddress, symbol, amount) {
    if (!this.where('address', userAddress).first()) {
      this.save({ address: userAddress });
    }

    const user = this.where('address', userAddress).first();

    user.tokens[tokenAddress] = {
      symbol: symbol,
      amount: amount,
    };

    this.save(user);
  }

  async setAllowance(userAddress, positionAddress, amount) {
    const user = this.where('address', userAddress).first();

    user.allowances[positionAddress] = amount;

    this.save(user);
  }

  async setAmountForAllCollaterals(address) {
    const zchf = await this.frankencoinFetcher.balance(address);
    const fps = await this.equityFetcher.balance(address);
    const xchf = await this.stablecoinFetcher.balance(address);
    const ZCHFMintingHubAllowance = await this.frankencoinFetcher.allowance(
      address,
      addresses.mintingHub
    );
    const XCHFBridgeAllowance = await this.stablecoinFetcher.allowance(
      address,
      addresses.bridge
    );
    const votes = await this.equityFetcher.votes(address);

    const collaterals = this.collateralRepository.all();

    await Promise.all(
      collaterals.map(async (collateral) => {
        const collateralFetcher = useCollateralFetcher(collateral.address);
        const ballance = await collateralFetcher.getBalance(address);
        this.setToken(address, collateral.address, collateral.symbol, ballance);
      })
    );

    this.setToken(address, addresses.frankencoin, 'ZCHF', zchf);
    this.setToken(address, addresses.equity, 'FPS', fps);
    this.setToken(address, addresses.stableCoin, 'XCHF', xchf);

    this.where('address', address).update({
      ZCHFMintingHubAllowance: ZCHFMintingHubAllowance,
    });
    this.where('address', address).update({
      XCHFBridgeAllowance: XCHFBridgeAllowance,
    });
    this.where('address', address).update({ votes: votes });
  }
}

export default () => {
  return useRepo(UsersRepository);
};