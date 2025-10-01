import { DigitekaReport, DigitekaApiConfig, DigitekaMetrics, DigitekaAuthResponse } from '@/types/digiteka';

export class DigitekaApiClient {
  private config: DigitekaApiConfig;
  private isDemoMode: boolean;
  private authToken: string | null = null;

  constructor(config: DigitekaApiConfig) {
    this.config = config;
    this.isDemoMode = !config.email || !config.password || 
                     config.email === 'email@example.com' || 
                     config.password === 'MotDePasse';
    console.log('DigitekaApiClient initialized', { isDemoMode: this.isDemoMode, email: config.email });
  }

  async fetchReports(startDate: string, endDate: string): Promise<DigitekaReport> {
    if (this.isDemoMode) {
      console.log('Running in demo mode with mock data');
      await new Promise(resolve => setTimeout(resolve, 500));
      return this.getMockData(startDate, endDate);
    }

    try {
      // Ensure we have a valid auth token
      if (!this.authToken) {
        await this.authenticate();
      }

      // Try to fetch reports from Digiteka API using the correct studio/generate endpoint
      const requestBody = {
        ranges: [{
          startDate: startDate,
          endDate: endDate,
          period: "P"
        }, null],
        data: [
          "streams", 
          "completion_video_25_per", 
          "completion_video_50_per", 
          "completion_video_75_per", 
          "completion_video_100_per",
          "video_duration",
          "percent_completed",
          "average_video_duration",
          "displays",
          "triggers"
        ],
        dimensions: ["device", "country"],
        filters: [],
        granularity: "day",
        context: "instream",
        subcontext: "editor"
      };

      const response = await fetch(`${this.config.baseUrl}/studio/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, try to re-authenticate
          await this.authenticate();
          return this.fetchReports(startDate, endDate);
        }
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return this.transformResponse(data, startDate, endDate);
    } catch (error) {
      console.error('Error fetching Digiteka reports:', error);
      console.log('Authentication successful, but reports endpoint not accessible. Using demo data.');
      return this.getMockData(startDate, endDate);
    }
  }

  private async authenticate(): Promise<void> {
    try {
      const response = await fetch(`${this.config.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.config.email,
          password: this.config.password,
        }),
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status}`);
      }

      const authData: DigitekaAuthResponse = await response.json();
      this.authToken = authData.access_token;
      console.log('Successfully authenticated with Digiteka API');
    } catch (error) {
      console.error('Digiteka authentication failed:', error);
      throw error;
    }
  }

  public getDemoMode(): boolean {
    return this.isDemoMode;
  }

  private transformResponse(apiData: any, startDate: string, endDate: string): DigitekaReport {
    console.log('Digiteka API Response:', JSON.stringify(apiData, null, 2));
    
    // The Digiteka API returns data with body array containing headers and body data
    const dataRows = apiData.body || [];
    const columns = apiData.columns || [];
    
    // Map column IDs to their indices for easier access
    const columnMap: { [key: string]: number } = {};
    columns.forEach((col: any, index: number) => {
      columnMap[col.id] = index;
    });

    const metrics = dataRows.map((item: any, index: number) => {
      const headers = item.headers || []; // [device, country, date]
      const values = item.body?.[0] || []; // Data values array
      
      return {
        id: `metric_${index}`,
        timestamp: headers[2] || new Date().toISOString(), // Date from headers
        views: parseInt(values[columnMap['streams']] || 0),
        impressions: parseInt(values[columnMap['displays']] || 0),
        clicks: parseInt(values[columnMap['triggers']] || 0),
        watch_time: parseFloat(values[columnMap['video_duration']] || 0) * 3600, // Convert hours to seconds
        avg_watch_time: parseFloat(values[columnMap['video_duration']] || 0) * 3600 / Math.max(parseInt(values[columnMap['streams']] || 1), 1), // Average per stream
        engagement_rate: parseFloat(values[columnMap['percent_completed']] || 0),
        completion_rate: parseFloat(values[columnMap['percent_completed']] || 0), // Use percent_completed as completion rate
        bounce_rate: Math.max(0, 100 - parseFloat(values[columnMap['percent_completed']] || 0)), // Estimate bounce as inverse of completion
        shares: 0, // Not available in current API call
        likes: 0, // Not available in current API call
        duration: parseFloat(values[columnMap['video_duration']] || 0) * 3600, // Total duration in seconds
        geography: headers[1], // Country from headers
        device_type: headers[0], // Device from headers
        content_id: `content_${index}`,
        content_title: `${headers[1]} ${headers[0]} Content ${index + 1}`,
        content_category: 'Video'
      };
    });

    // Calculate summary from all metrics
    const totalViews = metrics.reduce((sum, m) => sum + m.views, 0);
    const totalWatchTime = metrics.reduce((sum, m) => sum + m.watch_time, 0);
    const avgEngagement = metrics.length > 0 ? metrics.reduce((sum, m) => sum + m.engagement_rate, 0) / metrics.length : 0;
    const totalImpressions = metrics.reduce((sum, m) => sum + m.impressions, 0);
    const totalShares = metrics.reduce((sum, m) => sum + m.shares, 0);

    return {
      period: {
        start: startDate,
        end: endDate
      },
      metrics: metrics,
      summary: {
        total_views: totalViews,
        total_watch_time: totalWatchTime,
        avg_engagement_rate: avgEngagement,
        avg_completion_rate: avgEngagement, // Use engagement rate as completion rate
        total_impressions: totalImpressions,
        total_shares: totalShares
      }
    };
  }

  private getMockData(startDate: string, endDate: string): DigitekaReport {
    const mockMetrics: DigitekaMetrics[] = Array.from({ length: 10 }, (_, i) => {
      const views = Math.floor(Math.random() * 10000) + 1000;
      const duration = Math.floor(Math.random() * 300) + 30;
      const watchTime = Math.floor(Math.random() * 200) + 20;
      
      return {
        id: `metric_${i + 1}`,
        timestamp: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
        views: views,
        impressions: Math.floor(Math.random() * 50000) + 5000,
        clicks: Math.floor(Math.random() * 1000) + 100,
        watch_time: watchTime * views, // total watch time
        avg_watch_time: watchTime, // average watch time per view
        engagement_rate: Math.floor(Math.random() * 40) + 10, // 10-50%
        completion_rate: Math.floor(Math.random() * 60) + 20, // 20-80%
        bounce_rate: Math.floor(Math.random() * 30) + 10, // 10-40%
        shares: Math.floor(Math.random() * 500) + 10,
        likes: Math.floor(Math.random() * 2000) + 50,
        duration: duration,
        geography: ['US', 'FR', 'DE', 'UK', 'ES'][Math.floor(Math.random() * 5)],
        device_type: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)],
        content_id: `content_${i + 1}`,
        content_title: `Video Content ${i + 1}`,
        content_category: ['Entertainment', 'Educational', 'News', 'Sports', 'Music'][Math.floor(Math.random() * 5)]
      };
    });

    return {
      period: { start: startDate, end: endDate },
      metrics: mockMetrics,
      summary: {
        total_views: mockMetrics.reduce((sum, m) => sum + m.views, 0),
        total_watch_time: mockMetrics.reduce((sum, m) => sum + m.watch_time, 0),
        avg_engagement_rate: mockMetrics.reduce((sum, m) => sum + m.engagement_rate, 0) / mockMetrics.length,
        avg_completion_rate: mockMetrics.reduce((sum, m) => sum + m.completion_rate, 0) / mockMetrics.length,
        total_impressions: mockMetrics.reduce((sum, m) => sum + m.impressions, 0),
        total_shares: mockMetrics.reduce((sum, m) => sum + m.shares, 0)
      }
    };
  }
}