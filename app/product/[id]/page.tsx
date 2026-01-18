"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Star, Minus, Plus, ShoppingCart } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import { useCart } from '../../contexts/CartContext';
import { products } from '../../data/products';

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
  description: string;
  details: string;
  category: string;
}

export default function ProductDetail() {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const params = useParams();
  const id = params.id as string;
  const product = products.find(p => p.id === id);

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Producto no encontrado</div>;
  }

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      rating: product.rating
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-blue-600">Inicio</Link> &gt; 
          <Link href="/categories/licores" className="hover:text-blue-600"> Licores</Link> &gt; 
          <span className="text-gray-800"> {product.category}</span>
        </nav>

        {/* Product Detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Info */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">{product.title}</h1>

            {/* Rating */}
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
              <span className="ml-2 text-gray-600">({product.rating} estrellas)</span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-blue-600">S/ {product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through">S/ {product.originalPrice}</span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="font-semibold">Cantidad:</span>
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center transition-colors"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Añadir al Carrito
            </button>

            {/* Description */}
            <details className="group">
              <summary className="cursor-pointer font-semibold text-lg list-none flex items-center">
                <span className="group-open:rotate-90 transition-transform mr-2">▶</span>
                Descripción
              </summary>
              <p className="mt-4 text-gray-700 leading-relaxed">{product.description}</p>
            </details>

            {/* Details */}
            <details className="group">
              <summary className="cursor-pointer font-semibold text-lg list-none flex items-center">
                <span className="group-open:rotate-90 transition-transform mr-2">▶</span>
                Detalles
              </summary>
              <div className="mt-4 text-gray-700 whitespace-pre-line">{product.details}</div>
            </details>
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold mb-6">También te podría gustar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                id={relatedProduct.id}
                title={relatedProduct.title}
                price={relatedProduct.price}
                originalPrice={relatedProduct.originalPrice}
                image={relatedProduct.image}
                rating={relatedProduct.rating}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}