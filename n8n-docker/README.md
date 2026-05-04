# Despliegue n8n (producción)

Archivos incluidos:

- `docker-compose.prod.yml` — Compose con Traefik (TLS) y Postgres.
- `.env.example` — Variables de entorno de ejemplo.
- `secrets/` — No incluido; crear localmente con contraseñas.

Rápido:

1. Copia `.env.example` a `.env` y completa las variables.
2. Crea la carpeta `secrets` y añade los archivos:

```bash
mkdir -p n8n-docker/secrets
echo "your-postgres-pass" > n8n-docker/secrets/postgres_password
echo "your-n8n-basic-auth-pass" > n8n-docker/secrets/n8n_basic_auth_password
chmod 600 n8n-docker/secrets/*
```

3. Levanta los servicios desde la carpeta `n8n-docker`:

```bash
docker compose -f docker-compose.prod.yml --env-file .env up -d
```

Notas importantes:
- Mantén `n8n_data`, `postgres_data`, `letsencrypt` y `secrets` fuera del control de versiones.
- Para migrar desde SQLite, exporta workflows desde la UI o usa la CLI y sincroniza con la nueva base de datos.
