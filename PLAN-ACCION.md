# 🚀 GUÍA DE ACCIONES - QUÉ HACER PRIMERO

## 📋 ORDEN DE PRIORIDADES (Hacer en este orden)

---

## SEMANA 1: BASE CRÍTICA

### DÍA 1-2: n8n Service (Backend)

**Crear:** `backend/src/services/n8nService.ts`

```typescript
// Funciones necesarias:
export class N8nService {
  // 1. Disparar evento: Nueva Reserva
  async notifyNewReservation(reservationData: any): Promise<void>
  
  // 2. Disparar evento: Check-in
  async notifyCheckIn(reservationId: string): Promise<void>
  
  // 3. Disparar evento: Check-out
  async notifyCheckOut(reservationId: string): Promise<void>
  
  // 4. Recibir eventos desde n8n
  async handleWebhookEvent(data: any): Promise<void>
  
  // 5. Sincronizar estados
  async syncReservationStatus(reservationId: string): Promise<void>
}
```

**Testing:**
```bash
# En el browser
curl -X POST http://localhost:3000/api/webhooks/n8n \
  -H "Content-Type: application/json" \
  -d '{"event":"reservation.created","data":{...}}'
```

**Tiempo:** 4-6 horas

---

### DÍA 3: Evolution Service (Backend)

**Crear:** `backend/src/services/evolutionService.ts`

```typescript
export class EvolutionService {
  // 1. Enviar mensaje WhatsApp
  async sendMessage(phoneNumber: string, message: string): Promise<void>
  
  // 2. Recibir mensaje WhatsApp
  async receiveMessage(data: any): Promise<void>
  
  // 3. Enviar documento/imagen
  async sendDocument(phoneNumber: string, filePath: string): Promise<void>
  
  // 4. Marcar como leído
  async markAsRead(messageId: string): Promise<void>
  
  // 5. Obtener historial
  async getConversationHistory(phoneNumber: string): Promise<Message[]>
}
```

**Configuración necesaria:**
- URL de Evolution: `http://localhost:8080`
- API Key (generar en Evolution)
- Instancia WhatsApp conectada

**Tiempo:** 4-6 horas

---

### DÍA 4-5: Email Service + Actualizar Controllers

**Completar:** `backend/src/services/emailService.ts`

```typescript
export class EmailService {
  // 1. Reset de contraseña
  async sendPasswordReset(email: string, token: string): Promise<void>
  
  // 2. Confirmación de registro
  async sendWelcome(email: string, name: string): Promise<void>
  
  // 3. Confirmación de reserva
  async sendReservationConfirmation(email: string, reservation: any): Promise<void>
  
  // 4. Cancelación de reserva
  async sendReservationCancelled(email: string, reservationId: string): Promise<void>
}
```

**Actualizar Controllers para usar estos services:**
- `AuthController.ts` - Llamar sendPasswordReset
- `ReservationController.ts` - Llamar sendReservationConfirmation
- Más eventos según sea necesario

**Tiempo:** 3-4 horas

---

### DÍA 6: Agregar Tests (Aumentar cobertura a 70%)

**Crear/Expandir tests:**

```bash
# Agregar 20-30 tests nuevos
backend/tests/unit/
├── n8nService.test.ts       # Nuevo
├── evolutionService.test.ts # Nuevo
├── emailService.test.ts     # Nuevo
├── ReservationController.test.ts  # Expandir
├── GuestController.test.ts        # Expandir
└── RoomController.test.ts         # Expandir

backend/tests/integration/
├── webhook.test.ts          # Nuevo
├── reservationFlow.test.ts  # Nuevo
└── authentication.test.ts   # Expandir
```

**Comando:**
```bash
npm test -- --coverage
# Objetivo: > 70%
```

**Tiempo:** 4-6 horas

---

### DÍA 7: Verificar en Staging Local

**Checklist:**
- [ ] API inicia sin errores: `npm run dev`
- [ ] Todos los endpoints responden
- [ ] Tests pasan: `npm test`
- [ ] Coverage > 70%: `npm run test:coverage`
- [ ] No hay TypeScript errors: `npm run typecheck`
- [ ] No hay linting errors: `npm run lint`

```bash
# Comandos de verificación
npm run dev              # Debe iniciar sin error
npm test                 # Todos los tests pasan
npm run typecheck        # Sin errores
npm run lint            # Sin advertencias críticas
```

**Tiempo:** 1-2 horas

---

## SEMANA 2: FRONTEND + INTEGRACIONES

### DÍA 8-9: Autenticación Frontend Completa

**Actualizar:** `frontend/src/App.tsx`

```typescript
// Agregar:
1. Context global de autenticación
2. Protección de rutas privadas
3. Refresh automático de tokens
4. Logout al expirar sesión
5. Interceptor de axios para agregar token

// Componentes nuevos:
└── frontend/src/context/
    ├── AuthContext.tsx
    └── api.ts (axios configured)
```

**Actualizar Rutas:**
```typescript
// Rutas públicas: /login, /registro, /forgot-password
// Rutas privadas: /dashboard, /reservations, /guests, /rooms, /agente-virtual
```

**Tiempo:** 4-6 horas

---

### DÍA 10: Chat Interface Básico

**Mejorar:** `frontend/src/pages/AgenteVirtual.tsx`

```typescript
// Necesario:
1. Textarea para escribir mensajes
2. Lista de mensajes (chat bubble style)
3. Enviar por Enter
4. Indicador de "escribiendo..."
5. Emojis básicos
6. Mostrar timestamp

// Conectar a:
- Evolution API (recibir/enviar WhatsApp)
- Backend endpoint: POST /api/chat
```

**Estructura de componente:**
```
AgenteVirtual.tsx
├── ChatMessages (componente)
├── ChatInput (componente)
└── Conexión a Evolution vía API
```

**Tiempo:** 4-5 horas

---

### DÍA 11-12: CRUD Completo en Frontend

**Actualizar Páginas:**

```
Reservations.tsx
├─ Listar (✅ existe)
├─ Crear (agregar modal/form)
├─ Editar (agregar modal/form)
└─ Eliminar (con confirmación)

Guests.tsx
├─ Listar (✅ existe)
├─ Crear
├─ Editar
└─ Eliminar

Rooms.tsx
├─ Listar
├─ Ver detalles
└─ Actualizar disponibilidad
```

**Componentes necesarios:**
```
frontend/src/components/
├── Form/ReservationForm.tsx
├── Form/GuestForm.tsx
├── Modal/ConfirmDelete.tsx
├── Table/ReservationsTable.tsx
└── Loading/Spinner.tsx
```

**Validación:**
```typescript
// Validar en real-time:
- Email format
- Phone format
- Fechas (check-out > check-in)
- Capacidad de room
- Disponibilidad
```

**Tiempo:** 6-8 horas

---

### DÍA 13: Webhooks Bidireccionales

**Integración completa:**

```
Backend API
   ↓ (dispara)
n8n Service
   ↓ (ejecuta workflow)
n8n (envía eventos)
   ↓ (webhook)
Backend /api/webhooks/n8n
   ↓
Actualiza BD

Ciclo completo:
Crear Reserva → n8n envía WhatsApp → Confirma estado → Sincroniza BD
```

**Endpoints necesarios:**

```
POST /api/webhooks/n8n          ← Recibe eventos de n8n
POST /api/webhooks/evolution    ← Recibe eventos de Evolution
POST /api/webhooks/chat         ← Maneja chats
```

**Tiempo:** 4-6 horas

---

### DÍA 14: Deploy a Staging

```bash
# Ambiente staging
docker-compose -f docker-compose.yml up -d

# Pruebas en staging
- Login
- Crear reserva
- Recibir WhatsApp
- Recibir email
- Chat interface
- CRUD completo

# Verificación
npm run test:coverage  # > 80%
npm run lint          # Sin errors
```

**Tiempo:** 2-3 horas

---

## SEMANA 3: CI/CD + TESTS E2E

### DÍA 15-16: GitHub Actions Setup

**Crear:** `.github/workflows/ci-cd.yml`

```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  backend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd backend && npm install
      - run: npm test -- --coverage
      - run: npm run lint
      - run: npm run typecheck

  build:
    needs: backend-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: docker build -t api backend/
      - run: docker build -t frontend frontend/
```

**Tiempo:** 3-4 horas

---

### DÍA 17-18: E2E Tests

**Crear:** `backend/tests/e2e/`

```typescript
// Tests end-to-end con Playwright/Supertest

describe('Complete Flow', () => {
  test('Register → Login → Create Reservation → Receive WhatsApp', async () => {
    // 1. Register user
    // 2. Login
    // 3. Create reservation
    // 4. Verify WhatsApp sent
    // 5. Verify email sent
    // 6. Verify n8n workflow triggered
  })
  
  test('Chat flow: Send message → Receive response', async () => {
    // 1. Send WhatsApp message
    // 2. Verify received in chat
    // 3. Verify bot response
  })
})
```

**Comando:**
```bash
npm run test:e2e
```

**Tiempo:** 4-6 horas

---

### DÍA 19-20: Load Testing

```bash
# Usar k6 o Apache JMeter
npm install -g k6

# Script básico:
k6 run tests/load/api.js

# Pruebas:
- 100 usuarios concurrentes
- 5 minutos de duración
- Verificar que no haya errores
```

**Tiempo:** 2-3 horas

---

### DÍA 21: Production Checklist

```bash
# Pre-deployment checklist
- [ ] npm run test:coverage > 80%
- [ ] npm run lint (sin errors)
- [ ] npm run typecheck (sin errors)
- [ ] npm run build (sin errors)
- [ ] Docker builds sin error
- [ ] Environment variables configuradas
- [ ] Backups de BD listos
- [ ] SSL/HTTPS configurado
- [ ] Secretos generados y seguros
- [ ] Monitoring/Alertas configuradas
```

**Tiempo:** 1 hora

---

## SEMANA 4: OPTIMIZACIÓN + PRODUCCIÓN

### DÍA 22-24: Performance & Security

**Performance:**
```bash
# Frontend Lighthouse
npm run build
# Run Lighthouse > 90 score

# Backend load test
k6 run tests/load/api.js
# Verificar <200ms latency
```

**Security:**
```typescript
// Agregar:
- Rate limiting middleware
- CORS restringido (solo origin permitido)
- CSRF protection
- Input sanitization
- OWASP checks
```

**Tiempo:** 4-6 horas

---

### DÍA 25: Monitoring & Logging

**Configurar:**
```bash
# Logs centralizados
docker-compose -f monitoring/docker-compose.yml up -d

# Prometheus metrics
# Grafana dashboards
# Alert rules
```

**Tiempo:** 2-3 horas

---

### DÍA 26-27: Production Deployment

```bash
# En servidor de producción
cd /opt/agente-virtual-cgrisala

# Setup
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d

# Verificaciones
curl https://app.cgrisala.com/health
docker compose ps
```

**Tiempo:** 2-3 horas

---

### DÍA 28: Post-Launch

```bash
# Monitorear
- Revisar logs
- Verificar alertas
- Checklist de features
- Feedback de usuarios

# Documentar
- Runbook de operaciones
- Troubleshooting guide
- Rollback procedures
```

**Tiempo:** 2 horas

---

## 📋 CHECKLIST FINAL RESUMIDO

### Backend ✅
- [ ] n8nService funcional
- [ ] evolutionService funcional  
- [ ] emailService funcional
- [ ] Tests > 80% coverage
- [ ] E2E tests
- [ ] Load tests
- [ ] Rate limiting
- [ ] CORS configurado

### Frontend ✅
- [ ] Autenticación completa
- [ ] Rutas protegidas
- [ ] CRUD funcional
- [ ] Chat interface
- [ ] Responsive (mobile)
- [ ] Validación real-time
- [ ] Accesibilidad básica

### Infraestructura ✅
- [ ] CI/CD working
- [ ] Staging deployment
- [ ] SSL/HTTPS
- [ ] Backups automáticos
- [ ] Monitoring/Alertas
- [ ] Secrets seguros

### Integraciones ✅
- [ ] n8n workflows probados
- [ ] Evolution WhatsApp funcional
- [ ] Webhooks bidireccionales
- [ ] Emails enviándose

---

## ⏱️ SUMMARY

```
Semana 1: Backend crítico (n8n, Evolution, Email, Tests)
Semana 2: Frontend completo + Webhooks
Semana 3: CI/CD + E2E tests + Load tests
Semana 4: Performance + Security + Producción

Total: 4 semanas
Horas/semana: ~40 (1 developer full-time)
Horas totales: ~160 horas
```

---

## 🎯 FIRST THING TO DO TODAY

1. Abrir `backend/src/services/n8nService.ts`
2. Crear estructura base
3. Implementar `notifyNewReservation()`
4. Criar test básico
5. Verificar que se ejecute

**Tiempo:** 1-2 horas

---

**¿Empezamos?** 🚀
