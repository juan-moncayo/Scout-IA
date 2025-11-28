// lib/seed.ts
import { query } from './db'
import bcrypt from 'bcryptjs'

export async function seedDatabase() {
  try {
    console.log('[SEED] Starting Talent Scout AI database seeding...')

    // Verificar si ya existe un admin
    const existingAdmin = await query(
      "SELECT id FROM users WHERE role = 'admin' LIMIT 1"
    )

    if (existingAdmin.rows.length > 0) {
      console.log('[SEED] ⚠️  Admin user already exists, skipping seed')
      return
    }

    // Datos del admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@talentscout.ai'
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminScout2025!'
    const adminName = process.env.ADMIN_NAME || 'Admin Talent Scout'

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(adminPassword, 10)

    // Crear usuario admin
    await query(
      `INSERT INTO users (email, password_hash, full_name, role, is_active) 
       VALUES (?, ?, ?, 'admin', 1)`,
      [adminEmail, passwordHash, adminName]
    )

    console.log('[SEED] ✅ Admin user created successfully!')
    console.log(`[SEED] 📧 Email: ${adminEmail}`)
    console.log(`[SEED] 🔑 Password: ${adminPassword}`)
    console.log('[SEED] ⚠️  CHANGE THIS PASSWORD AFTER FIRST LOGIN!')

  } catch (error) {
    console.error('[SEED] ❌ Error seeding database:', error)
    throw error
  }
}