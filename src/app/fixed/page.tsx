'use client';

import React, { useState, useEffect } from 'react';
import { defaultFeatures } from '@/lib/data/features';
import { BotFeature, BotCategory } from '@/types/bot';

export default function FixedPage() {
  const [features, setFeatures] = useState<BotFeature[]>(defaultFeatures);
  const [activeCategory, setActiveCategory] = useState<BotCategory | 'all'>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f9fafb', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '128px',
            height: '128px',
            border: '2px solid #2563eb',
            borderTop: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '16px', color: '#6b7280' }}>Memuat platform bot...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const filteredFeatures = activeCategory === 'all' 
    ? features 
    : features.filter(feature => feature.category === activeCategory);

  const enabledCount = features.filter(f => f.enabled).length;

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f9fafb'
  };

  const headerStyle = {
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb'
  };

  const cardStyle = {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    padding: '24px'
  };

  const buttonStyle = {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  };

  const toggleStyle = (enabled: boolean) => ({
    width: '44px',
    height: '24px',
    borderRadius: '12px',
    backgroundColor: enabled ? '#2563eb' : '#d1d5db',
    cursor: 'pointer',
    position: 'relative' as const,
    transition: 'background-color 0.2s'
  });

  const toggleDotStyle = (enabled: boolean) => ({
    width: '16px',
    height: '16px',
    backgroundColor: 'white',
    borderRadius: '50%',
    position: 'absolute' as const,
    top: '4px',
    left: enabled ? '24px' : '4px',
    transition: 'left 0.2s'
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'education': return { bg: '#dbeafe', text: '#1e40af' };
      case 'management': return { bg: '#dcfce7', text: '#166534' };
      case 'entertainment': return { bg: '#fef3c7', text: '#92400e' };
      case 'business': return { bg: '#e9d5ff', text: '#7c3aed' };
      case 'technical': return { bg: '#f3f4f6', text: '#374151' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '24px 0' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ backgroundColor: '#2563eb', padding: '8px', borderRadius: '8px' }}>
                <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                  <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                  Bot Platform
                </h1>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Manajemen Bot Telegram Terintegrasi
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button style={{
                ...buttonStyle,
                backgroundColor: 'white',
                color: '#374151',
                border: '1px solid #d1d5db'
              }}>
                Settings
              </button>
              <button style={buttonStyle}>
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }}>
        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '24px', 
          marginBottom: '32px' 
        }}>
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ backgroundColor: '#dbeafe', padding: '12px', borderRadius: '8px' }}>
                <svg width="24" height="24" fill="#2563eb" viewBox="0 0 24 24">
                  <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div style={{ marginLeft: '16px' }}>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', margin: 0 }}>
                  Fitur Aktif
                </p>
                <p style={{ fontSize: '24px', fontWeight: '600', color: '#111827', margin: 0 }}>
                  {enabledCount}
                </p>
              </div>
            </div>
          </div>
          
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ backgroundColor: '#dcfce7', padding: '12px', borderRadius: '8px' }}>
                <svg width="24" height="24" fill="#059669" viewBox="0 0 24 24">
                  <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div style={{ marginLeft: '16px' }}>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', margin: 0 }}>
                  Total Users
                </p>
                <p style={{ fontSize: '24px', fontWeight: '600', color: '#111827', margin: 0 }}>
                  1,247
                </p>
              </div>
            </div>
          </div>
          
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ backgroundColor: '#e9d5ff', padding: '12px', borderRadius: '8px' }}>
                <svg width="24" height="24" fill="#7c3aed" viewBox="0 0 24 24">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div style={{ marginLeft: '16px' }}>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', margin: 0 }}>
                  Total Messages
                </p>
                <p style={{ fontSize: '24px', fontWeight: '600', color: '#111827', margin: 0 }}>
                  15,420
                </p>
              </div>
            </div>
          </div>
          
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ backgroundColor: '#fed7aa', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#ea580c' }}>%</span>
              </div>
              <div style={{ marginLeft: '16px' }}>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', margin: 0 }}>
                  Uptime
                </p>
                <p style={{ fontSize: '24px', fontWeight: '600', color: '#111827', margin: 0 }}>
                  99.9%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '24px' }}>
          <nav style={{ display: 'flex', gap: '32px' }}>
            {[
              { id: 'all', label: 'Semua' },
              { id: 'education', label: 'Pendidikan' },
              { id: 'management', label: 'Manajemen' },
              { id: 'entertainment', label: 'Hiburan' },
              { id: 'business', label: 'Bisnis' },
              { id: 'technical', label: 'Teknis' }
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id as BotCategory | 'all')}
                style={{
                  padding: '8px 4px',
                  borderBottom: activeCategory === category.id ? '2px solid #2563eb' : '2px solid transparent',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: activeCategory === category.id ? '#2563eb' : '#6b7280',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (activeCategory !== category.id) {
                    e.currentTarget.style.color = '#374151';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== category.id) {
                    e.currentTarget.style.color = '#6b7280';
                  }
                }}
              >
                {category.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Features Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '24px' 
        }}>
          {filteredFeatures.map((feature) => {
            const categoryColor = getCategoryColor(feature.category);
            
            return (
              <div key={feature.id} style={{
                ...cardStyle,
                transition: 'box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  justifyContent: 'space-between', 
                  marginBottom: '12px' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      backgroundColor: categoryColor.bg,
                      color: categoryColor.text,
                      fontSize: '12px',
                      fontWeight: '500',
                      padding: '4px 10px',
                      borderRadius: '9999px'
                    }}>
                      {feature.category}
                    </span>
                  </div>
                  <div style={toggleStyle(feature.enabled)}
                    onClick={() => {
                      const updated = features.map(f => 
                        f.id === feature.id ? { ...f, enabled: !f.enabled } : f
                      );
                      setFeatures(updated);
                    }}>
                    <div style={toggleDotStyle(feature.enabled)} />
                  </div>
                </div>
                
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#111827', 
                  margin: '0 0 8px 0' 
                }}>
                  {feature.name}
                </h3>
                
                <p style={{ 
                  color: '#6b7280', 
                  fontSize: '14px', 
                  margin: '0 0 16px 0',
                  lineHeight: '1.5'
                }}>
                  {feature.description}
                </p>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{
                    padding: '6px 12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'white',
                    color: '#374151',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}>
                    Konfigurasi
                  </button>
                  <button style={{
                    ...buttonStyle,
                    backgroundColor: feature.enabled ? '#2563eb' : '#4b5563',
                    padding: '6px 12px',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = feature.enabled ? '#1d4ed8' : '#374151';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = feature.enabled ? '#2563eb' : '#4b5563';
                  }}>
                    {feature.enabled ? 'Aktif' : 'Nonaktif'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Debug Info */}
        <div style={{ 
          marginTop: '32px', 
          backgroundColor: 'white', 
          padding: '16px', 
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>Debug Info:</h3>
          <p>Total features: {features.length}</p>
          <p>Active category: {activeCategory}</p>
          <p>Filtered features: {filteredFeatures.length}</p>
          <p>Mounted: {mounted ? 'Yes' : 'No'}</p>
          <p style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
            Bot Token: 8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw
          </p>
        </div>
      </div>
    </div>
  );
}
