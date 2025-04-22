# 🚀 SISTEC - Sistema de Tickets de Soporte Técnico

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript&style=for-the-badge)

Aplicación moderna para gestión de tickets de soporte técnico desarrollada con Next.js 15 y TypeScript.

## 📋 Requisitos

- Node.js v18+
- PNPM (recomendado) o npm/yarn/bun

## 🛠️ Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/Saravia2K/sistec-frontend.git
cd sistec-frontend
```

2. Instalar dependencias:

```bash
pnpm install
# o
npm install
# o
yarn install
# o
bun install
```

3. Configurar variables de entorno:

```bash
cp .env.example .env
```

Editar el archivo `.env` con tus credenciales.

ℹ️ Backend oficial: [sistec-backend](https://github.com/Saravia2K/sistec-backend).

## ▶️ Ejecución

Para iniciar el servidor de desarrollo:

```bash
npm run dev
# o
pnpm dev
# o
yarn dev
# o
bun dev
```

El servidor estará disponible en: http://localhost:3000

## 🏗️ Estructura del Proyecto

```bash
sistec-frontend/
├── src/
│   ├── app/          # Rutas de la aplicación (App Router)
│   ├── assets/       # Recursos estáticos
│   ├── components/   # Componentes reutilizables
│   ├── Forms/        # Formularios especializados
│   ├── hooks/        # Custom hooks
│   ├── layouts/      # Layouts globales
│   ├── lib/          # Utilidades y configuraciones
│   ├── providers/    # Context providers
│   └── services/     # Lógica de API y servicios
├── .eslint.config.mjs  # Config ESLint
├── next.config.ts    # Config Next.js
├── tsconfig.json     # Config TypeScript
└── package.json
```

## 📄 Licencia

MIT © Diego Saravia
