import { useState, useEffect, useCallback } from 'react';

const FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: "Conchas",
    description: "Una cubierta delicada y una miga suave. El clásico que siempre encuentra lugar en la mesa.",
    tag: "PARA ACOMPAÑAR TU CAFÉ",
    price: 18.00,
    image: "/images/pan_conchas.png",
    is_bestseller: true,
    is_seasonal: false,
    category: "Dulces"
  },
  {
    id: 2,
    name: "Roles de canela",
    description: "Capas de masa, un abrazo de canela y ese aroma que hace especial una pausa.",
    tag: "UN GUSTO SIN PRISA",
    price: 26.00,
    image: "/images/pan_roles.png",
    is_bestseller: true,
    is_seasonal: false,
    category: "Dulces"
  },
  {
    id: 3,
    name: "Panqué casero",
    description: "Una rebanada generosa, de textura tierna, para disfrutar a solas o partir entre todos.",
    tag: "MEJOR SI SE COMPARTE",
    price: 32.00,
    image: "/images/pan_panque.png",
    is_bestseller: true,
    is_seasonal: false,
    category: "Especiales"
  },
  {
    id: 4,
    name: "Conchas de vainilla",
    description: "Una versión especial con toque dulce y una presentación ideal para compartir en casa.",
    tag: "PARA UN MOMENTO ESPECIAL",
    price: 20.00,
    image: "/images/pan_vainilla.png",
    is_bestseller: false,
    is_seasonal: true,
    category: "Dulces"
  },
  {
    id: 5,
    name: "Pan de chocolate",
    description: "Un pan tierno con trozos de chocolate para acompañar el café, el té o un momento dulce.",
    tag: "DULZURA EQUILIBRADA",
    price: 24.00,
    image: "/images/pan_chocolate.png",
    is_bestseller: false,
    is_seasonal: true,
    category: "Dulces"
  },
  {
    id: 6,
    name: "Bolillo artesanal",
    description: "Corteza crujiente por fuera, migajón esponjoso y aireado por dentro. El básico de cada comida.",
    tag: "TRADICIÓN EN CADA MIGA",
    price: 10.00,
    image: "/images/pan_bolillo.png",
    is_bestseller: false,
    is_seasonal: false,
    category: "Rústicos"
  }
];

export function useProducts() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Todos');

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Respuesta no satisfactoria de la API');
      const data = await res.json();
      if (data && Array.isArray(data.products) && data.products.length > 0) {
        // Normalizar rutas de imágenes a /images/ si vienen como /static/images/
        const normalized = data.products.map(p => ({
          ...p,
          image: p.image ? p.image.replace('/static/images/', '/images/') : '/images/pan_conchas.png'
        }));
        setProducts(normalized);
      }
      setError(null);
    } catch (err) {
      console.warn('API no disponible o error de red, usando catálogo local:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const bestsellers = products.filter((p) => p.is_bestseller);
  const seasonal = products.filter((p) => p.is_seasonal);
  const filteredProducts = activeCategory === 'Todos'
    ? products
    : products.filter((p) => (p.category || '').toLowerCase() === activeCategory.toLowerCase());

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
