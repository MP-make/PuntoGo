"use client";

import React from 'react';
import { Beer, Wine, Cigarette, Martini, Package, Sun } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Category {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface CategoryRailProps {
  className?: string;
}

const categories: Category[] = [
  { name: 'Cervezas', icon: Beer },
  { name: 'Bebidas', icon: Wine }, // Ícono de copa/botella de vino
  { name: 'Playa', icon: Sun }, // Ícono de sol para playa
  { name: 'Licores', icon: Martini },
  { name: 'Snacks', icon: Package },
  { name: 'Cigarros', icon: Cigarette },
];

const CategoryRail: React.FC<CategoryRailProps> = ({ className }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');

  const handleCategoryClick = (categoryName: string) => {
    if (activeCategory === categoryName) {
      router.push('/');
    } else {
      router.push(`/?category=${categoryName}`);
    }
  };

  return (
    <div className={`overflow-x-auto scrollbar-hide py-3 sm:py-4 ${className}`}>
      <div className="flex justify-start sm:justify-center gap-3 sm:gap-4 px-3 sm:px-4 min-w-max sm:min-w-0 sm:flex-wrap">
        {categories.map((category, index) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.name;
          return (
            <div key={index} className="flex flex-col items-center space-y-1 sm:space-y-2 flex-shrink-0">
              <div
                onClick={() => handleCategoryClick(category.name)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${isActive ? 'border-blue-600 bg-blue-600 shadow-lg scale-105' : 'border-gray-300 hover:border-blue-500 hover:scale-105'}`}
              >
                <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${isActive ? 'text-white' : 'text-gray-600'}`} />
              </div>
              <span className={`text-xs sm:text-sm text-center whitespace-nowrap ${isActive ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>{category.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryRail;