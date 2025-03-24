#!/bin/sh
set -e

echo "Esperando que la base de datos esté disponible..."
MAX_RETRIES=30
RETRY_INTERVAL=2
count=0

until PGPASSWORD=$POSTGRES_PASSWORD psql -h baileys-db -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-bailey} -c "SELECT 1" > /dev/null 2>&1; do
  count=$((count+1))
  if [ $count -ge $MAX_RETRIES ]; then
    echo "Error: No se pudo conectar a la base de datos después de $MAX_RETRIES intentos."
    exit 1
  fi
  echo "Esperando conexión a la base de datos... ($count/$MAX_RETRIES)"
  sleep $RETRY_INTERVAL
done

echo "Base de datos disponible. Ejecutando migraciones..."

npx prisma migrate deploy

echo "Migraciones completadas. Iniciando aplicación..."

exec "$@"
