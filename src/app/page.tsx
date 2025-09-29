'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, Button } from '@/components/ui';
import { FeatureCard } from '@/components/FeatureCard';
import { CategoryTabs } from '@/components/CategoryTabs';
import { BotFeature, BotCategory } from '@/types/bot';
import { defaultFeatures } from '@/lib/data/features';
import { Settings, BarChart3, Users, Bot } from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const [features, setFeatures] = useState<BotFeature[]>(defaultFeatures);
  const [activeCategory, setActiveCategory] = useState<BotCategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client flag
    setIsClient(true);
    
    // Load features from localStorage
    try {
      const savedFeatures = localStorage.getItem('bot-features');
      console.log('Saved features:', savedFeatures);
      
      if (savedFeatures) {
        const parsed = JSON.parse(savedFeatures);
        console.log('Parsed features:', parsed);
        setFeatures(parsed);
      } else {
        console.log('No saved features, using defaults');
        setFeatures(defaultFeatures);
        localStorage.setItem('bot-features', JSON.stringify(defaultFeatures));
      }
    } catch (error) {
      console.error('Error loading features:', error);
      setFeatures(defaultFeatures);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Redirect to login if not authenticated (only on client side)
    if (isClient && !loading && !user) {
      window.location.href = '/login';
    }
  }, [isClient, loading, user]);

  const handleToggleFeature = (featureId: string) => {
    const updatedFeatures = features.map(feature => 
      feature.id === featureId 
        ? { ...feature, enabled: !feature.enabled, updatedAt: new Date() }
        : feature
    );
    
    setFeatures(updatedFeatures);
    
    // Save to localStorage only on client side
    if (isClient) {
      localStorage.setItem('bot-features', JSON.stringify(updatedFeatures));
    }
  };

  const handleConfigureFeature = (featureId: string) => {
    console.log('Configure feature:', featureId);
    // TODO: Implement feature configuration modal
  };

  // Show loading while checking authentication or loading features
  if (loading || isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  // Redirect to login if not authenticated (client-side only)
  if (isClient && !user) {
    return null; // Will redirect via useEffect
  }

  const filteredFeatures = activeCategory === 'all' 
    ? features 
    : features.filter(feature => feature.category === activeCategory);
    
  console.log('Active category:', activeCategory);
  console.log('Features:', features);
  console.log('Filtered features:', filteredFeatures);

  const enabledCount = features.filter(f => f.enabled).length;
  const totalUsers = 1247; // Mock data
  const totalMessages = 15420; // Mock data
  const uptime = '99.9%'; // Mock data

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
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
              <span className="text-sm text-gray-600">
                Halo, {user?.email}
              </span>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <a href="/dashboard">
                <Button variant="primary" size="sm">
                  Dashboard
                </Button>
              </a>
              <a href="/profile">
                <Button variant="outline" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Profil
                </Button>
              </a>
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
          {filteredFeatures.length > 0 ? (
            filteredFeatures.map((feature) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                onToggle={handleToggleFeature}
                onConfigure={handleConfigureFeature}
              />
            ))
          ) : (
            <div className="col-span-full">
              <Card className="text-center py-12">
                <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Bot className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Tidak ada fitur tersedia
                </h3>
                <p className="text-gray-600">
                  Fitur untuk kategori {activeCategory} belum tersedia atau sedang dimuat.
                </p>
              </Card>
            </div>
          )}
        </div>


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