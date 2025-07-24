import { createCustomError } from "../errors/custom-error";
import asyncWrapper from "../middleware/asyncWrapper";
import { Request, Response, NextFunction } from "express";
import pool from '../config/db/db';
import bcrypt from 'bcrypt';

export const signupEmail = asyncWrapper(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { email, password }: { email?: string; password?: string } = req.body;

  if (!email || !password) {
    return next(createCustomError('Email and Password are required', 400));
  }

  email = email.toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(createCustomError('Invalid email format', 400));
  }

  if (password.length < 8) {
    return next(createCustomError('Password must be at least 8 characters long', 400));
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
