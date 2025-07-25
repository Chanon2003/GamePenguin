import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config({ path: '.env.token' });

const JWT_SECRET = process.env.SECRET_KEY_ACCESS_TOKEN;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

const generatedAccessToken = async(email: string, userId: string) => {
  const payload = {
    email,
    id:userId,
    timestamp: Date.now() // ✅ เพิ่มตัวแปรที่ไม่ซ้ำ
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export default generatedAccessToken