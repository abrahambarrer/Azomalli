/**
 * Servicio de Productos — Centraliza las peticiones HTTP relacionadas al catálogo.
 */
import { API_ENDPOINTS, buildApiUrl } from '../config/api';

/**
 * Consulta el catálogo de productos aplicando filtros opcionales.
 * 
 * @param {Object} [filters]
 * @param {string} [filters.filter] - Tipo de filtro ('seasonal', etc.)
 * @param {string} [filters.category] - Categoría ('DULCE', 'SALADO', etc.)
 * @returns {Promise<Array>} Lista de productos normalizados
 */
export async function fetchProducts({ filter, category } = {}) {
  const url = buildApiUrl(API_ENDPOINTS.PRODUCTS.LIST, {
    filter,
    category: category && category.toLowerCase() !== 'todos' ? category : undefined
  });

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error en la API (${response.status}): ${response.statusText}`);
  }

  const data = await response.json();
  const rawList = Array.isArray(data.products) ? data.products : [];

  // Mapeo seguro con nombres de PostgreSQL y fallbacks
  return rawList.map((p) => ({
    ...p,
    producto_id: p.producto_id ?? p.id,
    nombre: p.nombre ?? p.name,
    descripcion: p.descripcion ?? p.description,
    precio_unitario: Number(p.precio_unitario ?? p.price ?? 0),
    imagen_url: p.imagen_url || p.image || '/images/pan_conchas.png',
    categoria: (p.categoria || p.category || 'DULCE').toUpperCase(),
    es_temporada: Boolean(p.es_temporada ?? p.is_seasonal)
  }));
}

/**
 * Consulta un producto individual por su ID.
 * 
 * @param {number|string} id - ID del producto
 * @returns {Promise<Object>} Datos del producto
 */
export async function fetchProductById(id) {
  const url = API_ENDPOINTS.PRODUCTS.BY_ID(id);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error al consultar producto ${id} (${response.status})`);
  }
  const data = await response.json();
  return data.product || data;
}
