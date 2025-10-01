export interface DigitekaMetrics {
  id: string;
  timestamp: string;
  views: number;
  impressions: number;
  clicks: number;
  watch_time: number; // in seconds
  avg_watch_time: number; // in seconds
  engagement_rate: number; // percentage
  completion_rate: number;
  bounce_rate: number; // percentage
  shares: number;
  likes: number;
  duration: number;
  geography?: string;
  device_type?: string;
  content_id?: string;
  content_title?: string;
  content_category?: string;
}

export interface DigitekaReport {
  period: {
    start: string;
    end: string;
  };
  metrics: DigitekaMetrics[];
  summary: {
    total_views: number;
    total_watch_time: number;
    avg_engagement_rate: number;
    avg_completion_rate: number;
    total_impressions: number;
    total_shares: number;
  };
}

export interface DigitekaApiConfig {
  email: string;
  password: string;
  baseUrl: string;
}

export interface DigitekaAuthResponse {
  token_type: string;
  access_token: string;
  expires_at: string;
  refresh_token: string;
}