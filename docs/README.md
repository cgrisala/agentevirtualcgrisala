# Agente Virtual CGrisala

**Sistema integral de gestión de reservas hoteleras automatizado con n8n y WhatsApp**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  🏨 Agente Virtual CGrisala - Hotel Reservation System    │
│  Versión: 1.0.0                                            │
│  Última actualización: Marzo 2026                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características Principales](#características-principales)
- [Arquitectura](#arquitectura)
- [Stack Tecnológico](#stack-tecnológico)
- [Inicio Rápido](#inicio-rápido)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Documentación Completa](#documentación-completa)
- [Contribución](#contribución)
- [Licencia](#licencia)

## 🎯 Descripción General

**Agente Virtual CGrisala** es una solución automatizada que integra:

- **n8n** para orquestación de workflows
- **Evolution API** para integración con WhatsApp  
- **PostgreSQL** como base de datos
- **API REST** con Node.js + TypeScript
- **Docker** para despliegue consistente

El sistema automatiza el proceso de reservas hoteleras, gestión de huéspedes y comunicación vía WhatsApp.

## ✨ Características Principales

### 🔄 Automatización
- Workflows automáticos en n8n
- Webhooks bidireccionales
- Notificaciones vía WhatsApp
- Confirmación de reservas automáticas

### 💬 Comunicación
- Integración WhatsApp (Evolution API)
- Notificaciones en tiempo real
- Templates de mensajes personalizables
- Historial de comunicaciones

### 📊 Gestión
- CRUD completo de reservas
- Gestión de huéspedes y documentos
- Calendario de disponibilidad
- Reportes de ocupación

### 🔐 Seguridad
- JWT para autenticación
- Roles y permisos (admin, staff, guest)
- Helmet para headers HTTP
- CORS configurado
- Variables de entorno seguras

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                     Cliente Web/Mobile                  │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/REST
                       ↓
┌─────────────────────────────────────────────────────────┐
│                     API Backend                         │
│        (Node.js + TypeScript + Express)                 │
│  Autenticación • Validaciones • Lógica de Negocio      │
└──────────────────────┬──────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         ↓             ↓             ↓
    ┌────────┐  ┌──────────┐  ┌──────────┐
    │n8n API │  │PostgreSQL│  │Evolution │
    │Webhooks│  │Database  │  │WhatsApp  │
    └────────┘  └──────────┘  └──────────┘
```

### Flujo de Datos

1. **Reserva**: Cliente → API → BD → n8n → WhatsApp
2. **Confirmación**: WhatsApp → Evolution → n8n → API → BD
3. **Notificaciones**: Eventos → n8n → WhatsApp/Email/SMS

## 🛠️ Stack Tecnológico

| Componente | Tecnología | Versión |
|-----------|-----------|---------|
| **Backend API** | Node.js + Express | 18.x |
| **Lenguaje** | TypeScript | 5.3+ |
| **Base de Datos** | PostgreSQL | 15.x |
| **Automatización** | n8n | 1.0+ |
| **WhatsApp** | Evolution API | 1.8.2+ |
| **Contenedores** | Docker + Docker Compose | Latest |
| **Testing** | Vitest + Supertest | Latest |
| **Linting** | ESLint + Prettier | Latest |

## 🚀 Inicio Rápido

### Prerequisitos

- Docker y Docker Compose
- Node.js >= 18.0.0
- PostgreSQL >= 15 (para desarrollo sin Docker)
- Git

### Instalación (5 minutos)

#### 1. Clonar repositorio

```bash
git clone https://github.com/tuuser/agente-virtual-cgrisala.git
cd agente-virtual-cgrisala
```

#### 2. Configuración de n8n + Evolution API

```bash
cd n8n-docker
cp .env.example .env

# Crear secretos seguros
./scripts/create_secrets.ps1

# Iniciar servicios
docker compose up -d
```

#### 3. Configuración de Backend API

```bash
cd ../backend
npm install
cp .env.example .env

# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

#### 4. Acceso

- **API**: http://localhost:3000
- **n8n**: http://localhost:5678
- **Evolution API**: http://localhost:8080

## 📁 Estructura del Proyecto

```
agente-virtual-cgrisala/
├── 📁 n8n-docker/              # Infraestructura n8n
│   ├── docker-compose.yml       # Dev (SQLite)
│   ├── docker-compose.prod.yml  # Prod (PostgreSQL + Traefik)
│   ├── .env                     # Variables actuales
│   ├── .env.example             # Template
│   ├── scripts/
│   │   ├── create_secrets.ps1   # Generador de secretos
│   │   └── backup_restore.ps1   # Backup automático
│   ├── n8n_data/
│   │   ├── config/              # Claves de encriptación
│   │   └── nodes/               # Nodos personalizados
│   └── postgres_data/           # BD PostgreSQL
│
├── 📁 backend/                  # API Backend
│   ├── src/
│   │   ├── index.ts             # Punto de entrada
│   │   ├── config/              # Configuraciones
│   │   ├── models/              # Entidades
│   │   ├── controllers/         # Controladores
│   │   ├── services/            # Lógica de negocio
│   │   ├── routes/              # Rutas API
│   │   ├── middleware/          # Middleware
│   │   ├── validators/          # Validaciones
│   │   ├── utils/               # Utilidades
│   │   ├── types/               # Tipos TypeScript
│   │   └── scripts/             # Scripts de BD
│   ├── tests/                   # Tests
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── 📁 docs/                     # Documentación
│   ├── README.md                # Este archivo
│   ├── ARCHITECTURE.md          # Arquitectura detallada
│   ├── INSTALLATION.md          # Guía de instalación
│   ├── DEVELOPMENT.md           # Guía de desarrollo
│   ├── API.md                   # Documentación API
│   ├── N8N_WORKFLOWS.md         # Workflows de n8n
│   ├── DEPLOYMENT.md            # Guía de despliegue
│   ├── TROUBLESHOOTING.md       # Resolución de problemas
│   └── CONTRIBUTING.md          # Guía de contribución
│
└── 📁 .git/                     # Control de versiones
```

## ⚙️ Configuración Inicial

### Prerrequisitos
- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker & Docker Compose
- PostgreSQL (o usar Docker)

### Instalación

1. **Clonar repositorio**
   ```bash
   git clone <repo-url>
   cd agentevirtualcgrisala
   ```

2. **Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configurar variables
   npm run dev
   ```

3. **Base de Datos**
   ```bash
   # Usar Docker o PostgreSQL local
   # Configurar .env con credenciales BD
   ```

4. **n8n + WhatsApp**
   ```bash
   cd n8n-docker
   docker compose up -d
   ```

### Docker local completo
1. Desde la raíz del repositorio:
   ```bash
   docker compose up --build
   ```
2. Servicios disponibles:
   - Backend: http://localhost:3000
   - Frontend: http://localhost:3001
   - PostgreSQL: localhost:5432
   
### Uso de Ramas
- `main`: Rama principal, código estable
- `develop`: Desarrollo activo
- `feature/*`: Nuevas funcionalidades
- `hotfix/*`: Corrección de bugs

### Herramientas de Calidad
- **ESLint**: Linting de código
- **Prettier**: Formateo automático
- **Vitest**: Testing unitario
- **TypeScript**: Tipado estático

## 📚 Documentación Completa

Documentación detallada disponible en carpeta `docs/`:

- [**ARCHITECTURE.md**](./docs/ARCHITECTURE.md) - Diagrama de arquitectura y componentes
- [**INSTALLATION.md**](./docs/INSTALLATION.md) - Guía paso a paso de instalación
- [**DEVELOPMENT.md**](./docs/DEVELOPMENT.md) - Guía de desarrollo local
- [**API.md**](./docs/API.md) - Referencia completa de API
- [**N8N_WORKFLOWS.md**](./docs/N8N_WORKFLOWS.md) - Documentación de workflows
- [**DEPLOYMENT.md**](./docs/DEPLOYMENT.md) - Despliegue en producción
- [**TROUBLESHOOTING.md**](./docs/TROUBLESHOOTING.md) - FAQ y solución de problemas
- [**CONTRIBUTING.md**](./docs/CONTRIBUTING.md) - Directrices de contribución

## 🤝 Contribución

Consulta [CONTRIBUTING.md](./docs/CONTRIBUTING.md) para directrices de contribución.

## 📄 Licencia

Privado - Propiedad de CGrisala

---

**Contacto & Soporte**: [contact@cgrisala.com](mailto:contact@cgrisala.com)
