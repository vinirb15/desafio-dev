import { Store } from 'src/common/entity/store.entity';
import { Transaction } from 'src/common/entity/transaction.entity';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'cnab',
  entities: [Transaction, Store],
  migrations: ['src/migrations/*.ts'],
});
