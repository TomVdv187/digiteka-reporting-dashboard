interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'emerald' | 'amber' | 'indigo';
}

export function MetricsCard({ title, value, subtitle, icon, trend, color = 'blue' }: MetricsCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 text-blue-600',
    emerald: 'from-emerald-500 to-emerald-600 text-emerald-600',
    amber: 'from-amber-500 to-amber-600 text-amber-600',
    indigo: 'from-indigo-500 to-indigo-600 text-indigo-600'
  };

  const iconBgClasses = {
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
    emerald: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    amber: 'bg-gradient-to-br from-amber-500 to-amber-600',
    indigo: 'bg-gradient-to-br from-indigo-500 to-indigo-600'
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-slate-200 p-6 card-hover animate-slide-up">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-4">
            {icon && (
              <div className={`w-12 h-12 ${iconBgClasses[color]} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                {icon}
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-slate-600 uppercase tracking-wide">{title}</h3>
              <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
              {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
            </div>
          </div>
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
            trend.isPositive 
              ? 'bg-emerald-100 text-emerald-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={trend.isPositive ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} 
              />
            </svg>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}