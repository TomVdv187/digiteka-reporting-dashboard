import { DigitekaMetrics } from '@/types/digiteka';
import { DownloadIcon } from '@/components/icons/Icons';

interface DataTableProps {
  data: DigitekaMetrics[];
  onExport?: () => void;
}

export function DataTable({ data, onExport }: DataTableProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 80) return 'text-emerald-700 bg-emerald-100';
    if (rate >= 60) return 'text-amber-700 bg-amber-100';
    return 'text-red-700 bg-red-100';
  };

  const getDeviceIcon = (device: string) => {
    switch (device?.toLowerCase()) {
      case 'mobile':
        return '📱';
      case 'tablet':
        return '💻';
      case 'desktop':
        return '🖥️';
      default:
        return '📟';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-slate-200 overflow-hidden animate-slide-up">
      <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Detailed Analytics</h3>
            <p className="text-sm text-slate-600 mt-1">Comprehensive performance breakdown</p>
          </div>
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <DownloadIcon />
              <span className="font-medium">Export CSV</span>
            </button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Content
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Impressions
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Clicks
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Completion
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Region
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Device
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((metric, index) => (
              <tr 
                key={metric.id} 
                className={`hover:bg-slate-50 transition-colors duration-150 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-slate-25'
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  {formatDate(metric.timestamp)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 max-w-xs truncate">
                  {metric.content_title || metric.content_id || 
                    <span className="text-slate-400 italic">No title</span>
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  {formatNumber(metric.views)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {formatNumber(metric.impressions)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {formatNumber(metric.clicks)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-700">
                  {formatCurrency(metric.revenue)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCompletionRateColor(metric.completion_rate)}`}>
                    {metric.completion_rate.toFixed(1)}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-medium">
                    {metric.geography || 'Unknown'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  <div className="flex items-center space-x-2">
                    <span>{getDeviceIcon(metric.device_type || '')}</span>
                    <span className="capitalize">{metric.device_type || 'Unknown'}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}