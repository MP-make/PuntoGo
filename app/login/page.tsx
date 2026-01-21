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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    login(email);
    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  return (
    <>
      <Link href="/" className="absolute top-4 left-4 z-50">
        <Image 
          src="/PuntoGo logo.png" 
          alt="PuntoGo" 
          width={100} 
          height={35}
          className="object-contain"
        />
      </Link>
      <div className="min-h-screen flex">
        {/* Left Side - Image */}
        <div className="hidden md:flex md:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80')" }}>
          <div className="bg-black/50 w-full flex items-center justify-center">
            <div className="text-white text-center px-8">
              <h2 className="text-4xl font-bold mb-4">Bienvenido de Vuelta</h2>
              <p className="text-lg">"Descubre los mejores sabores en PuntoGo"</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold text-center mb-6">Iniciar Sesión</h1>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button type="submit" disabled={loading} className="w-full p-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                {loading ? 'Cargando...' : 'Ingresar'}
              </button>
            </form>
            <button className="w-full p-4 mt-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
              <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5 mr-2" />
              Ingresar con Google
            </button>
            <p className="text-center mt-6 text-gray-600">
              ¿No tienes cuenta? <Link href="/register" className="text-blue-600 hover:underline">Regístrate aquí</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}