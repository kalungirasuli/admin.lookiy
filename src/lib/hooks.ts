import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// ─── Dashboard ────────────────────────────────────────────
export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.getDashboard(),
  });
}

// ─── Journeys ─────────────────────────────────────────────
export function useJourneys(params?: { page?: number; limit?: number; status?: string; vehicle?: string; search?: string }) {
  return useQuery({
    queryKey: ['journeys', params],
    queryFn: () => api.getJourneys(params),
  });
}

export function useJourney(id: string) {
  return useQuery({
    queryKey: ['journey', id],
    queryFn: () => api.getJourney(id),
    enabled: !!id,
  });
}

// ─── Users ────────────────────────────────────────────────
export function useUsers(params?: { page?: number; limit?: number; role?: string; search?: string }) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => api.getUsers(params),
  });
}

export function useUpdateUserRoles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, roles }: { userId: string; roles: string[] }) =>
      api.updateUserRoles(userId, roles),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

// ─── Operators ────────────────────────────────────────────
export function useOperators(params?: { page?: number; limit?: number; status?: string; vehicle?: string; search?: string }) {
  return useQuery({
    queryKey: ['operators', params],
    queryFn: () => api.getOperators(params),
  });
}

export function useOperator(id: string) {
  return useQuery({
    queryKey: ['operator', id],
    queryFn: () => api.getOperator(id),
    enabled: !!id,
  });
}

// ─── Companies ────────────────────────────────────────────
export function useCompanies(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['companies', params],
    queryFn: () => api.getCompanies(params),
  });
}

// ─── Wallet ───────────────────────────────────────────────
export function useWalletBalance() {
  return useQuery({
    queryKey: ['wallet-balance'],
    queryFn: () => api.getWalletBalance(),
  });
}

export function useTransactions(params?: { page?: number; limit?: number; type?: string; search?: string }) {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => api.getTransactions(params),
  });
}

// ─── Ads ──────────────────────────────────────────────────
export function useAds(params?: { page?: number; limit?: number; status?: string; search?: string }) {
  return useQuery({
    queryKey: ['ads', params],
    queryFn: () => api.getAds(params),
  });
}

export function useBusinesses(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['businesses', params],
    queryFn: () => api.getBusinesses(params),
  });
}

// ─── Analytics ────────────────────────────────────────────
export function useJourneyAnalytics(period?: string) {
  return useQuery({
    queryKey: ['journey-analytics', period],
    queryFn: () => api.getJourneyAnalytics(period ? { period } : undefined),
  });
}

export function useRevenue(period?: string) {
  return useQuery({
    queryKey: ['revenue', period],
    queryFn: () => api.getRevenue(period ? { period } : undefined),
  });
}

export function useHeatmap() {
  return useQuery({
    queryKey: ['heatmap'],
    queryFn: () => api.getHeatmap(),
  });
}

// ─── Notifications ────────────────────────────────────────
export function useNotifications(params?: { page?: number; limit?: number; category?: string }) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => api.getNotifications(params),
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.markNotificationRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.markAllNotificationsRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

// ─── Verifications ────────────────────────────────────────
export function useVerifications(params?: { page?: number; limit?: number; status?: string; search?: string }) {
  return useQuery({
    queryKey: ['verifications', params],
    queryFn: () => api.getVerifications(params),
  });
}

export function useProcessVerification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: 'APPROVED' | 'REJECTED'; reason?: string }) =>
      api.processVerification(id, status === 'APPROVED' ? 'approve' : 'reject', reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['verifications'] }),
  });
}

// ─── Auth ─────────────────────────────────────────────────
export function useLogin() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.login(email, password),
    onSuccess: (data) => {
      api.setToken(data.accessToken);
      if (typeof window !== 'undefined') {
        localStorage.setItem('_refresh_token', data.refreshToken);
      }
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => api.getMe(),
    retry: false,
  });
}

// ─── Settings ─────────────────────────────────────────────
export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => api.getSettings(),
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.updateSettings(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.updateProfile(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['me'] }),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      api.changePassword(currentPassword, newPassword),
  });
}
