import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CNABParser } from './parser/cnab.parser';
import { Transaction } from 'src/common/entity/transaction.entity';
import { Store } from 'src/common/entity/store.entity';

@Injectable()
export class CNABService {
  constructor(
    private readonly parser: CNABParser,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,
  ) { }

  async processCNAB(content: string): Promise<Transaction[]> {
    const transactionsData = this.parser.parse(content);
    const transactions: Transaction[] = [];

    for (const t of transactionsData) {
      let store = await this.storeRepo.findOne({
        where: { name: t.storeName, owner: t.storeOwner },
      });

      if (!store) {
        store = this.storeRepo.create({
          name: t.storeName,
          owner: t.storeOwner,
        });
        store = await this.storeRepo.save(store);
      }

      const transaction = this.transactionRepo.create({
        type: t.type,
        date: t.date,
        value: t.value,
        cpf: t.cpf,
        card: t.card,
        hour: t.hour,
        store,
      });

      transactions.push(transaction);
    }

    return await this.transactionRepo.save(transactions);
  }
}
