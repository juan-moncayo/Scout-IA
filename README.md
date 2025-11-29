# 🚀 Scout IA  
Plataforma de reclutamiento inteligente con IA  
Desarrollado con Next.js, Turso, Google Cloud y Claude AI

🌐 **Demo desplegada:**  
https://scout-ia-lemon.vercel.app

---

# 📘 Descripción General

Scout IA es una plataforma moderna que combina análisis inteligente de CVs, entrevistas por voz, dashboards administrativos y entrenamiento para reclutadores.  
Todo impulsado con IA (Claude + Google Cloud).

#Documentación Completa

Toda la documentación técnica detallada del proyecto (arquitectura, diagramas, explicación interna) está disponible aquí:

➡️ Documento oficial (Google Docs):
https://docs.google.com/document/d/1AaLXc4W7dBkWBW8Ldlh1sLZUeq4cg6OY/edit?usp=sharing

---

# ✅ Pasos simples para correr el proyecto

## 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/juan-moncayo/Scout-IA.git
cd Scout-IA
2️⃣ Instalar dependencias
Requiere Node 18+:

bash
Copiar código
npm install
3️⃣ Crear archivo de entorno
bash
Copiar código
cp .env.example .env.local
Completa tus claves (Turso, Anthropic, Google Cloud, Vercel Blob).
⚠️ El proyecto no funciona sin las variables.

🎤 4️⃣ Google Cloud STT / TTS (Speech)
El proyecto usa:

GOOGLE_CLOUD_CREDENTIALS_BASE64=
Pasos:

Crear proyecto en Google Cloud

Activar Speech-to-Text y Text-to-Speech

Crear Service Account → descargar JSON

Convertir JSON a Base64:

bash
Copiar código
cat credenciales.json | base64
Pegar el Base64 en .env.local

🗄 5️⃣ Inicializar Base de Datos (Turso)
Configurar:

DATABASE_URL=
TURSO_AUTH_TOKEN=
Ejecutar migraciones:

bash
Copiar código
npm run db:setup
Si falla:

bash
Copiar código
curl http://localhost:3000/api/db/setup?key=dev-setup-key-2025 (comando para migrar tiene que estar corriendo el proyecto)
▶️ 6️⃣ Ejecutar el proyecto
Modo desarrollo:

bash
Copiar código
npm run dev
Abrir:
👉 http://localhost:3000

🔑 7️⃣ Acceso admin por defecto

Email: admin@talentscout.ai
Password: AdminScout2025!
🧠 Stack Tecnológico
Frontend
Next.js 15

Tailwind CSS

Shadcn UI

Framer Motion

Recharts

Backend / Infra
Turso (SQLite Cloud)

Vercel Blob Storage

Next.js API Routes

JWT + bcryptjs

Nodemailer

IA
Claude Sonnet 4 (Anthropic)

Google Cloud STT / TTS

Otros
Zod

TypeScript

🏗 Arquitectura del Sistema (Por Capas)
Scout IA usa una arquitectura por capas, permitiendo separar responsabilidades y mantener el código limpio.

🔹 Capa de Presentación (UI)
Todo lo que el usuario ve e interactúa:

Componentes React

Animaciones (Framer Motion)

Formularios, dashboards, landing page

Ubicación:

/app
/components
/public
🔹 Capa de Lógica de Negocio (APIs / Controladores)
Procesa reglas del sistema:

Evaluación de CVs

Gestión de candidatos

Gestión de vacantes

Lógica de entrenamiento

Procesamiento de entrevistas

Ubicación:

/app/api
/lib
🔹 Capa de Servicios (Integraciones externas)
Se encarga de:

IA (Claude)

Voz (Google Cloud)

Almacenamiento (Vercel Blob)

Email (Nodemailer)

Ubicación:

/lib/ai
/lib/training
/lib/auth.ts
🔹 Capa de Datos (Persistencia)
Base de datos y almacenamiento de archivos:

Turso client

Migraciones

Seeds

Blob Storage

Ubicación:

/lib/db.ts
/lib/migrations.ts
/lib/seed.ts
📁 Sistema de Carpetas Completo
md

Scout-IA/
│
├── app/                     # App Router (Next.js)
│   ├── api/                 # Endpoints backend
│   │   ├── admin/           # Administración
│   │   ├── agents/          # Agentes
│   │   ├── candidates/      # Candidatos
│   │   ├── job-postings/    # Vacantes
│   │   ├── training/        # Entrenamientos
│   │   ├── ai/              # STT, TTS, IA
│   │   └── exam/            # Exámenes de voz
│   │
│   ├── login/               # Login agentes
│   ├── dashboard/           # Dashboard
│   ├── practice/[jobId]/    # Prácticas de entrevistas
│   ├── exam/[jobId]/        # Exámenes reales
│   └── page.tsx             # Landing page principal
│
├── components/              # UI reutilizable
│   ├── ui/                  # Shadcn UI
│   ├── training/            # Componentes del sistema de entrenamiento
│   ├── AvatarDisplay.tsx    # Avatar con animación
│   └── VoiceRecorder.tsx    # Grabador de voz
│
├── contexts/                # Contextos globales
│   ├── auth-context.tsx
│   └── language-context.tsx
│
├── lib/                     # Lógica del sistema
│   ├── ai/                  # Anthropic + prompts
│   ├── training/            # Lógica de entrenamiento
│   ├── auth.ts              # JWT, bcrypt
│   ├── db.ts                # Cliente Turso
│   ├── migrations.ts        # Migraciones
│   └── seed.ts              # Datos iniciales
│
├── public/                  # Archivos estáticos
│   ├── videos/              # Avatar IA
│   └── logo.png
│
├── .env.example             # Variables de entorno
├── package.json
└── README.md


bash
Copiar código
npm run build
npm start

