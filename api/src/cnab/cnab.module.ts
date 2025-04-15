import { Module } from '@nestjs/common';
import { CNABController } from './cnab.controller';
import { CNABService } from './cnab.service';
import { CNABParser } from './parser/cnab.parser';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionTypeStrategyFactory } from './strategy/cnab.strategy';
import { Transaction } from 'src/common/entity/transaction.entity';
import { Store } from 'src/common/entity/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Store])],
  controllers: [CNABController],
  providers: [CNABService, CNABParser, TransactionTypeStrategyFactory],
})
export class CNABModule { }
