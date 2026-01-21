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

export default function Terminos() {
  return (
    <>
      <NavbarWrapper />
      <div className="bg-gray-50 min-h-screen py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 text-sm sm:text-base">
            ← Volver al inicio
          </Link>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 lg:p-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Términos y Condiciones</h1>
            <p className="text-sm text-gray-500 mb-8">Última actualización: Enero 2026</p>

            <div className="prose prose-sm sm:prose max-w-none space-y-6">
              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">1. Aceptación de los Términos</h2>
                <p className="text-gray-700 leading-relaxed">
                  Al acceder y utilizar PuntoGo, usted acepta estar sujeto a estos términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro servicio.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">2. Uso del Servicio</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  PuntoGo es una plataforma de delivery de bebidas alcohólicas y productos relacionados. Al utilizar nuestro servicio:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Declara ser mayor de 18 años</li>
                  <li>Se compromete a proporcionar información veraz</li>
                  <li>Acepta que se verifique su edad al momento de la entrega</li>
                  <li>No revenderá los productos adquiridos</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">3. Pedidos y Pagos</h2>
                <p className="text-gray-700 leading-relaxed">
                  Los pedidos están sujetos a disponibilidad. Aceptamos pagos mediante Yape, Plin y efectivo contra entrega. 
                  Nos reservamos el derecho de cancelar pedidos en caso de información incompleta o sospecha de fraude.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">4. Entregas</h2>
                <p className="text-gray-700 leading-relaxed">
                  Los tiempos de entrega son estimados y pueden variar según la demanda. 
                  Es obligatorio presentar DNI al momento de recibir el pedido para verificar la mayoría de edad.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">5. Devoluciones y Reembolsos</h2>
                <p className="text-gray-700 leading-relaxed">
                  No se aceptan devoluciones de productos una vez entregados, salvo defectos de fábrica comprobables. 
                  Los reembolsos se procesarán en un plazo de 7 a 14 días hábiles.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">6. Responsabilidad</h2>
                <p className="text-gray-700 leading-relaxed">
                  PuntoGo no se hace responsable por el uso indebido de los productos adquiridos. 
                  El consumo excesivo de alcohol es dañino para la salud.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">7. Contacto</h2>
                <p className="text-gray-700 leading-relaxed">
                  Para consultas sobre estos términos, contáctenos en: <strong>contacto@puntogo.com</strong>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}