import request from 'supertest';
import app from '../../src/app'
import pool from '../../src/config/db/db'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.token' });
import bcrypt from 'bcrypt';

// ✅ Import Jest globals  explicit
import { describe, it, expect, afterAll } from '@jest/globals';

// create token for test
const testUser = { id: 1, role: 'admin' };
const JWT_SECRET = process.env.SECRET_KEY_ACCESS_TOKEN || 'secret';
const testToken = jwt.sign(testUser, JWT_SECRET, { expiresIn: '1h' });

describe('User API', () => {
  it('GET /api/user/getusers should return all users', async () => {
    const res = await request(app)
      .get('/api/user/getusers')
      .set('Authorization', `Bearer ${testToken}`); // ✅ JWT
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
  });
});

describe('Signup API', () => {
  it('POST /api/user/signup-email should create new user', async () => {
    const newUser = {
      email: 'testuser@example.com',
      password: '123456'
    };

    const res = await request(app)
      .post('/api/user/signup-email')      // use .post
      .send(newUser)                 // send body
      .set('Accept', 'application/json'); // tell server send JSON

    expect(res.status).toBe(201);                 
    expect(res.body.user).toHaveProperty('id');   
    expect(res.body.user.email).toBe(newUser.email); 
  });
});

describe('Sign in API', () => {
  it.only('POST /api/user/signin-email should return user', async () => {
    const newUser = { email: 'testuser@example.com', password: '123456' };

    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    // สร้าง user ก่อน login
    await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2)',
      [newUser.email, hashedPassword]
    );

    const res = await request(app)
      .post('/api/user/signin-email')
      .send(newUser)
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user).toHaveProperty('role');
    expect(res.body.user.email).toBe(newUser.email);
  });
});

afterAll(async () => {
  await pool.query('DELETE FROM users WHERE email=$1', ['testuser@example.com']);
  await pool.end(); // ✅ close connection
});

// npm test
// debug test-> npm test -- --detectOpenHandles

// npx jest tests/user.test.ts 
// use it.only to run only 1