# 🔐 Guía de Variables de Entorno

## 📋 Descripción

Este proyecto usa variables de entorno para configurar diferentes aspectos de la aplicación. Las variables se definen en el archivo `.env` y son accesibles en el código a través de `import.meta.env`.

---

## 🚀 Configuración Inicial

### 1. Crear archivo .env

```bash
# Copia el archivo de ejemplo
cp .env.example .env
```

### 2. Editar valores

Abre `.env` y completa los valores según tus necesidades.

---

## 📝 Variables Disponibles

### Aplicación

```env
VITE_APP_NAME=Tlapa Comida
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Plataforma de Delivery de Comida
```

### API (Para futuro backend)

```env
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000
```

### WhatsApp

```env
# Número de negocio (formato internacional sin +)
VITE_WHATSAPP_BUSINESS_NUMBER=521234567890
```

**Uso en código:**
```javascript
const whatsappNumber = import.meta.env.VITE_WHATSAPP_BUSINESS_NUMBER;
const url = `https://wa.me/${whatsappNumber}?text=${message}`;
```

### Google Maps

```env
VITE_GOOGLE_MAPS_API_KEY=tu-api-key-aqui
```

**Obtener API Key:**
1. Ve a https://console.cloud.google.com/
2. Crea un proyecto
3. Habilita "Maps JavaScript API"
4. Crea credenciales (API Key)

**Uso en código:**
```javascript
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
```

### Firebase (Autenticación y Base de Datos)

```env
VITE_FIREBASE_API_KEY=tu-api-key
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Obtener credenciales:**
1. Ve a https://console.firebase.google.com/
2. Crea un proyecto
3. Agrega una app web
4. Copia las credenciales

### Pasarelas de Pago

#### Stripe

```env
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

**Obtener:**
- https://dashboard.stripe.com/apikeys

#### PayPal

```env
VITE_PAYPAL_CLIENT_ID=tu-client-id
```

**Obtener:**
- https://developer.paypal.com/

### Configuración de la App

```env
VITE_DEFAULT_DELIVERY_FEE=20
VITE_MIN_ORDER_AMOUNT=50
VITE_MAX_DELIVERY_DISTANCE=10
```

### Feature Flags

```env
VITE_ENABLE_GEOLOCATION=true
VITE_ENABLE_WHATSAPP_SHARE=true
VITE_ENABLE_RATINGS=true
VITE_ENABLE_NOTIFICATIONS=true
```

**Uso en código:**
```javascript
const isGeolocationEnabled = import.meta.env.VITE_ENABLE_GEOLOCATION === 'true';

if (isGeolocationEnabled) {
    // Usar geolocalización
}
```

### Social Login

```env
VITE_GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
VITE_FACEBOOK_APP_ID=123456789
```

### Analytics

```env
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_MIXPANEL_TOKEN=tu-token
```

### Email (SendGrid)

```env
VITE_SENDGRID_API_KEY=SG.xxxxx
VITE_EMAIL_FROM=noreply@tlapacomida.com
```

### SMS (Twilio)

```env
VITE_TWILIO_ACCOUNT_SID=ACxxxxx
VITE_TWILIO_AUTH_TOKEN=tu-token
VITE_TWILIO_PHONE_NUMBER=+1234567890
```

### Almacenamiento de Imágenes (Cloudinary)

```env
VITE_CLOUDINARY_CLOUD_NAME=tu-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=tu-preset
```

---

## 💻 Uso en el Código

### Acceder a variables

```javascript
// En cualquier archivo .jsx o .js
const apiUrl = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;
const isDebug = import.meta.env.VITE_DEBUG_MODE === 'true';
```

### Ejemplo: Configurar API

```javascript
// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000;

export const fetchData = async (endpoint) => {
    const response = await fetch(`${API_URL}/${endpoint}`, {
        timeout: TIMEOUT
    });
    return response.json();
};
```

### Ejemplo: WhatsApp con número de negocio

```javascript
// src/utils/whatsapp.js
const BUSINESS_NUMBER = import.meta.env.VITE_WHATSAPP_BUSINESS_NUMBER;

export const shareToWhatsApp = (message) => {
    const url = BUSINESS_NUMBER 
        ? `https://wa.me/${BUSINESS_NUMBER}?text=${encodeURIComponent(message)}`
        : `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');
};
```

### Ejemplo: Feature Flags

```javascript
// src/components/LocationShare.jsx
const ENABLE_GEOLOCATION = import.meta.env.VITE_ENABLE_GEOLOCATION === 'true';

export default function LocationShare() {
    if (!ENABLE_GEOLOCATION) {
        return null; // No mostrar componente si está deshabilitado
    }
    
    // Resto del componente...
}
```

---

## 🔒 Seguridad

### ⚠️ IMPORTANTE

1. **NUNCA** subas el archivo `.env` a GitHub
2. **SIEMPRE** usa `.env.example` como plantilla
3. **CAMBIA** todos los valores secretos en producción
4. **NO** pongas claves privadas en variables `VITE_*`

### Variables Públicas vs Privadas

**✅ Seguro (Frontend - VITE_*):**
```env
VITE_API_URL=https://api.ejemplo.com
VITE_GOOGLE_MAPS_API_KEY=tu-key-publica
```

**❌ NO Seguro (Backend - sin VITE_):**
```env
DATABASE_URL=postgresql://...
JWT_SECRET=super-secret-key
STRIPE_SECRET_KEY=sk_live_...
```

> **Nota:** En Vite, solo las variables que empiezan con `VITE_` son accesibles en el frontend. Las demás son solo para el backend.

---

## 🌍 Entornos

### Desarrollo

```env
VITE_API_URL=http://localhost:3000/api
VITE_DEBUG_MODE=true
VITE_SHOW_CONSOLE_LOGS=true
```

### Producción

```env
VITE_API_URL=https://api.tlapacomida.com/api
VITE_DEBUG_MODE=false
VITE_SHOW_CONSOLE_LOGS=false
```

### Múltiples archivos

```
.env                # Valores por defecto
.env.local          # Sobrescribe .env (no se sube a git)
.env.development    # Desarrollo
.env.production     # Producción
```

---

## 🧪 Testing

Para tests, crea `.env.test`:

```env
VITE_API_URL=http://localhost:3001/api
VITE_DEBUG_MODE=true
```

---

## 📦 Deployment

### Vercel

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega cada variable manualmente

### Netlify

1. Site settings → Build & deploy → Environment
2. Agrega variables

### Heroku

```bash
heroku config:set VITE_API_URL=https://api.ejemplo.com
```

---

## ✅ Checklist

- [ ] Copiar `.env.example` a `.env`
- [ ] Completar valores necesarios
- [ ] Verificar que `.env` está en `.gitignore`
- [ ] NO subir `.env` a GitHub
- [ ] Configurar variables en plataforma de deployment
- [ ] Cambiar valores secretos en producción

---

## 🆘 Troubleshooting

### Variables no se cargan

```bash
# Reinicia el servidor de desarrollo
npm run dev
```

### Variables undefined

Verifica que:
1. El nombre empiece con `VITE_`
2. El archivo `.env` esté en la raíz del proyecto
3. Hayas reiniciado el servidor después de agregar variables

### Valores incorrectos

```javascript
// Debug: Ver todas las variables
console.log(import.meta.env);
```

---

## 📚 Recursos

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Google Maps API](https://developers.google.com/maps)
- [Firebase Setup](https://firebase.google.com/docs/web/setup)
- [Stripe API Keys](https://stripe.com/docs/keys)

---

## 🎯 Ejemplo Completo

```javascript
// src/config/app.config.js
export const config = {
    app: {
        name: import.meta.env.VITE_APP_NAME,
        version: import.meta.env.VITE_APP_VERSION,
    },
    api: {
        url: import.meta.env.VITE_API_URL,
        timeout: parseInt(import.meta.env.VITE_API_TIMEOUT),
    },
    features: {
        geolocation: import.meta.env.VITE_ENABLE_GEOLOCATION === 'true',
        whatsapp: import.meta.env.VITE_ENABLE_WHATSAPP_SHARE === 'true',
        ratings: import.meta.env.VITE_ENABLE_RATINGS === 'true',
    },
    delivery: {
        defaultFee: parseInt(import.meta.env.VITE_DEFAULT_DELIVERY_FEE),
        minAmount: parseInt(import.meta.env.VITE_MIN_ORDER_AMOUNT),
        maxDistance: parseInt(import.meta.env.VITE_MAX_DELIVERY_DISTANCE),
    }
};

// Uso
import { config } from './config/app.config';
console.log(config.app.name); // "Tlapa Comida"
```

---

¡Listo! Ahora puedes usar variables de entorno en tu proyecto. 🚀
