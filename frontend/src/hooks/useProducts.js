import { useState, useEffect, useCallback } from 'react';
import { fetchProducts } from '../services/productService';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Todos');

  const loadCatalog = useCallback(async () => {
    try {
      setLoading(true);
      const catalog = await fetchProducts();
      setProducts(catalog);
      setError(null);
    } catch (err) {
      console.warn('Error al cargar productos desde el servicio centralizado:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  // Productos de temporada desde la columna es_temporada
  const seasonal = products.filter((p) => p.es_temporada);

  // Destacados / Más vendidos: si la columna específica no existe, toma los primeros del catálogo
  const bestsellers = products.filter((p) => p.is_bestseller).length > 0
    ? products.filter((p) => p.is_bestseller)
    : products.slice(0, 3);

  // Filtrado por categoría PostgreSQL (DULCE / SALADO / Todos)
  const filteredProducts = activeCategory === 'Todos'
    ? products
    : products.filter((p) => {
        const cat = p.categoria.toUpperCase();
        if (activeCategory.toLowerCase() === 'dulces' || activeCategory.toLowerCase() === 'dulce') {
          return cat === 'DULCE';
        }
        if (activeCategory.toLowerCase() === 'salados' || activeCategory.toLowerCase() === 'salado') {
          return cat === 'SALADO';
        }
        return cat === activeCategory.toUpperCase();
      });

  return {
    products,
    bestsellers,
    seasonal,
    filteredProducts,
    activeCategory,
    setActiveCategory,
    loading,
    error,
    refreshProducts: loadCatalog
  };
}
