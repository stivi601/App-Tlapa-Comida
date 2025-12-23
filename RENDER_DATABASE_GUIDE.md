# Guía de Configuración: Base de Datos PostgreSQL en Render

Esta guía te ayudará a configurar tu base de datos PostgreSQL en Render y conectarla a la aplicación "Tlapa Comida".

## 1. Crear la Base de Datos en Render

1.  Inicia sesión en [Render](https://dashboard.render.com/).
2.  Haz clic en el botón **"New"** (Nuevo) y selecciona **"PostgreSQL"**.
3.  Configura los detalles:
    *   **Name:** `tlapa-comida-db` (o el que prefieras).
    *   **Database:** `tlapa_db`.
    *   **User:** Deja el valor predeterminado o elige uno.
    *   **Region:** Selecciona la más cercana a ti (ej. `Ohio (us-east-2)`).
4.  Selecciona el plan **"Free"** (Gratuito).
5.  Haz clic en **"Create Database"**.

## 2. Obtener la Cadena de Conexión

1.  Una vez creada la base de datos, desplázate hacia abajo hasta la sección **"Connections"**.
2.  Busca **"External Connection String"**.
3.  Copia ese valor. Debería verse algo así:
    `postgresql://user:password@host.render.com/tlapa_db?sslmode=require`

## 3. Configurar el Entorno Local

1.  En tu carpeta raíz, abre el archivo `.env`.
2.  Busca la línea de `DATABASE_URL` o agrégala si no existe.
3.  Pega la cadena de conexión que copiaste:
    ```dotenv
    DATABASE_URL="tu_cadena_de_conexion_externa_aqui"
    ```

## 4. Sincronizar la Base de Datos

Ejecuta los siguientes comandos en tu terminal (dentro de la carpeta `backend`):

```bash
# Sincroniza el esquema con la base de datos remota
npx prisma db push

# (Opcional) Si tienes un script de seed para llenar datos iniciales
# npx prisma db seed
```

## 5. Notas Importantes

*   **SSL Mode:** Render requiere que la cadena de conexión incluya `?sslmode=require`. Asegúrate de que esté al final de tu URL.
*   **Seguridad:** Nunca compartas tu `DATABASE_URL` públicamente.
