# 📖 Guía de Desarrollo

Guía completa para desarrollo local del Agente Virtual CGrisala.

## 🎯 Estructura para Desarrolladores

```
backend/
├── src/
│   ├── index.ts                 ← Punto de entrada
│   ├── config/                  
│   │   ├── database.ts          ← Config de BD
│   │   ├── logger.ts            ← Config de logs
│   │   └── env.ts               ← Validación de ENV
│   ├── models/                  ← Entidades (TypeORM)
│   │   ├── User.ts
│   │   ├── Reservation.ts
│   │   ├── Guest.ts
│   │   └── Room.ts
│   ├── controllers/             ← Controladores HTTP
│   │   ├── authController.ts
│   │   ├── reservationController.ts
│   │   ├── guestController.ts
│   │   └── webhookController.ts
│   ├── services/                ← Lógica de negocio
│   │   ├── authService.ts
│   │   ├── reservationService.ts
│   │   ├── n8nService.ts
│   │   ├── evolutionService.ts
│   │   └── emailService.ts
│   ├── routes/                  ← Definición de rutas
│   │   ├── auth.ts
│   │   ├── reservations.ts
│   │   ├── guests.ts
│   │   ├── webhooks.ts
│   │   └── health.ts
│   ├── middleware/              
│   │   ├── authentication.ts
│   │   ├── errorHandler.ts
│   │   ├── validation.ts
│   │   └── requestLogger.ts
│   ├── validators/              ← Schemas de validación
│   │   └── schemas.ts
│   ├── utils/                   
│   │   ├── logger.ts
│   │   ├── errors.ts
│   │   └── helpers.ts
│   ├── types/                   
│   │   └── index.ts             ← Tipos TypeScript
│   └── scripts/                 ← Scripts de BD
│       ├── migrate.ts
│       └── seed.ts
├── tests/                       
│   ├── unit/                    ← Unit tests
│   ├── integration/             ← Integration tests
│   └── e2e/                     ← End to end
├── package.json
├── tsconfig.json
└── .env.example
```

## 🚀 Flujo de Desarrollo

### 1. Clonar y Setup

```bash
git clone <repo>
cd agente-virtual-cgrisala/backend
npm install
cp .env.example .env
npm run dev
```

### 2. Crear Nueva Feature

#### A. Crear Modelo (TypeORM)

```typescript
// src/models/MyEntity.ts
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('my_entities')
export class MyEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('varchar')
  name!: string;

  @Column('timestamp')
  createdAt!: Date;
}
```

#### B. Crear Service (Lógica)

```typescript
// src/services/myService.ts
import { AppDataSource } from '../config/database';
import { MyEntity } from '../models/MyEntity';

export class MyService {
  private repo = AppDataSource.getRepository(MyEntity);

  async create(data: any): Promise<MyEntity> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async findById(id: string): Promise<MyEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: string, data: any): Promise<MyEntity> {
    await this.repo.update(id, data);
    return this.findById(id) as Promise<MyEntity>;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
```

#### C. Crear Controller

```typescript
// src/controllers/myController.ts
import { Request, Response } from 'express';
import { MyService } from '../services/myService';
import { ValidationError, NotFoundError } from '../utils/errors';

const myService = new MyService();

export const myController = {
  create: async (req: Request, res: Response) => {
    const entity = await myService.create(req.body);
    res.status(201).json({ success: true, data: entity });
  },

  getById: async (req: Request, res: Response) => {
    const entity = await myService.findById(req.params.id);
    if (!entity) throw new NotFoundError('Entity not found');
    res.json({ success: true, data: entity });
  },

  update: async (req: Request, res: Response) => {
    const entity = await myService.update(req.params.id, req.body);
    res.json({ success: true, data: entity });
  },

  delete: async (req: Request, res: Response) => {
    await myService.delete(req.params.id);
    res.status(204).send();
  },
};
```

#### D. Crear Validador

```typescript
// En src/validators/schemas.ts
export const createMyEntitySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
});
```

#### E. Crear Ruta

```typescript
// src/routes/my.ts
import { Router } from 'express';
import { authenticate } from '../middleware/authentication';
import { validate } from '../middleware/validation';
import { myController } from '../controllers/myController';
import { createMyEntitySchema } from '../validators/schemas';

const router = Router();

router.post('/', 
  authenticate,
  validate(createMyEntitySchema),
  myController.create
);

router.get('/:id', authenticate, myController.getById);
router.put('/:id', authenticate, validate(mySchema), myController.update);
router.delete('/:id', authenticate, myController.delete);

export default router;
```

#### F. Registrar Ruta en index.ts

```typescript
// En src/index.ts
import myRoutes from './routes/my';

app.use('/api/my', myRoutes);
```

### 3. Testing

#### Unit Test

```typescript
// tests/unit/myService.test.ts
import { describe, it, expect } from 'vitest';
import { MyService } from '../../src/services/myService';

describe('MyService', () => {
  it('should create entity', async () => {
    const service = new MyService();
    const result = await service.create({ name: 'Test' });
    expect(result).toHaveProperty('id');
    expect(result.name).toBe('Test');
  });
});
```

#### Integration Test

```typescript
// tests/integration/api.test.ts
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/index';

describe('API Endpoints', () => {
  it('POST /api/my should create', async () => {
    const res = await request(app)
      .post('/api/my')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test' });
    
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
```

#### Ejecutar Tests

```bash
npm test                    # Ejecutar todos
npm test -- --watch        # Watch mode
npm run test:coverage      # Con cobertura
```

## 📋 Guías de Estilo

### TypeScript

```typescript
// ✅ Bueno
interface UserData {
  email: string;
  password: string;
}

async function createUser(data: UserData): Promise<User> {
  // implementación
}

// ❌ Evitar
async function createUser(data: any): Promise<any> {
  // No usar 'any'
}
```

### Nombres

```typescript
// Controllers
const reservationController = { ... }

// Services
const reservationService = new ReservationService()

// Modelos
class Reservation { ... }

// Funciones
async function getReservationById(id: string): Promise<Reservation> { ... }
```

### Errores

```typescript
// ✅ Bueno
if (!user) {
  throw new NotFoundError('User not found');
}

// ❌ Evitar
if (!user) {
  res.status(404).json({ error: 'Not found' });
}
```

## 🔄 Integración con n8n

### Disparar webhook desde API

```typescript
// En un controller
import axios from 'axios';

const response = await axios.post(
  `${process.env.N8N_API_URL}/webhook/my-workflow`,
  {
    reservationId: reservation.id,
    guestId: reservation.guestId,
    status: 'created'
  }
);
```

### Recibir webhook de n8n

```typescript
// POST /api/webhooks/n8n
router.post('/n8n', async (req, res) => {
  const { event, data } = req.body;

  if (event === 'reservation.created') {
    // Procesar
    await reservationService.handleWebhook(data);
  }

  res.json({ success: true });
});
```

## 🔐 Autenticación

### Generar JWT

```typescript
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  {
    userId: user.id,
    email: user.email,
    role: user.role
  },
  process.env.JWT_SECRET!,
  { expiresIn: process.env.JWT_EXPIRATION }
);
```

### Usar Autenticación en Rutas

```typescript
router.post('/protected',
  authenticate,  // Requiere JWT valido
  authorize(['admin']),  // Requiere rol admin
  controller
);
```

## 📚 Bases de Datos

### Crear Migración

```bash
npm run typeorm migration:create src/migrations/CreateUsersTable
```

### Ejecutar Migraciones

```bash
npm run db:migrate
```

### Revertir Migración

```bash
npm run typeorm migration:revert
```

## 🐛 Debugging

### VS Code

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}/node_modules/.bin/tsx",
      "args": ["watch", "src/index.ts"],
      "console": "integratedTerminal",
      "env": { 
        "NODE_ENV": "development" 
      }
    }
  ]
}
```

### Logs

```typescript
import { logger } from '../utils/logger';

logger.debug('Debug message', { data });
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message', { error: err.stack });
```

## 📝 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Inicia con tsx watch

# Build
npm run build            # Compilar TypeScript
npm start                # Ejecutar build

# Calidad
npm run lint             # Validar código
npm run lint:fix         # Corregir automático
npm run format           # Formatear código
npm run typecheck        # Validar tipos TS

# Testing
npm test                 # Ejecutar tests
npm run test:coverage    # Con cobertura

# Base de datos
npm run db:migrate       # Ejecutar migraciones
npm run db:seed          # Cargar datos iniciales
```

## 🎨 Ejemplo Completo: CRUD de Salas

### 1. Modelo

```typescript
// src/models/Room.ts
@Entity('rooms')
export class Room {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('varchar')
  roomNumber!: string;

  @Column('varchar')
  name!: string;

  @Column('int')
  capacity!: number;

  @Column('decimal')
  pricePerNight!: number;
}
```

### 2. Service

```typescript
// src/services/roomService.ts
export class RoomService {
  async getAvailable(checkIn: Date, checkOut: Date) {
    // Query rooms no reservadas en ese período
  }
}
```

### 3. Controller

```typescript
// src/controllers/roomController.ts
export const getRoomAvailability = async (req: Request, res: Response) => {
  const { checkIn, checkOut } = req.query;
  const rooms = await roomService.getAvailable(
    new Date(checkIn as string),
    new Date(checkOut as string)
  );
  res.json({ success: true, data: rooms });
};
```

### 4. Route

```typescript
// src/routes/rooms.ts
router.get('/availability', authenticate, roomController.getRoomAvailability);
```

## 📞 Soporte

Dudas? Revisa:
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Diseño general
- [INSTALLATION.md](./INSTALLATION.md) - Setup inicial
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Problemas comunes

---

¡Happy coding! 🚀
