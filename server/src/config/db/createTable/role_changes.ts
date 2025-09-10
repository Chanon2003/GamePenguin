// createTable.ts
import pool from '../db';

const role_changes = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS role_changes (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,         
        old_role VARCHAR(50) NOT NULL,
        new_role VARCHAR(50) NOT NULL,
        changed_by INT,                
        changed_by_name VARCHAR(100), 
        changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
        CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_changed_by FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
      );
    `);
    console.log('✅ Users role_changes!');
  } catch (err) {
    console.error('❌ Error creatingrole_changes:', err);
  } finally {
    pool.end();
  }
};

role_changes();

//npx ts-node src/config/db/createTable/role_changes.ts


// 🔑 อธิบาย
// user_id → ผู้ใช้ที่ถูกเปลี่ยน role
// old_role / new_role → เก็บ role เดิมกับใหม่
// changed_by → id ของ admin ที่ทำการเปลี่ยน (FK ไปที่ users.id)
// changed_by_name → เก็บชื่อ admin ตอนนั้นไว้ snapshot (กันกรณี admin ถูกลบ)
// ON DELETE CASCADE สำหรับ user_id → ถ้าผู้ใช้โดนลบ audit log ก็ตามไปลบ (เพราะ user ไม่มีอยู่แล้ว)
// ON DELETE SET NULL สำหรับ changed_by → ถ้า admin ถูกลบ audit log ยังอยู่ แต่ changed_by จะกลายเป็น NULL (แต่คุณยังอ่านชื่อจาก changed_by_name ได้อยู่)