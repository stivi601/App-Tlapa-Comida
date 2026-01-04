#!/bin/bash

# Script para gestionar PostgreSQL local para Tlapa Comida

case "$1" in
  start)
    echo "🚀 Iniciando PostgreSQL..."
    /usr/local/opt/postgresql@15/bin/pg_ctl -D /usr/local/var/postgresql@15 start
    ;;
  stop)
    echo "🛑 Deteniendo PostgreSQL..."
    /usr/local/opt/postgresql@15/bin/pg_ctl -D /usr/local/var/postgresql@15 stop
    ;;
  status)
    echo "📊 Estado de PostgreSQL:"
    /usr/local/opt/postgresql@15/bin/pg_ctl -D /usr/local/var/postgresql@15 status
    ;;
  restart)
    echo "🔄 Reiniciando PostgreSQL..."
    /usr/local/opt/postgresql@15/bin/pg_ctl -D /usr/local/var/postgresql@15 restart
    ;;
  psql)
    echo "🗄️  Abriendo consola PostgreSQL..."
    /usr/local/opt/postgresql@15/bin/psql -d tlapa_comida_dev
    ;;
  reset)
    echo "⚠️  Reiniciando base de datos..."
    read -p "¿Estás seguro? Esto borrará todos los datos. (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      /usr/local/opt/postgresql@15/bin/dropdb tlapa_comida_dev
      /usr/local/opt/postgresql@15/bin/createdb tlapa_comida_dev
      cd backend && npx prisma migrate dev --name init && npx prisma db seed
      echo "✅ Base de datos reiniciada"
    fi
    ;;
  *)
    echo "Uso: $0 {start|stop|status|restart|psql|reset}"
    echo ""
    echo "Comandos:"
    echo "  start   - Iniciar PostgreSQL"
    echo "  stop    - Detener PostgreSQL"
    echo "  status  - Ver estado de PostgreSQL"
    echo "  restart - Reiniciar PostgreSQL"
    echo "  psql    - Abrir consola de PostgreSQL"
    echo "  reset   - Reiniciar base de datos (borra todos los datos)"
    exit 1
    ;;
esac
