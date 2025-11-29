// lib/virustotal.ts

interface VirusTotalScanResult {
  isSafe: boolean
  scanId?: string
  detections: number
  totalScans: number
  permalink?: string
  error?: string
}

export async function scanFileWithVirusTotal(
  fileBuffer: Buffer,
  fileName: string
): Promise<VirusTotalScanResult> {
  const apiKey = process.env.VIRUSTOTAL_API_KEY

  if (!apiKey) {
    console.warn('⚠️ VirusTotal API key not configured')
    return {
      isSafe: true, // En desarrollo sin API key, permitir subida
      detections: 0,
      totalScans: 0,
      error: 'API key not configured'
    }
  }

  try {
    // 1. Subir archivo para escaneo usando fetch con FormData nativo
    const formData = new FormData()
    
    // Crear un Blob compatible con Node.js usando File API
    const file = new File([fileBuffer], fileName, {
      type: 'application/octet-stream'
    })
    
    formData.append('file', file)

    console.log(`🔍 Uploading file to VirusTotal: ${fileName} (${fileBuffer.length} bytes)`)

    const uploadResponse = await fetch('https://www.virustotal.com/api/v3/files', {
      method: 'POST',
      headers: {
        'x-apikey': apiKey
      },
      body: formData
    })

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error(`❌ VirusTotal upload failed: ${uploadResponse.status}`, errorText)
      throw new Error(`Upload failed: ${uploadResponse.status}`)
    }

    const uploadData = await uploadResponse.json()
    const scanId = uploadData.data.id

    console.log(`✅ File uploaded to VirusTotal. Scan ID: ${scanId}`)

    // 2. Esperar 5 segundos para que VirusTotal procese el archivo
    console.log('⏳ Waiting 5 seconds for VirusTotal to process...')
    await new Promise(resolve => setTimeout(resolve, 5000))

    // 3. Obtener resultados del análisis
    console.log('📊 Fetching analysis results...')
    const analysisResponse = await fetch(
      `https://www.virustotal.com/api/v3/analyses/${scanId}`,
      {
        headers: {
          'x-apikey': apiKey
        }
      }
    )

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text()
      console.error(`❌ VirusTotal analysis failed: ${analysisResponse.status}`, errorText)
      throw new Error(`Analysis failed: ${analysisResponse.status}`)
    }

    const analysisData = await analysisResponse.json()
    const stats = analysisData.data.attributes.stats

    const detections = (stats.malicious || 0) + (stats.suspicious || 0)
    const totalScans = Object.values(stats).reduce((a: number, b: any) => a + (Number(b) || 0), 0)

    const result = {
      isSafe: detections === 0,
      scanId,
      detections,
      totalScans,
      permalink: `https://www.virustotal.com/gui/file-analysis/${scanId}`
    }

    console.log(`✅ VirusTotal scan complete:`)
    console.log(`   - Safe: ${result.isSafe ? '✅ YES' : '⛔ NO'}`)
    console.log(`   - Detections: ${detections}/${totalScans}`)
    console.log(`   - Report: ${result.permalink}`)

    return result

  } catch (error: any) {
    console.error('❌ VirusTotal scan error:', error)
    console.error('Error details:', error.message)
    
    // En caso de error, retornar como NO SEGURO por precaución
    return {
      isSafe: false,
      detections: 0,
      totalScans: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Validar que el archivo sea un PDF válido
export function validatePDFFile(buffer: Buffer): boolean {
  // Los archivos PDF comienzan con "%PDF"
  const pdfSignature = Buffer.from([0x25, 0x50, 0x44, 0x46]) // %PDF
  return buffer.slice(0, 4).equals(pdfSignature)
}

// Validar que el archivo sea un DOCX válido
export function validateDOCXFile(buffer: Buffer): boolean {
  // Los archivos DOCX son ZIP que comienzan con "PK"
  const zipSignature = Buffer.from([0x50, 0x4B]) // PK
  return buffer.slice(0, 2).equals(zipSignature)
}

// Validar que el archivo sea un DOC válido
export function validateDOCFile(buffer: Buffer): boolean {
  // Los archivos DOC comienzan con 0xD0CF11E0
  const docSignature = Buffer.from([0xD0, 0xCF, 0x11, 0xE0])
  return buffer.slice(0, 4).equals(docSignature)
}

// Validar formato del archivo según tipo
export function validateFileFormat(buffer: Buffer, fileType: string): boolean {
  if (fileType === 'application/pdf') {
    return validatePDFFile(buffer)
  } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return validateDOCXFile(buffer)
  } else if (fileType === 'application/msword') {
    return validateDOCFile(buffer)
  } else if (fileType === 'text/plain') {
    // TXT files - basic check
    return buffer.length > 0
  }
  return false
}

// Validar tamaño del archivo (máximo 10MB por defecto)
export function validateFileSize(buffer: Buffer, maxSizeMB: number = 5): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return buffer.length <= maxSizeBytes
}