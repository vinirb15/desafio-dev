import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CNABParser } from './parser/cnab.parser';
import { Transaction } from './entity/transaction.entity';

@Injectable()
export class CNABService {
  constructor(
    private readonly parser: CNABParser,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) { }

  async processCNAB(content: string): Promise<Transaction[]> {
    const transactions = this.parser.parse(content);

    const entities = transactions.map((t) =>
      this.transactionRepo.create({
        type: t.type,
        date: t.date,
        value: t.value,
        cpf: t.cpf,
        card: t.card,
        hour: t.hour,
        storeOwner: t.storeOwner,
        storeName: t.storeName,
      }),
    );

    // console.table(transactions, ['type', 'date', 'value', 'cpf', 'storeName']);
    return await this.transactionRepo.save(entities);
  }
}
