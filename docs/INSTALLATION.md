# 🚀 Guía de Instalación

## Requisitos del Sistema

### Hardware Mínimo
- CPU: 2 cores (4 recomendado)
- RAM: 4GB (8GB recomendado)
- Storage: 10GB (SSD recomendado)
- Internet: Conexión estable

### Software Requerido

| Software | Versión | Windows | macOS | Linux |
|----------|---------|---------|-------|-------|
| Docker | 24.0+ | ✅ | ✅ | ✅ |
| Docker Compose | 2.20+ | ✅ | ✅ | ✅ |
| Node.js | 18.0+ | ✅ | ✅ | ✅ |
| npm | 9.0+ | ✅ | ✅ | ✅ |
| Git | Latest | ✅ | ✅ | ✅ |
| PostgreSQL | 15 | Vía Docker | Vía Docker | Vía Docker |

## 1. Instalación de Dependencias

### Windows

#### Docker Desktop
1. Descargar: https://www.docker.com/products/docker-desktop
2. Ejecutar instalador
3. Reiniciar PC
4. Verificar:
```powershell
docker --version
docker compose version
```

#### Node.js
1. Descargar: https://nodejs.org/ (versión LTS)
2. Ejecutar instalador
3. Permitir PATH
4. Verificar:
```powershell
node --version
npm --version
```

#### Git
1. Descargar: https://git-scm.com/download/win
2. Ejecutar instalador
3. Usar valor por defecto para PowerShell
4. Verificar:
```powershell
git --version
```

### macOS

```bash
# Instalar Homebrew (si no está)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar dependencias
brew install docker docker-compose node git

# Verificar
docker --version
docker compose version
node --version
npm --version
git --version
```

### Linux (Ubuntu/Debian)

```bash
# Actualizar paquetes
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar Git
sudo apt install -y git

# Verificar
docker --version
docker compose version
node --version
npm --version
git --version
```

## 2. Clonar el Repositorio

```bash
git clone https://github.com/tuuser/agente-virtual-cgrisala.git
cd agente-virtual-cgrisala
```

## 3. Configuración de n8n + Evolution API

### Paso 1: Copiar variables de entorno

```bash
cd n8n-docker
cp .env.example .env
```

### Paso 2: Editar `.env` (configuración local)

```bash
# Abrir con editor
# Windows:
notepad .env
# macOS/Linux:
nano .env
```

**Contenido actualizado:**
```dotenv
LETSENCRYPT_EMAIL=your-email@example.com
N8N_VERSION=latest
N8N_HOST=localhost
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
POSTGRES_DB=n8n
POSTGRES_USER=n8n
```

### Paso 3: Crear carpeta de secretos

```powershell
# Windows PowerShell
mkdir -p secrets

# Crear archivos
@"
your_strong_postgres_password
"@ | Out-File -FilePath secrets/postgres_password -Encoding ASCII -NoNewline

@"
your_strong_n8n_password
"@ | Out-File -FilePath secrets/n8n_basic_auth_password -Encoding ASCII -NoNewline
```

```bash
# macOS/Linux
mkdir -p secrets
echo "your_strong_postgres_password" > secrets/postgres_password
echo "your_strong_n8n_password" > secrets/n8n_basic_auth_password
chmod 600 secrets/*
```

### Paso 4: Iniciar servicios

```bash
# Iniciar n8n, Evolution API, PostgreSQL
docker compose up -d

# Verificar status
docker compose ps

# Ver logs
docker compose logs -f n8n
```

### Paso 5: Verificar acceso

```
✅ n8n UI: http://localhost:5678
   Usuario: admin
   Contraseña: <la que configuraste>

✅ n8n API: http://localhost:5678/api/
   
✅ Evolution API: http://localhost:8080
   API Key: Balandu2026*
```

## 4. Configuración de Backend API

### Paso 1: Instalar dependencias

```bash
cd ../backend
npm install
```

**Tiempo estimado:** 2-5 minutos

### Paso 2: Copiar variables de entorno

```bash
cp .env.example .env
```

### Paso 3: Editar `.env`

```bash
# Windows
notepad .env
# macOS/Linux
nano .env
```

**Valores recomendados para desarrollo:**
```dotenv
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost:3000

DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=n8n
DB_PASSWORD=your_strong_postgres_password
DB_NAME=n8n

JWT_SECRET=your_super_secret_jwt_key_must_be_strong_and_long
JWT_EXPIRATION=24h

N8N_API_URL=http://localhost:5678
N8N_API_KEY=<generar en n8n UI>

EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=Balandu2026*

LOG_LEVEL=debug
LOG_FORMAT=json

CORS_ORIGIN=http://localhost:3000
```

### Paso 4: Iniciar en desarrollo

```bash
npm run dev
```

**Esperado:**
```
🚀 Server running on port 3000 in development mode
```

### Paso 5: Verificar API

```bash
curl http://localhost:3000/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-16T10:00:00.000Z",
  "uptime": 1.23456
}
```

## 5. Verificación Completa

### Checklist

```
✅ Docker ejecutándose
   docker ps

✅ n8n disponible
   http://localhost:5678

✅ Evolution API disponible
   http://localhost:8080

✅ PostgreSQL conectada
   docker compose exec db psql -U n8n -d n8n -c "SELECT 1"

✅ API Backend ejecutándose
   http://localhost:3000/health

✅ Logs sin errores
   npm run dev (terminal)
```

### Script de Verificación

```powershell
# Windows PowerShell

echo "Checking Docker..."
docker ps

echo "`nChecking n8n..."
Invoke-WebRequest -Uri http://localhost:5678

echo "`nChecking Evolution API..."
Invoke-WebRequest -Uri http://localhost:8080

echo "`nChecking Backend API..."
Invoke-WebRequest -Uri http://localhost:3000/health

echo "`nAll systems operational!"
```

```bash
# Linux/macOS

echo "Checking Docker..."
docker ps

echo -e "\nChecking n8n..."
curl http://localhost:5678

echo -e "\nChecking Evolution API..."
curl http://localhost:8080

echo -e "\nChecking Backend API..."
curl http://localhost:3000/health

echo -e "\nAll systems operational!"
```

## 6. Primeros Pasos en n8n

### 1. Acceder a n8n
```
URL: http://localhost:5678
Usuario: admin
Contraseña: <configurada en paso 3>
```

### 2. Cambiar contraseña
Settings → User Settings → Change Password

### 3. Crear API Key
Settings → Create API Key
(Guardar para usar en Backend API)

### 4. Importar workflows iniciales
Workflows → Import → Seleccionar archivo JSON

## 7. Primeros Pasos en Backend API

### 1. Ver documentación

```bash
# Swagger (cuando esté implementado)
http://localhost:3000/api/docs
```

### 2. Registrar usuario

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePassword123!",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

### 3. Hacer login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePassword123!"
  }'
```

## 8. Base de Datos

### Acceder a PostgreSQL

```bash
# Desde dentro de docker
docker compose exec db psql -U n8n -d n8n

# Comandos útiles
\dt              # Listar tablas
\du              # Listar usuarios
\l               # Listar bases de datos
SELECT VERSION() # Ver versión de PostgreSQL
```

### Crear migraciones

```bash
cd backend
npm run db:migrate
npm run db:seed
```

## Troubleshooting de Instalación

### ❌ "docker: command not found"
**Solución:**
```
1. Reinstalar Docker Desktop
2. Verificar que está en PATH
3. Reiniciar terminal/PC
```

### ❌ "Port 5678 already in use"
**Solución:**
```bash
# Identificar proceso
lsof -i :5678

# O cambiar puerto en docker-compose.yml
services:
  n8n:
    ports:
      - "5679:5678"
```

### ❌ "Error de conexión a PostgreSQL"
**Solución:**
```bash
# Reiniciar servicios
docker compose down
docker compose up -d

# Verificar logs
docker compose logs db
```

### ❌ "npm install stuck"
**Solución:**
```bash
# Limpiar cache
npm cache clean --force

# Reintentar
npm install --verbose
```

## Próximos Pasos

1. **Leer:**
   - [ARCHITECTURE.md](./ARCHITECTURE.md) - Entender arquitetura
   - [DEVELOPMENT.md](./DEVELOPMENT.md) - Guía de desarrollo

2. **Crear:**
   - Primeros workflows en n8n
   - Tabla de usuarios en BD
   - Endpoints API según necesidades

3. **Testing:**
   - Ejecutar tests: `npm test`
   - Probar API endpoints
   - Integración n8n

---

**¿Problemas?** Consulta [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
