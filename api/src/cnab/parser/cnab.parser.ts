import { Injectable } from '@nestjs/common';
import { TransactionTypeStrategyFactory } from '../strategy/cnab.strategy';
import { ParsedTransaction } from '../types/parsed-transaction.type';

@Injectable()
export class CNABParser {
  constructor(
    private readonly strategyFactory: TransactionTypeStrategyFactory,
  ) { }

  parse(content: string): ParsedTransaction[] {
    const lines = content.split('\n').filter(Boolean);
    return lines.map((line) => {
      const type = parseInt(line.slice(0, 1));
      const date = line.slice(1, 9);
      const value = parseInt(line.slice(9, 19)) / 100;
      const cpf = line.slice(19, 30).trim();
      const card = line.slice(30, 42).trim();
      const hour = line.slice(42, 48);
      const storeOwner = line.slice(48, 62).trim();
      const storeName = line.slice(62, 81).trim();

      const strategy = this.strategyFactory.getStrategy(type);
      const { kind, operator, description } = strategy;

      return {
        type,
        date: this.formatDate(date),
        hour: this.formatTime(hour),
        value: operator === '-' ? -value : value,
        cpf,
        card,
        storeOwner,
        storeName,
        kind,
        description,
      };
    });
  }

  private formatDate(raw: string): string {
    return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
  }

  private formatTime(raw: string): string {
    return `${raw.slice(0, 2)}:${raw.slice(2, 4)}:${raw.slice(4, 6)}`;
  }
}
