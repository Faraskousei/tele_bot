'use client';

import React, { useState, useEffect } from 'react';
import { defaultFeatures } from '@/lib/data/features';
import { BotFeature, BotCategory } from '@/types/bot';

export default function SimplePage() {
  const [features, setFeatures] = useState<BotFeature[]>([]);
  const [activeCategory, setActiveCategory] = useState<BotCategory | 'all'>('all');

  useEffect(() => {
    console.log('Simple: Setting features');
    setFeatures(defaultFeatures);
  }, []);

  const filteredFeatures = activeCategory === 'all' 
    ? features 
    : features.filter(feature => feature.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Bot Platform - Simple Version</h1>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Fitur Aktif</h3>
          <p className="text-2xl font-bold text-blue-600">{features.filter(f => f.enabled).length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-2xl font-bold text-green-600">1,247</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Messages</h3>
          <p className="text-2xl font-bold text-purple-600">15,420</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Uptime</h3>
          <p className="text-2xl font-bold text-orange-600">99.9%</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['all', 'education', 'management', 'entertainment', 'business', 'technical'].map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category as BotCategory | 'all')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeCategory === category
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {category === 'all' ? 'Semua' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeatures.length > 0 ? (
          filteredFeatures.map((feature) => (
            <div key={feature.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {feature.category}
                  </span>
                </div>
                <button
                  onClick={() => {
                    const updated = features.map(f => 
                      f.id === feature.id ? { ...f, enabled: !f.enabled } : f
                    );
                    setFeatures(updated);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    feature.enabled ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    feature.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.name}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4">
                {feature.description}
              </p>
              
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                  Konfigurasi
                </button>
                <button className={`px-3 py-1 text-sm rounded text-white ${
                  feature.enabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
                }`}>
                  {feature.enabled ? 'Aktif' : 'Nonaktif'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">Tidak ada fitur tersedia untuk kategori {activeCategory}</p>
          </div>
        )}
      </div>

      {/* Debug Info */}
      <div className="mt-8 bg-white p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Debug Info:</h3>
        <p>Total features: {features.length}</p>
        <p>Active category: {activeCategory}</p>
        <p>Filtered features: {filteredFeatures.length}</p>
      </div>
    </div>
  );
}
