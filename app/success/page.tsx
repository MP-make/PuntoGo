'use client'

import { useSearchParams } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

export default function Success() {
  const searchParams = useSearchParams();
  const nameParams = searchParams.get('name') || 'Cliente';
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    // Recuperar datos del pedido desde localStorage
    const storedOrder = localStorage.getItem('lastOrder');
    if (storedOrder) {
      setOrder(JSON.parse(storedOrder));
    }

    // Confeti desde los lados - Disparo más dramático
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50;
      
      // Confeti desde la IZQUIERDA
      confetti({
        particleCount,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#a29bfe']
      });
      
      // Confeti desde la DERECHA
      confetti({
        particleCount,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#a29bfe']
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style jsx global>{`
        @media print {
          /* Ocultar todo excepto la boleta */
          body > *:not(#__next) { display: none !important; }
          .print-hide { display: none !important; }
          
          /* Configurar página A4 */
          @page { 
            size: A4; 
            margin: 15mm;
          }
          
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
        }
        
        .check-icon {
          animation: check-bounce 2s ease-in-out infinite;
        }
        
        @keyframes check-bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) scale(1); }
          40% { transform: translateY(-20px) scale(1.1); }
          60% { transform: translateY(-10px) scale(1.05); }
        }
      `}</style>

      {/* VISTA EN PANTALLA - Con confeti */}
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center print-hide relative overflow-hidden px-4">
        
        {/* Icono animado */}
        <div className="text-9xl mb-8 check-icon">
          <span className="inline-block bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full w-32 h-32 flex items-center justify-center shadow-2xl">
            ✓
          </span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 text-center">
          ¡Pedido Confirmado!
        </h1>
        
        <p className="text-xl text-gray-700 mb-2 text-center max-w-2xl">
          Gracias <strong className="text-green-600">{order?.cliente?.nombre || nameParams}</strong>
        </p>
        
        <p className="text-3xl font-bold text-green-600 mb-10">
          Total: S/ {order?.total || '0.00'}
        </p>
        
        <p className="text-gray-600 mb-12 text-center max-w-xl">
          Hemos recibido tu solicitud. Te contactaremos por WhatsApp para confirmar tu pedido.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button 
            onClick={() => window.print()} 
            className="flex-1 px-6 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-bold shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            📄 Descargar Comprobante
          </button>
          <Link 
            href="/" 
            className="flex-1 px-6 py-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 font-bold text-center transition-all border-2 border-gray-200 hover:border-gray-300"
          >
            Volver a la Tienda
          </Link>
        </div>
      </div>

      {/* BOLETA PARA IMPRESIÓN - Solo visible al imprimir */}
      <div className="hidden print:block bg-white text-black">
        
        {/* Cabecera */}
        <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
          <div>
            <h1 className="text-3xl font-black uppercase">VENTIFY MARKET</h1>
            <p className="text-sm text-gray-600 mt-1">Venta de Bebidas Premium</p>
            <div className="mt-3 text-xs space-y-1">
              <p><strong>Dirección:</strong> Av. Principal 123, Lima, Perú</p>
              <p><strong>Teléfono:</strong> (01) 555-0000</p>
              <p><strong>Email:</strong> contacto@ventify.com</p>
            </div>
          </div>
          <div className="border-2 border-black p-3 rounded text-center min-w-[180px]">
            <p className="font-bold">RUC: 20601234567</p>
            <div className="bg-black text-white font-bold py-1 my-1 text-sm">BOLETA DE VENTA</div>
            <p className="font-bold">{order?.id || 'B001-000000'}</p>
          </div>
        </div>

        {/* Datos del Cliente */}
        <div className="mb-6 bg-gray-50 p-3 rounded border border-gray-300">
          <h3 className="font-bold text-xs uppercase text-gray-600 mb-2">DATOS DEL CLIENTE</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <p><strong>Nombre:</strong> {order?.cliente?.nombre || nameParams}</p>
            <p><strong>Fecha:</strong> {order?.date || new Date().toLocaleString('es-PE')}</p>
            <p><strong>Celular:</strong> {order?.cliente?.telefono || '-'}</p>
            <p><strong>Dirección:</strong> {order?.cliente?.direccion || 'No especificada'}</p>
          </div>
        </div>

        {/* Tabla de Productos */}
        <table className="w-full text-sm mb-6 border-collapse">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="py-2 text-left w-12">CANT.</th>
              <th className="py-2 text-left">DESCRIPCIÓN</th>
              <th className="py-2 text-right w-20">P.UNIT</th>
              <th className="py-2 text-right w-24">IMPORTE</th>
            </tr>
          </thead>
          <tbody>
            {order?.items?.map((item: any, index: number) => (
              <tr key={index} className="border-b border-gray-300">
                <td className="py-2 text-center font-bold">{item.quantity}</td>
                <td className="py-2">
                  <p className="font-semibold">{item.product.title}</p>
                  <p className="text-xs text-gray-600">{item.product.volume || ''}</p>
                </td>
                <td className="py-2 text-right">S/ {item.product.price.toFixed(2)}</td>
                <td className="py-2 text-right font-bold">S/ {(item.product.price * item.quantity).toFixed(2)}</td>
              </tr>
            )) || (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-500">
                  Sin productos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totales */}
        <div className="flex justify-end mb-8">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Op. Gravada:</span>
              <span>S/ {order ? (parseFloat(order.total) / 1.18).toFixed(2) : '0.00'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>IGV (18%):</span>
              <span>S/ {order ? (parseFloat(order.total) - (parseFloat(order.total) / 1.18)).toFixed(2) : '0.00'}</span>
            </div>
            <div className="flex justify-between border-t-2 border-black pt-2 text-lg font-black">
              <span>TOTAL:</span>
              <span>S/ {order?.total || '0.00'}</span>
            </div>
          </div>
        </div>

        {/* Método de Pago */}
        <div className="mb-6 p-3 bg-gray-50 rounded border border-gray-300">
          <p className="text-sm"><strong>Método de Pago:</strong> {order?.pago?.metodo === 'DIGITAL' ? 'Yape/Plin' : 'Contra Entrega'}</p>
          {order?.pago?.metodo === 'DIGITAL' && order?.pago?.referencia && (
            <p className="text-xs text-gray-600 mt-1">Ref: {order.pago.referencia}</p>
          )}
        </div>

        {/* Pie de Página */}
        <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-300">
          <p className="font-semibold">Gracias por su compra en Ventify Market</p>
          <p className="mt-1">Representación impresa de la Boleta de Venta Electrónica</p>
          <p className="mt-1 text-[10px] font-mono">HASH: {order?.id?.replace(/-/g, '')}ABC123XYZ</p>
        </div>

      </div>
    </>
  );
}