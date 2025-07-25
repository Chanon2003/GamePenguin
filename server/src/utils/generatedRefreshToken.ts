import pool from '../config/db/db'
import jwt from 'jsonwebtoken'

const JWT_REFRESH = process.env.REFRESH_KEY_ACCESS_TOKEN;
if (!JWT_REFRESH) {
  throw new Error('JWT_SECRET is not defined');
}

const generatedRefreshToken = async (userId:string) => {
  const token = jwt.sign({ id: userId }, JWT_REFRESH, { expiresIn: '7d' })

  const updateRefreshTokenUser = await pool.query(
    'UPDATE users SET refresh_token = $1 WHERE id = $2',
    [token, userId]
  );

  return token
}

export default generatedRefreshToken