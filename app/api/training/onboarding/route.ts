import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { query } from '@/lib/db'

// POST - Guardar datos de onboarding
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    if (!payload || payload.role !== 'agent') {
      return NextResponse.json({ error: 'Unauthorized. Agent access required.' }, { status: 403 })
    }

    const body = await request.json()
    const { formData } = body

    if (!formData) {
      return NextResponse.json({ error: 'Missing form data' }, { status: 400 })
    }

    console.log('[ONBOARDING] Saving data for user:', payload.userId)

    // Verificar si ya existe un registro
    const existingData = await query(
      'SELECT id FROM agent_onboarding_data WHERE user_id = $1',
      [payload.userId]
    )

    if (existingData.rows.length > 0) {
      // Actualizar registro existente
      await query(
        `UPDATE agent_onboarding_data SET
          expectations_employee_name = $1,
          expectations_signature_data = $2,
          expectations_signature_date = $3,
          
          full_name = $4,
          home_address_street = $5,
          home_city = $6,
          home_state = $7,
          home_zip = $8,
          home_phone = $9,
          cell_phone = $10,
          home_email = $11,
          
          w9_business_name = $12,
          w9_tax_classification = $13,
          w9_tax_id_type = $14,
          w9_ssn_ein = $15,
          w9_address = $16,
          w9_city_state_zip = $17,
          w9_signature_data = $18,
          w9_signature_date = $19,
          
          deposit_bank_name = $20,
          deposit_account_number = $21,
          deposit_routing_number = $22,
          deposit_account_type = $23,
          deposit_amount_type = $24,
          deposit_amount_value = $25,
          deposit_signature_data = $26,
          deposit_signature_date = $27,
          
          emergency_primary_name_last = $28,
          emergency_primary_name_first = $29,
          emergency_primary_relationship = $30,
          emergency_primary_phone_home = $31,
          emergency_primary_phone_cell = $32,
          emergency_primary_phone_work = $33,
          
          emergency_secondary_name_last = $34,
          emergency_secondary_name_first = $35,
          emergency_secondary_relationship = $36,
          emergency_secondary_phone_home = $37,
          emergency_secondary_phone_cell = $38,
          emergency_secondary_phone_work = $39,
          
          emergency_preferred_hospital = $40,
          emergency_insurance_company = $41,
          emergency_insurance_policy = $42,
          emergency_medical_comments = $43,
          emergency_signature_data = $44,
          emergency_signature_date = $45,
          
          updated_at = NOW()
        WHERE user_id = $46`,
        [
          formData.expectations_employee_name,
          formData.expectations_signature_data,
          formData.expectations_signature_date,
          
          formData.full_name,
          formData.home_address_street,
          formData.home_city,
          formData.home_state,
          formData.home_zip,
          formData.home_phone,
          formData.cell_phone,
          formData.home_email,
          
          formData.w9_business_name,
          formData.w9_tax_classification,
          formData.w9_tax_id_type,
          formData.w9_ssn_ein,
          formData.w9_address,
          formData.w9_city_state_zip,
          formData.w9_signature_data,
          formData.w9_signature_date,
          
          formData.deposit_bank_name,
          formData.deposit_account_number,
          formData.deposit_routing_number,
          formData.deposit_account_type,
          formData.deposit_amount_type,
          formData.deposit_amount_value,
          formData.deposit_signature_data,
          formData.deposit_signature_date,
          
          formData.emergency_primary_name_last,
          formData.emergency_primary_name_first,
          formData.emergency_primary_relationship,
          formData.emergency_primary_phone_home,
          formData.emergency_primary_phone_cell,
          formData.emergency_primary_phone_work,
          
          formData.emergency_secondary_name_last,
          formData.emergency_secondary_name_first,
          formData.emergency_secondary_relationship,
          formData.emergency_secondary_phone_home,
          formData.emergency_secondary_phone_cell,
          formData.emergency_secondary_phone_work,
          
          formData.emergency_preferred_hospital,
          formData.emergency_insurance_company,
          formData.emergency_insurance_policy,
          formData.emergency_medical_comments,
          formData.emergency_signature_data,
          formData.emergency_signature_date,
          
          payload.userId
        ]
      )
    } else {
      // Crear nuevo registro
      await query(
        `INSERT INTO agent_onboarding_data (
          user_id,
          expectations_employee_name,
          expectations_signature_data,
          expectations_signature_date,
          
          full_name,
          home_address_street,
          home_city,
          home_state,
          home_zip,
          home_phone,
          cell_phone,
          home_email,
          
          w9_business_name,
          w9_tax_classification,
          w9_tax_id_type,
          w9_ssn_ein,
          w9_address,
          w9_city_state_zip,
          w9_signature_data,
          w9_signature_date,
          
          deposit_bank_name,
          deposit_account_number,
          deposit_routing_number,
          deposit_account_type,
          deposit_amount_type,
          deposit_amount_value,
          deposit_signature_data,
          deposit_signature_date,
          
          emergency_primary_name_last,
          emergency_primary_name_first,
          emergency_primary_relationship,
          emergency_primary_phone_home,
          emergency_primary_phone_cell,
          emergency_primary_phone_work,
          
          emergency_secondary_name_last,
          emergency_secondary_name_first,
          emergency_secondary_relationship,
          emergency_secondary_phone_home,
          emergency_secondary_phone_cell,
          emergency_secondary_phone_work,
          
          emergency_preferred_hospital,
          emergency_insurance_company,
          emergency_insurance_policy,
          emergency_medical_comments,
          emergency_signature_data,
          emergency_signature_date
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
          $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
          $31, $32, $33, $34, $35, $36, $37, $38, $39, $40,
          $41, $42, $43, $44, $45, $46
        )`,
        [
          payload.userId,
          formData.expectations_employee_name,
          formData.expectations_signature_data,
          formData.expectations_signature_date,
          
          formData.full_name,
          formData.home_address_street,
          formData.home_city,
          formData.home_state,
          formData.home_zip,
          formData.home_phone,
          formData.cell_phone,
          formData.home_email,
          
          formData.w9_business_name,
          formData.w9_tax_classification,
          formData.w9_tax_id_type,
          formData.w9_ssn_ein,
          formData.w9_address,
          formData.w9_city_state_zip,
          formData.w9_signature_data,
          formData.w9_signature_date,
          
          formData.deposit_bank_name,
          formData.deposit_account_number,
          formData.deposit_routing_number,
          formData.deposit_account_type,
          formData.deposit_amount_type,
          formData.deposit_amount_value,
          formData.deposit_signature_data,
          formData.deposit_signature_date,
          
          formData.emergency_primary_name_last,
          formData.emergency_primary_name_first,
          formData.emergency_primary_relationship,
          formData.emergency_primary_phone_home,
          formData.emergency_primary_phone_cell,
          formData.emergency_primary_phone_work,
          
          formData.emergency_secondary_name_last,
          formData.emergency_secondary_name_first,
          formData.emergency_secondary_relationship,
          formData.emergency_secondary_phone_home,
          formData.emergency_secondary_phone_cell,
          formData.emergency_secondary_phone_work,
          
          formData.emergency_preferred_hospital,
          formData.emergency_insurance_company,
          formData.emergency_insurance_policy,
          formData.emergency_medical_comments,
          formData.emergency_signature_data,
          formData.emergency_signature_date
        ]
      )
    }

    // Marcar onboarding como completado en la tabla users
    await query(
      'UPDATE users SET onboarding_completed = TRUE WHERE id = $1',
      [payload.userId]
    )

    console.log('[ONBOARDING] ✅ Data saved successfully for user:', payload.userId)

    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully'
    })

  } catch (error) {
    console.error('[ONBOARDING] Error saving data:', error)
    return NextResponse.json({ error: 'Failed to save onboarding data' }, { status: 500 })
  }
}

// GET - Verificar si el usuario completó el onboarding
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Verificar si existe registro de onboarding
    const result = await query(
      'SELECT id, completed_at FROM agent_onboarding_data WHERE user_id = $1',
      [payload.userId]
    )

    const completed = result.rows.length > 0

    return NextResponse.json({
      completed,
      completedAt: completed ? result.rows[0].completed_at : null
    })

  } catch (error) {
    console.error('[ONBOARDING] Error checking status:', error)
    return NextResponse.json({ error: 'Failed to check onboarding status' }, { status: 500 })
  }
}