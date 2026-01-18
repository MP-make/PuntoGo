"use client";

import React, { useState, useEffect } from 'react';
import { Search, User, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { totalItems, openCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setSearchTerm(search);
    }
  }, [searchParams]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/?search=${encodeURIComponent(searchTerm)}`);
    } else {
      router.push('/');
    }
  };

  return (
    <>
      <nav className="sticky top-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-xl font-bold text-blue-900">Ventify Market</Link>
            </div>

            {/* Search Bar - Hidden on mobile, shown on md and up */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button onClick={handleSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Mobile Search Icon - Shown only on mobile */}
            <div className="md:hidden flex-1 flex justify-center">
              <button className="p-2">
                <Search className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4 relative">
              <button className="p-2" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <User className="h-6 w-6 text-gray-600" />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-xl rounded border border-gray-100 z-20">
                  {user ? (
                    <>
                      <Link href="/profile" className="block w-full text-left px-4 py-2 hover:bg-gray-50 cursor-pointer">Mi Perfil</Link>
                      <Link href="/orders" className="block w-full text-left px-4 py-2 hover:bg-gray-50 cursor-pointer">Mis Pedidos</Link>
                      <div className="border-t"></div>
                      <button onClick={logout} className="block w-full text-left px-4 py-2 text-red-600 font-bold hover:bg-gray-50 cursor-pointer">Cerrar Sesión</button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 text-gray-500 text-sm">Bienvenido</div>
                      <Link href="/login" className="block w-full px-4 py-2 bg-blue-600 text-white text-center rounded hover:bg-blue-700">Iniciar Sesión</Link>
                      <Link href="/register" className="block w-full px-4 py-2 border border-blue-600 text-blue-600 bg-transparent rounded hover:bg-blue-50 text-center">Registrarse</Link>
                    </>
                  )}
                </div>
              )}
              <button className="p-2 relative" onClick={openCart}>
                <ShoppingCart className="h-6 w-6 text-gray-600" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
      {isProfileOpen && <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>}
    </>
  );
};

export default Navbar;