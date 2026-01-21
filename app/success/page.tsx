'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../contexts/AuthContext';

function SuccessContent() {
  const searchParams = useSearchParams();
  const nameParams = searchParams.get('name') || 'Cliente';
  const { user } = useAuth();
  
  const [order, setOrder] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // 1. RECUPERAR DATOS
    const storedOrder = localStorage.getItem('lastOrder');
    if (storedOrder) {
      try {
        const parsedData = JSON.parse(storedOrder);
        setOrder(parsedData);
      } catch (e) {
        console.error("Error datos:", e);
      }
    }

    // 2. CONFETI (Solo visual para la pantalla)
    const end = Date.now() + (3 * 1000);
    const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];
    (function frame() {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: colors });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* === VISTA DE PANTALLA (WEB) === */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        
        <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl text-center max-w-lg w-full border border-gray-100">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">¡Solicitud Recibida!</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 px-2">
            Gracias <strong>{order?.cliente?.nombre || nameParams}</strong>.
            <br />Tu pedido está siendo procesado.
          </p>

          <div className="bg-blue-50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 text-left border-2 border-blue-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
              <span className="text-xs sm:text-sm text-gray-600 font-medium">Nro. Solicitud:</span>
              <span className="font-mono font-bold text-blue-900 text-sm sm:text-base break-all">{order?.id || '---'}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
              <span className="text-xs sm:text-sm text-gray-600 font-medium">Fecha:</span>
              <span className="text-sm sm:text-base text-gray-900">{order?.date || new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <span className="text-xs sm:text-sm text-gray-600 font-medium">Total:</span>
              <span className="font-bold text-green-600 text-lg sm:text-xl">S/ {order?.total || '0.00'}</span>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 mb-6 sm:mb-8 rounded text-left">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-xs sm:text-sm text-yellow-800 font-medium">
                  Confirmaremos tu pedido por WhatsApp al número <strong>{order?.cliente?.telefono}</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link 
              href="/" 
              className="block w-full py-3 sm:py-4 bg-blue-600 text-white rounded-xl font-bold text-sm sm:text-base hover:bg-blue-700 transition-all shadow-lg"
            >
              Volver a la Tienda
            </Link>
            {user && (
              <Link 
                href="/orders" 
                className="block w-full py-3 sm:py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-xl font-bold text-sm sm:text-base hover:bg-gray-50 transition-colors"
              >
                Ver mis Pedidos
              </Link>
            )}
          </div>
        </div>

        {/* Info adicional */}
        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500 max-w-md px-4">
          <p>📱 Revisa tu WhatsApp para la confirmación</p>
          <p className="mt-2">⏱️ Tiempo estimado de respuesta: 10-15 minutos</p>
        </div>
      </div>
    </>
  );
}

export default function Success() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div><p className="text-gray-600">Cargando...</p></div></div>}>
      <SuccessContent />
    </Suspense>
  );
}