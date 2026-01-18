"use client";

import React from 'react';
import { Beer, Wine, Cigarette, Martini, Package } from 'lucide-react';
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
  { name: 'Vinos', icon: Wine },
  { name: 'Whiskys', icon: Martini },
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
    <div className={`overflow-x-auto scrollbar-hide py-4 ${className}`}>
      <div className="flex flex-wrap justify-center gap-4 px-4">
        {categories.map((category, index) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.name;
          return (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div
                onClick={() => handleCategoryClick(category.name)}
                className={`w-20 h-20 rounded-full border-2 transition-colors flex items-center justify-center cursor-pointer ${isActive ? 'border-blue-600 bg-blue-600' : 'border-gray-300 hover:border-blue-500'}`}
              >
                <Icon className={`h-8 w-8 ${isActive ? 'text-white' : 'text-gray-600'}`} />
              </div>
              <span className={`text-xs text-center ${isActive ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>{category.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryRail;