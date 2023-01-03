import Collateral from '@/models/Collateral';
import { Repository, useRepo } from 'pinia-orm';

class CollateralsRepository extends Repository {
  use = Collateral;
}

export default () => {
  return useRepo(CollateralsRepository);
};
