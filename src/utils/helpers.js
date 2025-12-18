/**
 * Funciones de Utilidad
 * Helpers reutilizables en toda la aplicación
 */

/**
 * Formatea un número como precio en pesos mexicanos
 * @param {number} amount - Cantidad a formatear
 * @returns {string} - Precio formateado (ej: "$150.00")
 */
export const formatPrice = (amount) => {
    return `$${amount.toFixed(2)}`;
};

/**
 * Calcula el total de items en el carrito
 * @param {Array} items - Array de items con price y quantity
 * @returns {number} - Total calculado
 */
export const calculateCartTotal = (items) => {
    if (!items || items.length === 0) return 0;
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

/**
 * Formatea una fecha a tiempo relativo
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} - Tiempo relativo (ej: "Hace 5 min")
 */
export const formatRelativeTime = (date) => {
    const now = new Date();
    const targetDate = typeof date === 'string' ? new Date(date) : date;
    const diff = now - targetDate;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Ahora mismo';
    if (minutes < 60) return `Hace ${minutes} min`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;

    const days = Math.floor(hours / 24);
    return `Hace ${days} ${days === 1 ? 'día' : 'días'}`;
};

/**
 * Genera un ID único basado en timestamp
 * @returns {number} - ID único
 */
export const generateId = () => {
    return Date.now();
};

/**
 * Trunca un texto a una longitud específica
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} - Texto truncado con "..."
 */
export const truncateText = (text, maxLength = 50) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/**
 * Capitaliza la primera letra de un string
 * @param {string} str - String a capitalizar
 * @returns {string} - String capitalizado
 */
export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Valida si un email es válido
 * @param {string} email - Email a validar
 * @returns {boolean} - True si es válido
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Valida si un teléfono es válido (formato mexicano)
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} - True si es válido
 */
export const isValidPhone = (phone) => {
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    return phoneRegex.test(phone);
};

/**
 * Formatea un teléfono al formato XXX-XXX-XXXX
 * @param {string} phone - Teléfono sin formato
 * @returns {string} - Teléfono formateado
 */
export const formatPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) return phone;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
};

/**
 * Convierte un archivo a base64
 * @param {File} file - Archivo a convertir
 * @returns {Promise<string>} - String base64
 */
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

/**
 * Debounce function para optimizar búsquedas
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} - Función debounced
 */
export const debounce = (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
