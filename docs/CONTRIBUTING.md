# 🤝 Guía de Contribución

Cómo contribuir al proyecto Agente Virtual CGrisala.

## Código de Conducta

- Sé respetuoso con otros contribuidores
- No harassment de ningún tipo
- Sé inclusivo y abierto a diferentes opiniones
- Reporta problemas directamente a los maintainers

## ¿Cómo Empezar?

### 1. Fork del Repositorio

```bash
# En GitHub: Click en \"Fork\"

# Clonar tu fork
git clone https://github.com/tu-usuario/agente-virtual-cgrisala.git
cd agente-virtual-cgrisala

# Agregar upstream
git remote add upstream https://github.com/cgrisala/agente-virtual-cgrisala.git
```

### 2. Crear Rama de Desarrollo

```bash
# Crear rama con nombre descriptivo
git checkout -b feature/mi-feature
# o
git checkout -b fix/mi-bug
# o
git checkout -b docs/mi-documentacion
```

**Nombres de rama:**
- `feature/*` - Nueva funcionalidad
- `fix/*` - Corrección de bug
- `docs/*` - Documentación
- `test/*` - Tests
- `refactor/*` - Refactorización

### 3. Hacer Cambios

```bash
# Instalar dependencias
npm install

# Ejecutar en modo dev
npm run dev

# O para backend
cd backend
npm run dev
```

### 4. Escribir Tests

```bash
# Tests unitarios
npm test

# Con cobertura
npm run test:coverage

# Watch mode
npm test -- --watch
```

### 5. Linting y Formato

```bash
# Validar código
npm run lint

# Corregir automático
npm run lint:fix

# Formatear
npm run format

# Validar tipos
npm run typecheck
```

### 6. Commit

**Mensaje de commit:**
```
<tipo>(<scope>): <descripción breve>

<descripción detallada>

Fixes #123
```

**Tipos:**
- `feat` - Nueva funcionalidad
- `fix` - Corrección de bug
- `docs` - Documentación
- `test` - Tests
- `refactor` - Refactorización
- `perf` - Performance
- `chore` - Build, deps, etc

**Ejemplos:**
```bash
git commit -m "feat(reservations): add reservation timeline"
git commit -m "fix(auth): correct JWT expiration"
git commit -m "docs(api): update endpoint documentation"
```

### 7. Push

```bash
# Push a tu fork
git push origin feature/mi-feature
```

### 8. Pull Request

1. Ve a GitHub
2. Click en \"New Pull Request\"
3. Asegúrate que compara tu branch con `main`
4. Completa template:

```markdown
## Descripción
Describe los cambios y por qué se hacen.

## Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Actualización de docs

## Como Testear
Pasos para validar los cambios.

## Checklist
- [ ] Mi código sigue los estilos del proyecto
- [ ] He ejecutado lint y tests
- [ ] He actualizado la documentación
- [ ] No hay breaking changes
```

### 9. Code Review

Los maintainers revisarán tu PR:
- Responde a los comentarios
- Haz cambios si es necesario
- Espera la aprobación

### 10. Merge

Una vez aprobado, los maintainers harán merge automático.

---

## Estructura de Commits

### ✅ Bueno

```bash
git commit -m "feat(api): add reservation confirmation endpoint

- Create POST /api/reservations/:id/confirm
- Add email notification
- Add n8n webhook trigger
- Add tests

Fixes #456"
```

### ❌ Evitar

```bash
git commit -m "Update stuff"
git commit -m "WIP"
git commit -m "Fix again"
```

---

## Desarrollo Local

### Setup Completo

```bash
# Backend API
cd backend
npm install
cp .env.example .env
npm run dev

# En otra terminal: n8n + Evolution
cd n8n-docker
docker compose up -d

# En otra terminal: cambiar a backend si compilas TS
npm run build
```

### Database para Tests

```bash
# Usar BD separada para tests
# En .env.test
DB_NAME=n8n_test

# Ejecutar tests
npm test
```

---

## Estándares de Código

### TypeScript

```typescript
// ✅ Usar tipos explícitos
async function createReservation(data: CreateReservationDTO): Promise<Reservation> {
  // implementación
}

// ❌ Evitar any
async function createReservation(data: any): Promise<any> {
  // implementación
}
```

### Naming Conventions

```typescript
// Classes: PascalCase
class ReservationService { }

// Functions: camelCase
function getReservationById(id: string) { }

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;

// Variables: camelCase
let isProcessing = false;
```

### Indentación

```
2 espacios (no tabs)
```

### Máximo de líneas por función

```
50 líneas (reconsiderar si es más larga)
```

---

## Testing

### Unit Tests

```typescript
import { describe, it, expect } from 'vitest';

describe('ReservationService', () => {
  it('should create reservation', async () => {
    const result = await service.create(data);
    expect(result).toHaveProperty('id');
  });

  it('should throw if invalid data', async () => {
    await expect(service.create({})).rejects.toThrow();
  });
});
```

### Integration Tests

```typescript
describe('Reservation API', () => {
  it('POST /reservations should create', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send(validData);
    
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
```

### Cobertura

Objetivo: >80% de cobertura

```bash
npm run test:coverage
```

---

## Documentación

### README

Documentar:
- Setup
- Uso básico
- Estructura
- Comandos principales

### Inline Comments

Usar para código complejo:
```typescript
// ✅ Bueno
// Calculate total price considering discount for 7+ nights
const totalPrice = nights >= 7 
  ? basePrice * nights * 0.9 
  : basePrice * nights;

// ❌ Innecesarios
// Get the id
const id = data.id;
```

### JSDoc

```typescript
/**
 * Create a new reservation
 * 
 * @param {CreateReservationDTO} data - Reservation data
 * @param {User} user - Current user for audit trail
 * @returns {Promise<Reservation>} - Created reservation
 * @throws {ValidationError} - If data is invalid
 */
async function createReservation(
  data: CreateReservationDTO,
  user: User
): Promise<Reservation> {
  // ...
}
```

---

## Issues

### Reportar Bug

```markdown
**Descripción**
Bug conciso

**Pasos para reproducir**
1. Ir a...
2. Hacer click en...
3. Ver error

**Comportamiento esperado**
Debería...

**Screenshots**
[adjuntar]

**Ambiente**
- OS: Windows 10
- Node: 18.x
- Docker: 24.x
```

### Request Feature

```markdown
**Descripción**
Descripción clara de la funcionalidad

**Caso de uso**
Por qué es necesario

**Solución propuesta**
Cómo se podría implementar

**Alternativas**
Otros enfoques considerados
```

---

## Ci/CD

Los siguientes checks deben pasar:

```yaml
- ✅ npm run lint
- ✅ npm run typecheck
- ✅ npm test
- ✅ npm run build
```

Si fallan, no se puede hacer merge.

---

## Release Planning

Versioning: Semantic Versioning (MAJOR.MINOR.PATCH)

**MAJOR:** Breaking changes
```bash
npm version major
```

**MINOR:** Nueva funcionalidad compatible
```bash
npm version minor
```

**PATCH:** Bug fixes
```bash
npm version patch
```

---

## Preguntas?

- 📧 Email: dev@cgrisala.com
- 💬 Discussions: GitHub Discussions
- 📝 Issues: GitHub Issues

---

¡Gracias por contribuir! 🎉
