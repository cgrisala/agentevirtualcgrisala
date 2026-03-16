# 📡 Referencia de API

API REST para Agente Virtual CGrisala. Base URL: `http://localhost:3000/api`

## 🔐 Autenticación

Todos los endpoints excepto `/auth/register` y `/auth/login` requieren token JWT.

### Header requerido:
```
Authorization: Bearer <token>
```

### Errores de autenticación:
```json
{
  "success": false,
  "error": "Missing authentication token",
  "code": "UNAUTHORIZED",
  "timestamp": "2026-03-16T10:00:00.000Z"
}
```

---

## 🔑 Autenticación

### POST /auth/register

Registrar nuevo usuario.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "Juan",
  "lastName": "Pérez"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "guest"
  },
  "timestamp": "2026-03-16T10:00:00.000Z"
}
```

### POST /auth/login

Iniciar sesión.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "guest"
    },
    "expiresIn": "24h"
  },
  "timestamp": "2026-03-16T10:00:00.000Z"
}
```

### POST /auth/refresh

Renovar token JWT.

**Headers:**
```
Authorization: Bearer <expired_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "timestamp": "2026-03-16T10:00:00.000Z"
}
```

---

## 🏨 Reservas

### GET /reservations

Listar reservas.

**Query params:**
```
?page=1&pageSize=10&status=confirmed&guestId=<id>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "guestId": "uuid",
        "roomId": "uuid",
        "checkInDate": "2026-04-01",
        "checkOutDate": "2026-04-05",
        "status": "confirmed",
        "totalPrice": 500.00,
        "notes": "Llegada temprana",
        "createdAt": "2026-03-16T10:00:00.000Z",
        "updatedAt": "2026-03-16T10:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  },
  "timestamp": "2026-03-16T10:00:00.000Z"
}
```

### POST /reservations

Crear reserva (requiere rol: admin, staff).

**Request:**
```json
{
  "guestId": "uuid",
  "roomId": "uuid",
  "checkInDate": "2026-04-01",
  "checkOutDate": "2026-04-05",
  "notes": "Llegada temprana deseada"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "guestId": "uuid",
    "roomId": "uuid",
    "checkInDate": "2026-04-01",
    "checkOutDate": "2026-04-05",
    "status": "pending",
    "totalPrice": 500.00,
    "notes": "Llegada temprana deseada",
    "confirmationCode": "RES-2026-001",
    "createdAt": "2026-03-16T10:00:00.000Z"
  },
  "timestamp": "2026-03-16T10:00:00.000Z"
}
```

### GET /reservations/:id

Obtener detalle de reserva.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "guest": {
      "id": "uuid",
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "juan@example.com",
      "phone": "+34-999888777",
      "whatsappPhone": "+34-999888777"
    },
    "room": {
      "id": "uuid",
      "name": "Habitación Deluxe 101",
      "roomNumber": "101",
      "type": "double",
      "capacity": 2,
      "pricePerNight": 100.00,
      "amenities": ["WiFi", "AC", "TV", "Minibar"]
    },
    "checkInDate": "2026-04-01",
    "checkOutDate": "2026-04-05",
    "nights": 4,
    "status": "confirmed",
    "totalPrice": 400.00,
    "notes": "Llegada temprana",
    "confirmationCode": "RES-2026-001",
    "createdAt": "2026-03-16T10:00:00.000Z"
  },
  "timestamp": "2026-03-16T10:00:00.000Z"
}
```

### PUT /reservations/:id

Actualizar reserva (requiere rol: admin, staff).

**Request:**
```json
{
  "checkInDate": "2026-04-02",
  "checkOutDate": "2026-04-06",
  "status": "confirmed",
  "notes": "Actualizada"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* ídem GET /:id */ },
  "timestamp": "2026-03-16T10:00:00.000Z"
}
```

### DELETE /reservations/:id

Cancelar reserva (requiere rol: admin).

**Response (204):**
Sin contenido

### GET /reservations/:id/timeline

Obtener historial de eventos de reserva.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "event": "created",
      "details": {
        "createdBy": "admin@example.com",
        "notes": "Reserva creada en sistema"
      },
      "timestamp": "2026-03-16T10:00:00.000Z"
    },
    {
      "id": "uuid",
      "event": "status_changed",
      "details": {
        "from": "pending",
        "to": "confirmed",
        "reason": "confirmación_whatsapp"
      },
      "timestamp": "2026-03-16T11:30:00.000Z"
    }
  ],
  "timestamp": "2026-03-16T10:00:00.000Z"
}
```

---

## 👥 Huéspedes

### GET /guests

Listar huéspedes.

**Query params:**
```
?page=1&pageSize=10&search=juan
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "firstName": "Juan",
        "lastName": "Pérez",
        "email": "juan@example.com",
        "phone": "+34-999888777",
        "whatsappPhone": "+34-999888777",
        "nationality": "ES",
        "documentType": "DNI",
        "documentNumber": "12345678A",
        "createdAt": "2026-01-15",
        "updatedAt": "2026-03-16"
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  },
  "timestamp": "2026-03-16T10:00:00.000Z"
}
```

### POST /guests

Crear huésped (requiere rol: admin, staff).

**Request:**
```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "phone": "+34-999888777",
  "whatsappPhone": "+34-999888777",
  "nationality": "ES",
  "documentType": "DNI",
  "documentNumber": "12345678A"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "phone": "+34-999888777",
    "createdAt": "2026-03-16T10:00:00.000Z"
  },
  "timestamp": "2026-03-16T10:00:00.000Z"
}
```

### GET /guests/:id

Obtener detalle de huésped.

**Response (200):**
```json
{
  "success": true,
  "data": { /* ídem POST response */ },
  "timestamp": "2026-03-16T10:00:00.000Z"
}
```

### PUT /guests/:id

Actualizar huésped (requiere rol: admin, staff).

**Request:**
```json
{
  "phone": "+34-999888888",
  "notes": "Preferencias especiales"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* ídem GET /:id */ },
  "timestamp": "2026-03-16T10:00:00.000Z"
}
```

---

## 🔗 Webhooks

### POST /webhooks/n8n

Recibir eventos de n8n.

**Request (del n8n):**
```json
{
  "event": "reservation.created",
  "data": {
    "reservationId": "uuid",
    "guestId": "uuid",
    "roomId": "uuid",
    "status": "pending",
    "checkInDate": "2026-04-01"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Event processed"
}
```

### POST /webhooks/evolution

Recibir eventos de Evolution API (WhatsApp).

**Request (de Evolution):**
```json
{
  "event": "message.create",
  "data": {
    "remoteJid": "+34999888777@s.whatsapp.net",
    "message": {
      "conversation": "¿Cuál es el precio de la habitación?"
    },
    "messageId": "msg-123",
    "timestamp": 1234567890
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Message received"
}
```

---

## 🏥 Health Check

### GET /health

Estado general del sistema.

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2026-03-16T10:00:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "version": "1.0.0"
}
```

### GET /health/db

Estado de conexión a BD.

**Response (200):**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-03-16T10:00:00.000Z"
}
```

---

## ⚠️ Códigos de Error

| Código | Estado | Descripción |
|--------|--------|------------|
| `VALIDATION_ERROR` | 400 | Datos inválidos |
| `UNAUTHORIZED` | 401 | Token faltante o inválido |
| `FORBIDDEN` | 403 | Rol insuficiente |
| `NOT_FOUND` | 404 | Recurso no existe |
| `CONFLICT` | 409 | Duplicado o conflicto |
| `INTERNAL_ERROR` | 500 | Error del servidor |

**Ejemplo de error:**
```json
{
  "success": false,
  "error": "Guest not found",
  "code": "NOT_FOUND",
  "timestamp": "2026-03-16T10:00:00.000Z"
}
```

---

## 📊 Formatos Comunes

### Paginación
```json
{
  "items": [],
  "total": 100,
  "page": 1,
  "pageSize": 10,
  "totalPages": 10
}
```

### Respuesta exitosa
```json
{
  "success": true,
  "data": { /* ... */ },
  "timestamp": "2026-03-16T10:00:00.000Z"
}
```

### Respuesta con error
```json
{
  "success": false,
  "error": "Mensaje de error",
  "code": "ERROR_CODE",
  "timestamp": "2026-03-16T10:00:00.000Z"
}
```

---

## 🧪 Testing de Endpoints

### cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@ex.com","password":"pass"}'

# Crear reserva (con token)
curl -X POST http://localhost:3000/api/reservations \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "guestId":"...",
    "roomId":"...",
    "checkInDate":"2026-04-01",
    "checkOutDate":"2026-04-05"
  }'
```

### Postman

Importar colección (próximamente disponible):
```
GET /api/auth/login           → POST
GET /api/reservations         → GET + headers Auth
POST /api/reservations        → POST + body
GET /api/reservations/:id     → GET
etc...
```

---

Para más información, ver [DEVELOPMENT.md](./DEVELOPMENT.md) y [ARCHITECTURE.md](./ARCHITECTURE.md)
