import React from 'react';
import { Card, Badge, Button } from '@/components/ui';
import { BotFeature, BotCategory } from '@/types/bot';
import { BookOpen, CheckSquare, Gamepad2, ShoppingCart, Code } from 'lucide-react';

interface FeatureCardProps {
  feature: BotFeature;
  onToggle: (featureId: string) => void;
  onConfigure: (featureId: string) => void;
}

const getCategoryIcon = (category: BotCategory) => {
  switch (category) {
    case BotCategory.EDUCATION:
      return <BookOpen className="w-5 h-5" />;
    case BotCategory.MANAGEMENT:
      return <CheckSquare className="w-5 h-5" />;
    case BotCategory.ENTERTAINMENT:
      return <Gamepad2 className="w-5 h-5" />;
    case BotCategory.BUSINESS:
      return <ShoppingCart className="w-5 h-5" />;
    case BotCategory.TECHNICAL:
      return <Code className="w-5 h-5" />;
    default:
      return <CheckSquare className="w-5 h-5" />;
  }
};

const getCategoryColor = (category: BotCategory): 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' => {
  switch (category) {
    case BotCategory.EDUCATION:
      return 'info';
    case BotCategory.MANAGEMENT:
      return 'success';
    case BotCategory.ENTERTAINMENT:
      return 'warning';
    case BotCategory.BUSINESS:
      return 'primary';
    case BotCategory.TECHNICAL:
      return 'secondary';
    default:
      return 'primary';
  }
};

export const FeatureCard: React.FC<FeatureCardProps> = ({
  feature,
  onToggle,
  onConfigure
}) => {
  const categoryIcon = getCategoryIcon(feature.category);
  const categoryColor = getCategoryColor(feature.category);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="text-gray-600">
            {categoryIcon}
          </div>
          <Badge variant={categoryColor}>
            {feature.category}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggle(feature.id)}
            className={`w-11 h-6 rounded-full transition-colors ${
              feature.enabled ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
              feature.enabled ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {feature.name}
      </h3>
      
      <p className="text-gray-600 text-sm mb-4">
        {feature.description}
      </p>
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onConfigure(feature.id)}
        >
          Konfigurasi
        </Button>
        <Button
          variant={feature.enabled ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onToggle(feature.id)}
        >
          {feature.enabled ? 'Aktif' : 'Nonaktif'}
        </Button>
      </div>
    </Card>
  );
};
