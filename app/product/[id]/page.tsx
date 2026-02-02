"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Star, Minus, Plus, ShoppingCart, ArrowLeft, Package, Truck } from 'lucide-react';
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
  stock: number;
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
      
      const products = ventifyProducts.map(prod => {
        const physicalStock = prod.stock || 0;
        const reserved = prod.reservedStock || 0;
        const available = Math.max(0, physicalStock - reserved);
        
        return {
          id: prod.id,
          title: prod.name,
          price: prod.price,
          originalPrice: prod.originalPrice || undefined,
          image: prod.imageUrl || prod.image || '/placeholder-product.png',
          rating: prod.rating || 4.5,
          category: prod.category || 'General',
          description: prod.description || 'Producto de calidad premium',
          stock: available,
        };
      });

      const foundProduct = products.find(p => 
        p.title.toLowerCase().replace(/\s+/g, '-') === productName.toLowerCase() ||
        p.title.toLowerCase() === productName.toLowerCase().replace(/-/g, ' ')
      );

      setProduct(foundProduct || null);

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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando producto...</p>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
          <div className="text-7xl mb-6">😕</div>
          <h2 className="text-3xl font-bold mb-3 text-gray-900">Producto no encontrado</h2>
          <p className="text-gray-600 mb-8 text-center max-w-md">Lo sentimos, no pudimos encontrar este producto en nuestro catálogo</p>
          <Link href="/" className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-lg transition-all">
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

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen pb-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb simple */}
          <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              <ArrowLeft className="w-4 h-4 inline mr-1" />
              Volver a la tienda
            </Link>
            <span>/</span>
            <span className="text-blue-600 font-medium">{product.category}</span>
          </nav>

          {/* Grid principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            
            {/* COLUMNA IZQUIERDA: Imagen CON OBJECT-COVER */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 lg:sticky lg:top-24">
                <div className="aspect-square bg-white relative">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-product.png';
                    }}
                  />
                  {/* Badge de descuento */}
                  {discountPercentage > 0 && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-2 rounded-xl font-bold text-sm shadow-lg z-10">
                      -{discountPercentage}%
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA: Información */}
            <div className="space-y-6">
              {/* Categoría */}
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                {product.category}
              </div>

              {/* Título */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">
                  {product.rating.toFixed(1)} ({Math.floor(Math.random() * 50) + 10} reseñas)
                </span>
              </div>

              {/* Precio */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-100">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl sm:text-5xl font-black text-blue-600">
                    S/ {product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-500 line-through font-medium">
                      S/ {product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                {discountPercentage > 0 && (
                  <p className="text-sm text-green-700 font-semibold">
                    ¡Ahorras S/ {(product.originalPrice! - product.price).toFixed(2)}!
                  </p>
                )}
              </div>

              {/* Stock */}
              <div className={`rounded-xl p-4 border-2 ${
                product.stock === 0 
                  ? 'bg-red-50 border-red-200' 
                  : product.stock <= 5 
                  ? 'bg-orange-50 border-orange-200' 
                  : 'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-center gap-3">
                  <Package className={`w-5 h-5 ${
                    product.stock === 0 
                      ? 'text-red-600' 
                      : product.stock <= 5 
                      ? 'text-orange-600' 
                      : 'text-green-600'
                  }`} />
                  <div>
                    {product.stock === 0 ? (
                      <p className="text-red-700 font-bold">Agotado temporalmente</p>
                    ) : product.stock <= 5 ? (
                      <>
                        <p className="text-orange-700 font-bold">¡Últimas unidades!</p>
                        <p className="text-sm text-orange-600">Solo quedan {product.stock} disponibles</p>
                      </>
                    ) : (
                      <>
                        <p className="text-green-700 font-bold">Disponible</p>
                        <p className="text-sm text-green-600">{product.stock} unidades en stock</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Selector de cantidad */}
              {product.stock > 0 && (
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Cantidad:
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-3 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                      <span className="px-8 py-2 font-bold text-xl min-w-[80px] text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        disabled={quantity >= product.stock}
                        className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                    {quantity >= product.stock && (
                      <span className="text-sm text-orange-600 font-medium">Máximo disponible</span>
                    )}
                  </div>
                </div>
              )}

              {/* Botón de compra */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg ${
                  product.stock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transform hover:scale-[1.02]'
                }`}
              >
                <ShoppingCart className="h-6 w-6" />
                {product.stock === 0 ? 'Producto Agotado' : `Añadir ${quantity} al Carrito`}
              </button>

              {/* Info de envío */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 text-sm">Envío a todo Lima</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Envío gratis en compras mayores a S/ 50.00
                    </p>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-lg mb-3 text-gray-900">Descripción</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            </div>
          </div>

          {/* Productos relacionados CON FILTRO DE STOCK */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">También te podría gustar</h2>
                <Link href={`/?category=${product.category}`} className="text-blue-600 hover:text-blue-700 font-semibold text-sm hover:underline">
                  Ver más →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts
                  .filter(p => p.stock > 0)
                  .map((relatedProduct) => (
                    <ProductCard
                      key={relatedProduct.id}
                      id={relatedProduct.id}
                      title={relatedProduct.title}
                      price={relatedProduct.price}
                      originalPrice={relatedProduct.originalPrice}
                      image={relatedProduct.image}
                      rating={relatedProduct.rating}
                      stock={relatedProduct.stock}
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