import { Store } from 'src/common/entity/store.entity';
import { Transaction } from 'src/common/entity/transaction.entity';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'cnab',
  entities: [Transaction, Store],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
