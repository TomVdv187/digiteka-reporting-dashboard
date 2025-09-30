import { DigitekaReport, DigitekaApiConfig, DigitekaMetrics } from '@/types/digiteka';

export class DigitekaApiClient {
  private config: DigitekaApiConfig;
  private isDemoMode: boolean;

  constructor(config: DigitekaApiConfig) {
    this.config = config;
    this.isDemoMode = !config.apiKey || config.apiKey === 'demo_key' || config.apiKey === 'your_api_key_here';
  }

  async fetchReports(startDate: string, endDate: string): Promise<DigitekaReport> {
    if (this.isDemoMode) {
      console.log('Running in demo mode with mock data');
      await new Promise(resolve => setTimeout(resolve, 500));
      return this.getMockData(startDate, endDate);
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/reports`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate,
          site_id: this.config.siteId,
          metrics: ['views', 'impressions', 'clicks', 'revenue', 'duration', 'completion_rate'],
          dimensions: ['geography', 'device_type', 'content_id']
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return this.transformResponse(data);
    } catch (error) {
      console.error('Error fetching Digiteka reports:', error);
      return this.getMockData(startDate, endDate);
    }
  }

  public getDemoMode(): boolean {
    return this.isDemoMode;
  }

  private transformResponse(apiData: any): DigitekaReport {
    return {
      period: {
        start: apiData.period?.start || '',
        end: apiData.period?.end || ''
      },
      metrics: apiData.data?.map((item: any) => ({
        id: item.id || Math.random().toString(36),
        timestamp: item.timestamp || new Date().toISOString(),
        views: item.views || 0,
        impressions: item.impressions || 0,
        clicks: item.clicks || 0,
        revenue: item.revenue || 0,
        duration: item.duration || 0,
        completion_rate: item.completion_rate || 0,
        geography: item.geography,
        device_type: item.device_type,
        content_id: item.content_id,
        content_title: item.content_title
      })) || [],
      summary: {
        total_views: apiData.summary?.total_views || 0,
        total_revenue: apiData.summary?.total_revenue || 0,
        avg_completion_rate: apiData.summary?.avg_completion_rate || 0,
        total_impressions: apiData.summary?.total_impressions || 0
      }
    };
  }

  private getMockData(startDate: string, endDate: string): DigitekaReport {
    const mockMetrics: DigitekaMetrics[] = Array.from({ length: 10 }, (_, i) => ({
      id: `metric_${i + 1}`,
      timestamp: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
      views: Math.floor(Math.random() * 10000) + 1000,
      impressions: Math.floor(Math.random() * 50000) + 5000,
      clicks: Math.floor(Math.random() * 1000) + 100,
      revenue: Math.floor(Math.random() * 500) + 50,
      duration: Math.floor(Math.random() * 300) + 30,
      completion_rate: Math.floor(Math.random() * 100) + 1,
      geography: ['US', 'FR', 'DE', 'UK', 'ES'][Math.floor(Math.random() * 5)],
      device_type: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)],
      content_id: `content_${i + 1}`,
      content_title: `Video Content ${i + 1}`
    }));

    return {
      period: { start: startDate, end: endDate },
      metrics: mockMetrics,
      summary: {
        total_views: mockMetrics.reduce((sum, m) => sum + m.views, 0),
        total_revenue: mockMetrics.reduce((sum, m) => sum + m.revenue, 0),
        avg_completion_rate: mockMetrics.reduce((sum, m) => sum + m.completion_rate, 0) / mockMetrics.length,
        total_impressions: mockMetrics.reduce((sum, m) => sum + m.impressions, 0)
      }
    };
  }
}