"use client";

import React, { useState, useEffect } from 'react';
import { Search, User, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { totalItems, openCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
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
      setIsMobileSearchOpen(false); // Cerrar búsqueda móvil después de buscar
    } else {
      router.push('/');
    }
  };

  return (
    <>
      <nav className="sticky top-0 bg-white/70 backdrop-blur-lg border-b border-white/40 shadow-sm z-50 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img
                src="/PuntoGo-logo-sinfondo.webp"
                alt="PuntoGo"
                className="h-12 sm:h-14 md:h-16 lg:h-[72px] w-auto"
              />
            </Link>

            {/* Search Bar - Hidden on mobile, shown on md and up */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button onClick={handleSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-2 sm:space-x-4 relative">
              {/* Mobile Search Icon */}
              <button 
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors" 
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              >
                <Search className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
              </button>

              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <User className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 sm:w-56 bg-white shadow-xl rounded-lg border border-gray-100 z-20">
                  {user ? (
                    <>
                      <Link href="/profile" className="block w-full text-left px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm sm:text-base transition-colors">Mi Perfil</Link>
                      <Link href="/orders" className="block w-full text-left px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm sm:text-base transition-colors">Mis Pedidos</Link>
                      <div className="border-t"></div>
                      <button onClick={logout} className="block w-full text-left px-4 py-3 text-red-600 font-bold hover:bg-gray-50 cursor-pointer text-sm sm:text-base transition-colors">Cerrar Sesión</button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 text-gray-500 text-xs sm:text-sm">Bienvenido</div>
                      <Link href="/login" className="block w-full px-4 py-2 bg-blue-600 text-white text-center rounded hover:bg-blue-700 mx-auto text-sm sm:text-base transition-colors">Iniciar Sesión</Link>
                      <Link href="/register" className="block w-full px-4 py-2 border border-blue-600 text-blue-600 bg-transparent rounded hover:bg-blue-50 text-center mt-2 text-sm sm:text-base transition-colors">Registrarse</Link>
                    </>
                  )}
                </div>
              )}
              <button className="p-2 relative hover:bg-gray-100 rounded-full transition-colors" onClick={openCart}>
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar - Expandable */}
          {isMobileSearchOpen && (
            <div className="md:hidden pb-3 animate-in slide-in-from-top duration-200">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  autoFocus
                />
                <button onClick={handleSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
      {isProfileOpen && <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>}
    </>
  );
};

export default Navbar;