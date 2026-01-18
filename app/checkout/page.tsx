"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

const CheckoutPage: React.FC = () => {
  const { cart, totalAmount, clearCart } = useCart();
  const router = useRouter();
  const { user } = useAuth();

  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [metodoPago, setMetodoPago] = useState<'DIGITAL' | 'EFECTIVO'>('DIGITAL');
  const [nroOperacion, setNroOperacion] = useState('');
  const [comprobanteFile, setComprobanteFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<'saved' | 'other'>('saved');
  const [selectedPhone, setSelectedPhone] = useState<'saved' | 'other'>('saved');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setNombre(user.name);
      setTelefono(user.phone || '');
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setComprobanteFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveFile = () => {
    setComprobanteFile(null);
    setPreviewUrl(null);
    const input = document.getElementById('comprobante') as HTMLInputElement;
    if (input) input.value = '';
  };

  const handleGenerateRequest = () => {
    setError(null);
    const finalTelefono = user && selectedPhone === 'saved' ? (user.phone || '') : telefono;

    if (!nombre.trim() || !finalTelefono.trim()) {
      setError('Por favor, completa nombre y teléfono.');
      return;
    }

    if (finalTelefono.length !== 9 || !finalTelefono.startsWith('9')) {
      setError('El teléfono debe tener 9 dígitos y empezar con 9.');
      return;
    }

    const finalDireccion = user && selectedAddress === 'saved' ? `${user.savedAddress}${user.reference ? ` (${user.reference})` : ''}` : direccion;

    const solicitud = {
      id: `B001-${Math.floor(Math.random() * 100000).toString().padStart(6, '0')}`,
      date: new Date().toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' }),
      cliente: { nombre, telefono: finalTelefono, direccion: finalDireccion },
      items: cart,
      total: totalAmount.toFixed(2),
      pago: { metodo: metodoPago, referencia: metodoPago === 'DIGITAL' ? (comprobanteFile ? `Archivo: ${comprobanteFile.name}` : nroOperacion) : 'Efectivo' },
      estado: 'PENDIENTE'
    };

    console.log(solicitud);

    // GUARDAR EN LOCALSTORAGE PARA QUE SUCCESS LO LEA
    localStorage.setItem('lastOrder', JSON.stringify(solicitud));

    setIsProcessing(true);

    setTimeout(() => {
      clearCart();
      router.push(`/success?name=${encodeURIComponent(nombre)}`);
    }, 2000);
  };

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto py-10 px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna Izquierda: Formulario */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-2xl font-semibold mb-6">Datos para tu Solicitud</h2>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo *</label>
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tu nombre completo"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono / Celular *</label>
                    {user ? (
                      <div className="space-y-3">
                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${selectedPhone === 'saved' ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                          <input
                            type="radio"
                            name="phone"
                            value="saved"
                            checked={selectedPhone === 'saved'}
                            onChange={() => setSelectedPhone('saved')}
                            className="mr-3"
                          />
                          <span className="font-medium">Usar mi celular: {user.phone}</span>
                        </label>
                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${selectedPhone === 'other' ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                          <input
                            type="radio"
                            name="phone"
                            value="other"
                            checked={selectedPhone === 'other'}
                            onChange={() => setSelectedPhone('other')}
                            className="mr-3"
                          />
                          <span className="font-medium">Usar otro celular para este pedido</span>
                        </label>
                        {selectedPhone === 'other' && (
                          <div className="mt-4">
                            <input
                              type="tel"
                              value={telefono}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                                setTelefono(value);
                                if (value.length === 9 && value.startsWith('9')) {
                                  setPhoneError(null);
                                } else {
                                  setPhoneError('El teléfono debe tener 9 dígitos y empezar con 9.');
                                }
                              }}
                              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${phoneError ? 'border-red-500' : 'border-gray-300'}`}
                              placeholder="9XXXXXXXX"
                              required
                            />
                            {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <input
                          type="tel"
                          value={telefono}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                            setTelefono(value);
                            if (value.length === 9 && value.startsWith('9')) {
                              setPhoneError(null);
                            } else {
                              setPhoneError('El teléfono debe tener 9 dígitos y empezar con 9.');
                            }
                          }}
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${phoneError ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="9XXXXXXXX"
                          required
                        />
                        {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
                      </>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dirección de Entrega</label>
                    {user ? (
                      <div className="space-y-3">
                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${selectedAddress === 'saved' ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                          <input
                            type="radio"
                            name="address"
                            value="saved"
                            checked={selectedAddress === 'saved'}
                            onChange={() => setSelectedAddress('saved')}
                            className="mr-3"
                          />
                          <span className="font-medium">Usar dirección guardada: {user.savedAddress}{user.reference ? ` (${user.reference})` : ''}</span>
                        </label>
                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${selectedAddress === 'other' ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                          <input
                            type="radio"
                            name="address"
                            value="other"
                            checked={selectedAddress === 'other'}
                            onChange={() => setSelectedAddress('other')}
                            className="mr-3"
                          />
                          <span className="font-medium">Usar otra dirección</span>
                        </label>
                        {selectedAddress === 'other' && (
                          <textarea
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4"
                            placeholder="Dirección completa"
                            rows={3}
                          />
                        )}
                      </div>
                    ) : (
                      <textarea
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Dirección completa"
                        rows={3}
                      />
                    )}
                  </div>
                </form>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Método de Pago</h3>
                  <div className="space-y-3">
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${metodoPago === 'DIGITAL' ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="DIGITAL"
                        checked={metodoPago === 'DIGITAL'}
                        onChange={() => setMetodoPago('DIGITAL')}
                        className="mr-3"
                      />
                      <span className="font-medium">Pago Digital (Yape/Plin)</span>
                    </label>
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${metodoPago === 'EFECTIVO' ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="EFECTIVO"
                        checked={metodoPago === 'EFECTIVO'}
                        onChange={() => setMetodoPago('EFECTIVO')}
                        className="mr-3"
                      />
                      <span className="font-medium">Pago contra Entrega</span>
                    </label>
                  </div>

                  {metodoPago === 'DIGITAL' && (
                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Escanea el QR con Yape o Plin</h4>
                      <div className="bg-white p-4 rounded mb-4 text-center">
                        {/* Asegúrate de que esta imagen exista en public/ */}
                        <img
                          src="/Yape-MarlonPecho.png"
                          alt="QR Yape"
                          width={200}
                          height={200}
                          className="mx-auto"
                        />
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={nroOperacion}
                          onChange={(e) => setNroOperacion(e.target.value)}
                          placeholder="Nro de Operación / Captura"
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                        <label htmlFor="comprobante" className="inline-block px-4 py-2 bg-gray-200 text-gray-700 rounded cursor-pointer hover:bg-gray-300 transition-colors">
                          Adjuntar Comprobante
                        </label>
                        <input
                          id="comprobante"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        {previewUrl && (
                          <div className="bg-green-50 p-4 rounded-lg flex items-center space-x-4">
                            <img src={previewUrl} alt="Comprobante" className="max-h-36 rounded" />
                            <div className="flex-1">
                              <p className="text-sm text-gray-700">{comprobanteFile?.name}</p>
                            </div>
                            <button onClick={handleRemoveFile} className="text-red-500 hover:text-red-700">X</button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {metodoPago === 'EFECTIVO' && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm">Paga en efectivo o con tarjeta al momento de la entrega. Nuestro repartidor llevará el POS.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Columna Derecha: Resumen */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-4">
                <h3 className="text-lg font-semibold mb-4">Resumen del Pedido</h3>
                <div className="space-y-3 mb-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-3">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.product.title}</p>
                        <p className="text-xs text-gray-500">{item.quantity} x S/ {item.product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <hr className="border-gray-200 mb-4" />
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-gray-900">S/ {totalAmount}</span>
                </div>
                <button
                  onClick={() => user ? handleGenerateRequest() : setShowAuthModal(true)}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold text-lg shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                >
                  Generar Solicitud
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 z-50 animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🎁</div>
              <h2 className="text-3xl font-bold">¡Espera!</h2>
            </div>
            <p className="text-gray-700 mb-8 text-center">¿Quieres guardar este pedido y ganar puntos? Regístrate o Inicia Sesión para acceder a ofertas exclusivas y seguimiento en tiempo real. Si continúas como invitado, el pedido no quedará en tu historial.</p>
            <div className="space-y-4">
              <Link href="/login" className="block w-full py-4 bg-blue-600 text-white text-center rounded-lg font-semibold hover:bg-blue-700 text-lg">Iniciar Sesión</Link>
              <Link href="/register" className="block w-full py-4 bg-green-600 text-white text-center rounded-lg font-semibold hover:bg-green-700 text-lg">Registrarse</Link>
            </div>
            <div className="text-center mt-6">
              <button onClick={() => { setShowAuthModal(false); handleGenerateRequest(); }} className="text-gray-500 underline hover:text-gray-700">Continuar como Invitado</button>
            </div>
          </div>
        </div>
      )}
      {isProcessing && (
        <div className="fixed inset-0 z-[9999] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-40 w-40 border-b-4 border-blue-600 mb-6"></div>
          <p className="text-2xl font-bold text-gray-800">Procesando tu pedido con Ventify...</p>
        </div>
      )}
    </>
  );
};

export default CheckoutPage;