'use client';

import { useState, useEffect } from 'react';
import { DigitekaApiClient } from '@/lib/digiteka-api';
import { DigitekaReport } from '@/types/digiteka';
import { MetricsCard } from '@/components/MetricsCard';
import { DataTable } from '@/components/DataTable';
import { DateRangePicker } from '@/components/DateRangePicker';
import { ViewsChart, EngagementChart, GeographyChart, SocialChart } from '@/components/Charts';
import { EyeIcon, DollarSignIcon, UsersIcon, MousePointerClickIcon } from '@/components/icons/Icons';
import { exportToCSV, exportToJSON } from '@/utils/export';

export default function Home() {
  const [report, setReport] = useState<DigitekaReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiClient = new DigitekaApiClient({
    apiKey: typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_DIGITEKA_API_KEY || 'demo_key') : 'demo_key',
    baseUrl: typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_DIGITEKA_BASE_URL || 'https://api.digiteka.com/v1') : 'https://api.digiteka.com/v1',
    siteId: typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_DIGITEKA_SITE_ID : undefined
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
    <div className="min-h-screen bg-gray-50">
      {/* Dark Header */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Digiteka Analytics</h1>
            </div>
            {isDemoMode && (
              <div className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-md text-sm font-medium">
                Demo Mode
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <DateRangePicker onDateChange={fetchData} />

          {report && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricsCard
                title="Total Views"
                value={report.summary.total_views.toLocaleString()}
                icon={<EyeIcon />}
                color="blue"
                trend={{ value: 12.5, isPositive: true }}
              />
              <MetricsCard
                title="Total Watch Time"
                value={`${Math.floor(report.summary.total_watch_time / 3600).toLocaleString()}h`}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                color="emerald"
                trend={{ value: 15.2, isPositive: true }}
              />
              <MetricsCard
                title="Engagement Rate"
                value={`${report.summary.avg_engagement_rate.toFixed(1)}%`}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
                color="indigo"
                trend={{ value: 3.2, isPositive: true }}
              />
              <MetricsCard
                title="Total Shares"
                value={report.summary.total_shares.toLocaleString()}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>}
                color="amber"
                trend={{ value: 22.4, isPositive: true }}
              />
            </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ViewsChart data={report.metrics} />
                <EngagementChart data={report.metrics} />
                <GeographyChart data={report.metrics} />
                <SocialChart data={report.metrics} />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleExportCSV}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Export CSV
                </button>
                <button
                  onClick={handleExportJSON}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Export JSON
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