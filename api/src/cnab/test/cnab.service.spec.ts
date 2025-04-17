import { Test, TestingModule } from '@nestjs/testing';
import { Transaction } from '@app/common/entity/transaction.entity';
import { Store } from '@app/common/entity/store.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CNABService } from '@app/cnab/domain/cnab.service';
import { CNABParser } from '@app/cnab/domain/cnab.parser';

describe('CNABService', () => {
  let service: CNABService;
  let parser: CNABParser;
  let transactionRepo: Repository<Transaction>;
  let storeRepo: Repository<Store>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CNABService,
        {
          provide: CNABParser,
          useValue: {
            parse: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Store),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(CNABService);
    parser = module.get(CNABParser);
    transactionRepo = module.get(getRepositoryToken(Transaction));
    storeRepo = module.get(getRepositoryToken(Store));
  });

  it('should parse, create store if needed, and save transactions', async () => {
    const mockParsed = [
      {
        type: 1,
        date: new Date('2022-01-01'),
        value: 10000,
        cpf: '12345678901',
        card: '1234****5678',
        hour: '120000',
        storeName: 'Store A',
        storeOwner: 'Owner A',
      },
    ];

    (parser.parse as jest.Mock).mockReturnValue(mockParsed);
    (storeRepo.findOne as jest.Mock).mockResolvedValue(null);
    (storeRepo.create as jest.Mock).mockReturnValue({
      name: 'Store A',
      owner: 'Owner A',
    });
    (storeRepo.save as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'Store A',
      owner: 'Owner A',
    });

    const createdTransaction = {
      type: 1,
      date: new Date('2022-01-01'),
      value: 10000,
      cpf: '12345678901',
      card: '1234****5678',
      hour: '120000',
      store: { id: 1, name: 'Store A', owner: 'Owner A' },
    };

    (transactionRepo.create as jest.Mock).mockReturnValue(createdTransaction);
    (transactionRepo.save as jest.Mock).mockResolvedValue([createdTransaction]);

    const result = await service.processCNAB('mock content');

    expect(parser.parse).toHaveBeenCalledWith('mock content');
    expect(storeRepo.findOne).toHaveBeenCalledWith({
      where: { name: 'Store A', owner: 'Owner A' },
    });
    expect(storeRepo.create).toHaveBeenCalledWith({
      name: 'Store A',
      owner: 'Owner A',
    });
    expect(transactionRepo.create).toHaveBeenCalled();
    expect(transactionRepo.save).toHaveBeenCalledWith([createdTransaction]);
    expect(result).toEqual([createdTransaction]);
  });
});
