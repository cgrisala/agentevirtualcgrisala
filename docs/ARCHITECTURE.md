# 🏗️ Arquitectura del Sistema

## Descripción General

El sistema está diseñado con una arquitectura de microservicios con contenedores, separando claramente las responsabilidades entre orquestación (n8n), comunicación (Evolution) y lógica de negocio (API).

## Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                   Cliente Final                             │
│         (Web App / Mobile App / WhatsApp Bot)               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓ HTTP/REST
                       
┌─────────────────────────────────────────────────────────────┐
│                   API REST Backend                          │
│  ✓ Validaciones    ✓ Autenticación    ✓ Lógica de B.      │
│  Port: 3000        Node.js + Express + TypeScript          │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ↓              ↓              ↓
        
┌────────────┐  ┌─────────────┐  ┌──────────────┐
│ PostgreSQL │  │    n8n      │  │  Evolution   │
│ Database   │  │  Automation │  │   WhatsApp   │
│            │  │             │  │              │
│ • Reservas │  │ • Workflows │  │ • Mensajes   │
│ • Huéspedes│  │ • Webhooks  │  │ • Chats      │
│ • Salas    │  │ • Triggers  │  │ • Notificac. │
└────────────┘  └─────────────┘  └──────────────┘
```

## Componentes Principales

### 1. API Backend (Node.js + Express)

**Responsabilidades:**
- Autenticación y autorización (JWT)
- Validación de datos
- Lógica de negocio
- Persistencia de datos
- Integración con n8n

**Stack:**
```
TypeScript 5.3+
↓
Express.js 4.18+
↓
PostgreSQL Driver (pg)
↓
Middleware (Helmet, CORS, Logger)
```

**Endpoints Principales:**
```
POST   /api/auth/register          Registro de usuarios
POST   /api/auth/login             Inicio de sesión
POST   /api/auth/refresh           Renovar token

GET    /api/reservations           Listar reservas
POST   /api/reservations           Crear reserva
GET    /api/reservations/:id       Obtener detalle
PUT    /api/reservations/:id       Actualizar
DELETE /api/reservations/:id       Cancelar

GET    /api/guests                 Listar huéspedes
POST   /api/guests                 Crear huésped
GET    /api/guests/:id             Obtener detalle
PUT    /api/guests/:id             Actualizar

POST   /api/webhooks/n8n           Webhooks de n8n
POST   /api/webhooks/evolution     Webhooks de WhatsApp

GET    /health                     Estado de salud
GET    /health/db                  Estado de BD
```

### 2. n8n (Automatización)

**Responsabilidades:**
- Orquestación de workflows
- Automatización de procesos
- Integración de sistemas
- Webhooks y triggers

**Workflows Principales:**
```
1. Nueva Reserva
   Cliente → API → n8n → WhatsApp (confirmación)
   
2. Check-in
   Admin → n8n → Email + WhatsApp
   
3. Check-out
   Sistema → n8n → Email + Factura
   
4. Cancelación
   Cliente/Admin → API → n8n → Notificación
```

**Puertos:**
- UI: http://localhost:5678
- API: http://localhost:5678/api
- Webhooks: http://localhost:5678/webhook/*

### 3. Evolution API (WhatsApp)

**Responsabilidades:**
- Integración con WhatsApp
- Envío/recepción de mensajes
- Gestión de instancias
- Webhooks de eventos

**Endpoints:**
```
POST   /chats/send             Enviar mensaje
POST   /chats/read             Marcar como leído
GET    /chats/list             Listar conversaciones
POST   /contacts/upsert        Crear/actualizar contacto
```

**Puertos:**
- API: http://localhost:8080

### 4. PostgreSQL (Base de Datos)

**Esquema:**
```sql
-- Usuarios
Table: users
  - id (UUID PK)
  - email (VARCHAR UNIQUE)
  - password (VARCHAR)
  - firstName, lastName
  - role (admin|staff|guest)
  - createdAt, updatedAt

-- Huéspedes
Table: guests
  - id (UUID PK)
  - firstName, lastName
  - email, phone, whatsappPhone
  - documentType, documentNumber
  - nationality
  - createdAt, updatedAt

-- Salas
Table: rooms
  - id (UUID PK)
  - roomNumber (VARCHAR UNIQUE)
  - name (VARCHAR)
  - type (single|double|suite)
  - capacity (INT)
  - pricePerNight (DECIMAL)
  - amenities (TEXT[])
  - isActive (BOOLEAN)
  - createdAt, updatedAt

-- Reservas
Table: reservations
  - id (UUID PK)
  - guestId (FK guests)
  - roomId (FK rooms)
  - checkInDate (DATE)
  - checkOutDate (DATE)
  - status (pending|confirmed|checked_in|checked_out|cancelled)
  - totalPrice (DECIMAL)
  - notes (TEXT)
  - createdAt, updatedAt

-- Historial de eventos
Table: reservation_timeline
  - id (UUID PK)
  - reservationId (FK reservations)
  - event (VARCHAR)
  - details (JSONB)
  - createdAt
```

**Conexión:**
```
Host: db (desde docker)
Port: 5432
User: n8n
Database: n8n
```

## Flujos de Datos Importantes

### 📝 Flujo de Nueva Reserva

```
1. Cliente/Admin accede a API
   POST /api/reservations
   
2. API valida datos
   ✓ Guest existe
   ✓ Room disponible
   ✓ Fechas válidas
   
3. API crea registro en BD
   INSERT INTO reservations
   
4. API dispara webhook a n8n
   POST /webhook/reservation-created
   {
     reservationId,
     guestId,
     roomId,
     checkInDate,
     checkOutDate,
     totalPrice
   }
   
5. n8n ejecuta workflow:
   a) Obtiene datos del huésped
   b) Obtiene datos de la sala
   c) Envía confirmación vía WhatsApp
   d) Registra evento en timeline
   
6. API retorna respuesta al cliente
   {
     success: true,
     reservationId,
     confirmationCode
   }
```

### 💬 Flujo de Mensaje WhatsApp

```
1. Cliente envía mensaje a WhatsApp
   "¿Tienen habitaciones disponibles?"
   
2. Evolution API recibe webhook
   POST /api/webhooks/evolution
   {
     from: "55999999999",
     body: "¿Tienen habitaciones"
   }
   
3. n8n procesa el mensaje
   a) Extrae intención (disponibilidad)
   b) Consulta BD por fechas solicitadas
   c) Genera respuesta
   d) Envía vía Evolution API
   
4. Cliente recibe respuesta
   "Contamos con habitaciones disponibles..."
```

### ✅ Flujo de Check-in

```
1. Admin marca check-in en API
   PATCH /api/reservations/:id
   { status: "checked_in" }
   
2. API actualiza BD y notifica n8n
   
3. n8n ejecuta workflow check-in:
   a) Obtiene datos del huésped
   b) Obtiene detalles de la habitación
   c) Envía welcome message
   d) Envía WiFi/keys info
   e) Registra en timeline
   
4. Cliente recibe bienvenida
```

## Patrones de Comunicación

### Request-Response (Sincrónico)

```
Cliente → API → BD
↓
Respuesta inmediata
```

**Casos:**
- Login
- Obtener listados
- Validaciones

### Event-Webhook (Asincrónico)

```
API → BD → n8n (webhook) → Acciones
↑                              ↓
└──────← Respuesta opcional ───┘
```

**Casos:**
- Nueva reserva
- Cambio de estado
- Notificaciones

## Implementación de Seguridad

### Autenticación

```
1. Login
   POST /api/auth/login
   { email, password }
   
2. Server genera JWT
   {
     userId,
     email,
     role,
     iat,
     exp
   }
   
3. Cliente almacena token
   
4. Cliente envía en headers
   Authorization: Bearer <token>
   
5. API valida token
   ✓ Firma válida
   ✓ No expirado
```

### Autorización

```
Sistema de roles:
- admin: Acceso completo
- staff: Gestión de reservas y huéspedes
- guest: Solo acceso a sus reservas
```

### Headers de Seguridad

```
Helmet.js:
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security
```

## Escalabilidad

### Horizontal (Múltiples instancias)

```
Cliente
  ↓
Load Balancer (Nginx/HAProxy)
  ├→ API Instance 1:3000
  ├→ API Instance 2:3000
  └→ API Instance 3:3000
  ↓
PostgreSQL (conexión centralizada)
```

### Vertical (Más recursos)

```
DB Connection Pool: 20
Thread Pool: Automático
Memory: 512MB → 4GB
```

## Monitoring y Observabilidad

### Logs

```
Winston Logger:
- Level: debug|info|warn|error
- Format: JSON (producción)
- Transports: Console + Archivos
```

### Health Checks

```
GET /health
{
  status: "ok",
  uptime: 3600,
  environment: "production"
}

GET /health/db
{
  status: "ok",
  database: "connected"
}
```

### Métricas (Futuro)

```
Prometheus:
- Requests/segundo
- Latencia (p50, p95, p99)
- Errores
- Conexiones BD
```

## Despliegue

### Desarrollo (Docker Compose)

```bash
docker compose up -d
```

Servicios:
- n8n (SQLite)
- Evolution API
- PostgreSQL (opcional)

### Producción (Docker Compose con Traefik)

```bash
docker compose -f docker-compose.prod.yml up -d
```

Características:
- HTTPS automático (Let's Encrypt)
- Reverse proxy (Traefik)
- PostgreSQL persistente
- Secretos seguros
- Backups automáticos

---

Para más detalles técnicos, ver [DEVELOPMENT.md](./DEVELOPMENT.md) y [API.md](./API.md)
