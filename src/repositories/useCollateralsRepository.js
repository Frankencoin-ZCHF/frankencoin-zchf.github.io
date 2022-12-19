import { Repository, useRepo } from 'pinia-orm';
import Collateral from '@/models/Collateral';

class CollateralsRepository extends Repository {
  use = Collateral;
}

export default () => {
  return useRepo(CollateralsRepository);
};
