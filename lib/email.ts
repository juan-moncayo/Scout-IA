// lib/email.ts
import nodemailer from 'nodemailer'

// Configurar transporter (usando Gmail como ejemplo)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // App password si usas Gmail con 2FA
  },
})

// Verificar configuración
transporter.verify((error, success) => {
  if (error) {
    console.error('[EMAIL] Configuration error:', error)
  } else {
    console.log('[EMAIL] Server ready to send emails')
  }
})

export interface WelcomeEmailData {
  to: string
  fullName: string
  email: string
  tempPassword: string
  loginUrl: string
}

export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
  try {
    const mailOptions = {
      from: `"Scout AI" <${process.env.EMAIL_USER}>`,
      to: data.to,
      subject: '🎉 ¡Bienvenido a Scout AI! - Credenciales de Acceso',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #000000 0%, #7f1d1d 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                background: #f9f9f9;
                padding: 30px;
                border: 1px solid #ddd;
              }
              .credentials-box {
                background: white;
                border: 2px solid #dc2626;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
              }
              .credential-item {
                margin: 15px 0;
                padding: 10px;
                background: #f3f4f6;
                border-radius: 5px;
              }
              .credential-label {
                font-weight: bold;
                color: #7f1d1d;
                display: block;
                margin-bottom: 5px;
              }
              .credential-value {
                font-size: 16px;
                color: #000;
                font-family: 'Courier New', monospace;
              }
              .button {
                display: inline-block;
                background: #dc2626;
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 20px 0;
              }
              .button:hover {
                background: #b91c1c;
              }
              .warning {
                background: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 15px;
                margin: 20px 0;
              }
              .footer {
                background: #1f2937;
                color: #9ca3af;
                padding: 20px;
                text-align: center;
                border-radius: 0 0 10px 10px;
                font-size: 14px;
              }
              .steps {
                background: #e0f2fe;
                border-left: 4px solid #0284c7;
                padding: 15px;
                margin: 20px 0;
              }
              .steps ol {
                margin: 10px 0;
                padding-left: 20px;
              }
              .steps li {
                margin: 8px 0;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🎉 ¡Felicitaciones!</h1>
              <p>Has sido aprobado para formar parte de Talent Scout AI</p>
            </div>
            
            <div class="content">
              <h2>Hola ${data.fullName},</h2>
              
              <p>Nos complace informarte que tu aplicación ha sido <strong>aprobada exitosamente</strong>. ¡Bienvenido al equipo de Talent Scout AI!</p>
              
              <div class="credentials-box">
                <h3 style="color: #dc2626; margin-top: 0;">🔐 Tus Credenciales de Acceso</h3>
                
                <div class="credential-item">
                  <span class="credential-label">📧 Email:</span>
                  <span class="credential-value">${data.email}</span>
                </div>
                
                <div class="credential-item">
                  <span class="credential-label">🔑 Contraseña Temporal:</span>
                  <span class="credential-value">${data.tempPassword}</span>
                </div>
              </div>
              
              <div class="warning">
                <strong>⚠️ Importante:</strong> Esta es una contraseña temporal. Por seguridad, te recomendamos cambiarla después de tu primer inicio de sesión.
              </div>
              
              <div class="steps">
                <h3 style="color: #0284c7; margin-top: 0;">📋 Próximos Pasos:</h3>
                <ol>
                  <li>Haz clic en el botón de abajo para acceder a la plataforma</li>
                  <li>Inicia sesión con tus credenciales</li>
                  <li>Completa tu perfil y el proceso de onboarding</li>
                  <li>Realiza el examen de voz para activar tu cuenta completamente</li>
                </ol>
              </div>
              
              <center>
                <a href="${data.loginUrl}" class="button">
                  🚀 Acceder a la Plataforma
                </a>
              </center>
              
              <p style="margin-top: 30px;">Si tienes alguna pregunta o problema para acceder, no dudes en contactarnos respondiendo a este correo.</p>
              
              <p>¡Estamos emocionados de tenerte en el equipo!</p>
              
              <p style="margin-top: 30px;">
                Saludos cordiales,<br>
                <strong>El equipo de Talent Scout AI</strong>
              </p>
            </div>
            
            <div class="footer">
              <p>Este es un correo automático, por favor no respondas directamente.</p>
              <p>© ${new Date().getFullYear()} Talent Scout AI. Todos los derechos reservados.</p>
              <p style="margin-top: 10px; font-size: 12px;">
                Si no solicitaste acceso a Talent Scout AI, por favor ignora este mensaje.
              </p>
            </div>
          </body>
        </html>
      `,
      text: `
¡Felicitaciones ${data.fullName}!

Has sido aprobado para formar parte de Talent Scout AI.

CREDENCIALES DE ACCESO:
========================
Email: ${data.email}
Contraseña Temporal: ${data.tempPassword}

IMPORTANTE: Esta es una contraseña temporal. Cámbiala después de tu primer inicio de sesión.

PRÓXIMOS PASOS:
1. Accede a: ${data.loginUrl}
2. Inicia sesión con tus credenciales
3. Completa tu perfil y el proceso de onboarding
4. Realiza el examen de voz para activar tu cuenta

¡Bienvenido al equipo!

El equipo de Talent Scout AI
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('[EMAIL] ✅ Email sent successfully:', info.messageId)
    console.log('[EMAIL] Preview URL:', nodemailer.getTestMessageUrl(info))
    return true

  } catch (error) {
    console.error('[EMAIL] ❌ Error sending email:', error)
    return false
  }
}

// Función auxiliar para verificar si el email está configurado
export function isEmailConfigured(): boolean {
  return !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD)
}