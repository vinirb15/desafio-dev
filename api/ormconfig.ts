import { Transaction } from 'src/cnab/entity/transaction.entity';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost', // ou 'db' se estiver no docker
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'cnab',
  entities: [Transaction],
  migrations: ['src/migrations/*.ts'],
});
