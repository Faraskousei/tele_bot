'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '@/components/ui';
import { FeatureCard } from '@/components/FeatureCard';
import { CategoryTabs } from '@/components/CategoryTabs';
import { BotFeature, BotCategory } from '@/types/bot';
import { defaultFeatures } from '@/lib/data/features';
import { Settings, BarChart3, Users, Bot } from 'lucide-react';

export default function HomePage() {
  const [features, setFeatures] = useState<BotFeature[]>([]);
  const [activeCategory, setActiveCategory] = useState<BotCategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load features from localStorage or API
    const savedFeatures = localStorage.getItem('bot-features');
    if (savedFeatures) {
      setFeatures(JSON.parse(savedFeatures));
    } else {
      setFeatures(defaultFeatures);
      localStorage.setItem('bot-features', JSON.stringify(defaultFeatures));
    }
    setIsLoading(false);
  }, []);

  const handleToggleFeature = (featureId: string) => {
    const updatedFeatures = features.map(feature => 
      feature.id === featureId 
        ? { ...feature, enabled: !feature.enabled, updatedAt: new Date() }
        : feature
    );
    setFeatures(updatedFeatures);
    localStorage.setItem('bot-features', JSON.stringify(updatedFeatures));
  };

  const handleConfigureFeature = (featureId: string) => {
    // Open configuration modal or navigate to settings page
    console.log('Configure feature:', featureId);
    alert(`Konfigurasi untuk fitur ${featureId} akan segera tersedia!`);
  };

  const filteredFeatures = activeCategory === 'all' 
    ? features 
    : features.filter(feature => feature.category === activeCategory);

  const enabledCount = features.filter(f => f.enabled).length;
  const totalUsers = 1247; // Mock data
  const totalMessages = 15420; // Mock data
  const uptime = '99.9%'; // Mock data

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat platform bot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Bot Platform</h1>
                <p className="text-sm text-gray-600">Manajemen Bot Telegram Terintegrasi</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="primary" size="sm">
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Bot className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Fitur Aktif</p>
                <p className="text-2xl font-semibold text-gray-900">{enabledCount}</p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Messages</p>
                <p className="text-2xl font-semibold text-gray-900">{totalMessages.toLocaleString()}</p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <div className="w-6 h-6 text-orange-600 flex items-center justify-center">
                  <span className="text-sm font-bold">%</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-2xl font-semibold text-gray-900">{uptime}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Category Tabs */}
        <CategoryTabs 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feature) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              onToggle={handleToggleFeature}
              onConfigure={handleConfigureFeature}
            />
          ))}
        </div>

        {filteredFeatures.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Bot className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tidak ada fitur di kategori ini
            </h3>
            <p className="text-gray-600">
              Fitur untuk kategori {activeCategory} belum tersedia.
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12">
          <Card title="Quick Actions" description="Aksi cepat untuk mengelola bot">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <Bot className="w-6 h-6" />
                <span>Test Bot</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <BarChart3 className="w-6 h-6" />
                <span>View Analytics</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <Settings className="w-6 h-6" />
                <span>Bot Settings</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}