✅ README listo para copiar (pegar tal cual en GitHub)

Copia TODO desde aquí 👇

# 🚀 Scout IA  
Plataforma de reclutamiento inteligente con IA  
Desarrollado con Next.js, Turso, Google Cloud y Claude AI

---

## ✅ Pasos simples para correr el proyecto

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/juan-moncayo/Scout-IA.git
cd Scout-IA

2️⃣ Instalar dependencias

Requiere Node 18+

npm install

3️⃣ Crear archivo de entorno
cp .env.example .env.local


Completa tus claves (Turso, Anthropic, Google Cloud, Vercel Blob).
⚠️ El proyecto no funciona sin las variables.

4️⃣ Configurar Google Cloud (STT / TTS)

Necesitas:

GOOGLE_CLOUD_CREDENTIALS_BASE64=


Pasos:

Crea el proyecto en Google Cloud

Activa Speech-to-Text y Text-to-Speech

Crea un Service Account y descarga el JSON

Convierte el JSON a Base64:

cat credenciales.json | base64


Pégalo completo en .env.local

5️⃣ Inicializar Base de Datos (Turso)

Configurar:

DATABASE_URL=
TURSO_AUTH_TOKEN=


Ejecutar:

npm run db:setup


Si falla:

curl http://localhost:3000/api/db/setup?key=dev-setup-key-2025

6️⃣ Ejecutar el proyecto
npm run dev


Abrir:
👉 http://localhost:3000

7️⃣ Acceso admin por defecto
Email: admin@talentscout.ai
Password: AdminScout2025!

🧠 Stack Tecnológico
Frontend

Next.js 15

Tailwind CSS

Framer Motion

Recharts

Backend / Infra

Turso

Vercel Blob

JWT + bcryptjs

Nodemailer

IA

Claude Sonnet (Anthropic)

Google Cloud STT / TTS

Otros

Zod

TypeScript

📁 Estructura del Proyecto (simplificada)
/app
  /api
  /auth
  /admin
  /candidates
  /training
/components
  /ui
  /training
/contexts
/lib
  /ai
  db.ts
/public

📦 Scripts útiles

Producción:

npm run build
npm start


Reset DB:

npm run db:setup
