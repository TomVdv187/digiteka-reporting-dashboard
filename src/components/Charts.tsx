'use client';

import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DigitekaMetrics } from '@/types/digiteka';

interface ChartsProps {
  data: DigitekaMetrics[];
}

export function ViewsChart({ data }: ChartsProps) {
  const chartData = data.map(item => ({
    date: new Date(item.timestamp).toLocaleDateString(),
    views: item.views,
    impressions: item.impressions,
  }));

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-slate-200 p-8 card-hover animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Views & Impressions</h3>
          <p className="text-sm text-slate-600 mt-1">Performance trends over time</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-slate-600">Views</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-sm text-slate-600">Impressions</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="impressionsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#64748B' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#64748B' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="views" 
            stroke="#3B82F6" 
            strokeWidth={3}
            fill="url(#viewsGradient)" 
          />
          <Area 
            type="monotone" 
            dataKey="impressions" 
            stroke="#10B981" 
            strokeWidth={3}
            fill="url(#impressionsGradient)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RevenueChart({ data }: ChartsProps) {
  const chartData = data.map(item => ({
    date: new Date(item.timestamp).toLocaleDateString(),
    revenue: item.revenue,
    clicks: item.clicks,
  }));

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-slate-200 p-8 card-hover animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Revenue & Engagement</h3>
          <p className="text-sm text-slate-600 mt-1">Financial performance metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
            <span className="text-sm text-slate-600">Revenue</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span className="text-sm text-slate-600">Clicks</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#64748B' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#64748B' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#4F46E5" 
            strokeWidth={3}
            fill="url(#revenueGradient)" 
          />
          <Area 
            type="monotone" 
            dataKey="clicks" 
            stroke="#F59E0B" 
            strokeWidth={3}
            fill="url(#clicksGradient)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GeographyChart({ data }: ChartsProps) {
  const geographyData = data.reduce((acc: Record<string, number>, item) => {
    if (item.geography) {
      acc[item.geography] = (acc[item.geography] || 0) + item.views;
    }
    return acc;
  }, {});

  const chartData = Object.entries(geographyData).map(([geography, views]) => ({
    geography,
    views,
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-slate-200 p-8 card-hover animate-slide-up">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900">Geographic Distribution</h3>
        <p className="text-sm text-slate-600 mt-1">Views breakdown by region</p>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ geography, percent }) => `${geography} ${(percent * 100).toFixed(0)}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="views"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DeviceChart({ data }: ChartsProps) {
  const deviceData = data.reduce((acc: Record<string, number>, item) => {
    if (item.device_type) {
      acc[item.device_type] = (acc[item.device_type] || 0) + item.views;
    }
    return acc;
  }, {});

  const chartData = Object.entries(deviceData).map(([device, views]) => ({
    device: device.charAt(0).toUpperCase() + device.slice(1),
    views,
  }));

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-slate-200 p-8 card-hover animate-slide-up">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900">Device Analytics</h3>
        <p className="text-sm text-slate-600 mt-1">Audience device preferences</p>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="deviceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.4}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis 
            dataKey="device" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#64748B' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#64748B' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar 
            dataKey="views" 
            fill="url(#deviceGradient)"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}