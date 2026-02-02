"use client";

import React from 'react';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice: number | undefined;
  image: string;
  rating: number;
  stock?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, title, price, originalPrice, image, rating, stock }) => {
  const { addToCart } = useCart();

  const discountPercentage = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const availableStock = stock !== undefined ? stock : 999;
  const isOutOfStock = availableStock === 0;
  const isLowStock = availableStock > 0 && availableStock <= 5;

  return (
    <div className="group flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* 
        CONTENEDOR DE IMAGEN:
        - aspect-square: Cuadrado perfecto
        - SIN PADDING (p-0): La imagen llena TODO el espacio
      */}
      <Link 
        href={`/product/${encodeURIComponent(title.replace(/\s+/g, '-'))}`} 
        className="relative block aspect-square w-full bg-white overflow-hidden"
      >
        {/*
          IMAGEN DEL PRODUCTO:
          - object-cover: Se adapta llenando TODO el contenedor (como en tu captura)
          - La imagen ocupa el 100% sin espacios blancos
        */}
        <img
          src={image}
          alt={title}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-product.png';
          }}
        />
        
        {/* Badge de Descuento */}
        {discountPercentage > 0 && !isOutOfStock && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm z-10">
            -{discountPercentage}%
          </div>
        )}

        {/* Overlay Agotado */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm font-bold uppercase tracking-wider">
              AGOTADO
            </span>
          </div>
        )}
      </Link>

      {/* CONTENIDO */}
      <div className="p-3 flex flex-col flex-1">
        {/* Title */}
        <Link href={`/product/${encodeURIComponent(title.replace(/\s+/g, '-'))}`}>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 hover:text-blue-600 transition-colors leading-snug min-h-[40px]" title={title}>
            {title}
          </h3>
        </Link>

        {/* Rating & Stock - Restaurado al formato original */}
        <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
           <div className="flex items-center">
             <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 mr-1" />
             <span>{rating.toFixed(1)}</span>
           </div>
           
           {!isOutOfStock && stock !== undefined && (
             <span className={`${isLowStock ? 'text-orange-600 font-medium' : 'text-green-600'}`}>
               {isLowStock ? `Quedan ${availableStock}` : 'Disponible'}
             </span>
           )}
        </div>

        {/* Pricing */}
        <div className="mt-auto mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">S/ {price.toFixed(2)}</span>
            {originalPrice && (
              <span className="text-xs text-gray-500 line-through">S/ {originalPrice.toFixed(2)}</span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => !isOutOfStock && addToCart({ id, title, price, image, rating })}
          disabled={isOutOfStock}
          className={`w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
              isOutOfStock 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {isOutOfStock ? 'Sin Stock' : 'Agregar'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;