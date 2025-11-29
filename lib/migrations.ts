// lib/migrations.ts
import { getClient } from './db'

export async function runMigrations() {
  const db = getClient()

  try {
    console.log('[MIGRATIONS] Starting Talent Scout AI database migrations...')

    // 1. Tabla de usuarios (admin y reclutadores)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'recruiter',
        created_at TEXT DEFAULT (datetime('now')),
        last_login TEXT,
        is_active INTEGER DEFAULT 1,
        onboarding_completed INTEGER DEFAULT 0,
        CHECK (role IN ('admin', 'agent'))
      )
    `)
    console.log('[MIGRATIONS] ✅ Table "users" created')

    // 2. Tabla de vacantes de trabajo (job postings)
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

    // 3. 🔥 MIGRACIÓN INTELIGENTE DE CANDIDATES
    console.log('[MIGRATIONS] 🔄 Checking candidates table...')
    
    // Verificar si la tabla existe
    const tableExists = await db.execute(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='candidates'
    `)
    
    if (tableExists.rows.length > 0) {
      console.log('[MIGRATIONS] ⚠️  Old candidates table found, migrating...')
      
      // Verificar columnas existentes
      const columnsResult = await db.execute(`PRAGMA table_info(candidates)`)
      const columns = columnsResult.rows.map((row: any) => row.name)
      
      // 🔥 AGREGAR COLUMNAS FALTANTES UNA POR UNA
      if (!columns.includes('fit_score')) {
        console.log('[MIGRATIONS] 🔄 Adding fit_score column...')
        await db.execute(`ALTER TABLE candidates ADD COLUMN fit_score INTEGER DEFAULT 0`)
      }
      
      if (!columns.includes('ai_evaluation')) {
        console.log('[MIGRATIONS] 🔄 Adding ai_evaluation column...')
        await db.execute(`ALTER TABLE candidates ADD COLUMN ai_evaluation TEXT`)
      }
      
      if (!columns.includes('evaluated_at')) {
        console.log('[MIGRATIONS] 🔄 Adding evaluated_at column...')
        await db.execute(`ALTER TABLE candidates ADD COLUMN evaluated_at TEXT`)
      }
      
      if (!columns.includes('resume_text')) {
        console.log('[MIGRATIONS] 🔄 Adding resume_text column...')
        await db.execute(`ALTER TABLE candidates ADD COLUMN resume_text TEXT`)
      }
      
      // 🔥 CRUCIAL: Agregar cv_file_path si no existe
      if (!columns.includes('cv_file_path')) {
        console.log('[MIGRATIONS] 🔄 Adding cv_file_path column...')
        await db.execute(`ALTER TABLE candidates ADD COLUMN cv_file_path TEXT`)
      }
      
      // Agregar best_match si no existe
      if (!columns.includes('best_match')) {
        console.log('[MIGRATIONS] 🔄 Adding best_match column...')
        await db.execute(`ALTER TABLE candidates ADD COLUMN best_match TEXT`)
      }
      
      // Agregar match_percentages si no existe
      if (!columns.includes('match_percentages')) {
        console.log('[MIGRATIONS] 🔄 Adding match_percentages column...')
        await db.execute(`ALTER TABLE candidates ADD COLUMN match_percentages TEXT`)
      }
      
      // Si hay columnas viejas que necesitamos eliminar, recrear la tabla
      if (columns.includes('job_posting_id') || columns.includes('resume_url')) {
        console.log('[MIGRATIONS] 🔄 Recreating candidates table with new schema...')
        
        // Crear tabla temporal con el esquema correcto
        await db.execute(`
          CREATE TABLE candidates_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            cv_file_path TEXT,
            resume_text TEXT NOT NULL,
            cover_letter TEXT,
            ai_evaluation TEXT,
            fit_score INTEGER DEFAULT 0,
            best_match TEXT,
            match_percentages TEXT,
            status TEXT DEFAULT 'pending',
            applied_at TEXT DEFAULT (datetime('now')),
            evaluated_at TEXT,
            CHECK (status IN ('pending', 'approved', 'rejected')),
            CHECK (fit_score BETWEEN 0 AND 100)
          )
        `)
        
        // Copiar datos existentes (mapeando columnas viejas a nuevas)
        await db.execute(`
          INSERT INTO candidates_new (
            id, full_name, email, phone, cover_letter, 
            resume_text, ai_evaluation, fit_score, best_match, 
            match_percentages, status, applied_at, evaluated_at
          )
          SELECT 
            id, full_name, email, phone, cover_letter,
            COALESCE(resume_text, ''), ai_evaluation, 
            COALESCE(fit_score, 0), best_match, match_percentages,
            status, applied_at, evaluated_at
          FROM candidates
        `).catch((err) => {
          console.log('[MIGRATIONS] ℹ️  Partial data migration:', err.message)
        })
        
        // Eliminar tabla vieja y renombrar
        await db.execute(`DROP TABLE candidates`)
        await db.execute(`ALTER TABLE candidates_new RENAME TO candidates`)
        
        console.log('[MIGRATIONS] ✅ Candidates table recreated successfully')
      } else {
        console.log('[MIGRATIONS] ✅ Candidates table updated successfully')
      }
      
    } else {
      // Crear tabla nueva desde cero con TODAS las columnas
      console.log('[MIGRATIONS] 🔄 Creating new candidates table...')
      await db.execute(`
        CREATE TABLE candidates (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          full_name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          cv_file_path TEXT,
          resume_text TEXT NOT NULL,
          cover_letter TEXT,
          ai_evaluation TEXT,
          fit_score INTEGER DEFAULT 0,
          best_match TEXT,
          match_percentages TEXT,
          status TEXT DEFAULT 'pending',
          applied_at TEXT DEFAULT (datetime('now')),
          evaluated_at TEXT,
          CHECK (status IN ('pending', 'approved', 'rejected')),
          CHECK (fit_score BETWEEN 0 AND 100)
        )
      `)
      console.log('[MIGRATIONS] ✅ New candidates table created')
    }

    // 3.5. 🔥 VERIFICACIÓN FINAL: Asegurar que todas las columnas críticas existen
    const finalColumns = await db.execute(`PRAGMA table_info(candidates)`)
    const finalColumnNames = finalColumns.rows.map((row: any) => row.name)
    
    const requiredColumns = ['cv_file_path', 'best_match', 'match_percentages']
    for (const col of requiredColumns) {
      if (!finalColumnNames.includes(col)) {
        console.log(`[MIGRATIONS] ⚠️  ${col} missing, adding now...`)
        await db.execute(`ALTER TABLE candidates ADD COLUMN ${col} TEXT`)
        console.log(`[MIGRATIONS] ✅ ${col} column added`)
      } else {
        console.log(`[MIGRATIONS] ✅ ${col} column confirmed present`)
      }
    }

    // 4. Tabla de sesiones de examen de voz
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
        passed INTEGER DEFAULT 0,
        CHECK (confidence_score IS NULL OR (confidence_score BETWEEN 0 AND 100)),
        CHECK (clarity_score IS NULL OR (clarity_score BETWEEN 0 AND 100)),
        CHECK (professionalism_score IS NULL OR (professionalism_score BETWEEN 0 AND 100)),
        CHECK (trust_building_score IS NULL OR (trust_building_score BETWEEN 0 AND 100)),
        CHECK (overall_score IS NULL OR (overall_score BETWEEN 0 AND 100)),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)
    console.log('[MIGRATIONS] ✅ Table "voice_exam_sessions" created')

    // 5. 🆕 TABLA DE KNOWLEDGE BASE PARA RAG
    console.log('[MIGRATIONS] 🔄 Creating knowledge_base table...')
    await db.execute(`
      CREATE TABLE IF NOT EXISTS knowledge_base (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        keywords TEXT NOT NULL,
        metadata TEXT,
        embedding TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        created_by INTEGER,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `)
    console.log('[MIGRATIONS] ✅ Table "knowledge_base" created')

    // 6. Crear índices para mejor performance
    await db.execute('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)')
    await db.execute('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)')
    await db.execute('CREATE INDEX IF NOT EXISTS idx_job_postings_active ON job_postings(is_active)')
    await db.execute('CREATE INDEX IF NOT EXISTS idx_candidates_status ON candidates(status)')
    await db.execute('CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email)')
    await db.execute('CREATE INDEX IF NOT EXISTS idx_candidates_fit_score ON candidates(fit_score)')
    await db.execute('CREATE INDEX IF NOT EXISTS idx_voice_exam_user ON voice_exam_sessions(user_id)')
    await db.execute('CREATE INDEX IF NOT EXISTS idx_voice_exam_passed ON voice_exam_sessions(passed)')
    
    // 🆕 Índices para knowledge_base
    await db.execute('CREATE INDEX IF NOT EXISTS idx_knowledge_category ON knowledge_base(category)')
    await db.execute('CREATE INDEX IF NOT EXISTS idx_knowledge_active ON knowledge_base(is_active)')
    await db.execute('CREATE INDEX IF NOT EXISTS idx_knowledge_keywords ON knowledge_base(keywords)')
    
    console.log('[MIGRATIONS] ✅ Indexes created')

    console.log('[MIGRATIONS] ✅ Talent Scout AI database ready!')
    console.log('[MIGRATIONS] 📊 Tables: users, job_postings, candidates, voice_exam_sessions, knowledge_base')

  } catch (error) {
    console.error('[MIGRATIONS] ❌ Error:', error)
    throw error
  }
}