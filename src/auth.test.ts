import request from 'supertest';
import express from 'express';
import { validateToken } from './auth';

type Payload = Record<string, any>;

function createToken(payload: Payload): string {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64');
  return `${header}.${body}.`;
}

const app = express();
app.get('/check', validateToken, (req, res) => {
  res.json(req.user);
});

describe('validateToken', () => {
  it('attaches user info to request', async () => {
    const token = createToken({ oid: '42', preferred_username: 'me@example.com', exp: Date.now() / 1000 + 60 });
    const res = await request(app).get('/check').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: '42', email: 'me@example.com' });
  });
});
