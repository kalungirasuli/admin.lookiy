const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('travo_token', token);
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('travo_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('travo_token');
      localStorage.removeItem('travo_refresh_token');
    }
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const token = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

    if (res.status === 401) {
      this.clearToken();
      if (typeof window !== 'undefined') window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getMe() {
    return this.request<any>('/auth/me');
  }

  // Users
  async getUsers(page = 1, limit = 20) {
    return this.request<any>(`/users/profile?page=${page}&limit=${limit}`);
  }

  async updateUserRoles(userId: string, roles: string[]) {
    return this.request<any>('/users/roles', {
      method: 'PUT',
      body: JSON.stringify({ userId, roles }),
    });
  }

  // Journeys
  async getJourneys(page = 1, limit = 20) {
    return this.request<any>(`/journeys/my/history?page=${page}&limit=${limit}`);
  }

  async getJourney(id: string) {
    return this.request<any>(`/journeys/${id}`);
  }

  // Operators
  async getOperators(page = 1, limit = 20) {
    return this.request<any>(`/operators?page=${page}&limit=${limit}`);
  }

  async getOperator(id: string) {
    return this.request<any>(`/operators/${id}`);
  }

  // Companies
  async getCompanies(page = 1, limit = 20) {
    return this.request<any>(`/companies?page=${page}&limit=${limit}`);
  }

  async getCompany(id: string) {
    return this.request<any>(`/companies/${id}`);
  }

  // Wallet
  async getWalletBalance() {
    return this.request<any>('/wallet/balance');
  }

  async getTransactions(page = 1, limit = 20) {
    return this.request<any>(`/wallet/transactions?page=${page}&limit=${limit}`);
  }

  // Ads
  async getAds(page = 1, limit = 20) {
    return this.request<any>(`/ads/campaigns?page=${page}&limit=${limit}`);
  }

  async getAdAnalytics(id: string) {
    return this.request<any>(`/ads/${id}/analytics`);
  }

  // Analytics
  async getDashboard() {
    return this.request<any>('/analytics/dashboard');
  }

  async getJourneyAnalytics(params?: string) {
    return this.request<any>(`/analytics/journeys${params ? `?${params}` : ''}`);
  }

  async getRevenue() {
    return this.request<any>('/analytics/revenue');
  }

  async getHeatmap() {
    return this.request<any>('/analytics/heatmap');
  }

  // Notifications
  async getNotifications(page = 1) {
    return this.request<any>(`/notifications?page=${page}`);
  }

  async getUnreadCount() {
    return this.request<any>('/notifications/unread-count');
  }

  // Verifications
  async getPendingVerifications() {
    return this.request<any>('/verification/pending');
  }

  async processVerification(id: string, action: 'approve' | 'reject', reason?: string) {
    return this.request<any>(`/verification/${id}/manual-review`, {
      method: 'POST',
      body: JSON.stringify({ action, reason }),
    });
  }
}

export const api = new ApiClient();
