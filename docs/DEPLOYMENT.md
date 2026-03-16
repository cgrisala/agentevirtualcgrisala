# 🚀 Guía de Despliegue

Despliegue del Agente Virtual CGrisala en producción.

## Entornos

```
        Local Dev              Staging               Production
        =========              =======               ===========
Port    3000, 5678, 8080       3000, 5678, 8080      443 (HTTPS)
DB      SQLite                 PostgreSQL            PostgreSQL
URL     localhost              staging.example.com   app.cgrisala.com
SSL     No                     Self-signed           Let's Encrypt
```

## 📋 Pre-requisitos Producción

- Servidor Linux (Ubuntu 22.04 recomendado)
- Docker + Docker Compose instalados
- Dominio propio
- Email para Let's Encrypt
- Acceso SSH
- Mínimo 4GB RAM, 2 CPU

## 🏗️ Arquitectura Producción

```
┌─────────────────────────────────────────────────┐
│          CloudFlare / CDN                       │
└────────────────────┬────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────┐
│    Traefik (Reverse Proxy + HTTPS)              │
│    ✓ Let's Encrypt automático                   │
│    ✓ Load balancing                             │
│    ✓ SSL termination                            │
└────────────┬────────────────────────┬───────────┘
             ↓                        ↓
        ┌─────────┐              ┌─────────┐
        │  API    │              │  n8n    │
        │ Backend │              └─────────┘
        └────┬────┘
             ↓
        ┌─────────────────────┐
        │   PostgreSQL 15     │
        │   ✓ Backups         │
        │   ✓ Replicación     │
        └─────────────────────┘
```

## 🔐 Configuración de Producción

### 1. Preparar Servidor

```bash
# SSH al servidor
ssh user@your-server.com

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L \
  https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-linux-x86_64 \
  -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verificar
docker --version && docker compose version
```

### 2. Clonar Repositorio

```bash
cd /opt
git clone https://github.com/tuuser/agente-virtual-cgrisala.git
cd agente-virtual-cgrisala/n8n-docker
```

### 3. Configurar Variables de Entorno

```bash
cp .env.example .env
nano .env
```

**Valores DEBE ser diferentes:**
```dotenv
# EMAIL para Let's Encrypt
LETSENCRYPT_EMAIL=admin@cgrisala.com

# Tu dominio
N8N_HOST=app.cgrisala.com

# Version estable
N8N_VERSION=1.0.0

# Contraseñas FUERTE
POSTGRES_DB=n8n
POSTGRES_USER=n8n_prod

# Basic Auth habilitado
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
```

### 4. Crear Secretos Seguros

**En Windows PowerShell (desde dev):**
```powershell
.\scripts\create_secrets.ps1
```

**En Linux (manual):**
```bash
# Crear carpeta
mkdir -p secrets

# Generar contraseñas seguras
openssl rand -base64 24 > secrets/postgres_password
openssl rand -base64 24 > secrets/n8n_basic_auth_password

# Restringir permisos
chmod 600 secrets/*
```

### 5. Copiar a Servidor

```bash
# Desde local
scp -r secrets/ user@server:/opt/agente-virtual-cgrisala/n8n-docker/

# O manualmente en servidor
# Crear archivos con valores seguros
mkdir -p /opt/agente-virtual-cgrisala/n8n-docker/secrets
nano /opt/agente-virtual-cgrisala/n8n-docker/secrets/postgres_password
nano /opt/agente-virtual-cgrisala/n8n-docker/secrets/n8n_basic_auth_password
chmod 600 /opt/agente-virtual-cgrisala/n8n-docker/secrets/*
```

### 6. Iniciar Servicios

```bash
cd /opt/agente-virtual-cgrisala/n8n-docker

# Usar compose de producción
docker compose -f docker-compose.prod.yml up -d

# Verificar
docker compose ps
docker compose logs -f n8n
```

### 7. Configurar API Backend

```bash
cd /opt/agente-virtual-cgrisala/backend

# Instalar dependencias
npm ci --production

# Crear .env
cp .env.example .env
nano .env
```

**Variables de producción:**
```dotenv
NODE_ENV=production
PORT=3000
API_BASE_URL=https://app.cgrisala.com

# BD (misma que n8n)
DB_HOST=db
DB_PORT=5432
DB_USER=n8n_prod
DB_PASSWORD=<del archivo secrets>
DB_NAME=n8n

# JWT seguro
JWT_SECRET=<generar con: openssl rand -base64 32>
JWT_EXPIRATION=24h

# n8n
N8N_API_URL=http://n8n:5678
N8N_API_KEY=<generar en n8n UI>

# Evolution
EVOLUTION_API_URL=http://evolution:8080
EVOLUTION_API_KEY=<configurar>

# Logs
LOG_LEVEL=info
LOG_FORMAT=json

CORS_ORIGIN=https://app.cgrisala.com
```

### 8. Build y Deployar API

```bash
# Compilar TS
npm run build

# Crear Dockerfile si no existe
cat > Dockerfile << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY dist ./dist
COPY package*.json ./
RUN npm ci --production
EXPOSE 3000
CMD ["node", "dist/index.js"]
EOF

# Build imagen docker
docker build -t agente-api:latest .

# Run con docker compose ext.
# Agregar a docker-compose.prod.yml:
# services:
#   api:
#     image: agente-api:latest
#     ports:
#       - "3000:3000"
#     labels:
#       - "traefik.enable=true"
#       - "traefik.http.routers.api.rule=Host(`api.cgrisala.com`)"
```

---

## 🔒 Seguridad en Producción

### Firewall

```bash
sudo ufw allow 22/tcp       # SSH
sudo ufw allow 80/tcp       # HTTP
sudo ufw allow 443/tcp      # HTTPS
sudo ufw enable
```

### Certificados SSL

```bash
# Validar ruta de Let's Encrypt
ls -la ./letsencrypt/

# Auto-renovación (Traefik lo maneja)
docker logs -f traefik
```

### Backups Automáticos

```bash
# Crear script de backup
cat > /home/user/backup-daily.sh << 'EOF'
#!/bin/bash
cd /opt/agente-virtual-cgrisala/n8n-docker
./scripts/backup_restore.ps1 -Action backup
EOF

chmod +x /home/user/backup-daily.sh

# Agendar con cron (2 AM diariamente)
crontab -e
0 2 * * * /home/user/backup-daily.sh
```

### Monitoreo

```bash
# Health checks
curl https://app.cgrisala.com/health

# Logs
docker logs n8n_hotel_agent -f
docker logs postgres -f

# Recursos
docker stats

# Disco
df -h
```

---

## 📈 Escalabilidad

### Load Balancing con Nginx

```nginx
# /etc/nginx/sites-available/app.cgrisala.com
upstream api_backend {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;  # segundo instance
}

server {
    listen 80;
    server_name api.cgrisala.com;
    
    location / {
        proxy_pass http://api_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Replicación PostgreSQL

```bash
# Configurar streaming replication
# Ver postgresql documentation
```

---

## 🚨 Monitoring

### Prometheus (Recomendado)

```yaml
# docker-compose.prod.yml
prometheus:
  image: prom/prometheus
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
  ports:
    - "9090:9090"
```

### Alertas

```
- CPU > 80%
- Memoria > 85%
- Disco > 90%
- Errores BD > 5/min
```

---

## 📝 Checklist de Despliegue

```
Antes de ir a producción:

✅ Dominio registrado y apuntando al servidor
✅ Certificado SSL configurado
✅ Contraseñas seguras en secrets/
✅ CORS configurado con dominio real
✅ JWT_SECRET único y fuerte
✅ DB backups configurados
✅ Monitoreo habilitado
✅ Logs centralizados
✅ Firewall restringido
✅ Rate limiting habilitado
✅ CORS headers configurados
✅ Secrets no en git
✅ Tests ejecutados y pasando
✅ Documentación actualizada
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy-prod.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t agente-api:latest .
      
      - name: Push to registry
        run: |
          docker tag agente-api:latest ${{ secrets.REGISTRY }}/agente-api:latest
          docker push ...
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/agente-virtual-cgrisala
            docker compose pull
            docker compose up -d
            docker compose exec api npm run db:migrate
```

---

## 📞 Soporte en Producción

En caso de problemas:

```bash
# Ver logs
docker compose logs -f n8n
docker compose logs -f db
docker compose logs -f api

# Reiniciar servicio
docker compose restart n8n

# Rollback
git checkout <commit-anterior>
docker compose up -d
```

---

Para más ayuda, ver [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
