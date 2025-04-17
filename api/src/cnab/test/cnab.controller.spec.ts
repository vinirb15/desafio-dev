import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { Readable } from 'stream';
import { CNABService } from '@app/cnab/domain/cnab.service';
import { CNABController } from '@app/cnab/application/cnab.controller';
import * as path from 'path';
import * as fs from 'fs';

describe('CNABController', () => {
  let controller: CNABController;
  let cnabService: CNABService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CNABController],
      providers: [
        {
          provide: CNABService,
          useValue: {
            processCNAB: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CNABController>(CNABController);
    cnabService = module.get<CNABService>(CNABService);
  });

  it('should upload and process the CNAB.txt file', async () => {
    const filePath = path.resolve(__dirname, './mocks/CNAB.txt');
    const fileBuffer = fs.readFileSync(filePath);

    const mockFile: Express.Multer.File = {
      buffer: fileBuffer,
      fieldname: 'file',
      originalname: 'CNAB.txt',
      encoding: '7bit',
      mimetype: 'text/plain',
      size: fileBuffer.length,
      stream: Readable.from(fileBuffer),
      destination: '',
      filename: '',
      path: '',
    };

    const mockResult = [{ transaction: 'mock' }];
    (cnabService.processCNAB as jest.Mock).mockResolvedValue(mockResult);

    const response = await controller.uploadFile(mockFile);

    expect(cnabService.processCNAB).toHaveBeenCalledWith(
      fileBuffer.toString('utf-8'),
    );
    expect(response).toEqual({
      message: 'File uploaded successfully',
      total: mockResult.length,
    });
  });

  it('should throw an error when no file is uploaded', async () => {
    await expect(
      controller.uploadFile(undefined as unknown as Express.Multer.File),
    ).rejects.toThrow(HttpException);
  });
});
