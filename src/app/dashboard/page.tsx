'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '@/components/ui';
import { BotFeature, BotCategory } from '@/types/bot';
import { defaultFeatures } from '@/lib/data/features';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  Activity, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Bot,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [features, setFeatures] = useState<BotFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedFeatures = localStorage.getItem('bot-features');
    if (savedFeatures) {
      setFeatures(JSON.parse(savedFeatures));
    } else {
      setFeatures(defaultFeatures);
    }
    setIsLoading(false);
  }, []);

  // Mock analytics data
  const analytics = {
    totalUsers: 1247,
    activeUsers: 892,
    totalMessages: 15420,
    messagesToday: 234,
    responseTime: 1.2,
    uptime: 99.9,
    features: {
      enabled: features.filter(f => f.enabled).length,
      total: features.length,
      popular: ['translate', 'todo', 'quiz']
    }
  };

  const recentActivity = [
    { type: 'message', user: 'john_doe', action: 'used /translate', time: '2 min ago' },
    { type: 'user', user: 'new_user_123', action: 'joined bot', time: '5 min ago' },
    { type: 'feature', user: 'admin', action: 'enabled quiz feature', time: '1 hour ago' },
    { type: 'message', user: 'jane_smith', action: 'completed todo task', time: '2 hours ago' },
    { type: 'user', user: 'bob_wilson', action: 'started quiz', time: '3 hours ago' }
  ];

  const categoryStats = Object.values(BotCategory).map(category => ({
    category,
    count: features.filter(f => f.category === category && f.enabled).length,
    total: features.filter(f => f.category === category).length
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat dashboard...</p>
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
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="bg-blue-600 p-2 rounded-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">Analytics & Monitoring Bot</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="success">Online</Badge>
              <Button variant="outline" size="sm">Export Data</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{analytics.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-600">+12% from last month</p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-semibold text-gray-900">{analytics.activeUsers.toLocaleString()}</p>
                <p className="text-xs text-green-600">+8% from last month</p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Messages Today</p>
                <p className="text-2xl font-semibold text-gray-900">{analytics.messagesToday.toLocaleString()}</p>
                <p className="text-xs text-blue-600">+15% from yesterday</p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Response Time</p>
                <p className="text-2xl font-semibold text-gray-900">{analytics.responseTime}s</p>
                <p className="text-xs text-green-600">-0.3s from last week</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* System Status */}
          <div className="lg:col-span-2">
            <Card title="System Status" description="Status keseluruhan sistem bot">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Bot Status</span>
                  </div>
                  <Badge variant="success">Online</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Database</span>
                  </div>
                  <Badge variant="success">Connected</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium">API Endpoints</span>
                  </div>
                  <Badge variant="success">Healthy</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Uptime</span>
                  </div>
                  <span className="font-semibold text-green-600">{analytics.uptime}%</span>
                </div>
              </div>
            </Card>

            {/* Features Status */}
            <Card title="Features Status" description="Status fitur-fitur bot" className="mt-6">
              <div className="space-y-4">
                {categoryStats.map(({ category, count, total }) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bot className="w-5 h-5 text-gray-600" />
                      <span className="font-medium capitalize">{category}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{count}/{total}</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(count / total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card title="Recent Activity" description="Aktivitas terbaru dari pengguna">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {activity.type === 'message' && <MessageSquare className="w-4 h-4 text-blue-600 mt-1" />}
                      {activity.type === 'user' && <Users className="w-4 h-4 text-green-600 mt-1" />}
                      {activity.type === 'feature' && <Bot className="w-4 h-4 text-purple-600 mt-1" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Alerts */}
            <Card title="System Alerts" description="Peringatan sistem" className="mt-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">High CPU Usage</p>
                    <p className="text-xs text-gray-600">CPU usage above 80% for 5 minutes</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">All Systems Normal</p>
                    <p className="text-xs text-gray-600">No critical issues detected</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card title="Quick Actions" description="Aksi cepat untuk manajemen bot">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Bot className="w-6 h-6" />
                <span>Test Bot</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <BarChart3 className="w-6 h-6" />
                <span>View Reports</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Users className="w-6 h-6" />
                <span>User Management</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Activity className="w-6 h-6" />
                <span>System Health</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
