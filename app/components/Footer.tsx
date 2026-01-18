"use client";

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">Ventify Market</h3>
            <p className="text-gray-400">
              Tu tienda online de bebidas premium. Encuentra whiskys, vinos, cervezas y más con entrega rápida.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Inicio</a></li>
              <li><a href="/categories" className="text-gray-400 hover:text-white transition-colors">Categorías</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contacto</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">Sobre Nosotros</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contacto</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@ventifymarket.com</li>
              <li>Teléfono: +51 999 999 999</li>
              <li>Dirección: Lima, Perú</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center">
          <p>&copy; 2026 Ventify Market. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;