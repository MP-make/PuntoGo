'use client'

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    if (phoneError) {
      return;
    }
    setLoading(true);
    login(email);
    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  return (
    <>
      <Link href="/" className="absolute top-6 right-6 z-[100]" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
        <Image 
          src="/PuntoGo logo.png" 
          alt="PuntoGo" 
          width={100} 
          height={35}
          className="object-contain"
        />
      </Link>
      <div className="min-h-screen flex">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold text-center mb-6">Crear Cuenta</h1>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nombre Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="tel"
                placeholder="Teléfono / Celular"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length > 9) return;
                  setPhone(value);
                  if (value.length === 9 && !value.startsWith('9')) {
                    setPhoneError('El número debe empezar con 9');
                  } else if (value.length > 0 && value.length < 9) {
                    setPhoneError('Debe tener exactamente 9 dígitos');
                  } else {
                    setPhoneError(null);
                  }
                }}
                maxLength={9}
                className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {phoneError && <p className="text-red-500 text-sm mb-4">{phoneError}</p>}
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
                className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                placeholder="Confirmar Contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-4 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button type="submit" className="w-full p-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors" disabled={loading}>
                {loading ? 'Cargando...' : 'Crear Cuenta'}
              </button>
            </form>
            <p className="text-center mt-6 text-gray-600">
              ¿Ya tienes cuenta? <Link href="/login" className="text-blue-600 hover:underline">Inicia Sesión</Link>
            </p>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden md:flex md:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80')" }}>
          <div className="bg-black/50 w-full flex items-center justify-center">
            <div className="text-white text-center px-8">
              <h2 className="text-4xl font-bold mb-4">Únete a Nosotros</h2>
              <p className="text-lg">"Explora un mundo de sabores exclusivos"</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}