import { Store } from '@app/common/entity/store.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '@app/common/entity/transaction.entity';
import { CNABService } from '@app/cnab/domain/cnab.service';
import { CNABParser } from '@app/cnab/domain/cnab.parser';
import { TransactionTypeStrategyFactory } from '@app/cnab/domain/cnab.strategy';
import { CNABController } from '@app/cnab/application/cnab.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Store])],
  controllers: [CNABController],
  providers: [CNABService, CNABParser, TransactionTypeStrategyFactory],
})
export class CNABModule { }
