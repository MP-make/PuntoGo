"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Slide {
  title: string;
  subtitle: string;
  buttonText: string;
  image: string;
}

interface HeroCarouselProps {
  className?: string;
}

const slides: Slide[] = [
  {
    title: 'Oferta Fin de Semana',
    subtitle: 'Hasta 40% en Whiskys',
    buttonText: 'Ver Ofertas',
    image: 'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&q=80'
  },
  {
    title: 'Nuevos Vinos Importados',
    subtitle: 'Descubre sabores únicos',
    buttonText: 'Explorar',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80'
  },
  {
    title: 'Cervezas Artesanales',
    subtitle: 'Frescas y de calidad',
    buttonText: 'Comprar Ahora',
    image: 'https://images.unsplash.com/photo-1618183180483-3687355dc5c4?auto=format&fit=crop&q=80'
  },
];

const HeroCarousel: React.FC<HeroCarouselProps> = ({ className }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className={`relative overflow-hidden h-[200px] md:h-[400px] ${className}`}>
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative flex items-center justify-center h-full px-4 z-10 pointer-events-none">
            <div className="text-center text-white animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <h2 className="text-4xl md:text-7xl font-black tracking-tight mb-4">{slide.title}</h2>
              <p className="text-lg md:text-xl mb-6 text-gray-200">{slide.subtitle}</p>
              <Link
                href="#catalogo"
                className="inline-block bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition-all pointer-events-auto"
              >
                {slide.buttonText}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;