"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { createVentifyOrder, generateOrderId } from '../services/ventifyService';
import { ArrowLeft, ShoppingBag, Package, Truck } from 'lucide-react';

const CheckoutPage: React.FC = () => {
  const { cart, totalAmount, clearCart } = useCart();
  const router = useRouter();
  const { user } = useAuth();

  // Estados existentes
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
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // LÓGICA DE COSTOS DE ENVÍO
  const MINIMUM_ORDER = 20;
  const SHIPPING_COST = 5;
  const FREE_SHIPPING_THRESHOLD = 150;

  const subtotal = totalAmount;
  const isMinimumMet = subtotal >= MINIMUM_ORDER;
  
  // CORRECCIÓN DEFINITIVA: Si NO cumple el mínimo, NO mostrar envío como "gratis"
  let shippingCost = 0;
  let shippingLabel = '';
  
  if (!isMinimumMet) {
    // No cumple mínimo: No puede comprar, no calcular envío
    shippingCost = 0;
    shippingLabel = '-';
  } else if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    // Cumple para envío gratis
    shippingCost = 0;
    shippingLabel = '¡GRATIS!';
  } else {
    // Cumple mínimo pero paga envío
    shippingCost = SHIPPING_COST;
    shippingLabel = `S/ ${SHIPPING_COST.toFixed(2)}`;
  }
  
  const total = subtotal + shippingCost;

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

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización");
      return;
    }

    setIsLoadingLocation(true);
    
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
        
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
          const data = await response.json();
          
          if (data && data.display_name) {
            const direccionFormateada = `${data.display_name} \n(Coordenadas: ${latitude}, ${longitude})`;
            setDireccion(direccionFormateada);
          } else {
            setDireccion(`Ubicación seleccionada: ${latitude}, ${longitude}\n${mapsLink}`);
          }
        } catch (error) {
          console.error("Error obteniendo dirección:", error);
          setDireccion(`Ubicación seleccionada: ${latitude}, ${longitude}\n${mapsLink}`);
        } finally {
          setIsLoadingLocation(false);
          if (user) setSelectedAddress('other');
        }
      },
      (error) => {
        console.error("Error de geolocalización:", error);
        setIsLoadingLocation(false);
        let msg = "No se pudo obtener la ubicación.";
        if (error.code === 1) msg = "Por favor, permite el acceso a tu ubicación.";
        else if (error.code === 2) msg = "Ubicación no disponible.";
        else if (error.code === 3) msg = "Se agotó el tiempo para obtener la ubicación.";
        alert(msg);
      },
      options
    );
  };

  const handleGenerateRequest = async () => {
    setError(null);

    // VALIDACIÓN DEL MÍNIMO
    if (!isMinimumMet) {
      setError(`⛔ El pedido mínimo es de S/ ${MINIMUM_ORDER.toFixed(2)}. Agrega más productos al carrito.`);
      return;
    }

    const finalTelefono = user && selectedPhone === 'saved' ? (user.phone || '') : telefono;

    if (!nombre.trim() || !finalTelefono.trim()) {
      setError('Por favor, completa nombre y teléfono.');
      return;
    }

    if (finalTelefono.length !== 9 || !finalTelefono.startsWith('9')) {
      setError('El teléfono debe tener 9 dígitos y empezar con 9.');
      return;
    }

    if (metodoPago === 'DIGITAL') {
      if (!nroOperacion.trim() && !comprobanteFile) {
        setError('⚠️ Para pago digital debes ingresar el número de operación o adjuntar una captura.');
        return;
      }
    }

    const finalDireccion = user && selectedAddress === 'saved' ? `${user.savedAddress}${user.reference ? ` (${user.reference})` : ''}` : direccion;

    const orderId = generateOrderId();

    const solicitud = {
      id: `B001-${Math.floor(Math.random() * 100000).toString().padStart(6, '0')}`,
      date: new Date().toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' }),
      cliente: { nombre, telefono: finalTelefono, direccion: finalDireccion },
      items: cart,
      total: total.toFixed(2),
      shippingCost: shippingCost.toFixed(2),
      pago: { metodo: metodoPago, referencia: metodoPago === 'DIGITAL' ? (comprobanteFile ? `Archivo: ${comprobanteFile.name}` : nroOperacion) : 'Efectivo' },
      estado: 'PENDIENTE'
    };

    console.log('📦 Solicitud generada:', solicitud);
    localStorage.setItem('lastOrder', JSON.stringify(solicitud));
    setIsProcessing(true);

    const ventifyPayload = {
      customerName: nombre,
      customerEmail: user?.email || 'cliente@puntogo.com',
      customerPhone: finalTelefono,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.title,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total: parseFloat(total.toFixed(2)),
      preferredPaymentMethod: metodoPago,
      notes: `Dirección: ${finalDireccion}\nEnvío: S/ ${shippingCost.toFixed(2)}\n${metodoPago === 'DIGITAL' && nroOperacion ? `Operación: ${nroOperacion}` : 'Pago contra entrega'}`,
    };

    try {
      console.log('🚀 Enviando orden a Ventify...');
      const response = await createVentifyOrder(ventifyPayload);
      
      if (response.success) {
        console.log('✅ Orden enviada exitosamente a Ventify:', response);
        const ventifyId = response.id || response.saleRequestId || response.order_id || response.data?.id;
        
        if (ventifyId) {
          solicitud.id = ventifyId;
          console.log('✅ ID de Ventify capturado:', ventifyId);
          localStorage.setItem('lastOrder', JSON.stringify(solicitud));
        }
      } else {
        console.warn('⚠️ No se pudo enviar a Ventify, pero continuamos:', response.error);
      }
    } catch (error) {
      console.error('❌ Error al conectar con Ventify:', error);
    }

    setTimeout(() => {
      clearCart();
      router.push(`/success?name=${encodeURIComponent(nombre)}`);
    }, 2000);
  };

  return (
    <>
      {/* HEADER MEJORADO */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium hidden sm:inline">Seguir comprando</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Finalizar Compra</h1>
            </div>

            <div className="w-24 sm:w-32"></div> {/* Spacer para centrar */}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen pb-16 sm:pb-0">
        <div className="max-w-7xl mx-auto py-6 sm:py-10 px-3 sm:px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Columna Izquierda: Formulario */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Datos para tu Solicitud</h2>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded mb-4 text-sm">{error}</div>}
                
                {/* Formulario existente sin cambios */}
                <form className="space-y-4 sm:space-y-6">
                  {/* ...campos de nombre, teléfono, dirección sin cambios... */}
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
                          <input type="radio" name="phone" value="saved" checked={selectedPhone === 'saved'} onChange={() => setSelectedPhone('saved')} className="mr-3" />
                          <span className="font-medium">Usar mi celular: {user.phone}</span>
                        </label>
                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${selectedPhone === 'other' ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                          <input type="radio" name="phone" value="other" checked={selectedPhone === 'other'} onChange={() => setSelectedPhone('other')} className="mr-3" />
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
                                setPhoneError(value.length === 9 && value.startsWith('9') ? null : 'El teléfono debe tener 9 dígitos y empezar con 9.');
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
                            setPhoneError(value.length === 9 && value.startsWith('9') ? null : 'El teléfono debe tener 9 dígitos y empezar con 9.');
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
                          <input type="radio" name="address" value="saved" checked={selectedAddress === 'saved'} onChange={() => setSelectedAddress('saved')} className="mr-3" />
                          <span className="font-medium">Usar dirección guardada: {user.savedAddress}{user.reference ? ` (${user.reference})` : ''}</span>
                        </label>
                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${selectedAddress === 'other' ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                          <input type="radio" name="address" value="other" checked={selectedAddress === 'other'} onChange={() => setSelectedAddress('other')} className="mr-3" />
                          <span className="font-medium">Usar otra dirección o ubicación actual</span>
                        </label>
                        {selectedAddress === 'other' && (
                          <div className="mt-4 space-y-2">
                             <button type="button" onClick={handleGetLocation} disabled={isLoadingLocation} className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium text-sm border border-green-200">
                                {isLoadingLocation ? <span className="animate-spin">⏳</span> : <span>📍</span>}
                                {isLoadingLocation ? "Obteniendo ubicación..." : "Usar mi Ubicación Actual"}
                              </button>
                              <textarea value={direccion} onChange={(e) => setDireccion(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Dirección completa o usa el botón de ubicación" rows={3} />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <button type="button" onClick={handleGetLocation} disabled={isLoadingLocation} className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium text-sm border border-green-200 mb-2">
                           {isLoadingLocation ? <span className="animate-spin">⏳</span> : <span>📍</span>}
                           {isLoadingLocation ? "Obteniendo ubicación..." : "Usar mi Ubicación Actual"}
                        </button>
                        <textarea value={direccion} onChange={(e) => setDireccion(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Ingresa tu dirección exacta y referencia" rows={3} />
                      </div>
                    )}
                  </div>
                </form>

                {/* Método de Pago - Con rediseño */}
                <div className="mt-6 sm:mt-8">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Método de Pago</h3>
                  <div className="space-y-3">
                    <label className={`flex items-center p-3 sm:p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${metodoPago === 'DIGITAL' ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                      <input type="radio" name="payment" value="DIGITAL" checked={metodoPago === 'DIGITAL'} onChange={() => setMetodoPago('DIGITAL')} className="mr-3 flex-shrink-0" />
                      <span className="font-medium text-sm sm:text-base">Pago Digital (Yape/Plin)</span>
                    </label>
                    <label className={`flex items-center p-3 sm:p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${metodoPago === 'EFECTIVO' ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                      <input type="radio" name="payment" value="EFECTIVO" checked={metodoPago === 'EFECTIVO'} onChange={() => setMetodoPago('EFECTIVO')} className="mr-3 flex-shrink-0" />
                      <span className="font-medium text-sm sm:text-base">Pago contra Entrega</span>
                    </label>
                  </div>

                  {metodoPago === 'DIGITAL' && (
                    <div className="mt-4 p-4 sm:p-6 bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-xl border border-purple-200 shadow-sm">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-purple-100">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <span className="text-white text-2xl">💳</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-gray-900">Pago con Yape o Plin</h4>
                          <p className="text-xs text-gray-600">Escanea y paga al instante</p>
                        </div>
                      </div>

                      {/* QR Container ARREGLADO - Sin recortes */}
                      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-4 border-2 border-purple-200">
                        <div className="flex flex-col items-center space-y-4">
                          {/* QR con espacio suficiente */}
                          <div className="bg-gradient-to-br from-purple-100 via-purple-50 to-blue-100 rounded-2xl p-6 w-full max-w-xs mx-auto">
                            <img
                              src="/Yape-MarlonPecho.png"
                              alt="QR Yape - Marlon Pecho"
                              className="w-full h-auto object-contain"
                              style={{ minHeight: '200px', maxHeight: '300px' }}
                            />
                          </div>
                          
                          {/* Info del destinatario */}
                          <div className="text-center bg-purple-50 px-6 py-3 rounded-xl border border-purple-200 w-full">
                            <p className="text-sm font-bold text-purple-900">Marlon Yohel Pecho Pecho</p>
                            <p className="text-xs text-gray-600 mt-0.5">Escanea con Yape o Plin</p>
                          </div>
                        </div>
                      </div>

                      {/* Instrucciones */}
                      <div className="bg-white rounded-xl p-4 mb-4 border-2 border-purple-100 shadow-sm">
                        <p className="text-sm font-bold text-purple-900 mb-3 flex items-center gap-2">
                          <span className="text-lg">📱</span> 
                          Pasos para pagar:
                        </p>
                        <ol className="space-y-2 text-sm text-gray-700">
                          <li className="flex gap-3">
                            <span className="font-bold text-purple-600 flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs">1</span>
                            <span>Abre <strong>Yape</strong> o <strong>Plin</strong> en tu celular</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="font-bold text-purple-600 flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs">2</span>
                            <span>Escanea el código QR de arriba</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="font-bold text-purple-600 flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs">3</span>
                            <span>Confirma el pago de <strong className="text-purple-700">S/ {total.toFixed(2)}</strong></span>
                          </li>
                          <li className="flex gap-3">
                            <span className="font-bold text-purple-600 flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs">4</span>
                            <span>Ingresa el número de operación abajo 👇</span>
                          </li>
                        </ol>
                      </div>
                      
                      {/* Alerta */}
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 p-4 mb-4 rounded-lg shadow-sm">
                        <p className="text-sm text-orange-900 font-bold flex items-start gap-2">
                          <span className="text-xl flex-shrink-0">⚠️</span>
                          <span>
                            <strong>Importante:</strong> Debes ingresar el número de operación o subir la captura para confirmar tu pedido.
                          </span>
                        </p>
                      </div>
                      
                      {/* Campos */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-2">
                            Número de Operación <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={nroOperacion}
                            onChange={(e) => setNroOperacion(e.target.value)}
                            placeholder="Ejemplo: 000123456789"
                            className={`w-full p-3 border-2 rounded-xl text-sm font-medium transition-all ${
                              metodoPago === 'DIGITAL' && !nroOperacion && !comprobanteFile 
                                ? 'border-orange-400 bg-orange-50 focus:border-orange-600' 
                                : 'border-gray-300 focus:border-purple-500 bg-white'
                            } focus:outline-none focus:ring-2 focus:ring-purple-200`}
                          />
                        </div>

                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <div className="flex-1 h-px bg-gray-300"></div>
                          <span className="font-bold bg-gray-100 px-3 py-1 rounded-full">o</span>
                          <div className="flex-1 h-px bg-gray-300"></div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-2">
                            Captura del Comprobante
                          </label>
                          <label 
                            htmlFor="comprobante" 
                            className="flex items-center justify-center gap-3 w-full p-4 bg-white border-3 border-dashed border-purple-300 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all group"
                          >
                            <span className="text-3xl group-hover:scale-110 transition-transform">📸</span>
                            <div className="text-left">
                              <p className="font-bold text-gray-800 group-hover:text-purple-700">Subir Captura</p>
                              <p className="text-xs text-gray-500">PNG, JPG hasta 5MB</p>
                            </div>
                          </label>
                          <input
                            id="comprobante"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </div>

                        {/* Preview */}
                        {previewUrl && (
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 p-4 rounded-xl flex items-center gap-4 shadow-md animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <img 
                              src={previewUrl} 
                              alt="Comprobante" 
                              className="w-24 h-24 rounded-xl object-cover shadow-lg border-2 border-white" 
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900 mb-1 truncate">
                                ✅ {comprobanteFile?.name}
                              </p>
                              <p className="text-xs text-green-700 font-semibold">Listo para enviar</p>
                            </div>
                            <button 
                              onClick={handleRemoveFile} 
                              className="w-10 h-10 flex-shrink-0 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold text-xl transition-all hover:scale-110 flex items-center justify-center shadow-lg"
                              aria-label="Eliminar"
                            >
                              ×
                            </button>
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

            {/* COLUMNA DERECHA: RESUMEN CON LÓGICA DE ENVÍO */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:sticky lg:top-4 space-y-4">
                <div className="flex items-center gap-2 border-b pb-3">
                  <Package className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base sm:text-lg font-semibold">Resumen del Pedido</h3>
                </div>

                {/* Lista de productos */}
                <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-2 sm:space-x-3">
                      <img src={item.product.image} alt={item.product.title} className="w-10 h-10 sm:w-12 sm:h-12 rounded-md object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium truncate">{item.product.title}</p>
                        <p className="text-xs text-gray-500">{item.quantity} x S/ {item.product.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <hr className="border-gray-200" />

                {/* Desglose de costos */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">S/ {subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm items-center">
                    <div className="flex items-center gap-1">
                      <Truck className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Envío</span>
                    </div>
                    <span className={`font-medium ${shippingLabel === '¡GRATIS!' ? 'text-green-600' : 'text-gray-900'}`}>
                      {shippingLabel}
                    </span>
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* Total final */}
                <div className="flex justify-between items-center">
                  <span className="text-base sm:text-lg font-semibold">Total</span>
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">S/ {total.toFixed(2)}</span>
                </div>

                {/* ALERTAS DE ENVÍO */}
                {!isMinimumMet && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                    <p className="text-xs sm:text-sm text-red-800 font-semibold">
                      ⛔ <strong>Pedido mínimo:</strong> S/ {MINIMUM_ORDER.toFixed(2)}
                    </p>
                    <p className="text-xs text-red-700 mt-1">
                      Te faltan <strong>S/ {(MINIMUM_ORDER - subtotal).toFixed(2)}</strong> para poder comprar
                    </p>
                  </div>
                )}

                {isMinimumMet && subtotal < FREE_SHIPPING_THRESHOLD && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                    <p className="text-xs sm:text-sm text-blue-800 font-semibold">
                      🛵 <strong>Envío:</strong> S/ {SHIPPING_COST.toFixed(2)}
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Agrega <strong>S/ {(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)}</strong> más para envío gratis
                    </p>
                  </div>
                )}

                {isMinimumMet && subtotal >= FREE_SHIPPING_THRESHOLD && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <p className="text-xs sm:text-sm text-green-800 font-semibold">
                      🎉 <strong>¡Envío GRATIS!</strong>
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      Tu pedido supera los S/ {FREE_SHIPPING_THRESHOLD.toFixed(2)}
                    </p>
                  </div>
                )}

                {/* Botón de compra */}
                <button
                  onClick={() => user ? handleGenerateRequest() : setShowAuthModal(true)}
                  disabled={!isMinimumMet}
                  className={`w-full py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-lg shadow-lg transition-all ${
                    !isMinimumMet 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                  }`}
                >
                  {!isMinimumMet ? 'Agrega más productos' : 'Generar Solicitud'}
                </button>

                {/* AVISO DE VERIFICACIÓN DE PAGO */}
                {metodoPago === 'DIGITAL' && (
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-xl p-4 mt-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">⏱️</span>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-900">Verificación de Pago</p>
                        <p className="text-xs text-gray-800 leading-relaxed">
                          Verificaremos tu pago primero. Una vez confirmado que el pago se realizó correctamente, 
                          nos comunicaremos contigo para coordinar el envío de tu pedido.
                        </p>
                        <p className="text-xs font-semibold text-orange-700 mt-2">
                          ⚠️ No olvides ingresar el número de operación o subir la captura
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modales sin cambios */}
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