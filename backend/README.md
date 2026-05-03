# API Backend - Agente Virtual CGrisala

API RESTful para gestión de reservas integrando n8n y Evolution API (WhatsApp).

## 🚀 Inicio Rápido

### Requisitos
- Node.js >= 18.0.0
- PostgreSQL >= 15
- npm >= 9.0.0

### Instalación

```bash
npm install
cp .env.example .env
npm run dev
```

### Base de datos

Migrar esquema:
```bash
npm run db:migrate
```

Cargar datos de prueba:
```bash
npm run db:seed
```

## 📁 Estructura

```
src/
├── index.ts
├── config/
│   ├── database.ts
│   ├── logger.ts
│   └── env.ts
├── models/
│   ├── Reservation.ts
│   ├── Guest.ts
│   ├── Room.ts
│   └── User.ts
├── controllers/
│   ├── reservationController.ts
│   ├── guestController.ts
│   ├── webhookController.ts
│   └── authController.ts
├── services/
│   ├── reservationService.ts
│   ├── n8nService.ts
│   ├── evolutionService.ts
│   ├── emailService.ts
│   └── authService.ts
├── middleware/
│   ├── errorHandler.ts
│   ├── authentication.ts
│   └── validation.ts
├── routes/
│   ├── reservations.ts
│   ├── guests.ts
│   ├── webhooks.ts
│   ├── auth.ts
│   └── health.ts
├── validators/
│   └── schemas.ts
├── utils/
│   ├── logger.ts
│   ├── errors.ts
│   └── helpers.ts
├── scripts/
│   ├── migrate.ts
│   └── seed.ts
└── types/
    └── index.ts
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `POST /api/auth/forgot-password` - Solicitar restablecimiento de contraseña
- `POST /api/auth/reset-password` - Restablecer contraseña
- `POST /api/auth/refresh` - Refresh token

### Chat / Agente Virtual
- `POST /api/chat/send` - Enviar mensaje al agente virtual (requiere auth)

### Reservas
- `GET /api/reservations` - Listar
- `POST /api/reservations` - Crear
- `GET /api/reservations/:id` - Obtener
- `PUT /api/reservations/:id` - Actualizar
- `DELETE /api/reservations/:id` - Eliminar
- `GET /api/reservations/:id/timeline` - Historial

### Huéspedes
- `GET /api/guests` - Listar
- `POST /api/guests` - Crear
- `GET /api/guests/:id` - Obtener
- `PUT /api/guests/:id` - Actualizar

### Webhooks
- `POST /api/webhooks/n8n` - Eventos de n8n
- `POST /api/webhooks/evolution` - Eventos de Evolution API

### Health
- `GET /health` - Estado de salud
- `GET /health/db` - Estado de BD

## 🧪 Testing

```bash
npm test
npm run test:coverage
```

## 📝 Lint & Format

```bash
npm run lint
npm run lint:fix
npm run format
```

## 🔨 Build

```bash
npm run build
npm start
```

## 🔐 Seguridad

- JWT para autenticación
- Helmet para headers HTTP
- CORS configurado
- Validación de entrada con Joi
- Password hashing con bcryptjs

## 📚 Variables de Entorno

Ver `.env.example` para template completo.

## 📄 Licencia

Privado - Propiedad de CGrisala
