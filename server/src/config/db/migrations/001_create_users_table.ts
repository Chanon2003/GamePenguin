import pool from '../db';

const addUsernameColumn = async () => {
  try {
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS refresh_token VARCHAR(100);
    `);
    console.log('✅ Added refresh_token column to users table');
  } catch (err) {
    console.error('❌ Error adding username column:', err);
  } finally {
    pool.end();
  }
};

addUsernameColumn();

//npx ts-node src/config/db/migrations/001_create_users_table.ts
