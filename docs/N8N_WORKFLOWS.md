# 🔄 Workflows n8n

Documentación de workflows de automatización en n8n.

## Workflows Principales

### 1. 📝 Nueva Reserva

**Trigger:** Webhook POST `/webhook/reservation-created`

**Flujo:**
```
1. Recibir datos de reserva
   ↓
2. Obtener información del huésped
   ↓
3. Obtener detalles de la habitación
   ↓
4. Calcular precio total
   ↓
5. Enviar confirmación vía WhatsApp
   ↓
6. Guardar en timeline de reserva
   ↓
7. Responder al cliente
```

**Datos esperados:**
```json
{
  "reservationId": "uuid",
  "guestId": "uuid",
  "roomId": "uuid",
  "checkInDate": "2026-04-01",
  "checkOutDate": "2026-04-05",
  "totalPrice": 400.00
}
```

**Acciones:**
- 🔗 Obtener Guest por ID (REST API)
- 🔗 Obtener Room por ID (REST API)
- 💬 Enviar mensaje WhatsApp (Evolution)
- 📊 Log a BD

**Enviar a n8n:**
```bash
# Desde backend API
curl -X POST http://localhost:5678/webhook/reservation-created \
  -H "Content-Type: application/json" \
  -d '{
    "reservationId": "abc123",
    "guestId": "guest1",
    ...
  }'
```

---

### 2. ✅ Confirmación de Check-in

**Trigger:** Webhook POST `/webhook/check-in`

**Flujo:**
```
1. Recibir datos de check-in
   ↓
2. Obtener reserva y huésped
   ↓
3. Preparar información de acceso
   ↓
4. Enviar bienvenida + WiFi + keys
   ↓
5. Actualizar estado en BD
```

**Acciones:**
- 📱 Enviar bienvenida WhatsApp
- 🔐 Enviar credenciales WiFi
- 🗝️ Información de llaves
- 📸 Enviar fotos de sala

---

### 3. 🚪 Check-out

**Trigger:** Webhook POST `/webhook/check-out`

**Flujo:**
```
1. Recibir datos de check-out
   ↓
2. Registrar hora de check-out
   ↓
3. Generar factura/recibo
   ↓
4. Enviar factura por email/WhatsApp
   ↓
5. Encuesta de satisfacción
   ↓
6. Actualizar estado
```

**Acciones:**
- 📄 Generar factura (PDF)
- 📧 Enviar email
- 💬 Enviar confirmación WhatsApp
- ⭐ Enviar encuesta

---

### 4. ❌ Cancelación de Reserva

**Trigger:** Webhook POST `/webhook/reservation-cancelled`

**Flujo:**
```
1. Recibir datos de cancelación
   ↓
2. Verificar política de devolución
   ↓
3. Calcular reembolso
   ↓
4. Procesar devolución
   ↓
5. Notificar al cliente
   ↓
6. Marcar habitación como disponible
```

**Acciones:**
- 💰 Procesar reembolso
- 💬 Notificar vía WhatsApp
- 📅 Liberar disponibilidad

---

### 5. 💬 Bot Conversacional WhatsApp

**Trigger:** Mensaje WhatsApp (Evolution)

**Intenciones:**
```
- Disponibilidad: "¿Tienen habitaciones el 5 de abril?"
- Precio: "¿Cuál es el precio?"
- Reserva: "Quiero reservar una habitación"
- Información: "¿Tienen WiFi?, ¿Estacionamiento?"
```

**Flujo:**
```
1. Recibir mensaje
   ↓
2. Extraer intención (NLP)
   ↓
3. Consultar BD según intención
   ↓
4. Generar respuesta
   ↓
5. Enviar respuesta WhatsApp
   ↓
6. Log de conversación
```

**Respuestas predefinidas:**
```
Disponibilidad:
"👍 Contamos con habitaciones disponibles del 5 al 10 de abril.
- Habitación Doble: $100/noche
- Habitación Suite: $150/noche
¿Desea reservar?"

Precio:
"💰 Nuestros precios son:
- Single: $80/noche
- Double: $100/noche
- Suite: $150/noche
10% descuento por 7+ noches"

Reserva:
"📝 Para reservar, necesitamos:
1. Nombre completo
2. Email
3. Teléfono
4. Fechas de check-in y check-out
¿Desea continuar?"
```

---

## 📋 Nodos Comúnmente Usados

### HTTP Request
```
Método: GET/POST/PUT/DELETE
URL: http://localhost:3000/api/...
Headers:
  - Authorization: Bearer <token>
  - Content-Type: application/json
Body: JSON según endpoint
```

### Evolution API
```
Endpoint: http://localhost:8080
Métodos:
  - POST /chats/send (enviar mensaje)
  - GET /chats/list (listar chats)
  - POST /contacts/upsert (crear contacto)
```

### Log
```
Registrar datos en console
Útil para debugging
```

### Wait
```
Esperar X segundos antes de continuar
Útil para dar tiempo a procesos
```

### Conditional
```
Si/Entonces para lógica condicional
Ejemplo: Si status = pending, entonces enviar notificación
```

---

## 🔗 Variables Globales en n8n

```
$node.nodeName.data[0].fieldName   - Acceder a datos
$env.N8N_HOST                      - Variables de entorno
$now                               - Timestamp actual
$randomName                        - Nombre aleatorio
```

---

## 📤 Integración Bidireccional

### API Backend → n8n

Backend dispara webhook:
```bash
POST http://localhost:5678/webhook/{workflow-url}
```

### n8n → API Backend

n8n HTTP Request node:
```
http://localhost:3000/api/x
Headers: Authorization: Bearer token
```

---

## 🧪 Testing de Workflows

### En n8n UI:
1. Abrir workflow
2. Hacer click en "Trigger" node
3. Hacer click en "Test workflow"
4. Ver resultado

### Por CLI:
```bash
# Disparar webhook manualmente
curl -X POST http://localhost:5678/webhook/test-workflow \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

---

## 📊 Monitoreo de Workflows

En n8n:
```
Settings → Executions → Filtrar por workflow
Ver: Status, duración, errores
```

Logs:
```bash
docker compose logs -f n8n
```

---

## 🚀 Deploy de Workflows

### Exportar workflow:
1. Abrir workflow
2. Menu → Download
3. Seleccionar archivo JSON

### Importar workflow:
1. Workflows → Import
2. Seleccionar JSON exportado
3. Activar

### Versionado en Git:
```bash
# Guardar workflows como JSON en repo
backend/
└── n8n-workflows/
    ├── reservation-created.json
    ├── check-in.json
    ├── check-out.json
    └── whatsapp-bot.json
```

---

Para más detalles, ver [https://docs.n8n.io/](https://docs.n8n.io/)
