import { createCustomError } from "../errors/custom-error";
import asyncWrapper from "../middleware/asyncWrapper";
import { Request, Response, NextFunction } from "express";
import pool from '../config/db/db';
import bcrypt from 'bcrypt';
import generatedAccessToken from "../utils/generatedAccessToken";
import generatedRefreshToken from "../utils/generatedRefreshToken";
import { CookieOptions } from 'express';
import dotenv from 'dotenv';
import { redisClient } from "../config/redis";
dotenv.config({ path: '.env' });

// Extend Express Request interface to include 'user'

export const signupEmail = asyncWrapper(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Received signup request:", req.body);
  let { email, password }: { email: string; password: string } = req.body;

  if (!email || !password) {
    return next(createCustomError('Email and Password are required', 400));
  }

  email = email.toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(createCustomError('Invalid email format', 400));
  }

  if (password.length < 6) {
    return next(createCustomError('Password must be at least 6 characters long', 400));
  }

  const existingUser = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if ((existingUser.rowCount ?? 0) > 0) {
    return next(createCustomError('Email already in use', 409));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await pool.query(
    'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
    [email, hashedPassword]
  );

  return res.status(201).json({
    user: {
      id: newUser.rows[0].id,
      email: newUser.rows[0].email,
      profileSetup: false,
    },
    message: 'User registered successfully',
    success: true,
    error: false
  });
});

export const getAllUser = asyncWrapper(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const users = await pool.query(
    'SELECT id, email, role, is_active, is_verified, last_login, created_at FROM users'
  );

  if (users.rows.length === 0) {
    return next(createCustomError('No users found', 404));
  }

  // ส่ง response กลับ frontend
  return res.status(200).json({
    users: users.rows,
  });
});

export const signinEmail = asyncWrapper(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { email, password }: { email: string; password: string } = req.body;

  if (!email || !password) {
    return next(createCustomError('Email and Password are required', 400));
  }

  email = email.toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(createCustomError('Invalid email format', 400));
  }

  const user = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (user.rowCount === 0) {
    return next(createCustomError('User not found', 404));
  }

  const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);

  if (!isPasswordValid) {
    return next(createCustomError('Invalid password', 401));
  }

  const cookiesOption: CookieOptions = {
    maxAge: 1000 * 60 * 60 * 24, // 1 วัน
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: 'none' // ✅ lowercase
  };

  const refreshTokenOptions: CookieOptions = {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: 'none'
  };

  const refreshToken = await generatedRefreshToken(user.rows[0].id);
  const hashedToken = await bcrypt.hash(refreshToken, 10);

  const accessToken = await generatedAccessToken(email, user.rows[0].id); // 🔑 access token

  // ✅ Store the refresh token in Redis
  await redisClient.set(
    `refreshToken:${user.rows[0].id}`,
    hashedToken,
    { EX: 60 * 60 * 24 * 7 }
  );

  // ✅ store hashedToken in database
  await pool.query(
    'UPDATE users SET last_login = NOW(), refresh_token = $2 WHERE id = $1',
    [user.rows[0].id, hashedToken]
  );


  res.cookie('accessToken', accessToken, cookiesOption);
  res.cookie('refreshToken', refreshToken, refreshTokenOptions); // 🔑 raw token -> client

  // ส่ง response กลับ frontend
  return res.status(200).json({
    users: {
      id: user.rows[0].id,
      email: user.rows[0].email,
      role: user.rows[0].role,
      is_active: user.rows[0].is_active,
      is_verified: user.rows[0].is_verified,
      last_login: user.rows[0].last_login,
      created_at: user.rows[0].created_at
    },
    success: true,
    error: false,
  });
});

export const signout = asyncWrapper(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user || !user.id) {
    return next(createCustomError('User not authenticated', 401));
  }

  const userId = user?.id;

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  await redisClient.del(`refreshToken:${userId}`);

  await pool.query(
    'UPDATE users SET refresh_token = NULL WHERE id = $1',
    [userId]
  );

  return res.status(200).json({
    message: 'Sign out successful',
    success: true,
  });
});

export const refreshToken = asyncWrapper(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user || !user.id) {
    return next(createCustomError('User not authenticated', 401));
  }

  const userId = user.id;
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return next(createCustomError('Refresh token not found', 401));
  }

  const redisKey: string = `refreshToken:${userId.toString()}`;
  const hashedToken = await redisClient.get(redisKey);

  if (!hashedToken) {
    return next(createCustomError('Refresh token invalid or expired', 403));
  }

  const isValidToken = await bcrypt.compare(refreshToken, hashedToken);

  if (!isValidToken) {
    return next(createCustomError('Invalid refresh token', 403));
  }

  const newAccessToken = await generatedAccessToken(user.email, userId.toString());

  res.cookie('accessToken', newAccessToken, {
    maxAge: 1000 * 60 * 60, // 1 hour
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: 'none'
  });

  return res.status(200).json({
    accessToken: newAccessToken,
    message: 'Access token refreshed successfully',
    success: true,
  });
});