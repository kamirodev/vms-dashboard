# VMS Frontend

## Descripción
Aplicación web para gestión de máquinas virtuales construida con Next.js 15 y React 19.

## Características Principales
- Autenticación con JWT
- Dashboard de máquinas virtuales
- Gestión de VMs para administradores
- Actualizaciones en tiempo real

## Tecnologías
- Next.js 15
- React 19
- Tailwind CSS
- WebSocket (socket.io-client)

## Requisitos
- Node.js 18+
- npm o yarn

## Instalación Local

1. Clonar el repositorio
```bash
git clone https://github.com/kamirodev/vms-dashboard.git
cd vms-dashboard
```

2. Instalar dependencias
```bash
npm install
# o
yarn install
```

3. Configurar variables de entorno
- Crear archivo `.env.local`
- Configurar `NEXT_PUBLIC_API_URL`

4. Iniciar servidor de desarrollo
```bash
npm run dev
# o
yarn dev
```

## Construcción para Producción
```bash
npm run build
npm start
# o
yarn build
yarn start
```

## Despliegue
Alojado en [Vercel](https://vercel.com)
- URL del proyecto: (https://vms-dashboard-eight.vercel.app)

## Características Adicionales
- Autenticación de rutas
- Manejo de roles (Admin/Cliente)
- Sincronización en tiempo real de VMs
