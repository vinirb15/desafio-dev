import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import * as path from 'path';
import { ParsedTransaction } from '@app/common/types/parsed-transaction.type';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );

    await app.init();
  });

  it('POST /cnab/upload - deve importar o arquivo com sucesso', async () => {
    const filePath = path.resolve(__dirname, 'fixtures/cnab.txt');

    const response = await request(app.getHttpServer())
      .post('/cnab/upload')
      .attach('file', filePath);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'Arquivo importado com sucesso',
    });
  });

  it('GET /stores - deve retornar a lista de lojas com saldo', async () => {
    const response = await request(app.getHttpServer()).get('/stores');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    response.body.forEach(
      (store: Partial<ParsedTransaction & { balance: number }>) => {
        expect(store).toHaveProperty('storeName');
        expect(store).toHaveProperty('ownerName');
        expect(store).toHaveProperty('balance');
        expect(typeof store.balance).toBe('number');
      },
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
