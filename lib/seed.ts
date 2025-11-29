// lib/seed.ts
import { query } from './db'
import bcrypt from 'bcryptjs'
import { recruitmentKnowledge } from './ai/knowledge-base'

export async function seedDatabase() {
  try {
    console.log('[SEED] Starting Talent Scout AI database seeding...')

    // Verificar si ya existe un admin
    const existingAdmin = await query(
      "SELECT id FROM users WHERE role = 'admin' LIMIT 1"
    )

    if (existingAdmin.rows.length > 0) {
      console.log('[SEED] ⚠️  Admin user already exists, skipping admin creation')
    } else {
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
    }

    // 🆕 SEED DE KNOWLEDGE BASE
    const existingKnowledge = await query(
      "SELECT COUNT(*) as count FROM knowledge_base"
    )

    // 🔥 FIX: Asegurar que count es un número
    const knowledgeCount = Number(existingKnowledge.rows[0]?.count) || 0

    if (knowledgeCount > 0) {
      console.log(`[SEED] ⚠️  Knowledge base already has ${knowledgeCount} entries, skipping seed`)
    } else {
      console.log('[SEED] 🔄 Seeding knowledge base with initial data...')
      
      let seedCount = 0
      for (const item of recruitmentKnowledge) {
        await query(
          `INSERT INTO knowledge_base (
            category, 
            question, 
            answer, 
            keywords, 
            metadata,
            is_active
          ) VALUES (?, ?, ?, ?, ?, 1)`,
          [
            item.category,
            item.question,
            item.answer,
            JSON.stringify(item.keywords),
            JSON.stringify({ phase: item.phase })
          ]
        )
        seedCount++
      }

      console.log(`[SEED] ✅ Knowledge base seeded with ${seedCount} entries!`)
    }

  } catch (error) {
    console.error('[SEED] ❌ Error seeding database:', error)
    throw error
  }
}