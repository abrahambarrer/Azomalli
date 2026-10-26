import { useState, useEffect, useCallback } from 'react';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Todos');

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Respuesta no satisfactoria de la API');
      const data = await res.json();

      if (data && Array.isArray(data.products)) {
        const mapped = data.products.map((p) => ({
          ...p,
          producto_id: p.producto_id ?? p.id,
          nombre: p.nombre ?? p.name,
          descripcion: p.descripcion ?? p.description,
          precio_unitario: Number(p.precio_unitario ?? p.price ?? 0),
          imagen_url: p.imagen_url || p.image || '/images/pan_conchas.png',
          categoria: (p.categoria || p.category || 'DULCE').toUpperCase(),
          es_temporada: Boolean(p.es_temporada ?? p.is_seasonal)
        }));
        setProducts(mapped);
      } else {
        setProducts([]);
      }
      setError(null);
    } catch (err) {
      console.warn('Error al cargar productos desde la base de datos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
    refreshProducts: fetchProducts
  };
}
