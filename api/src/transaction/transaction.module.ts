import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from '@app/common/entity/store.entity';
import { TransactionController } from '@app/transaction/application/transaction.controller';
import { TransactionService } from '@app/transaction/domain/transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([Store])],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule { }
