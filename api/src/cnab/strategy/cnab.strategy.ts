import { Injectable } from '@nestjs/common';

export type TransactionStrategy = {
  kind: 'entrada' | 'saida';
  operator: '+' | '-';
  description: string;
};

@Injectable()
export class TransactionTypeStrategyFactory {
  private readonly strategies: Record<number, TransactionStrategy> = {
    1: { kind: 'entrada', operator: '+', description: 'Débito' },
    2: { kind: 'saida', operator: '-', description: 'Boleto' },
    3: { kind: 'saida', operator: '-', description: 'Financiamento' },
    4: { kind: 'entrada', operator: '+', description: 'Crédito' },
    5: {
      kind: 'entrada',
      operator: '+',
      description: 'Recebimento Empréstimo',
    },
    6: { kind: 'entrada', operator: '+', description: 'Vendas' },
    7: { kind: 'entrada', operator: '+', description: 'Recebimento TED' },
    8: { kind: 'entrada', operator: '+', description: 'Recebimento DOC' },
    9: { kind: 'saida', operator: '-', description: 'Aluguel' },
  };

  getStrategy(type: number): TransactionStrategy {
    const strategy = this.strategies[type];
    if (!strategy) {
      throw new Error(`Transaction type unknow: ${type}`);
    }
    return strategy;
  }
}
