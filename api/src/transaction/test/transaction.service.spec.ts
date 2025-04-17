import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from '@app/transaction/domain/transaction.service';
import { Store } from '@app/common/entity/store.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('TransactionService', () => {
  let service: TransactionService;
  let storeRepo: Repository<Store>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Store),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    storeRepo = module.get<Repository<Store>>(getRepositoryToken(Store));
  });

  it('should list transactions grouped by store with calculated balance and type description', async () => {
    const mockStores: Store[] = [
      {
        id: 1,
        name: 'Store A',
        owner: 'Owner A',
        transactions: [
          {
            id: 1,
            type: 1,
            date: new Date('2022-01-01'),
            hour: '120000',
            value: 10000,
            cpf: '12345678901',
            card: '1234****5678',
            store: {} as Store,
          },
          {
            id: 2,
            type: 2,
            date: new Date('2022-01-02'),
            hour: '130000',
            value: 5000,
            cpf: '98765432100',
            card: '8765****4321',
            store: {} as Store,
          },
        ],
      },
    ];

    (storeRepo.find as jest.Mock).mockResolvedValue(mockStores);

    const result = await service.listGroupedByStore();

    expect(storeRepo.find).toHaveBeenCalledWith({
      relations: ['transactions'],
    });

    expect(result).toEqual([
      {
        storeName: 'Store A',
        storeOwner: 'Owner A',
        balance: 5000, // 10000 (type 1, +) - 5000 (type 2, -)
        transactions: [
          {
            type: 'Débito',
            date: mockStores[0].transactions[0].date,
            value: 10000,
            cpf: '12345678901',
            card: '1234****5678',
          },
          {
            type: 'Boleto',
            date: mockStores[0].transactions[1].date,
            value: 5000,
            cpf: '98765432100',
            card: '8765****4321',
          },
        ],
      },
    ]);
  });
});
