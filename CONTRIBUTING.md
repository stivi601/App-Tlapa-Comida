# Contribuir a Tlapa Comida

¡Gracias por tu interés en contribuir a Tlapa Comida! 🎉

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)
- [Pull Requests](#pull-requests)
- [Guía de Estilo](#guía-de-estilo)
- [Configuración del Entorno](#configuración-del-entorno)

## 🤝 Código de Conducta

Este proyecto se adhiere a un código de conducta. Al participar, se espera que mantengas este código. Por favor reporta comportamientos inaceptables.

## 🚀 Cómo Contribuir

### Reportar Bugs

Si encuentras un bug, por favor crea un issue con:

- **Título descriptivo**
- **Pasos para reproducir** el problema
- **Comportamiento esperado** vs **comportamiento actual**
- **Screenshots** si es posible
- **Versión del navegador** y sistema operativo

**Ejemplo:**
```
Título: El carrito no actualiza la cantidad al hacer click en +

Pasos:
1. Login como cliente
2. Ir a un restaurante
3. Click en + en un item
4. El contador no aumenta

Esperado: El contador debe aumentar de 0 a 1
Actual: El contador permanece en 0

Navegador: Chrome 120.0
OS: Windows 11
```

### Sugerir Mejoras

Para sugerir nuevas características:

1. Verifica que no exista un issue similar
2. Crea un nuevo issue con el tag `enhancement`
3. Describe claramente:
   - **Qué** quieres agregar
   - **Por qué** es útil
   - **Cómo** debería funcionar

## 🔧 Pull Requests

### Proceso

1. **Fork** el repositorio
2. **Crea una rama** desde `main`:
   ```bash
   git checkout -b feature/mi-nueva-caracteristica
   ```
3. **Haz tus cambios** siguiendo la guía de estilo
4. **Commit** con mensajes descriptivos:
   ```bash
   git commit -m "feat: agregar búsqueda de restaurantes por ubicación"
   ```
5. **Push** a tu fork:
   ```bash
   git push origin feature/mi-nueva-caracteristica
   ```
6. **Abre un Pull Request** en GitHub

### Checklist del PR

Antes de enviar tu PR, verifica:

- [ ] El código sigue la guía de estilo del proyecto
- [ ] Has probado los cambios localmente
- [ ] Has actualizado la documentación si es necesario
- [ ] No hay errores de ESLint
- [ ] Los commits tienen mensajes descriptivos
- [ ] Has agregado comentarios donde sea necesario

## 🎨 Guía de Estilo

### JavaScript/React

```javascript
// ✅ Bueno
const handleAddToCart = (item) => {
    if (!item.price) return;
    addToCart(item.name, item.price);
};

// ❌ Malo
const handle=(i)=>{addToCart(i.name,i.price)}
```

**Reglas:**
- Usa `const` y `let`, evita `var`
- Nombres descriptivos en camelCase
- Componentes en PascalCase
- Funciones de manejo con prefijo `handle`
- Espacios alrededor de operadores
- Punto y coma al final de statements

### CSS

```css
/* ✅ Bueno */
.restaurant-card {
    padding: 1rem;
    border-radius: 12px;
    transition: transform 0.2s;
}

/* ❌ Malo */
.rc{padding:10px;border-radius:12px}
```

**Reglas:**
- Nombres de clase descriptivos con kebab-case
- Usa variables CSS para colores
- Mobile-first approach
- Evita !important

### Commits

Usa [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: agregar filtro por precio
fix: corregir error en carrito
docs: actualizar README
style: formatear código
refactor: reorganizar componentes
test: agregar tests unitarios
chore: actualizar dependencias
```

## 🛠️ Configuración del Entorno

### Requisitos

- Node.js 18+
- npm o yarn
- Git

### Setup

```bash
# Clonar tu fork
git clone https://github.com/TU-USUARIO/tlapa-comida.git
cd tlapa-comida

# Agregar upstream
git remote add upstream https://github.com/USUARIO-ORIGINAL/tlapa-comida.git

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Estructura de Ramas

- `main` - Rama principal, siempre estable
- `develop` - Rama de desarrollo
- `feature/*` - Nuevas características
- `fix/*` - Correcciones de bugs
- `docs/*` - Cambios en documentación

## 📝 Áreas de Contribución

### 🐛 Bugs Conocidos

Revisa los [issues abiertos](https://github.com/tu-usuario/tlapa-comida/issues) con el tag `bug`.

### ✨ Características Deseadas

- [ ] Backend real con Node.js/Express
- [ ] Autenticación JWT
- [ ] Pasarela de pagos (Stripe/PayPal)
- [ ] Notificaciones push
- [ ] Tests unitarios y E2E
- [ ] Docker setup
- [ ] CI/CD pipeline
- [ ] Internacionalización (i18n)

### 📚 Documentación

- Mejorar README
- Agregar JSDoc a funciones
- Crear guías de usuario
- Tutoriales en video

## 🧪 Testing

Antes de enviar un PR, prueba:

1. **Flujo de Cliente**
   - Login/Registro
   - Búsqueda de restaurantes
   - Agregar al carrito
   - Hacer pedido

2. **Flujo de Restaurante**
   - Login
   - Gestión de pedidos
   - Gestión de menú

3. **Flujo de Repartidor**
   - Login
   - Ver pedidos
   - Compartir ubicación
   - Completar entrega

4. **Flujo de Admin**
   - Gestión de usuarios
   - Gestión de restaurantes
   - Gestión de repartidores

## ❓ Preguntas

Si tienes preguntas:

1. Revisa la [documentación](README.md)
2. Busca en [issues cerrados](https://github.com/tu-usuario/tlapa-comida/issues?q=is%3Aissue+is%3Aclosed)
3. Abre un nuevo issue con el tag `question`

## 🎉 Reconocimientos

Los contribuidores serán agregados al README. ¡Gracias por tu ayuda!

---

**¡Feliz coding! 🚀**
