# 🚀 QUICK START GUIDE

Referencia rápida para iniciar el Agente Virtual CGrisala.

## 5 Minutos - Desarrollo Local

```bash
# Terminal 1: Backend API
cd backend
npm install
npm run dev
# → http://localhost:3000

# Terminal 2: n8n + Evolution
cd n8n-docker
docker compose up -d
# → n8n: http://localhost:5678
# → Evolution: http://localhost:8080
```

## Comandos Esenciales

### Backend

```bash
# Instalar
npm install

# Desarrollo (hot reload)
npm run dev

# Build
npm run build

# Tests
npm test

# Linting
npm run lint
npm run lint:fix

# Formatear código
npm run format

# Validar tipos
npm run typecheck

# Base de datos
npm run db:migrate
npm run db:seed
```

### Docker (n8n)

```bash
# Iniciar
docker compose up -d

# Ver logs
docker compose logs -f n8n

# Parar
docker compose down

# Reiniciar servicio
docker compose restart n8n

# Status
docker compose ps

# Limpiar (⚠️ borra datos)
docker compose down -v
```

## URLs de Desarrollo

| Servicio | URL | Usuario | Contraseña |
|----------|-----|---------|-----------|
| API Backend | http://localhost:3000 | - | - |
| n8n UI | http://localhost:5678 | admin | *(en .env)* |
| Evolution API | http://localhost:8080 | - | - |
| Health Check | http://localhost:3000/health | - | - |

## API Endpoints Principales

```bash
# Registro
POST http://localhost:3000/api/auth/register
{"email":"user@ex.com","password":"Pass123!","firstName":"Juan","lastName":"Pérez"}

# Login
POST http://localhost:3000/api/auth/login
{"email":"user@ex.com","password":"Pass123!"}

# Listar reservas (requiere token)
GET http://localhost:3000/api/reservations
Header: Authorization: Bearer <token>

# Health
GET http://localhost:3000/health
```

## Estructura de Carpetas

```
agente-virtual-cgrisala/
├── backend/              # API REST (Node.js + TypeScript)
├── n8n-docker/          # Orquestación (n8n + Evolution)
├── docs/                # Documentación completa
├── monitoring/          # Stack de monitoreo
├── .github/workflows/   # CI/CD
└── .gitignore          # Archivos ignorados
```

## Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `backend/.env.example` | Variables de backend |
| `backend/package.json` | Dependencias |
| `backend/src/index.ts` | Punto de entrada |
| `n8n-docker/.env.example` | Variables de n8n |
| `n8n-docker/docker-compose.yml` | Dev services |
| `n8n-docker/docker-compose.prod.yml` | Prod services |
| `docs/README.md` | Documentación principal |
| `docs/API.md` | Referencia de API |

## Solución Rápida de Problemas

| Problema | Solución |
|----------|----------|
| Puerto en uso | Cambiar puerto en `.env` o `docker-compose.yml` |
| npm install lento | `npm cache clean --force` luego `npm install` |
| Docker no inicia | Reiniciar Docker Desktop o servicio |
| BD de conexión fallida | Esperar 30s y `docker compose restart db` |
| Tests falan | `npm run typecheck` y revisar errores |

## Documentación Según Necesidad

**¿Quiero?** → **Leo:**
- Entender el proyecto → `docs/README.md`
- Instalar por primera vez → `docs/INSTALLATION.md`
- Entender arquitectura → `docs/ARCHITECTURE.md`
- Desarrollar features → `docs/DEVELOPMENT.md`
- Consumir API → `docs/API.md`
- Configurar workflows → `docs/N8N_WORKFLOWS.md`
- Desplegar en prod → `docs/DEPLOYMENT.md`
- Solucionar problemas → `docs/TROUBLESHOOTING.md`
- Contribuir código → `docs/CONTRIBUTING.md`

## Variables de Entorno Mínimas

### Backend (.env)

```
NODE_ENV=development
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=n8n
DB_PASSWORD=password
DB_NAME=n8n
JWT_SECRET=dev-secret-key-change-in-prod
N8N_API_URL=http://localhost:5678
EVOLUTION_API_URL=http://localhost:8080
```

### n8n (.env)

```
N8N_HOST=localhost
N8N_VERSION=latest
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
POSTGRES_DB=n8n
POSTGRES_USER=n8n
```

## Primeros Pasos en Código

1. **Crear ruta**: `backend/src/routes/mi-feature.ts`
2. **Crear controller**: `backend/src/controllers/miController.ts`
3. **Crear service**: `backend/src/services/miService.ts`
4. **Crear model**: `backend/src/models/MiEntity.ts`
5. **Registrar ruta**: Agregar en `src/index.ts`
6. **Testear**: `npm test` o Postman/Insomnia

## GitHub Workflow

```bash
# 1. Nueva rama
git checkout -b feature/mi-feature

# 2. Hacer cambios
# ... código ...

# 3. Validar
npm run lint
npm run typecheck
npm test

# 4. Commit
git commit -m "feat(scope): descripción"

# 5. Push
git push origin feature/mi-feature

# 6. PR en GitHub
# ... crear pull request ...
```

## Checklist Pre-Commit

- [ ] `npm run lint` pasa ✅
- [ ] `npm run typecheck` pasa ✅
- [ ] `npm test` pasa ✅
- [ ] Código formateado (`npm run format`)
- [ ] Documentación actualizada
- [ ] No hay `console.log` en prod

## Recursos Rápidos

```bash
# Abrir documentación en navegador
# (macOS)
open docs/README.md

# (Linux)
xdg-open docs/README.md

# (Windows)
start docs/README.md
```

---

**¡Listo para empezar!** 🚀

Más dudas? → `docs/TROUBLESHOOTING.md`
