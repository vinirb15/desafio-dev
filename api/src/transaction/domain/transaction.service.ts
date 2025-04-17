import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '@app/common/entity/store.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) { }

  async listGroupedByStore() {
    const stores = await this.storeRepository.find({
      relations: ['transactions'],
    });

    return stores.map((store) => {
      const balance = store.transactions.reduce((acc, tx) => {
        const signal = this.getSignalForType(tx.type);
        return acc + signal * Number(tx.value);
      }, 0);

      return {
        storeName: store.name,
        storeOwner: store.owner,
        balance,
        transactions: store.transactions.map((tx) => ({
          type: this.getTypeDescription(tx.type),
          date: tx.date,
          value: Number(tx.value),
          cpf: tx.cpf,
          card: tx.card,
        })),
      };
    });
  }

  async deleteAll() {
    const queryRunner =
      this.storeRepository.manager.connection.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete('Transaction', {});
      await queryRunner.manager.delete(Store, {});
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private getSignalForType(type: number): number {
    const negative = [2, 3, 9];
    return negative.includes(type) ? -1 : 1;
  }

  private getTypeDescription(type: number): string {
    const map: Record<number, string> = {
      1: 'Débito',
      2: 'Boleto',
      3: 'Financiamento',
      4: 'Crédito',
      5: 'Recebimento Empréstimo',
      6: 'Vendas',
      7: 'Recebimento TED',
      8: 'Recebimento DOC',
      9: 'Aluguel',
    };

    return map[type] || 'Desconhecido';
  }
}
