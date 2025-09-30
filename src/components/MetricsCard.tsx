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
  const bgColors = {
    blue: 'bg-blue-500',
    emerald: 'bg-emerald-500', 
    amber: 'bg-amber-500',
    indigo: 'bg-indigo-500'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        {icon && (
          <div className={`w-12 h-12 ${bgColors[color]} rounded-lg flex items-center justify-center text-white mr-4`}>
            {icon}
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {trend && (
            <div className={`text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
}