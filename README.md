# 🚀 SubaruDev Portfolio | High-Performance Engineering

Bienvenido al repositorio de mi portafolio profesional. Este proyecto es una plataforma full-stack diseñada para exhibir mi trayectoria como **Ingeniero Civil Informático**, integrando una arquitectura moderna, gestión dinámica de contenidos y una experiencia de usuario inmersiva.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Neon_DB-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)

---

## 🛠️ Stack Tecnológico

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Framer Motion (Animaciones).
- **Backend:** Next.js Server Actions.
- **Base de Datos:** Neon PostgreSQL (Serverless SQL).
- **CMS Propietario:** Panel de administración personalizado con autenticación y gestión de imágenes.
- **Diseño:** Enfoque en accesibilidad y estética "Metamorphosis" (temas adaptativos).

## ✨ Características Principales

- **Gestión Dinámica:** CRUD completo de proyectos y certificados sin necesidad de redeploy.
- **Filtrado Inteligente:** Sistema de filtrado por categorías y tecnologías con transiciones de vista nativas (View Transitions API).
- **Certificaciones Expandibles:** Visualización detallada de logros académicos con soporte para Markdown.
- **Optimización:** Carga ultrarrápida mediante Server Components y streaming de datos.

---

## 🏗️ Estructura del Proyecto

\`\`\`text
src/
├── app/             # Rutas y Server Actions (Next.js App Router)
├── components/      # UI Atoms, Molecules & Organisms
├── lib/             # Cliente de base de datos y utilidades SQL
├── types/           # Definiciones de TypeScript
└── utils/           # Lógica de temas y helpers
\`\`\`

## ⚙️ Configuración Local

Si deseas clonar y probar el proyecto localmente:

1. **Clonar repositorio:**
   \`\`\`bash
   git clone https://github.com/SubaruDev0/Portfolio.git
   \`\`\`

2. **Instalar dependencias:**
   \`\`\`bash
   npm install --legacy-peer-deps
   \`\`\`

3. **Variables de Entorno:** Crea un archivo \`.env.local\` con tu conexión de Neon:
   \`\`\`env
   DATABASE_URL=postgres://usuario:password@host/dbname?sslmode=require
   \`\`\`

4. **Ejecutar en modo dev:**
   \`\`\`bash
   npm run dev
   \`\`\`

---

## 🛡️ Licencia

Este proyecto está bajo la licencia MIT. Siéntete libre de usar el código para aprender o como base para tu propio portafolio.

---

### 📬 Contacto
**Javier Sebastián Morales Subaru**  
🔗 [LinkedIn](https://linkedin.com/in/subarudev0)  
🌐 [Portfolio en Vivo](https://portfolio-subarudev.vercel.app)
