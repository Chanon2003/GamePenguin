// app.ts
import express from 'express';
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config(); // load default from main .env 

import pool from './config/db/db'; 
import errorHandlerMiddleware from './middleware/error-handler';
import userRouter from './routes/user.routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin:[process.env.ORIGIN || "http://localhost:3000"], 
  methods:["GET","POST","PUT","PATCH","DELETE"],
  credentials:true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(morgan('dev'))
app.use(helmet.frameguard({ action: 'deny' }));

//check ip user
app.use((req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log(`📡 IP เข้าใช้งาน: ${ip}`);
  next();
});

//Data base test Connect.
pool.connect()
  .then(() => {
    console.log('✅ Connected to PostgreSQL DB');
  })
  .catch((err) => {
    console.error('❌ DB connection error:', err);
  });

// ex.main route
app.use('/api/user',userRouter);

// use Error handler in middle ware
app.use(errorHandlerMiddleware)

//run sever
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
