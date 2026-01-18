'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [telefono, setTelefono] = useState(user?.phone || '');
  const [direccion, setDireccion] = useState(user?.savedAddress || '');
  const [referencia, setReferencia] = useState(user?.reference || '');
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setTelefono(user.phone || '');
      setDireccion(user.savedAddress || '');
      setReferencia(user.reference || '');
    }
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Mi Cuenta</h2>
            <nav className="space-y-2">
              <Link href="/profile" className="block px-4 py-2 bg-blue-100 text-blue-700 rounded">Mi Perfil</Link>
              <Link href="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">Mis Pedidos</Link>
              <Link href="/" className="block px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">← Volver a la Tienda</Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-2xl font-bold text-green-600">S/ 1,250.00</h3>
              <p className="text-gray-600">Total Gastado</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-2xl font-bold text-blue-600">12</h3>
              <p className="text-gray-600">Pedidos Realizados</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-2xl font-bold text-purple-600">250</h3>
              <p className="text-gray-600">Puntos Acumulados</p>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-8">Bienvenido, {user?.name}</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-gray-600">{user?.email}</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Phone className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Teléfono</h3>
              <p className="text-gray-600">{user?.phone || 'No registrado'}</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <MapPin className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Dirección</h3>
              <p className="text-gray-600">{user?.savedAddress}{user?.reference ? ` (${user?.reference})` : ''}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Editar Información</h2>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Editar Perfil</button>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
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
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dirección Exacta</label>
                  <textarea
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    rows={3}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Referencia (Opcional)</label>
                  <input
                    type="text"
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <button onClick={() => { if (phoneError) return; updateUser({ phone: telefono, savedAddress: direccion, reference: referencia }); setIsEditing(false); }} className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">Guardar Cambios</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}