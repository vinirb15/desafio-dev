import { Module } from '@nestjs/common';
import { CNABController } from './cnab.controller';
import { CNABService } from './cnab.service';
import { CNABParser } from './parser/cnab.parser';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionTypeStrategyFactory } from './strategy/cnab.strategy';
import { Transaction } from './entity/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [CNABController],
  providers: [CNABService, CNABParser, TransactionTypeStrategyFactory],
})
export class CNABModule { }
