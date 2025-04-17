import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from '@app/transaction/application/transaction.controller';
import { TransactionService } from '@app/transaction/domain/transaction.service';

describe('TransactionController', () => {
  let controller: TransactionController;
  let transactionService: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: {
            listGroupedByStore: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    transactionService = module.get<TransactionService>(TransactionService);
  });

  it('should return the list of transactions grouped by store', async () => {
    const mockResult = [
      {
        storeName: 'Loja 1',
        transactions: [
          { id: 1, value: 100 },
          { id: 2, value: 200 },
        ],
      },
      {
        storeName: 'Loja 2',
        transactions: [{ id: 3, value: 150 }],
      },
    ];

    (transactionService.listGroupedByStore as jest.Mock).mockResolvedValue(
      mockResult,
    );

    const result = await controller.listByStore();

    expect(transactionService.listGroupedByStore).toHaveBeenCalled();
    expect(result).toEqual(mockResult);
  });
});
