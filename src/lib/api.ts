import {
  initCrypto,
  isCryptoReady,
  encrypt,
  decrypt,
  isEncryptedPayload,
  getClientPublicKey,
} from './crypto';
import { adminPreview, previewResponse } from './admin-preview';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
type QueryParams = Record<string, string | number | undefined>;

class ApiClient {
  private token: string | null = null;
  private cryptoReady = false;

  constructor() {
    if (typeof window !== 'undefined' && !adminPreview) {
      initCrypto(API_BASE)
        .then((ok) => { this.cryptoReady = ok; })
        .catch(() => { this.cryptoReady = false; });
    }
  }

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
    if (adminPreview) return previewResponse(path, options.method || 'GET', options.body) as T;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const token = this.getToken();
    if (token && !headers.Authorization) headers.Authorization = `Bearer ${token}`;

    // Encrypt request body if crypto is active and there's a body
    let finalBody = options.body;
    if (this.cryptoReady && isCryptoReady() && options.body && options.method && options.method !== 'GET') {
      try {
        const bodyStr = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
        const encrypted = encrypt(bodyStr);
        finalBody = JSON.stringify(encrypted);
        headers['x-sodium'] = '1';
        headers['x-sodium-public-key'] = getClientPublicKey();
      } catch {
        // Fall back to plaintext
      }
    }

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers, body: finalBody });

    if (res.status === 401) {
      this.clearToken();
      if (typeof window !== 'undefined') window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    let data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');

    // Decrypt response if encrypted
    if (this.cryptoReady && isCryptoReady() && isEncryptedPayload(data)) {
      try {
        data = JSON.parse(decrypt(data));
      } catch {
        // If decryption fails, use raw data
      }
    }

    return data;
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async verifyTwoFactor(tempToken: string, code: string) {
    return this.request<any>('/auth/2fa/verify', { method: 'POST', headers: { Authorization: `Bearer ${tempToken}` }, body: JSON.stringify({ code }) });
  }

  async adminGet<T = any>(path: string): Promise<T> { return this.request<T>(path); }
  async adminPost<T = any>(path: string, body: unknown): Promise<T> { return this.request<T>(path, { method: 'POST', body: JSON.stringify(body) }); }
  async adminPut<T = any>(path: string, body: unknown): Promise<T> { return this.request<T>(path, { method: 'PUT', body: JSON.stringify(body) }); }
  async adminDelete<T = any>(path: string): Promise<T> { return this.request<T>(path, { method: 'DELETE' }); }

  async getMe() {
    return this.request<any>('/auth/me');
  }

  // Users
  async getUsers(params: Record<string, string | number | undefined> = {}) {
    return this.request<any>(`/users/profile?${new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined).map(([key, value]) => [key, String(value)]))}`);
  }

  async updateUserRoles(userId: string, roles: string[]) {
    return this.request<any>('/users/roles', {
      method: 'PUT',
      body: JSON.stringify({ userId, roles }),
    });
  }

  // Journeys
  async getJourneys(params: Record<string, string | number | undefined> = {}) {
    return this.request<any>(`/journeys/my/history?${new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined).map(([key, value]) => [key, String(value)]))}`);
  }

  async getJourney(id: string) {
    return this.request<any>(`/journeys/${id}`);
  }

  // Operators
  async getOperators(params: Record<string, string | number | undefined> = {}) {
    return this.request<any>(`/operators?${new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined).map(([key, value]) => [key, String(value)]))}`);
  }

  async getActiveOperatorLocations() {
    return this.request<any>('/tracking/operators/active');
  }

  async getOperator(id: string) {
    return this.request<any>(`/operators/${id}`);
  }

  // Companies
  async getCompanies(params: Record<string, string | number | undefined> = {}) {
    return this.request<any>(`/companies?${new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined).map(([key, value]) => [key, String(value)]))}`);
  }

  async getCompany(id: string) {
    return this.request<any>(`/companies/${id}`);
  }

  // Wallet
  async getWalletBalance() {
    return this.request<any>('/wallet/balance');
  }

  async getTransactions(params: Record<string, string | number | undefined> = {}) {
    return this.request<any>(`/wallet/transactions?${new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined).map(([key, value]) => [key, String(value)]))}`);
  }

  // Ads
  async getAds(params: Record<string, string | number | undefined> = {}) {
    return this.request<any>(`/ads/campaigns?${new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined).map(([key, value]) => [key, String(value)]))}`);
  }

  async getAdAnalytics(id: string) {
    return this.request<any>(`/ads/${id}/analytics`);
  }

  // Analytics
  async getDashboard() {
    return this.request<any>('/analytics/dashboard');
  }

  async getJourneyAnalytics(params?: QueryParams) {
    return this.request<any>(`/analytics/journeys${params ? `?${new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined).map(([key, value]) => [key, String(value)]))}` : ''}`);
  }

  async getRevenue(params?: QueryParams) {
    return this.request<any>(`/analytics/revenue${params ? `?${new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined).map(([key, value]) => [key, String(value)]))}` : ''}`);
  }

  async getHeatmap() {
    return this.request<any>('/analytics/heatmap');
  }

  // Notifications
  async getNotifications(params: QueryParams = {}) {
    return this.request<any>(`/notifications?${new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined).map(([key, value]) => [key, String(value)]))}`);
  }

  async getUnreadCount() {
    return this.request<any>('/notifications/unread-count');
  }

  async getBusinesses(params: QueryParams = {}) { return this.request<any>(`/businesses?${new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined).map(([key, value]) => [key, String(value)]))}`); }
  async markNotificationRead(id: string) { return this.request<any>(`/notifications/${id}/read`, { method: 'POST' }); }
  async markAllNotificationsRead() { return this.request<any>('/notifications/read-all', { method: 'POST' }); }
  async getVerifications(params: QueryParams = {}) { return this.request<any>(`/verification/pending?${new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined).map(([key, value]) => [key, String(value)]))}`); }
  async getSettings() { return this.request<any>('/settings'); }
  async updateSettings(data: any) { return this.request<any>('/settings', { method: 'PUT', body: JSON.stringify(data) }); }
  async updateProfile(data: any) { return this.request<any>('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }); }
  async changePassword(currentPassword: string, newPassword: string) { return this.request<any>('/auth/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) }); }

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
