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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
      <Link href="/" className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 z-[100]">
        <Image 
          src="/PuntoGo logo sinfondo.png" 
          alt="PuntoGo" 
          width={120} 
          height={45}
          className="object-contain sm:w-[140px] sm:h-[52px] md:w-[160px] md:h-[60px]"
        />
      </Link>
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-50 md:bg-white">
          <div className="w-full max-w-md">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Crear Cuenta</h1>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <input
                type="text"
                placeholder="Nombre Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                required
              />
              <div>
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
                  className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  required
                />
                {phoneError && <p className="text-red-500 text-xs sm:text-sm mt-1">{phoneError}</p>}
              </div>
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
              <input
                type="password"
                placeholder="Confirmar Contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                required
              />
              <button type="submit" className="w-full p-3 sm:p-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base" disabled={loading}>
                {loading ? 'Cargando...' : 'Crear Cuenta'}
              </button>
            </form>
            <p className="text-center mt-4 sm:mt-6 text-gray-600 text-sm sm:text-base">
              ¿Ya tienes cuenta? <Link href="/login" className="text-blue-600 hover:underline font-medium">Inicia Sesión</Link>
            </p>
          </div>
        </div>

        {/* Right Side - Image - Hidden on mobile */}
        <div className="hidden md:flex md:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80')" }}>
          <div className="bg-black/50 w-full flex items-center justify-center">
            <div className="text-white text-center px-8">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Únete a Nosotros</h2>
              <p className="text-base lg:text-lg">"Explora un mundo de sabores exclusivos"</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}