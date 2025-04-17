import { ParsedTransaction } from '@app/common/types/parsed-transaction.type';
import { CNABParser } from '@app/cnab/domain/cnab.parser';
import { TransactionTypeStrategyFactory } from '@app/cnab/domain/cnab.strategy';

describe('CNABParser', () => {
  let parser: CNABParser;
  let strategyFactory: TransactionTypeStrategyFactory;
  const line =
    '3201903010000014200096206760174753****3153153453JOÃO MACEDO   BAR DO JOÃO';

  beforeEach(() => {
    strategyFactory = {
      getStrategy: jest.fn().mockReturnValue({
        kind: 'entrada',
        operator: '+',
        description: 'Venda Débito',
      }),
    } as any;

    parser = new CNABParser(strategyFactory);
  });

  it('should parse a single CNAB line correctly', () => {
    const parsed = parser.parse(line);

    expect(parsed).toHaveLength(1);
    expect(parsed[0]).toEqual<ParsedTransaction>({
      type: 3,
      date: '2019-03-01',
      hour: '15:34:53',
      value: 142,
      cpf: '09620676017',
      card: '4753****3153',
      storeOwner: 'JOÃO MACEDO',
      storeName: 'BAR DO JOÃO',
      kind: 'entrada',
      description: 'Venda Débito',
    });
  });

  it('should apply negative operator from strategy', () => {
    (strategyFactory.getStrategy as jest.Mock).mockReturnValueOnce({
      kind: 'saída',
      operator: '-',
      description: 'Saque',
    });

    const parsed = parser.parse(line);

    expect(parsed[0].value).toBe(-142);
    expect(parsed[0].kind).toBe('saída');
    expect(parsed[0].description).toBe('Saque');
  });

  it('should ignore empty lines', () => {
    const content =
      '\n' +
      '120190301000001234520123456****1234091234JOÃO MACEDO   MERCADO DA AVENIDA  ' +
      '\n';

    const parsed = parser.parse(content);

    expect(parsed).toHaveLength(1);
  });
});
