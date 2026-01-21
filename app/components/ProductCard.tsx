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
}

const ProductCard: React.FC<ProductCardProps> = ({ id, title, price, originalPrice, image, rating }) => {
  const { addToCart } = useCart();

  // Calcular porcentaje de descuento si hay originalPrice
  const discountPercentage = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group relative">
      {/* Image */}
      <Link href={`/product/${id}`}>
        <div className="aspect-square bg-gray-200 relative overflow-hidden cursor-pointer">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {/* Badge dinámico */}
          {discountPercentage > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              -{discountPercentage}%
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 relative">
        {/* Title */}
        <Link href={`/product/${id}`}>
          <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2 cursor-pointer hover:text-blue-600 transition-colors">{title}</h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
          ))}
        </div>

        {/* Prices */}
        <div className="mb-4">
          <span className="text-2xl font-bold text-slate-900">{'S/ ' + price}</span>
          {originalPrice && <span className="text-sm text-gray-500 line-through ml-2">{'S/ ' + originalPrice}</span>}
        </div>

        {/* Button */}
        <button
          onClick={() => addToCart({ id, title, price, image, rating })}
          className="w-full border-2 border-blue-500 text-blue-500 py-2 px-4 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 group-hover:translate-y-0 translate-y-2 opacity-80 group-hover:opacity-100"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Agregar
        </button>
      </div>
    </div>
  );
};

export default ProductCard;