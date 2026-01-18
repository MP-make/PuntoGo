"use client";

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom'; // <--- LA CLAVE: Teletransporta el carrito
import { ShoppingCart, Trash2, X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext'; // Asegúrate que esta ruta sea correcta
import { useRouter } from 'next/navigation';
import Image from 'next/image'; 

const CartDrawer: React.FC = () => {
  const { cart, totalAmount, removeFromCart, updateQuantity, isCartOpen, closeCart } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // 1. Esperamos a que el componente cargue en el navegador (Cliente)
  useEffect(() => {
    setMounted(true);
    // Bloqueamos el scroll de la página de atrás cuando el carrito está abierto
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCartOpen]);

  // Si no está montado o está cerrado, no renderizamos NADA
  if (!mounted || !isCartOpen) return null;

  // 2. Usamos createPortal para renderizar fuera de la jerarquía normal
  return createPortal(
    <div className="fixed inset-0 z-[99999] flex justify-end">
      {/* Backdrop: El fondo negro transparente detrás */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={closeCart}
      />

      {/* Drawer: El cajón blanco */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Tu Carrito</h2>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
              {cart.length} items
            </span>
          </div>
          <button 
            onClick={closeCart} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* --- BODY (Productos) --- */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-white">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
              <ShoppingCart className="w-16 h-16 text-gray-300" />
              <p className="text-lg font-medium">Tu carrito está vacío</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex gap-4 group">
                {/* Imagen Cuadrada */}
                <div className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                  <img // Usamos img normal por seguridad, puedes cambiar a Image si prefieres
                    src={item.product.image} 
                    alt={item.product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-semibold text-slate-800 line-clamp-2 pr-2">
                      {item.product.title}
                    </h4>
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex justify-between items-end mt-2">
                    <p className="font-bold text-blue-600">S/ {item.product.price}</p>
                    
                    {/* Controles + - */}
                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-white rounded-l-lg text-gray-600 disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-semibold w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-white rounded-r-lg text-gray-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- FOOTER --- */}
        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className="text-2xl font-black text-slate-900">S/ {totalAmount}</span>
            </div>
            <button
              onClick={() => {
                closeCart();
                router.push('/checkout');
              }}
              className="w-full bg-green-600 text-white font-bold text-lg py-3 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200"
            >
              Ir a Pagar
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body // <--- Aquí renderizamos directamente en el BODY del HTML
  );
};

export default CartDrawer;