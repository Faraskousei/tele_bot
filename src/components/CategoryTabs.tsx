import React from 'react';
import { BotCategory } from '@/types/bot';
import { BookOpen, CheckSquare, Gamepad2, ShoppingCart, Code } from 'lucide-react';

interface CategoryTabsProps {
  activeCategory: BotCategory | 'all';
  onCategoryChange: (category: BotCategory | 'all') => void;
}

const categories = [
  { id: 'all', label: 'Semua', icon: null },
  { id: BotCategory.EDUCATION, label: 'Pendidikan', icon: BookOpen },
  { id: BotCategory.MANAGEMENT, label: 'Manajemen', icon: CheckSquare },
  { id: BotCategory.ENTERTAINMENT, label: 'Hiburan', icon: Gamepad2 },
  { id: BotCategory.BUSINESS, label: 'Bisnis', icon: ShoppingCart },
  { id: BotCategory.TECHNICAL, label: 'Teknis', icon: Code },
];

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onCategoryChange
}) => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id as BotCategory | 'all')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                isActive
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span>{category.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
