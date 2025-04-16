import { Module } from '@nestjs/common';
import { CNABModule } from './cnab/cnab.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'cnab',
      autoLoadEntities: true,
      synchronize: false,
    }),
    CNABModule,
    TransactionModule,
  ],
})
export class AppModule {}
