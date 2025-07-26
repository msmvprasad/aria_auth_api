import request from 'supertest';
import express from 'express';
import router from './users';
import { validateToken } from '../auth';
import { __mockQuery } from '../db';

jest.mock('../db', () => {
  const mockQuery = {
    select: jest.fn(),
    where: jest.fn().mockReturnThis(),
    first: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    del: jest.fn(),
  };
  const dbFn = jest.fn(() => mockQuery);
  return { __esModule: true, default: dbFn, __mockQuery: mockQuery };
});

function createToken() {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64');
  const body = Buffer.from(JSON.stringify({ oid: '1', preferred_username: 'a@b.com', exp: Date.now() / 1000 + 60 })).toString('base64');
  return `${header}.${body}.`;
}

const app = express();
app.use(express.json());
app.use('/users', validateToken, router);

const token = `Bearer ${createToken()}`;

describe('users routes', () => {
  beforeEach(() => {
    for (const fn of Object.values(__mockQuery)) {
      (fn as jest.Mock).mockReset();
    }
  });

  it('returns user list', async () => {
    (__mockQuery.select as jest.Mock).mockResolvedValue([{ azureId: '1', mail: 'a@b.com', external: true, adType: 'AAD' }]);
    const res = await request(app).get('/users').set('Authorization', token);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('validates on create', async () => {
    const res = await request(app).post('/users').set('Authorization', token).send({});
    expect(res.status).toBe(400);
  });

  it('creates user when valid', async () => {
    (__mockQuery.insert as jest.Mock).mockResolvedValue([1]);
    const payload = { azureId: '1', mail: 'a@b.com', external: true, adType: 'AAD' };
    const res = await request(app).post('/users').set('Authorization', token).send(payload);
    expect(res.status).toBe(201);
    expect(__mockQuery.insert).toHaveBeenCalledWith(payload);
  });
});
