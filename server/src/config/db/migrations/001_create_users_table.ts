import pool from '../db';

const addUsernameColumn = async () => {
  try {
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(100);
    `);
    console.log('✅ Added username column to users table');
  } catch (err) {
    console.error('❌ Error adding username column:', err);
  } finally {
    pool.end();
  }
};

addUsernameColumn();

//npx ts-node src/config/db/migrations/002_add_username_to_users.ts
