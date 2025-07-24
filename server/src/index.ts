// app.ts
import express from 'express';
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import dotenv from 'dotenv';
dotenv.config(); // โหลดค่า default จาก .env หลัก

import pool from './config/db/db'; // <<-- เชื่อมต่อกับ db.ts
import errorHandlerMiddleware from './middleware/error-handler';
import userRouter from './routes/user.routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(morgan('dev'))
app.use(helmet.frameguard({ action: 'deny' }));

// ทดสอบเชื่อมต่อ DB
pool.connect()
  .then(() => {
    console.log('✅ Connected to PostgreSQL DB');
  })
  .catch((err) => {
    console.error('❌ DB connection error:', err);
  });

// ตัวอย่าง route
app.use('/api/users',userRouter);

app.use(errorHandlerMiddleware)

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
