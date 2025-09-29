'use client';

import React, { useState, useEffect } from 'react';
import { defaultFeatures } from '@/lib/data/features';
import { BotFeature, BotCategory } from '@/types/bot';

export default function DebugPage() {
  const [features, setFeatures] = useState<BotFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Debug: Loading features...');
    console.log('Debug: Default features:', defaultFeatures);
    
    setFeatures(defaultFeatures);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Features Count: {features.length}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => (
          <div key={feature.id} className="border p-4 rounded-lg">
            <h3 className="font-semibold">{feature.name}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
            <p className="text-xs">Category: {feature.category}</p>
            <p className="text-xs">Enabled: {feature.enabled ? 'Yes' : 'No'}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Raw Data:</h2>
        <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
          {JSON.stringify(features, null, 2)}
        </pre>
      </div>
    </div>
  );
}
