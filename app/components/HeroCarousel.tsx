"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Slide {
  title: string;
  subtitle: string;
  buttonText: string;
  image: string;
  noOverlay?: boolean; // Propiedad opcional para controlar el overlay
}

interface HeroCarouselProps {
  className?: string;
}

const slides: Slide[] = [
  {
    title: 'Ofertas Fin de Semana',
    subtitle: 'Delivery gratis Pisco-Playa por compras mayores a S/ 80',
    buttonText: 'Ver Ofertas',
    image: '/Carrusel/Carrusel-cocteles.png',
    noOverlay: false
  },
  {
    title: 'Proximamente Vinos Artesanales',
    subtitle: 'Descubre sabores únicos',
    buttonText: 'Explorar',
    image: '/Carrusel/Carrusel-vino.png',
    noOverlay: false
  },
  {
    title: 'Tus Cervezas Favoritas',
    subtitle: 'Frescas y de calidad',
    buttonText: 'Comprar Ahora',
    image: '/Carrusel/Carrusel-cervezaartesanal.png',
    noOverlay: false
  },
];

const HeroCarousel: React.FC<HeroCarouselProps> = ({ className }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 segundos por slide
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className={`relative overflow-hidden h-[300px] md:h-[500px] ${className}`}>
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image - SIN zoom para banner del chancho */}
          <div 
            className={`absolute inset-0 ${
              slide.noOverlay 
                ? 'bg-cover bg-center bg-no-repeat' 
                : 'bg-cover bg-center'
            } ${
              !slide.noOverlay && 'transition-transform duration-[8000ms] ease-out'
            } ${
               index === currentSlide && !slide.noOverlay ? 'scale-110' : 'scale-100'
            }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          
          {/* Overlay oscuro para legibilidad - CONDICIONAL */}
          {!slide.noOverlay && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
          )}
          
          {/* Content - Solo mostrar si hay título */}
          {slide.title && (
            <div className="relative flex items-center justify-center h-full px-4 z-20 pointer-events-none">
              <div className={`text-center text-white space-y-4 transition-all duration-1000 delay-300 transform ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight drop-shadow-lg leading-tight">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-2xl text-gray-100 font-medium drop-shadow-md max-w-2xl mx-auto">
                  {slide.subtitle}
                </p>
                {slide.buttonText && (
                  <div className="pt-4">
                    <Link
                      href={
                        slide.title === 'Ofertas Fin de Semana' 
                          ? '/proximamente' 
                          : slide.title === 'Nuevos Vinos Disponibles'
                          ? '/?category=Vinos'
                          : '/?category=Cervezas'
                      }
                      className="inline-block bg-white text-slate-900 px-8 py-3 rounded-full font-bold text-base md:text-lg hover:bg-blue-50 hover:scale-105 transition-all shadow-xl pointer-events-auto"
                    >
                      {slide.buttonText}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 space-x-3 z-30 flex">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;