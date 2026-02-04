// PostHog API utilities for admin analytics

interface PostHogAnalytics {
  visitors: number;
  views: number;
  sessions: number;
  bounce_rate: number;
  session_duration: number;
}

interface PostHogUser {
  date_joined: string;
  uuid: string;
  distinct_id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_email_verified: boolean;
  is_staff: boolean;
  last_seen?: string;
}

export class PostHogAPI {
  private baseURL: string;
  private apiKey: string;
  private projectId: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.posthog.com';
    this.apiKey = process.env.POSTHOG_PERSONAL_API_KEY || '';
    this.projectId = process.env.POSTHOG_PROJECT_ID || '';
  }

  private async makeRequest(endpoint: string): Promise<any> {
    if (!this.apiKey || !this.projectId) {
      throw new Error('PostHog API credentials not configured');
    }

    const response = await fetch(`${this.baseURL}/api${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`PostHog API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getWebAnalyticsOverview(dateFrom?: string, dateTo?: string): Promise<PostHogAnalytics> {
    const params = new URLSearchParams();
    if (dateFrom) params.append('date_from', dateFrom);
    if (dateTo) params.append('date_to', dateTo);
    
    const endpoint = `/projects/${this.projectId}/web_analytics/overview/?${params.toString()}`;
    const data = await this.makeRequest(endpoint);
    
    return {
      visitors: data.visitors || 0,
      views: data.views || 0,
      sessions: data.sessions || 0,
      bounce_rate: data.bounce_rate || 0,
      session_duration: data.session_duration || 0,
    };
  }

  async getTotalUsers(): Promise<{ count: number; users: PostHogUser[] }> {
    const endpoint = `/users/`;
    const data = await this.makeRequest(endpoint);
    
    return {
      count: data.count || 0,
      users: data.results || [],
    };
  }

  async getActiveUsers(lastSeenHours: number = 24): Promise<number> {
    const { users } = await this.getTotalUsers();
    const cutoffTime = new Date(Date.now() - lastSeenHours * 60 * 60 * 1000);
    
    return users.filter(user => {
      if (!user.last_seen) return false;
      return new Date(user.last_seen) > cutoffTime;
    }).length;
  }

  async getRealtimeStats(): Promise<{
    totalViews: number;
    activeUsers: number;
    totalUsers: number;
    currentSessions: number;
  }> {
    try {
      // Check if credentials are configured
      if (!this.apiKey || this.apiKey === 'your_posthog_personal_api_key_here' || 
          !this.projectId || this.projectId === 'your_project_id_here') {
        throw new Error('PostHog API credentials not properly configured');
      }

      // Get total users (this works with free plan)
      const { count: totalUsers, users } = await this.getTotalUsers();
      
      // Calculate active users (users seen in last 30 minutes)
      const activeUsers = await this.getActiveUsers(0.5);
      
      // For web analytics, we need to simulate or use alternative data
      // since web analytics endpoint requires higher plan
      return {
        totalViews: 0, // Not available on current plan
        activeUsers,
        totalUsers,
        currentSessions: activeUsers, // Approximate sessions as active users
      };
    } catch (error) {
      console.error('Error fetching PostHog stats:', error);
      throw error;
    }
  }
}

export const posthogAPI = new PostHogAPI();
