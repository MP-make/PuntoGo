import Link from 'next/link';
import Navbar from '../components/Navbar';
import { Suspense } from 'react';

function NavbarWrapper() {
  return (
    <Suspense fallback={<div className="h-16 bg-white shadow-sm"></div>}>
      <Navbar />
    </Suspense>
  );
}

export default function Privacidad() {
  return (
    <>
      <NavbarWrapper />
      <div className="bg-gray-50 min-h-screen py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 text-sm sm:text-base">
            ← Volver al inicio
          </Link>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 lg:p-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Política de Privacidad</h1>
            <p className="text-sm text-gray-500 mb-8">Última actualización: Enero 2026</p>

            <div className="prose prose-sm sm:prose max-w-none space-y-6">
              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">1. Información que Recopilamos</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  En PuntoGo recopilamos la siguiente información:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Nombre completo y datos de contacto (teléfono, email)</li>
                  <li>Dirección de entrega</li>
                  <li>Información de pago (procesada de forma segura)</li>
                  <li>Historial de pedidos</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">2. Uso de la Información</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Utilizamos su información para:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Procesar y entregar sus pedidos</li>
                  <li>Comunicarnos sobre el estado de sus pedidos</li>
                  <li>Mejorar nuestros servicios</li>
                  <li>Enviar ofertas y promociones (con su consentimiento)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">3. Protección de Datos</h2>
                <p className="text-gray-700 leading-relaxed">
                  Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos personales contra acceso no autorizado, pérdida o alteración.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">4. Compartir Información</h2>
                <p className="text-gray-700 leading-relaxed">
                  No vendemos ni alquilamos su información personal a terceros. Solo compartimos datos necesarios con proveedores de servicios (logística, pagos) bajo estrictos acuerdos de confidencialidad.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">5. Cookies</h2>
                <p className="text-gray-700 leading-relaxed">
                  Utilizamos cookies para mejorar su experiencia de navegación, recordar preferencias y analizar el tráfico del sitio web.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">6. Sus Derechos</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Usted tiene derecho a:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Acceder a sus datos personales</li>
                  <li>Rectificar información inexacta</li>
                  <li>Solicitar la eliminación de sus datos</li>
                  <li>Oponerse al procesamiento de sus datos</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">7. Contacto</h2>
                <p className="text-gray-700 leading-relaxed">
                  Para ejercer sus derechos o consultas sobre privacidad, contáctenos en: <strong>privacidad@puntogo.com</strong>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}