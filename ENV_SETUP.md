# ✅ Variables de Entorno Configuradas

## 📦 Archivos Creados

1. **`.env`** - Archivo con variables de entorno (NO se sube a GitHub)
2. **`.env.example`** - Plantilla de ejemplo (SÍ se sube a GitHub)
3. **`.gitignore`** - Actualizado para ignorar archivos .env
4. **`ENV_GUIDE.md`** - Guía completa de uso

---

## 🔐 Variables Incluidas

### Configuración Actual

```env
✅ Información de la app (nombre, versión)
✅ Feature flags (geolocalización, WhatsApp, ratings)
✅ Configuración de delivery (tarifa, mínimo, distancia)
```

### Para Futuras Integraciones

```env
🔮 API Backend
🔮 Google Maps
🔮 Firebase (autenticación, base de datos)
🔮 Stripe/PayPal (pagos)
🔮 WhatsApp Business
🔮 Google/Facebook Login
🔮 SendGrid (emails)
🔮 Twilio (SMS)
🔮 Cloudinary (imágenes)
🔮 Analytics (Google Analytics, Mixpanel)
```

---

## 🚀 Cómo Usar

### 1. Configurar Variables

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env con tus valores
```

### 2. Acceder en el Código

```javascript
// Cualquier variable que empiece con VITE_ es accesible
const appName = import.meta.env.VITE_APP_NAME;
const apiUrl = import.meta.env.VITE_API_URL;
const enableGeo = import.meta.env.VITE_ENABLE_GEOLOCATION === 'true';
```

### 3. Ejemplo Práctico

```javascript
// src/utils/whatsapp.js
const BUSINESS_NUMBER = import.meta.env.VITE_WHATSAPP_BUSINESS_NUMBER;

export const shareToWhatsApp = (message) => {
    const url = BUSINESS_NUMBER 
        ? `https://wa.me/${BUSINESS_NUMBER}?text=${message}`
        : `https://wa.me/?text=${message}`;
    
    window.open(url, '_blank');
};
```

---

## 🔒 Seguridad

### ✅ Configurado Correctamente

- `.env` está en `.gitignore` (NO se sube a GitHub)
- `.env.example` SÍ se sube (sin valores sensibles)
- Solo variables `VITE_*` son accesibles en frontend

### ⚠️ Importante

1. **NUNCA** subas `.env` a GitHub
2. **SIEMPRE** usa `.env.example` como plantilla
3. **CAMBIA** valores secretos en producción
4. **NO** pongas claves privadas en variables `VITE_*`

---

## 📋 Variables Actuales

### Aplicación
```env
VITE_APP_NAME=Tlapa Comida
VITE_APP_VERSION=1.0.0
```

### Features Habilitados
```env
VITE_ENABLE_GEOLOCATION=true      ✅ Ubicación GPS
VITE_ENABLE_WHATSAPP_SHARE=true   ✅ Compartir por WhatsApp
VITE_ENABLE_RATINGS=true          ✅ Calificaciones
VITE_ENABLE_NOTIFICATIONS=true    ✅ Notificaciones
```

### Configuración de Delivery
```env
VITE_DEFAULT_DELIVERY_FEE=20      💰 Tarifa por defecto
VITE_MIN_ORDER_AMOUNT=50          📦 Pedido mínimo
VITE_MAX_DELIVERY_DISTANCE=10     📍 Distancia máxima (km)
```

---

## 🌍 Deployment

### Vercel
```
Settings → Environment Variables → Agregar cada variable
```

### Netlify
```
Site settings → Environment → Agregar variables
```

### Heroku
```bash
heroku config:set VITE_API_URL=https://api.ejemplo.com
```

---

## 📚 Documentación

Lee **`ENV_GUIDE.md`** para:
- Guía completa de todas las variables
- Ejemplos de uso en código
- Cómo obtener API keys
- Troubleshooting
- Best practices

---

## ✅ Checklist

- [x] `.env` creado
- [x] `.env.example` creado
- [x] `.gitignore` actualizado
- [x] Guía de uso creada
- [ ] Completar valores en `.env` según necesites
- [ ] Configurar variables en plataforma de deployment

---

## 🎯 Próximos Pasos

1. **Ahora:** Usa las variables actuales
2. **Futuro:** Agrega API keys cuando integres servicios externos
3. **Producción:** Configura variables en tu plataforma de hosting

---

## 📖 Archivos Relacionados

- **`.env`** - Tus variables (privado)
- **`.env.example`** - Plantilla (público)
- **`ENV_GUIDE.md`** - Guía completa
- **`.gitignore`** - Configuración de Git

---

¡Variables de entorno listas! 🎉
