'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Mail, Phone, MapPin, User, Package, Award, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [phoneAction, setPhoneAction] = useState<'keep' | 'new' | 'delete'>('keep');
  const [addressAction, setAddressAction] = useState<'keep' | 'new' | 'delete'>('keep');
  const [telefono, setTelefono] = useState(user?.phone || '');
  const [direccion, setDireccion] = useState(user?.savedAddress || '');
  const [referencia, setReferencia] = useState(user?.reference || '');
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      setTelefono(user.phone || '');
      setDireccion(user.savedAddress || '');
      setReferencia(user.reference || '');
      setPhoneAction('keep');
      setAddressAction('keep');
    }
  }, [user, router]);

  if (!user) return null;

  const handleSave = () => {
    if (phoneError) return;
    
    const updates: any = {};
    
    // Manejar teléfono
    if (phoneAction === 'delete') {
      updates.phone = '';
    } else if (phoneAction === 'new' && telefono) {
      updates.phone = telefono;
    }
    
    // Manejar dirección
    if (addressAction === 'delete') {
      updates.savedAddress = '';
      updates.reference = '';
    } else if (addressAction === 'new' && direccion) {
      updates.savedAddress = direccion;
      updates.reference = referencia;
    }
    
    updateUser(updates);
    setIsEditing(false);
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header con avatar */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-6 sm:p-8 mb-6 sm:mb-8 text-white">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center">
                <User className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600" />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">¡Hola, {user.name}!</h1>
                <p className="text-blue-100 text-sm sm:text-base">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 sticky top-4">
                <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Mi Cuenta
                </h2>
                <nav className="space-y-2">
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium transition-colors">
                    <User className="w-5 h-5" />
                    Mi Perfil
                  </Link>
                  <Link href="/orders" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <Package className="w-5 h-5" />
                    Mis Pedidos
                  </Link>
                  <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border-t border-gray-200 mt-4 pt-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver a la Tienda
                  </Link>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm p-4 sm:p-6 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-green-700 mb-1">S/ 1,250</h3>
                  <p className="text-xs sm:text-sm text-green-600 font-medium">Total Gastado</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm p-4 sm:p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <Package className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-1">12</h3>
                  <p className="text-xs sm:text-sm text-blue-600 font-medium">Pedidos Realizados</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm p-4 sm:p-6 border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <Award className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-1">250</h3>
                  <p className="text-xs sm:text-sm text-purple-600 font-medium">Puntos</p>
                </div>
              </div>

              {/* Información Personal */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Información Personal</h2>
                  {!isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)} 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium"
                    >
                      Editar
                    </button>
                  )}
                </div>

                {!isEditing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <Mail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                        <p className="text-sm sm:text-base text-gray-900 break-all">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <Phone className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Teléfono</h3>
                        <p className="text-sm sm:text-base text-gray-900">{user.phone || 'No registrado'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg sm:col-span-2">
                      <MapPin className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Dirección de Entrega</h3>
                        <p className="text-sm sm:text-base text-gray-900">
                          {user.savedAddress || 'No registrada'}
                          {user.reference && <span className="block text-gray-600 text-sm mt-1">Ref: {user.reference}</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono / Celular *</label>
                      <input
                        type="tel"
                        value={telefono}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length > 9) return;
                          setTelefono(value);
                          if (value.length === 9 && !value.startsWith('9')) {
                            setPhoneError('El número debe empezar con 9');
                          } else if (value.length > 0 && value.length < 9) {
                            setPhoneError('Debe tener exactamente 9 dígitos');
                          } else {
                            setPhoneError(null);
                          }
                        }}
                        maxLength={9}
                        placeholder="9XXXXXXXX"
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${phoneError ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dirección Exacta</label>
                      <textarea
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        placeholder="Ej: Av. Principal 123, San Isidro"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Referencia (Opcional)</label>
                      <input
                        type="text"
                        value={referencia}
                        onChange={(e) => setReferencia(e.target.value)}
                        placeholder="Ej: Casa de dos pisos, portón negro"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button 
                        onClick={handleSave} 
                        disabled={!!phoneError}
                        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      >
                        Guardar Cambios
                      </button>
                      <button 
                        onClick={() => setIsEditing(false)} 
                        className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors text-sm sm:text-base"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}