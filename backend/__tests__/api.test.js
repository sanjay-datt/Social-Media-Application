const request = require('supertest');
const app = require('../server');

describe('Health Check', () => {
  it('GET /api/health should return OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
  });
});

describe('Auth Routes', () => {
  it('POST /api/auth/register - should reject missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com' });
    expect(res.statusCode).toBe(400);
  });

  it('POST /api/auth/register - should reject invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', email: 'not-an-email', password: 'password123' });
    expect(res.statusCode).toBe(400);
  });

  it('POST /api/auth/register - should reject short password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', email: 'test@example.com', password: '123' });
    expect(res.statusCode).toBe(400);
  });

  it('POST /api/auth/login - should reject missing credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});
    expect(res.statusCode).toBe(400);
  });
});

describe('Protected Routes', () => {
  it('GET /api/posts/feed - should require auth', async () => {
    const res = await request(app).get('/api/posts/feed');
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/users/profile - should require auth', async () => {
    const res = await request(app).get('/api/users/123');
    expect(res.statusCode).toBe(401);
  });

  it('POST /api/posts - should require auth', async () => {
    const res = await request(app).post('/api/posts').send({ content: 'Test post' });
    expect(res.statusCode).toBe(401);
  });
});
