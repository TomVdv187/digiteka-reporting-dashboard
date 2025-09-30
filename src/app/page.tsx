'use client';

import { useState, useEffect } from 'react';
import { DigitekaApiClient } from '@/lib/digiteka-api';
import { DigitekaReport } from '@/types/digiteka';
import { MetricsCard } from '@/components/MetricsCard';
import { DataTable } from '@/components/DataTable';
import { DateRangePicker } from '@/components/DateRangePicker';
import { ViewsChart, RevenueChart, GeographyChart, DeviceChart } from '@/components/Charts';
import { EyeIcon, DollarSignIcon, UsersIcon, MousePointerClickIcon } from '@/components/icons/Icons';
import { exportToCSV, exportToJSON } from '@/utils/export';

export default function Home() {
  const [report, setReport] = useState<DigitekaReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiClient = new DigitekaApiClient({
    apiKey: process.env.NEXT_PUBLIC_DIGITEKA_API_KEY || 'demo_key',
    baseUrl: process.env.NEXT_PUBLIC_DIGITEKA_BASE_URL || 'https://api.digiteka.com/v1',
    siteId: process.env.NEXT_PUBLIC_DIGITEKA_SITE_ID
  });

  const isDemoMode = apiClient.getDemoMode();

  const fetchData = async (startDate: string, endDate: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiClient.fetchReports(startDate, endDate);
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const defaultEndDate = new Date().toISOString().split('T')[0];
    const defaultStartDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    fetchData(defaultStartDate, defaultEndDate);
  }, []);

  const handleExportCSV = () => {
    if (report?.metrics) {
      exportToCSV(report.metrics);
    }
  };

  const handleExportJSON = () => {
    if (report) {
      exportToJSON(report);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Digiteka reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 py-0">
        <div className="gradient-bg relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          <div className="relative z-10 px-8 py-12">
            <div className="flex items-center justify-between">
              <div className="animate-fade-in">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Digiteka Analytics</h1>
                    <p className="text-white text-opacity-90 text-lg">Professional video content performance insights</p>
                  </div>
                </div>
              </div>
              {isDemoMode && (
                <div className="glass-effect px-6 py-4 rounded-xl animate-scale-in">
                  <div className="flex items-center text-indigo-900">
                    <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Demo Mode Active</div>
                      <div className="text-sm text-gray-600">Sample data • Add API credentials for live data</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-8 space-y-8">
          <DateRangePicker onDateChange={fetchData} />

          {report && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 -mt-8 relative z-20">
              <MetricsCard
                title="Total Views"
                value={report.summary.total_views.toLocaleString()}
                icon={<EyeIcon />}
                color="blue"
                trend={{ value: 12.5, isPositive: true }}
              />
              <MetricsCard
                title="Total Revenue"
                value={`$${report.summary.total_revenue.toLocaleString()}`}
                icon={<DollarSignIcon />}
                color="emerald"
                trend={{ value: 8.3, isPositive: true }}
              />
              <MetricsCard
                title="Completion Rate"
                value={`${report.summary.avg_completion_rate.toFixed(1)}%`}
                icon={<UsersIcon />}
                color="indigo"
                trend={{ value: 3.2, isPositive: false }}
              />
              <MetricsCard
                title="Total Impressions"
                value={report.summary.total_impressions.toLocaleString()}
                icon={<MousePointerClickIcon />}
                color="amber"
                trend={{ value: 15.7, isPositive: true }}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <ViewsChart data={report.metrics} />
              <RevenueChart data={report.metrics} />
              <GeographyChart data={report.metrics} />
              <DeviceChart data={report.metrics} />
            </div>

            <div className="mb-8 flex flex-wrap gap-4 justify-center">
              <button
                onClick={handleExportCSV}
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export CSV</span>
              </button>
              <button
                onClick={handleExportJSON}
                className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>Export JSON</span>
              </button>
            </div>

              <DataTable data={report.metrics} onExport={handleExportCSV} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}