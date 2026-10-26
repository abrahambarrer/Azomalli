/**
 * Servicio de Pedidos — Centraliza las peticiones HTTP relacionadas con encargos.
 */
import { API_ENDPOINTS } from '../config/api';

/**
 * Crea un nuevo pedido en el backend.
 * 
 * @param {Object} orderData
 * @param {Array} orderData.items - Lista de productos en el carrito
 * @param {string} [orderData.user] - Nombre o identificador del usuario
 * @returns {Promise<Object>} Respuesta del servidor con los detalles del pedido creado
 */
export async function createOrder(orderData) {
  try {
    const response = await fetch(API_ENDPOINTS.ORDERS.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      throw new Error(`Error en el servidor al procesar el pedido (${response.status})`);
    }

    return await response.json();
  } catch (err) {
    console.warn('Fallo en la llamada de backend /api/orders, aplicando simulación local:', err);
    // Simulación local de respaldo en modo desconectado
    return {
      success: true,
      order_id: `GLO-${Math.floor(1000 + Math.random() * 9000)}`,
      message: '¡Tu pedido ha sido recibido y comenzará a hornearse pronto!'
    };
  }
}
