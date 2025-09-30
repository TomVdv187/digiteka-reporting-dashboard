import { DigitekaMetrics, DigitekaReport } from '@/types/digiteka';

export function exportToCSV(data: DigitekaMetrics[], filename: string = 'digiteka-report') {
  const headers = [
    'Date',
    'Content ID',
    'Content Title',
    'Views',
    'Impressions',
    'Clicks',
    'Revenue',
    'Duration',
    'Completion Rate',
    'Geography',
    'Device Type'
  ];

  const csvContent = [
    headers.join(','),
    ...data.map(row => [
      new Date(row.timestamp).toLocaleDateString(),
      row.content_id || '',
      row.content_title || '',
      row.views,
      row.impressions,
      row.clicks,
      row.revenue,
      row.duration,
      row.completion_rate,
      row.geography || '',
      row.device_type || ''
    ].map(field => `"${field}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(data: DigitekaReport, filename: string = 'digiteka-report') {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}