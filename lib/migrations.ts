// lib/migrations.ts
import { getClient } from './db'

export async function runMigrations() {
  const db = getClient()

  try {
    console.log('[MIGRATIONS] Starting Talent Scout AI database migrations...')

    // 1. Tabla de usuarios
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'agent',
        created_at TEXT DEFAULT (datetime('now')),
        last_login TEXT,
        is_active INTEGER DEFAULT 1,
        onboarding_completed INTEGER DEFAULT 0,
        CHECK (role IN ('admin', 'agent'))
      )
    `)
    console.log('[MIGRATIONS] ✅ Table "users" created')

    // 2. Tabla de progreso de entrenamiento
    await db.execute(`
      CREATE TABLE IF NOT EXISTS training_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        phase_number INTEGER NOT NULL,
        module_name TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        completed_at TEXT,
        notes TEXT,
        CHECK (phase_number BETWEEN 1 AND 5),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)
    console.log('[MIGRATIONS] ✅ Table "training_progress" created')

    // 3. Tabla de sesiones de examen de voz
    await db.execute(`
      CREATE TABLE IF NOT EXISTS voice_exam_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        exam_date TEXT DEFAULT (datetime('now')),
        confidence_score INTEGER,
        clarity_score INTEGER,
        professionalism_score INTEGER,
        trust_building_score INTEGER,
        overall_score INTEGER,
        transcript TEXT,
        ai_feedback TEXT,
        passed INTEGER,
        CHECK (confidence_score IS NULL OR (confidence_score BETWEEN 0 AND 100)),
        CHECK (clarity_score IS NULL OR (clarity_score BETWEEN 0 AND 100)),
        CHECK (professionalism_score IS NULL OR (professionalism_score BETWEEN 0 AND 100)),
        CHECK (trust_building_score IS NULL OR (trust_building_score BETWEEN 0 AND 100)),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)
    console.log('[MIGRATIONS] ✅ Table "voice_exam_sessions" created')

    // 4. Tabla de configuración de avatar IA
    await db.execute(`
      CREATE TABLE IF NOT EXISTS ai_avatar_config (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        avatar_image_url TEXT NOT NULL,
        did_presenter_id TEXT,
        avatar_name TEXT DEFAULT 'Scout AI Assistant',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        is_active INTEGER DEFAULT 1
      )
    `)
    console.log('[MIGRATIONS] ✅ Table "ai_avatar_config" created')

    // 5. Tabla de datos de onboarding (mantener por compatibilidad)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS agent_onboarding_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE NOT NULL,
        
        full_name TEXT NOT NULL,
        home_address_street TEXT,
        home_city TEXT,
        home_state TEXT,
        home_zip TEXT,
        home_phone TEXT,
        cell_phone TEXT,
        home_email TEXT,
        
        w9_business_name TEXT,
        w9_tax_classification TEXT,
        w9_tax_id_type TEXT,
        w9_ssn_ein TEXT,
        w9_address TEXT,
        w9_city_state_zip TEXT,
        w9_signature_data TEXT,
        w9_signature_date TEXT,
        
        deposit_bank_name TEXT,
        deposit_account_number TEXT,
        deposit_routing_number TEXT,
        deposit_account_type TEXT,
        deposit_amount_type TEXT,
        deposit_amount_value TEXT,
        deposit_signature_data TEXT,
        deposit_signature_date TEXT,
        
        emergency_primary_name_last TEXT,
        emergency_primary_name_first TEXT,
        emergency_primary_relationship TEXT,
        emergency_primary_phone_home TEXT,
        emergency_primary_phone_cell TEXT,
        emergency_primary_phone_work TEXT,
        
        emergency_secondary_name_last TEXT,
        emergency_secondary_name_first TEXT,
        emergency_secondary_relationship TEXT,
        emergency_secondary_phone_home TEXT,
        emergency_secondary_phone_cell TEXT,
        emergency_secondary_phone_work TEXT,
        
        emergency_preferred_hospital TEXT,
        emergency_insurance_company TEXT,
        emergency_insurance_policy TEXT,
        emergency_medical_comments TEXT,
        emergency_signature_data TEXT,
        emergency_signature_date TEXT,
        
        expectations_employee_name TEXT,
        expectations_signature_data TEXT,
        expectations_signature_date TEXT,
        
        completed_at TEXT DEFAULT (datetime('now')),
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)
    console.log('[MIGRATIONS] ✅ Table "agent_onboarding_data" created')

    // 6. Tabla de vacantes de trabajo (job postings)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS job_postings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        department TEXT NOT NULL,
        location TEXT NOT NULL,
        employment_type TEXT DEFAULT 'Full-time',
        salary_range TEXT,
        description TEXT NOT NULL,
        requirements TEXT NOT NULL,
        responsibilities TEXT,
        interview_guidelines TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        is_active INTEGER DEFAULT 1
      )
    `)
    console.log('[MIGRATIONS] ✅ Table "job_postings" created')

    // 7. Tabla de candidatos
    await db.execute(`
      CREATE TABLE IF NOT EXISTS candidates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_posting_id INTEGER NOT NULL,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        resume_url TEXT,
        cover_letter TEXT,
        interview_score INTEGER,
        interview_feedback TEXT,
        status TEXT DEFAULT 'pending',
        applied_at TEXT DEFAULT (datetime('now')),
        CHECK (status IN ('pending', 'interviewed', 'accepted', 'rejected')),
        FOREIGN KEY (job_posting_id) REFERENCES job_postings(id) ON DELETE CASCADE
      )
    `)
    console.log('[MIGRATIONS] ✅ Table "candidates" created')

    // 8. Crear índices para mejor performance
    await db.execute('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)')
    await db.execute('CREATE INDEX IF NOT EXISTS idx_users_onboarding ON users(onboarding_completed)')
    await db.execute('CREATE INDEX IF NOT EXISTS idx_training_progress_user ON training_progress(user_id)')
    await db.execute('CREATE INDEX IF NOT EXISTS idx_voice_exam_user ON voice_exam_sessions(user_id)')
    await db.execute('CREATE INDEX IF NOT EXISTS idx_onboarding_user ON agent_onboarding_data(user_id)')
    await db.execute('CREATE INDEX IF NOT EXISTS idx_job_postings_active ON job_postings(is_active)')
    await db.execute('CREATE INDEX IF NOT EXISTS idx_candidates_job ON candidates(job_posting_id)')
    await db.execute('CREATE INDEX IF NOT EXISTS idx_candidates_status ON candidates(status)')
    console.log('[MIGRATIONS] ✅ Indexes created')

    console.log('[MIGRATIONS] ✅ Talent Scout AI database ready!')

  } catch (error) {
    console.error('[MIGRATIONS] ❌ Error:', error)
    throw error
  }
}