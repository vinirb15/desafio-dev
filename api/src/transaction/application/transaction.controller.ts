import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransactionService } from '@app/transaction/domain/transaction.service';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  @Get()
  async listByStore() {
    return this.transactionService.listGroupedByStore();
  }
}
