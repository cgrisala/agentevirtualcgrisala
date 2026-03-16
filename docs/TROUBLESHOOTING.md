# 🔧 Troubleshooting & FAQ

Soluciones para problemas comunes.

## 🐳 Problemas con Docker

### ❌ "docker: command not found"

**Causa:** Docker no instalado o no en PATH

```bash
# Verificar instalación
docker --version

# Si no funciona:
# Windows: Reinstalar Docker Desktop
# macOS: brew install docker docker-compose
# Linux: curl -fsSL https://get.docker.com | sh
```

### ❌ "Port 5678 already in use"

**Causa:** Otro proceso usando el puerto

**Solución:**
```bash
# Identificar proceso
lsof -i :5678         # macOS/Linux
netstat -ano | findstr :5678  # Windows

# Cambiar puerto en docker-compose.yml
services:
  n8n:
    ports:
      - "5679:5678"   # Cambiar de 5678 a 5679

# Reiniciar
docker compose up -d
```

### ❌ "Cannot connect to Docker daemon"

**Causa:** Docker daemon no está corriendo

**Solución:**
```bash
# Windows/macOS: abrir Docker Desktop
# Linux: 
sudo systemctl start docker
sudo systemctl enable docker  # auto-inicio
```

### ❌ "docker compose: command not found"

**Causa:** Docker Compose versión antigua

```bash
# Actualizar
sudo curl -L \
  https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
  -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verificar
docker compose version
```

---

## 📦 Problemas NPM

### ❌ "npm: command not found"

**Solución:**
```bash
# Reinstalar Node.js desde nodejs.org
# O:
brew install node         # macOS
sudo apt install nodejs   # Linux
```

### ❌ "npm ERR! code ERESOLVE"

**Causa:** Dependencias conflictivas

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### ❌ "npm ERR! EACCES: permission denied"

**Linux/macOS:**
```bash
# Opción 1: Cambiar permisos
sudo chown -R $(whoami) ~/.npm

# Opción 2: Usar nvm
curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

---

## 🗄️ Problemas con Base de Datos

### ❌ "Error de conexión a PostgreSQL"

**Solución:**
```bash
# Verificar que container está corriendo
docker ps | grep postgres

# Ver logs
docker compose logs db

# Reiniciar
docker compose restart db

# Conectar manualmente
docker compose exec db psql -U n8n -d n8n -c "SELECT 1"
```

### ❌ "Error: connect ECONNREFUSED 127.0.0.1:5432"

**Causa:** PostgreSQL no está corriendo

```bash
# Iniciar servicios BD
docker compose up -d db

# Esperar a que se inicie
sleep 5

# Verificar
docker compose logs db
```

### ❌ "FATAL: password authentication failed"

**Causa:** Contraseña incorrecta

**Solución:**
```bash
# Verificar en .env
cat .env | grep POSTGRES

# Verificar .env vs docker-compose
# Deben coincidir

# Reset de contraseña (requiere recrear container)
docker compose down
# Editar .env con nueva contraseña
docker compose up -d
```

### ❌ "database already exists"

```bash
# Eliminar BD
docker compose exec db psql -U n8n -d postgres -c "DROP DATABASE n8n;"

# O usar named volume fresco
docker volume rm agentevirtualcgrisala_postgres_data
```

---

## 🚀 Problemas con n8n

### ❌ "Cannot reach n8n on port 5678"

```bash
# Verificar que está corriendo
docker ps | grep n8n

# Ver logs
docker compose logs n8n

# Verificar puerto
curl http://localhost:5678

# Reiniciar
docker compose restart n8n
```

### ❌ "n8n takes too long to start"

**Causa:** Migraciones de BD lentas

```bash
# Esperar pacientemente (puede tardar 2-3 min)
docker compose logs n8n -f

# Si se queda pegado > 10 min:
docker compose restart n8n

# Revisar logs
docker logs n8n_hotel_agent | tail -100
```

### ❌ "Workflows no aparecen"

```bash
# Verificar que BD tiene datos
docker compose exec db psql -U n8n -d n8n -c "SELECT * FROM workflows;"

# Restaurar desde backup
./scripts/backup_restore.ps1 -Action restore -BackupPath ./backups/last
```

### ❌ "WebSocket connection failed"

**Causa:** Problema de conectividad

```bash
# Limpiar cache del navegador
# Settings → Clear browser cache

# Or:
docker compose restart n8n

# Verificar URL en Settings
http://localhost:5678
```

---

## 🔌 Problemas con Evolution API

### ❌ "Cannot reach Evolution API"

```bash
# Verificar que está corriendo
docker ps | grep evolution

# Ver logs
docker compose logs evolution_api

# Reiniciar
docker compose restart evolution_api

# Verificar Puerto
curl http://localhost:8080
```

### ❌ "WhatsApp messages not sending"

```bash
# Verificar credenciales en .env
echo $EVOLUTION_API_KEY

# Verificar instancia en Evolution
curl http://localhost:8080/instances

# Recrear instancia
docker compose restart evolution_api
```

---

## 🔐 Problemas de Autenticación

### ❌ "Invalid or expired token"

**Causa:** JWT expirado

**Solución:**
```bash
# Hacer login nuevamente
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@ex.com","password":"pass"}'

# Usar nuevo token
Authorization: Bearer <nuevo-token>
```

### ❌ "Missing authentication token"

**Causa:** Header faltante

```bash
# Agregar header al request
-H "Authorization: Bearer <token>"

# Solo endpoints /auth/register y /auth/login no requieren token
```

---

## 🏗️ Problemas de Compilación

### ❌ "TypeScript compilation errors"

```bash
# Verificar tipos
npm run typecheck

# Ver errores específicos
npx tsc --noEmit

# Limpiar y reinstalar
rm -rf node_modules dist
npm install
npm run build
```

### ❌ "Module not found"

**Causa:** Path aliases mal configurados

```bash
# Verificar tsconfig.json
cat tsconfig.json | grep paths

# Reinstalar
npm install
npm run build
```

---

## 📝 Problemas de Logs

### ❌ "Cannot read logs"

```bash
# Ver logs en tiempo real
docker compose logs -f

# Ver logs de servicio específico
docker compose logs -f n8n

# Ver últimas líneas
docker compose logs --tail=50

# Ver con timestamps
docker compose logs --timestamps
```

### ❌ "Logs file too large"

```bash
# Limpiar logs antiguos
docker system prune --volumes

# O rotar manualmente
truncate -s 0 logs/*.log
```

---

## 🔄 Problemas de Env Variables

### ❌ "Environment variable not found"

```bash
# Verificar que .env existe
ls -la .env

# Recargar variables
export $(cat .env | xargs)
echo $N8N_HOST

# En Docker
docker compose config | grep N8N_HOST
```

### ❌ "Values not loading from .env"

```bash
# Asegurarse que archivo está en carpeta correcta
pwd
ls -la .env

# Docker no recarga .env, requiere recrear container
docker compose down
docker compose up -d
```

---

## 💾 Problemas de Almacenamiento

### ❌ "Out of disk space"

```bash
# Ver uso de disco
df -h
docker system df

# Limpiar
docker system prune -a --volumes
docker rmi $(docker images -q)
```

### ❌ "Permission denied" a carpetas

**Linux:**
```bash
sudo chown -R $USER:$USER n8n_data postgres_data

# O para Docker
sudo chown -R 1000:1000 n8n_data postgres_data
```

---

## 🎯 Problemas Específicos de API

### ❌ "API no inicia"

```bash
# Ver logs
npm run dev

# Ver puerto en uso
lsof -i :3000

# Cambiar puerto
PORT=3001 npm run dev
```

### ❌ "Cannot read POST body"

```bash
# Agregar header
-H "Content-Type: application/json"

# Verificar JSON válido
echo '{"key":"value"}' | jq .
```

### ❌ "CORS error"

**Frontend → Backend:**
```bash
# Verificar CORS en .env
echo $CORS_ORIGIN

# Debe coincidir con origin del cliente
# http://localhost:3000 (dev)
# https://app.cgrisala.com (prod)
```

---

## 🛠️ Debugging Avanzado

### Modo Verbose

```bash
# Docker
docker compose --verbose up -d

# Node
DEBUG=* npm run dev

# npm
npm install --verbose
```

### Conectar Debugger VS Code

```json
// .vscode/launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Debug",
  "program": "${workspaceFolder}/node_modules/.bin/tsx",
  "args": ["watch", "src/index.ts"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Inspeccionar BD

```bash
# Conectar con pgAdmin
docker run -d \
  --name pgadmin \
  -p 5050:80 \
  -e PGADMIN_DEFAULT_EMAIL=admin@admin.com \
  -e PGADMIN_DEFAULT_PASSWORD=admin \
  dpage/pgadmin4

# Acceder: http://localhost:5050
```

---

## 📞 Escalación

Si nada funciona:

1. **Reiniciar todo**
   ```bash
   docker compose down -v
   docker compose up -d
   ```

2. **Limpiar volúmenes** (cuidado: borra datos)
   ```bash
   docker volume rm $(docker volume ls -q)
   ```

3. **Contactar soporte**
   - Email: support@cgrisala.com
   - Incluir:
     - Logs completos
     - Versión de Docker
     - OS del sistema
     - Pasos para reproducir

---

## 📖 Recursos Útiles

- [Docker Docs](https://docs.docker.com)
- [n8n Docs](https://docs.n8n.io)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [Node.js Docs](https://nodejs.org/docs)
- [Express Docs](https://expressjs.com)
