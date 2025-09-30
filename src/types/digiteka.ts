export interface DigitekaMetrics {
  id: string;
  timestamp: string;
  views: number;
  impressions: number;
  clicks: number;
  revenue: number;
  duration: number;
  completion_rate: number;
  geography?: string;
  device_type?: string;
  content_id?: string;
  content_title?: string;
}

export interface DigitekaReport {
  period: {
    start: string;
    end: string;
  };
  metrics: DigitekaMetrics[];
  summary: {
    total_views: number;
    total_revenue: number;
    avg_completion_rate: number;
    total_impressions: number;
  };
}

export interface DigitekaApiConfig {
  apiKey: string;
  baseUrl: string;
  siteId?: string;
}