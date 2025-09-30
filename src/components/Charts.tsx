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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Views & Impressions Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="views" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
          <Area type="monotone" dataKey="impressions" stackId="2" stroke="#10B981" fill="#10B981" />
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue & Clicks</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" />
          <Line yAxisId="right" type="monotone" dataKey="clicks" stroke="#ff7300" />
        </LineChart>
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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Views by Geography</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ geography, percent }) => `${geography} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="views"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
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
    device,
    views,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Views by Device Type</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="device" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="views" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}