'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

export default function Success() {
  const searchParams = useSearchParams();
  const nameParams = searchParams.get('name') || 'Cliente';
  
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
      <style jsx global>{`
        /* 1. ESTILOS POR DEFECTO (PANTALLA) */
        .print-only {
          display: none !important;
        }
        
        .screen-only {
          display: flex !important;
        }

        /* 2. ESTILOS DE IMPRESIÓN (CUANDO DAS CLICK A IMPRIMIR) */
        @media print {
          .screen-only {
            display: none !important;
          }
          
          .print-only {
            display: block !important;
            width: 100%;
            background-color: white;
            color: black;
            font-family: Arial, sans-serif;
          }

          /* Limpiar márgenes del navegador */
          @page {
            size: A4;
            margin: 1.5cm;
          }
          
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>

      {/* === VISTA DE PANTALLA (WEB) === */}
      <div className="screen-only min-h-screen bg-gray-50 flex-col items-center justify-center p-4">
        
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-lg w-full border border-gray-100">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">¡Pedido Confirmado!</h1>
          <p className="text-gray-500 mb-8">
            Gracias <strong>{order?.cliente?.nombre || nameParams}</strong>.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left border border-gray-200">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Nro. Pedido:</span>
              <span className="font-mono font-bold text-gray-900">{order?.id || '---'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total:</span>
              <span className="font-bold text-green-600 text-lg">S/ {order?.total || '0.00'}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => window.print()} 
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2"
            >
              📄 Descargar Comprobante
            </button>
            <Link 
              href="/" 
              className="block w-full py-4 bg-white text-gray-700 border border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-colors text-center"
            >
              Volver a la Tienda
            </Link>
          </div>
        </div>
      </div>

      {/* === VISTA DE IMPRESIÓN (BOLETA REAL) === */}
      <div className="print-only">
        <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
          
          {/* Cabecera */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid black', paddingBottom: '20px', marginBottom: '30px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '900', margin: '0', textTransform: 'uppercase' }}>PUNTOGO</h1>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#333' }}>Venta de Bebidas Premium</p>
              <div style={{ fontSize: '12px', marginTop: '10px' }}>
                <p style={{ margin: 0 }}>Av. La Marina 2000, Lima</p>
                <p style={{ margin: 0 }}>Tel: (01) 555-1234</p>
                <p style={{ margin: 0 }}>contacto@puntogo.com</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ border: '2px solid black', padding: '10px 20px', borderRadius: '4px', display: 'inline-block' }}>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '12px' }}>R.U.C. 20601234567</p>
                <div style={{ backgroundColor: 'black', color: 'white', padding: '4px 10px', margin: '8px 0', fontWeight: 'bold', fontSize: '14px' }}>BOLETA DE VENTA</div>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{order?.id || 'B001-000000'}</p>
              </div>
            </div>
          </div>

          {/* Datos del Cliente */}
          <div style={{ marginBottom: '30px', border: '1px solid #ddd', padding: '15px', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
            <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 'bold', width: '100px', padding: '4px' }}>CLIENTE:</td>
                  <td style={{ padding: '4px' }}>{order?.cliente?.nombre || nameParams}</td>
                  <td style={{ fontWeight: 'bold', width: '100px', padding: '4px' }}>FECHA:</td>
                  <td style={{ padding: '4px' }}>{order?.date || new Date().toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold', padding: '4px' }}>DIRECCIÓN:</td>
                  <td style={{ padding: '4px' }}>{order?.cliente?.direccion || '-'}</td>
                  <td style={{ fontWeight: 'bold', padding: '4px' }}>TELÉFONO:</td>
                  <td style={{ padding: '4px' }}>{order?.cliente?.telefono || '-'}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold', padding: '4px' }}>PAGO:</td>
                  <td colSpan={3} style={{ padding: '4px' }}>{order?.pago?.metodo === 'DIGITAL' ? 'Yape/Plin' : 'Efectivo'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tabla de Productos */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#eee' }}>
                <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>CANT.</th>
                <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left', fontWeight: 'bold' }}>DESCRIPCIÓN</th>
                <th style={{ border: '1px solid black', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>P. UNIT</th>
                <th style={{ border: '1px solid black', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>IMPORTE</th>
              </tr>
            </thead>
            <tbody>
              {order?.items?.map((item: any, index: number) => (
                <tr key={index}>
                  <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{item.product.title}</td>
                  <td style={{ border: '1px solid black', padding: '8px', textAlign: 'right' }}>S/ {Number(item.product.price).toFixed(2)}</td>
                  <td style={{ border: '1px solid black', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>S/ {(item.product.price * item.quantity).toFixed(2)}</td>
                </tr>
              )) || <tr><td colSpan={4} style={{ padding: '20px', textAlign: 'center' }}>Cargando datos...</td></tr>}
            </tbody>
          </table>

          {/* Totales */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <table style={{ width: '250px', fontSize: '14px', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ textAlign: 'right', padding: '5px' }}>Op. Gravada:</td>
                  <td style={{ textAlign: 'right', padding: '5px', fontWeight: 'bold' }}>S/ {order ? (parseFloat(order.total) / 1.18).toFixed(2) : '0.00'}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'right', padding: '5px' }}>I.G.V. (18%):</td>
                  <td style={{ textAlign: 'right', padding: '5px', fontWeight: 'bold' }}>S/ {order ? (parseFloat(order.total) - (parseFloat(order.total) / 1.18)).toFixed(2) : '0.00'}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'right', padding: '10px 5px', borderTop: '2px solid black', fontWeight: '900', fontSize: '18px' }}>TOTAL:</td>
                  <td style={{ textAlign: 'right', padding: '10px 5px', borderTop: '2px solid black', fontWeight: '900', fontSize: '18px' }}>S/ {order?.total || '0.00'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pie */}
          <div style={{ marginTop: '50px', borderTop: '1px solid #ccc', paddingTop: '10px', textAlign: 'center', fontSize: '11px', color: '#666' }}>
            <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>Gracias por su compra en PuntoGo</p>
            <p style={{ margin: 0 }}>Representación impresa de la Boleta de Venta Electrónica</p>
            <p style={{ marginTop: '5px', fontFamily: 'monospace' }}>HASH: {order?.id?.replace(/-/g, '')}XYZ123</p>
          </div>

        </div>
      </div>
    </>
  );
}