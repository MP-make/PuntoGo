'use client'

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Package, User, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import Navbar from '../components/Navbar';

const orders = [
  { id: '#SR-001234', date: '18 Ene 2026', total: 174.80, status: 'Entregado', items: 3 },
  { id: '#SR-001235', date: '15 Ene 2026', total: 89.50, status: 'En Camino', items: 2 },
  { id: '#SR-001236', date: '10 Ene 2026', total: 245.00, status: 'Confirmado', items: 5 },
  { id: '#SR-001237', date: '5 Ene 2026', total: 67.30, status: 'En Revisión', items: 1 },
];

const getStatusConfig = (status: string) => {
  switch(status) {
    case 'En Revisión': 
      return { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock, text: 'En Revisión' };
    case 'Confirmado': 
      return { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle, text: 'Confirmado' };
    case 'En Camino': 
      return { color: 'bg-orange-100 text-orange-700 border-orange-200', icon: Truck, text: 'En Camino' };
    case 'Entregado': 
      return { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle, text: 'Entregado' };
    case 'Cancelado': 
      return { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle, text: 'Cancelado' };
    default: 
      return { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: Package, text: status };
  }
};

export default function Orders() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4 sm:mb-6">
            ← Volver a la Tienda
          </Link>

          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Mis Pedidos</h1>
            <p className="text-sm sm:text-base text-gray-600">Revisa el estado de tus pedidos y tu historial de compras</p>
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
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <User className="w-5 h-5" />
                    Mi Perfil
                  </Link>
                  <Link href="/orders" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium transition-colors">
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
            <div className="lg:col-span-2">
              {orders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Package className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">No tienes pedidos aún</h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">¡Explora nuestro catálogo y realiza tu primer pedido!</p>
                  <Link href="/" className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors text-sm sm:text-base">
                    Ir al Catálogo
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {orders.map((order) => {
                    const statusConfig = getStatusConfig(order.status);
                    const StatusIcon = statusConfig.icon;
                    
                    return (
                      <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        {/* Header del pedido */}
                        <div className="bg-gradient-to-r from-gray-50 to-white p-4 sm:p-6 border-b border-gray-100">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Package className="w-5 h-5 text-gray-600" />
                                <h3 className="text-base sm:text-lg font-bold text-gray-900">{order.id}</h3>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {order.date}
                                </span>
                                <span>•</span>
                                <span>{order.items} producto{order.items > 1 ? 's' : ''}</span>
                              </div>
                            </div>
                            <div className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border ${statusConfig.color} font-semibold text-xs sm:text-sm`}>
                              <StatusIcon className="w-4 h-4" />
                              {statusConfig.text}
                            </div>
                          </div>
                        </div>

                        {/* Body del pedido */}
                        <div className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                              <p className="text-xs sm:text-sm text-gray-500 mb-1">Total pagado</p>
                              <p className="text-xl sm:text-2xl font-bold text-gray-900">S/ {order.total.toFixed(2)}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                              <button 
                                onClick={() => alert(`Detalles del pedido ${order.id}\n(Próximamente conectado con Ventify)`)}
                                className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
                              >
                                Ver Detalles
                              </button>
                              <button 
                                onClick={() => alert("Próximamente: Descarga de comprobante desde Ventify")} 
                                className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                Comprobante
                              </button>
                            </div>
                          </div>

                          {/* Progress tracker */}
                          {order.status !== 'Cancelado' && (
                            <div className="mt-6 pt-6 border-t border-gray-100">
                              <div className="relative">
                                <div className="absolute top-3 left-0 w-full h-1 bg-gray-200 rounded" />
                                <div 
                                  className="absolute top-3 left-0 h-1 bg-blue-600 rounded transition-all duration-500"
                                  style={{ 
                                    width: order.status === 'En Revisión' ? '10%' : 
                                           order.status === 'Confirmado' ? '40%' : 
                                           order.status === 'En Camino' ? '70%' : 
                                           '100%' 
                                  }}
                                />
                                <div className="relative flex justify-between">
                                  {['En Revisión', 'Confirmado', 'En Camino', 'Entregado'].map((step, idx) => {
                                    const isCompleted = 
                                      (order.status === 'Entregado') ||
                                      (order.status === 'En Camino' && idx < 3) ||
                                      (order.status === 'Confirmado' && idx < 2) ||
                                      (order.status === 'En Revisión' && idx < 1);
                                    const isCurrent = order.status === step;
                                    
                                    return (
                                      <div key={step} className="flex flex-col items-center">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 ${
                                          isCompleted || isCurrent ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
                                        }`}>
                                          {(isCompleted || isCurrent) && (
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                          )}
                                        </div>
                                        <p className={`text-xs mt-2 text-center hidden sm:block ${isCurrent ? 'font-bold text-blue-600' : 'text-gray-500'}`}>
                                          {step}
                                        </p>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}