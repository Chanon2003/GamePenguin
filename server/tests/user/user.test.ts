import request from 'supertest';
import app from '../../src/app'
import pool from '../../src/config/db/db'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.token' });
import bcrypt from 'bcrypt';

// ✅ Import Jest globals  explicit
import { describe, it, expect, afterAll,beforeAll } from '@jest/globals';

// Shared variables
let testUserId: number;
const testUserEmail = 'testuser@example.com';
const testUserPassword = '123456';
let testToken: string;

beforeAll(async () => {
  // 1️⃣ create user test in DB
  const hashedPassword = await bcrypt.hash(testUserPassword, 10);
  const result = await pool.query(
    'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id',
    [testUserEmail, hashedPassword, 'user']
  );
  testUserId = result.rows[0].id;

  // 2️⃣ สร้าง JWT สำหรับ protected routes
  const JWT_SECRET = process.env.SECRET_KEY_ACCESS_TOKEN || 'secret';
  testToken = jwt.sign({ id: testUserId, role: 'user' }, JWT_SECRET, { expiresIn: '1h' });
});

describe('User API Integration Tests', () => {
  // ✅ Sign In
  it('POST /api/user/signin-email should return user with token', async () => {
    const res = await request(app)
      .post('/api/user/signin-email')
      .send({ email: testUserEmail, password: testUserPassword })
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe(testUserEmail);
  });

  // ✅ Get user by Id
  it('GET /api/user/getuser/:id should return 1 user', async () => {
    const res = await request(app)
      .get(`/api/user/getuser/${testUserId}`)
      .set('Authorization', `Bearer ${testToken}`);

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.id).toBe(testUserId);
    expect(res.body.user.email).toBe(testUserEmail);
  });

  // ✅ Get all users
  it('GET /api/user/getusers should return array of users', async () => {
    const res = await request(app)
      .get('/api/user/getusers')
      .set('Authorization', `Bearer ${testToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
  });
});

afterAll(async () => {
  // Cleanup DB
  if (testUserId) {
    await pool.query('DELETE FROM users WHERE id=$1', [testUserId]);
  }
  await pool.end(); // Close DB pool
});

// npm test
// debug test-> npm test -- --detectOpenHandles

// npx jest tests/user.test.ts
// use it.only to run only 1