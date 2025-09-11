import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config(); // load default .env

import pool from './config/db/db';
import errorHandlerMiddleware from './middleware/error-handler';
import userRouter from './routes/user.routes';

const app = express();

// middleware
app.use(cors({
  origin: [process.env.ORIGIN || 'http://localhost:3000'],
  methods: ['GET','POST','PUT','PATCH','DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet.frameguard({ action: 'deny' }));

// log IP
app.use((req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log(`📡 IP เข้าใช้งาน: ${ip}`);
  next();
});

// DB connect
export const connectDB = async () => {
  try {
    await pool.connect();
    console.log('✅ Connected to PostgreSQL DB');
  } catch (err) {
    console.error('❌ DB connection error:', err);
    throw err;
  }
};
// routes
app.use('/api/user', userRouter);

// error handler
app.use(errorHandlerMiddleware);

export default app; // ✅ export app object
