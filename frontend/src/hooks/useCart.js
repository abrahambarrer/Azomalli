import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'azomalli_cart';

export function useCart() {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error al recuperar carrito de localStorage:', e);
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);

  // Sincronizar cambios en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Error al guardar carrito en localStorage:', e);
    }
  }, [cart]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addToCart = useCallback((product) => {
    const prodId = product.producto_id ?? product.id;
    const prodName = product.nombre ?? product.name;
    const prodPrice = Number(product.precio_unitario ?? product.price ?? 0);
    const prodImage = product.imagen_url || product.image || '/images/pan_conchas.png';

    setCart((prevCart) => {
      const existing = prevCart.find((item) => (item.producto_id ?? item.id) === prodId);
      if (existing) {
        return prevCart.map((item) =>
          (item.producto_id ?? item.id) === prodId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prevCart,
        {
          id: prodId,
          producto_id: prodId,
          name: prodName,
          nombre: prodName,
          price: prodPrice,
          precio_unitario: prodPrice,
          image: prodImage,
          imagen_url: prodImage,
          quantity: 1
        }
      ];
    });
  }, []);

  const updateQuantity = useCallback((id, change) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          const currentId = item.producto_id ?? item.id;
          if (currentId === id) {
            const newQty = item.quantity + change;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  }, []);

  const removeItem = useCallback((id) => {
    setCart((prevCart) => prevCart.filter((item) => (item.producto_id ?? item.id) !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => {
    const itemPrice = Number(item.precio_unitario ?? item.price ?? 0);
    return sum + itemPrice * item.quantity;
  }, 0);

  const checkout = useCallback(async () => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          user: localStorage.getItem('azomalli_user')
            ? JSON.parse(localStorage.getItem('azomalli_user')).name
            : 'Invitado'
        })
      });

      if (res.ok) {
        const data = await res.json();
        clearCart();
        closeCart();
        return data;
      }
      throw new Error('Respuesta fallida del backend');
    } catch (err) {
      console.warn('Backend no disponible, simulando encargo localmente:', err);
      const mockOrder = {
        success: true,
        order_id: `GLO-${Math.floor(1000 + Math.random() * 9000)}`,
        message: '¡Tu pedido ha sido recibido y comenzará a hornearse pronto!'
      };
      clearCart();
      closeCart();
      return mockOrder;
    }
  }, [cart, clearCart, closeCart]);

  return {
    cart,
    isOpen,
    openCart,
    closeCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    totalCount,
    totalAmount,
    checkout
  };
}
