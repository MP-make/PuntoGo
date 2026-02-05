'use client'

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    login(email);
    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  return (
    <>
      <Link href="/" className="absolute top-3 left-3 sm:top-4 sm:left-4 z-50">
        <Image 
          src="/PuntoGo-logo-sinfondo.webp" 
          alt="PuntoGo" 
          width={180} 
          height={67}
          className="object-contain sm:w-[200px] sm:h-[75px] md:w-[220px] md:h-[82px]"
        />
      </Link>
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Left Side - Image - Hidden on mobile */}
        <div className="hidden md:flex md:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80')" }}>
          <div className="bg-black/50 w-full flex items-center justify-center">
            <div className="text-white text-center px-8">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Bienvenido de Vuelta</h2>
              <p className="text-base lg:text-lg">"Descubre los mejores sabores en PuntoGo"</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-50 md:bg-white">
          <div className="w-full max-w-md">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Iniciar Sesión</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                required
              />
              <button type="submit" disabled={loading} className="w-full p-3 sm:p-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm sm:text-base">
                {loading ? 'Cargando...' : 'Ingresar'}
              </button>
            </form>
            <button className="w-full p-3 sm:p-4 mt-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center text-sm sm:text-base">
              <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5 mr-2" />
              Ingresar con Google
            </button>
            <p className="text-center mt-4 sm:mt-6 text-gray-600 text-sm sm:text-base">
              ¿No tienes cuenta? <Link href="/register" className="text-blue-600 hover:underline font-medium">Regístrate aquí</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}