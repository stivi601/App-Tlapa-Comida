/**
 * Constantes de Estados de Pedidos
 * Define todos los posibles estados de un pedido en el sistema
 */

export const ORDER_STATUS = {
    PENDING: 'pending',
    PREPARING: 'preparing',
    READY: 'ready',
    DELIVERING: 'delivering',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

/**
 * Etiquetas legibles para cada estado de pedido
 */
export const ORDER_STATUS_LABELS = {
    [ORDER_STATUS.PENDING]: 'Pendiente',
    [ORDER_STATUS.PREPARING]: 'Preparando',
    [ORDER_STATUS.READY]: 'Listo para Recoger',
    [ORDER_STATUS.DELIVERING]: 'En Camino',
    [ORDER_STATUS.COMPLETED]: 'Entregado',
    [ORDER_STATUS.CANCELLED]: 'Cancelado'
};

/**
 * Colores asociados a cada estado de pedido
 */
export const ORDER_STATUS_COLORS = {
    [ORDER_STATUS.PENDING]: '#FFA500',      // Naranja
    [ORDER_STATUS.PREPARING]: '#4169E1',    // Azul
    [ORDER_STATUS.READY]: '#32CD32',        // Verde lima
    [ORDER_STATUS.DELIVERING]: '#9370DB',   // Púrpura
    [ORDER_STATUS.COMPLETED]: '#10B981',    // Verde éxito
    [ORDER_STATUS.CANCELLED]: '#EF4444'     // Rojo
};

/**
 * Iconos asociados a cada estado (nombres de Lucide React)
 */
export const ORDER_STATUS_ICONS = {
    [ORDER_STATUS.PENDING]: 'Clock',
    [ORDER_STATUS.PREPARING]: 'ChefHat',
    [ORDER_STATUS.READY]: 'Package',
    [ORDER_STATUS.DELIVERING]: 'Bike',
    [ORDER_STATUS.COMPLETED]: 'CheckCircle',
    [ORDER_STATUS.CANCELLED]: 'XCircle'
};
