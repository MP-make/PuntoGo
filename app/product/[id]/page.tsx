"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Star, Minus, Plus, ShoppingCart } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import { useCart } from '../../contexts/CartContext';
import { getVentifyProducts } from '../../services/ventifyService';
import Navbar from '../../components/Navbar';

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
  description: string;
  category: string;
}

export default function ProductDetail() {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const params = useParams();
  const productName = decodeURIComponent(params.id as string);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const ventifyProducts = await getVentifyProducts();
      
      // Mapear productos
      const products = ventifyProducts.map(prod => ({
        id: prod.id,
        title: prod.name,
        price: prod.price,
        originalPrice: prod.originalPrice || undefined,
        image: prod.imageUrl || prod.image || '/placeholder-product.png',
        rating: prod.rating || 4.5,
        category: prod.category || 'General',
        description: prod.description || 'Producto de calidad premium',
      }));

      // Buscar producto por nombre (URL friendly)
      const foundProduct = products.find(p => 
        p.title.toLowerCase().replace(/\s+/g, '-') === productName.toLowerCase() ||
        p.title.toLowerCase() === productName.toLowerCase().replace(/-/g, ' ')
      );

      setProduct(foundProduct || null);

      // Productos relacionados
      if (foundProduct) {
        const related = products
          .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
          .slice(0, 4);
        setRelatedProducts(related);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [productName]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando producto...</p>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">Producto no encontrado</h2>
          <p className="text-gray-600 mb-6">Lo sentimos, no pudimos encontrar este producto</p>
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Volver a la tienda
          </Link>
        </div>
      </>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        rating: product.rating
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Breadcrumb */}
          <nav className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
            <Link href="/" className="hover:text-blue-600">Inicio</Link> &gt; 
            <span className="text-gray-800"> {product.category}</span> &gt;
            <span className="text-gray-800"> {product.title}</span>
          </nav>

          {/* Product Detail */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {/* Image */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-product.png';
                }}
              />
            </div>

            {/* Info */}
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{product.title}</h1>

              {/* Rating */}
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
                <span className="ml-2 text-sm sm:text-base text-gray-600">({product.rating} estrellas)</span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 sm:space-x-4">
                <span className="text-2xl sm:text-3xl font-bold text-blue-600">S/ {product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-base sm:text-lg text-gray-500 line-through">S/ {product.originalPrice.toFixed(2)}</span>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <span className="font-semibold text-sm sm:text-base">Cantidad:</span>
                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 sm:p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 sm:px-6 py-2 font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 sm:p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center transition-colors shadow-lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Añadir al Carrito
              </button>

              {/* Description */}
              <details className="group bg-white p-4 sm:p-6 rounded-xl shadow-sm">
                <summary className="cursor-pointer font-semibold text-base sm:text-lg list-none flex items-center">
                  <span className="group-open:rotate-90 transition-transform mr-2">▶</span>
                  Descripción
                </summary>
                <p className="mt-4 text-sm sm:text-base text-gray-700 leading-relaxed">{product.description}</p>
              </details>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">También te podría gustar</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
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
          )}
        </div>
      </div>
    </>
  );
}