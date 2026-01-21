"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { createVentifyOrder, generateOrderId } from '../services/ventifyService';

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

  const handleGenerateRequest = async () => {
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

    // Generar ID único para la orden
    const orderId = generateOrderId();

    const solicitud = {
      id: `B001-${Math.floor(Math.random() * 100000).toString().padStart(6, '0')}`,
      date: new Date().toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' }),
      cliente: { nombre, telefono: finalTelefono, direccion: finalDireccion },
      items: cart,
      total: totalAmount.toFixed(2),
      pago: { metodo: metodoPago, referencia: metodoPago === 'DIGITAL' ? (comprobanteFile ? `Archivo: ${comprobanteFile.name}` : nroOperacion) : 'Efectivo' },
      estado: 'PENDIENTE'
    };

    console.log('📦 Solicitud generada:', solicitud);

    // GUARDAR EN LOCALSTORAGE (respaldo para la página de éxito)
    localStorage.setItem('lastOrder', JSON.stringify(solicitud));

    setIsProcessing(true);

    // Preparar payload para la API de Ventify
    const ventifyPayload = {
      customerName: nombre,
      customerEmail: user?.email || 'cliente@puntogo.com', // Email por defecto si no existe
      customerPhone: finalTelefono,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.title,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total: parseFloat(totalAmount.toFixed(2)),
      preferredPaymentMethod: metodoPago,
      notes: `Dirección: ${finalDireccion}\n${metodoPago === 'DIGITAL' && nroOperacion ? `Operación: ${nroOperacion}` : 'Pago contra entrega'}`,
    };

    // Intentar enviar a la API de Ventify
    try {
      console.log('🚀 Enviando orden a Ventify...');
      const response = await createVentifyOrder(ventifyPayload);
      
      if (response.success) {
        console.log('✅ Orden enviada exitosamente a Ventify:', response);
        
        // Actualizar el ID de la orden con el de Ventify
        // La API puede devolver el ID en diferentes campos
        const ventifyId = response.id || response.saleRequestId || response.order_id || response.data?.id;
        
        if (ventifyId) {
          solicitud.id = ventifyId;
          console.log('✅ ID de Ventify capturado:', ventifyId);
          localStorage.setItem('lastOrder', JSON.stringify(solicitud));
        }
      } else {
        console.warn('⚠️ No se pudo enviar a Ventify, pero continuamos:', response.error);
        // No mostramos error al usuario, la orden se procesa localmente como respaldo
      }
    } catch (error) {
      console.error('❌ Error al conectar con Ventify:', error);
      // Continuamos sin mostrar error - el localStorage servirá como respaldo
    }

    // Simular procesamiento y redirigir
    setTimeout(() => {
      clearCart();
      router.push(`/success?name=${encodeURIComponent(nombre)}`);
    }, 2000);
  };

  return (
    <>
      <div className="bg-gray-50 min-h-screen pb-16 sm:pb-0">
        <div className="max-w-6xl mx-auto py-6 sm:py-10 px-3 sm:px-4 lg:px-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Columna Izquierda: Formulario */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Datos para tu Solicitud</h2>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded mb-4 text-sm">{error}</div>}
                <form className="space-y-4 sm:space-y-6">
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

                <div className="mt-6 sm:mt-8">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Método de Pago</h3>
                  <div className="space-y-3">
                    <label className={`flex items-center p-3 sm:p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${metodoPago === 'DIGITAL' ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="DIGITAL"
                        checked={metodoPago === 'DIGITAL'}
                        onChange={() => setMetodoPago('DIGITAL')}
                        className="mr-3 flex-shrink-0"
                      />
                      <span className="font-medium text-sm sm:text-base">Pago Digital (Yape/Plin)</span>
                    </label>
                    <label className={`flex items-center p-3 sm:p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${metodoPago === 'EFECTIVO' ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="EFECTIVO"
                        checked={metodoPago === 'EFECTIVO'}
                        onChange={() => setMetodoPago('EFECTIVO')}
                        className="mr-3 flex-shrink-0"
                      />
                      <span className="font-medium text-sm sm:text-base">Pago contra Entrega</span>
                    </label>
                  </div>

                  {metodoPago === 'DIGITAL' && (
                    <div className="mt-4 p-3 sm:p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">Escanea el QR con Yape o Plin</h4>
                      <div className="bg-white p-3 sm:p-4 rounded mb-3 sm:mb-4 text-center">
                        <img
                          src="/Yape-MarlonPecho.png"
                          alt="QR Yape"
                          className="mx-auto w-40 h-40 sm:w-48 sm:h-48 object-contain"
                        />
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={nroOperacion}
                          onChange={(e) => setNroOperacion(e.target.value)}
                          placeholder="Nro de Operación / Captura"
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded text-sm sm:text-base"
                        />
                        <label htmlFor="comprobante" className="inline-block px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded cursor-pointer hover:bg-gray-300 transition-colors text-sm sm:text-base">
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
                          <div className="bg-green-50 p-3 sm:p-4 rounded-lg flex items-center space-x-3 sm:space-x-4">
                            <img src={previewUrl} alt="Comprobante" className="max-h-24 sm:max-h-36 rounded" />
                            <div className="flex-1">
                              <p className="text-xs sm:text-sm text-gray-700 break-all">{comprobanteFile?.name}</p>
                            </div>
                            <button onClick={handleRemoveFile} className="text-red-500 hover:text-red-700 flex-shrink-0 text-lg sm:text-xl font-bold">×</button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {metodoPago === 'EFECTIVO' && (
                    <div className="mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
                      <p className="text-xs sm:text-sm">Paga en efectivo o con tarjeta al momento de la entrega. Nuestro repartidor llevará el POS.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Columna Derecha: Resumen - Sticky solo en desktop */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:sticky lg:top-4">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Resumen del Pedido</h3>
                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 max-h-48 sm:max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-2 sm:space-x-3">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-md object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium truncate">{item.product.title}</p>
                        <p className="text-xs text-gray-500">{item.quantity} x S/ {item.product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <hr className="border-gray-200 mb-3 sm:mb-4" />
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <span className="text-base sm:text-lg font-semibold">Total</span>
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">S/ {totalAmount}</span>
                </div>
                <button
                  onClick={() => user ? handleGenerateRequest() : setShowAuthModal(true)}
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold text-sm sm:text-lg shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                >
                  Generar Solicitud
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de autenticación - Mobile optimized */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full z-50 animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-4 sm:mb-6">
              <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🎁</div>
              <h2 className="text-2xl sm:text-3xl font-bold">¡Espera!</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-700 mb-6 sm:mb-8 text-center">¿Quieres guardar este pedido y ganar puntos? Regístrate o Inicia Sesión para acceder a ofertas exclusivas y seguimiento en tiempo real. Si continúas como invitado, el pedido no quedará en tu historial.</p>
            <div className="space-y-3 sm:space-y-4">
              <Link href="/login" className="block w-full py-3 sm:py-4 bg-blue-600 text-white text-center rounded-lg font-semibold hover:bg-blue-700 text-sm sm:text-lg transition-colors">Iniciar Sesión</Link>
              <Link href="/register" className="block w-full py-3 sm:py-4 bg-green-600 text-white text-center rounded-lg font-semibold hover:bg-green-700 text-sm sm:text-lg transition-colors">Registrarse</Link>
            </div>
            <div className="text-center mt-4 sm:mt-6">
              <button onClick={() => { setShowAuthModal(false); handleGenerateRequest(); }} className="text-sm sm:text-base text-gray-500 underline hover:text-gray-700">Continuar como Invitado</button>
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-[9999] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          <div className="animate-spin rounded-full h-32 w-32 sm:h-40 sm:w-40 border-b-4 border-blue-600 mb-4 sm:mb-6"></div>
          <p className="text-xl sm:text-2xl font-bold text-gray-800 text-center">Procesando tu pedido con PuntoGo...</p>
        </div>
      )}
    </>
  );
};

export default CheckoutPage;