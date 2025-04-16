#!/bin/sh

echo "⏳ Aguardando o banco de dados iniciar..."
until nc -z $DB_HOST $DB_PORT; do
  sleep 1
done

echo "✅ Banco de dados disponível. Executando migrations..."
npm run migration:run

echo "🚀 Iniciando a aplicação NestJS..."
exec npm run start:prod
