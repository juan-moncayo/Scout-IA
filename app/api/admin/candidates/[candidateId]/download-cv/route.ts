import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { query } from '@/lib/db'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { candidateId: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No authorization token' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Verificar admin
    const userResult = await query('SELECT role FROM users WHERE id = ?', [payload.userId])
    if (userResult.rows.length === 0 || userResult.rows[0].role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const candidateId = parseInt(params.candidateId)

    if (isNaN(candidateId)) {
      return NextResponse.json({ error: 'Invalid candidate ID' }, { status: 400 })
    }

    console.log('[DOWNLOAD-CV] Fetching candidate:', candidateId)

    // Obtener candidato con cv_file_path
    const candidateResult = await query(
      'SELECT full_name, cv_file_path, resume_text FROM candidates WHERE id = ?',
      [candidateId]
    )

    if (candidateResult.rows.length === 0) {
      return NextResponse.json({ 
        error: 'Candidate not found',
        candidateId 
      }, { status: 404 })
    }

    const candidate = candidateResult.rows[0]

    // Si existe cv_file_path, intentar leer el archivo del disco
    if (candidate.cv_file_path) {
      try {
        const filePath = join(process.cwd(), 'public', candidate.cv_file_path)
        
        console.log('[DOWNLOAD-CV] Reading file from:', filePath)
        
        const fileBuffer = await readFile(filePath)
        
        // Determinar tipo MIME
        const extension = candidate.cv_file_path.split('.').pop()?.toLowerCase()
        let contentType = 'application/octet-stream'
        
        if (extension === 'pdf') {
          contentType = 'application/pdf'
        } else if (extension === 'doc') {
          contentType = 'application/msword'
        } else if (extension === 'docx') {
          contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        } else if (extension === 'txt') {
          contentType = 'text/plain'
        }

        const fileName = `CV_${candidate.full_name.replace(/\s+/g, '_')}.${extension}`

        console.log('[DOWNLOAD-CV] ✅ Sending file:', fileName)

        // Retornar archivo original
        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="${fileName}"`,
            'Content-Length': fileBuffer.length.toString(),
          },
        })
      } catch (fileError) {
        console.log('[DOWNLOAD-CV] ⚠️ File not found on disk, generating from resume_text')
      }
    }

    // Fallback: Generar archivo de texto desde resume_text
    if (!candidate.resume_text) {
      return NextResponse.json({ 
        error: 'No CV data available for this candidate',
        candidateId,
        message: 'This candidate does not have CV data stored'
      }, { status: 404 })
    }

    // Crear documento de texto simple con el CV
    const cvContent = `
CURRICULUM VITAE
================

Candidato: ${candidate.full_name}
Fecha de Generación: ${new Date().toLocaleDateString('es-ES')}

${candidate.resume_text}

---
Este documento fue generado automáticamente por Talent Scout AI
    `.trim()

    const fileName = `CV_${candidate.full_name.replace(/\s+/g, '_')}.txt`

    console.log('[DOWNLOAD-CV] ✅ Generating text file:', fileName)

    // Retornar como archivo de texto
    return new NextResponse(cvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': Buffer.byteLength(cvContent, 'utf8').toString(),
      },
    })

  } catch (error: any) {
    console.error('[DOWNLOAD-CV] ❌ Error:', error.message)
    return NextResponse.json(
      { error: error.message || 'Failed to download CV' },
      { status: 500 }
    )
  }
}