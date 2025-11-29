// app/api/send-email/route.ts
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const name = formData.get("name")?.toString() || ""
    const email = formData.get("email")?.toString() || ""
    const phone = formData.get("phone")?.toString() || ""
    const company = formData.get("company")?.toString() || ""
    const details = formData.get("details")?.toString() || ""

    const attachments: { filename: string; content: Buffer }[] = []

    // Usar for...of para poder await
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("attachment_") && value instanceof File) {
        attachments.push({
          filename: value.name,
          content: Buffer.from(await value.arrayBuffer()),
        })
      }
    }

    const transporter = nodemailer.createTransport({
      service: "gmail", // o tu proveedor
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `Nuevo mensaje de contacto - ${company}`,
      text: `
Nombre: ${name}
Email: ${email}
Teléfono: ${phone}
Empresa: ${company}

Mensaje:
${details}
      `,
      attachments,
    })

    return NextResponse.json({ success: true, message: "Correo enviado correctamente" })
  } catch (error) {
    console.error("Error enviando correo:", error)
    return NextResponse.json({ success: false, message: "Error enviando correo", error }, { status: 500 })
  }
}
