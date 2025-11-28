import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { query } from '@/lib/db'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ candidateId: string }> }
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

    // ⭐ AWAIT params antes de usar
    const { candidateId: candidateIdStr } = await params
    const candidateId = parseInt(candidateIdStr)

    // Obtener candidato
    const candidateResult = await query(
      'SELECT full_name, cv_file_path FROM candidates WHERE id = ?',
      [candidateId]
    )

    if (candidateResult.rows.length === 0) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
    }

    const candidate = candidateResult.rows[0]

    if (!candidate.cv_file_path) {
      return NextResponse.json({ error: 'CV file not found' }, { status: 404 })
    }

    // Leer archivo del disco
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

    // Nombre de archivo para descarga
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

  } catch (error: any) {
    console.error('[DOWNLOAD-CV] ❌ Error:', error.message)
    return NextResponse.json(
      { error: error.message || 'Failed to download CV' },
      { status: 500 }
    )
  }
}