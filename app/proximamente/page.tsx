"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { Clock, Home, ArrowLeft } from 'lucide-react';

function ProximamenteContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Icono animado */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="relative bg-white rounded-full p-8 shadow-2xl border-4 border-blue-100">
            <Clock className="w-24 h-24 text-blue-600 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
        </div>

        {/* Título */}
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl font-black text-gray-900 tracking-tight">
            Próximamente
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 font-medium">
            Estamos preparando algo increíble para ti
          </p>
        </div>

        {/* Descripción */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100">
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
            🎉 Nuestro equipo está trabajando en <strong>nuevas ofertas exclusivas</strong> y promociones especiales. 
            Muy pronto podrás disfrutar de descuentos increíbles en tus productos favoritos.
          </p>
        </div>

        {/* Llamado a la acción */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 sm:p-8 text-white shadow-2xl">
          <h3 className="text-xl sm:text-2xl font-bold mb-3">¡No te pierdas nada!</h3>
          <p className="text-sm sm:text-base mb-4 opacity-90">
            Mientras tanto, explora nuestro catálogo completo con los mejores precios.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:scale-105"
            >
              <Home className="w-5 h-5" />
              Ver Productos
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-white/20 text-white border-2 border-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al Inicio
            </Link>
          </div>
        </div>

        {/* Footer mensaje */}
        <p className="text-sm text-gray-500">
          ¿Tienes preguntas? <Link href="/" className="text-blue-600 font-semibold hover:underline">Contáctanos</Link>
        </p>
      </div>
    </div>
  );
}

export default function ProximamentePage() {
  return (
    <>
      <Suspense fallback={
        <div className="h-16 bg-white border-b border-gray-200 animate-pulse" />
      }>
        <Navbar />
      </Suspense>
      <ProximamenteContent />
    </>
  );
}