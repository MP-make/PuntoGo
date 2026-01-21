'use client'

import Link from 'next/link';

const orders = [
  { id: 1234, date: '18 Ene 2026', total: 'S/ 174.80', status: 'Entregado', steps: ['En Revisión', 'Confirmado', 'En Camino', 'Entregado'] },
  { id: 1235, date: '15 Ene 2026', total: 'S/ 89.50', status: 'En Camino', steps: ['En Revisión', 'Confirmado', 'En Camino'] },
  { id: 1236, date: '10 Ene 2026', total: 'S/ 245.00', status: 'Confirmado', steps: ['En Revisión', 'Confirmado'] },
  { id: 1237, date: '5 Ene 2026', total: 'S/ 67.30', status: 'En Revisión', steps: ['En Revisión'] },
];

const getStepColor = (step: string, status: string) => {
  const allSteps = ['En Revisión', 'Confirmado', 'En Camino', 'Entregado'];
  const statusIndex = allSteps.indexOf(status);
  const stepIndex = allSteps.indexOf(step);
  if (stepIndex < statusIndex) return 'bg-green-500';
  if (stepIndex === statusIndex) {
    if (step === 'En Revisión') return 'bg-yellow-500';
    if (step === 'Confirmado') return 'bg-blue-500';
    if (step === 'En Camino') return 'bg-orange-500';
    if (step === 'Entregado') return 'bg-green-500';
  }
  return 'bg-gray-300';
};

const getStepText = (step: string) => {
  if (step === 'En Revisión') return 'Validando Yape';
  if (step === 'Confirmado') return 'Pago Aceptado';
  if (step === 'En Camino') return 'Motorizado asignado';
  if (step === 'Entregado') return 'Disfruta tu pedido';
  return step;
};

const getProgressWidth = (status: string) => {
  switch(status) {
    case 'En Revisión': return '10%';
    case 'Confirmado': return '50%';
    case 'En Camino': return '80%';
    case 'Entregado': return '100%';
    default: return '0%';
  }
};

const getProgressColor = (status: string) => {
  switch(status) {
    case 'En Revisión': return 'bg-yellow-500';
    case 'Confirmado': return 'bg-blue-500';
    case 'En Camino': return 'bg-orange-500';
    case 'Entregado': return 'bg-green-500';
    default: return 'bg-gray-300';
  }
};

const getStatusColor = (status: string) => {
  switch(status) {
    case 'En Revisión': return 'text-yellow-600';
    case 'Confirmado': return 'text-blue-600';
    case 'En Camino': return 'text-orange-600';
    case 'Entregado': return 'text-green-600';
    default: return 'text-gray-600';
  }
};

export default function Orders() {
  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Mi Cuenta</h2>
            <nav className="space-y-2">
              <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">Mi Perfil</Link>
              <Link href="/orders" className="block px-4 py-2 bg-blue-100 text-blue-700 rounded">Mis Pedidos</Link>
              <Link href="/" className="block px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">← Volver a la Tienda</Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4">
          <h1 className="text-3xl font-bold mb-8">Mis Pedidos</h1>
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-2xl font-bold mb-4">No tienes pedidos aún</h2>
              <p className="text-gray-600 mb-6">¡Explora nuestro catálogo y realiza tu primer pedido!</p>
              <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">Ir al Catálogo</Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">Pedido #{index + 1}</h3>
                      <p className="text-gray-600">{order.date} - Total: {order.total}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Ver Detalles</button>
                      <button onClick={() => alert("Próximamente: PDF Real")} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">📄 Ver Boleta</button>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded h-3">
                      <div className={`h-full rounded transition-all ${getProgressColor(order.status)}`} style={{ width: getProgressWidth(order.status) }}></div>
                    </div>
                    <p className={`text-center font-bold mt-2 ${getStatusColor(order.status)}`}>{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}