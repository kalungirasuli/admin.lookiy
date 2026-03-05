'use client';

import Header from '@/components/layout/Header';
import { cn, formatRelativeTime } from '@/lib/utils';
import {
  Bell,
  Navigation,
  CreditCard,
  AlertTriangle,
  ShieldCheck,
  Settings,
  CheckCheck,
  X,
  Search,
  Megaphone,
  Users,
  Car,
  Wifi,
  Server,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

type NotificationCategory = 'all' | 'journey' | 'payment' | 'system' | 'security';

interface Notification {
  id: string;
  title: string;
  message: string;
  category: 'journey' | 'payment' | 'system' | 'security';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

const notifications: Notification[] = [
  { id: 'N-001', title: 'New Journey Started', message: 'David Okiror booked a car ride from Kampala CBD to Entebbe Airport. Operator Peter Nalwoga matched.', category: 'journey', timestamp: '2026-03-05T14:32:00', read: false },
  { id: 'N-002', title: 'Large Payout Processed', message: 'UGX 12,500,000 payout to SafeRide Ltd has been processed successfully.', category: 'payment', timestamp: '2026-03-05T14:15:00', read: false },
  { id: 'N-003', title: 'New Verification Submitted', message: 'John Okello has submitted operator verification documents for review.', category: 'system', timestamp: '2026-03-05T13:45:00', read: false },
  { id: 'N-004', title: 'Journey Cancelled', message: 'Brian Sserunjogi cancelled journey J-3006 (Ntinda → Bukoto). Operator was not assigned.', category: 'journey', timestamp: '2026-03-05T13:30:00', read: false },
  { id: 'N-005', title: 'Suspicious Login Attempt', message: 'Multiple failed login attempts detected for admin account from IP 102.68.45.xx. Auto-blocked for 30 minutes.', category: 'security', timestamp: '2026-03-05T13:00:00', read: false },
  { id: 'N-006', title: 'Ad Campaign Budget Alert', message: 'Rolex Hub campaign "Late Night Rolex Deal" has used 90% of its budget. Campaign ends in 5 days.', category: 'payment', timestamp: '2026-03-05T12:30:00', read: true },
  { id: 'N-007', title: 'New Company Registration', message: 'Pearl Transit Co. has submitted a company registration request with 71 vehicles.', category: 'system', timestamp: '2026-03-05T12:00:00', read: true },
  { id: 'N-008', title: 'Operator Rating Alert', message: 'Operator Isaac Lubega (OP-008) rating dropped below 4.5. Average: 4.4 from last 50 reviews.', category: 'system', timestamp: '2026-03-05T11:30:00', read: true },
  { id: 'N-009', title: 'System Maintenance Scheduled', message: 'Matching service maintenance scheduled for tonight 2am–4am EAT. Expected minimal disruption.', category: 'system', timestamp: '2026-03-05T11:00:00', read: true },
  { id: 'N-010', title: 'Payment Gateway Alert', message: 'MTN Mobile Money API experienced 2 minutes of downtime. All transactions recovered.', category: 'payment', timestamp: '2026-03-05T10:30:00', read: true },
  { id: 'N-011', title: 'Journey Speed Alert', message: 'Journey J-2998 operator exceeded speed limit of 80km/h on Entebbe Expressway. Peak: 112km/h.', category: 'journey', timestamp: '2026-03-05T10:00:00', read: true },
  { id: 'N-012', title: '2FA Recovery Code Used', message: 'Admin user Agnes Tusiime used a recovery code to authenticate. Recommend code rotation.', category: 'security', timestamp: '2026-03-05T09:30:00', read: true },
  { id: 'N-013', title: 'Daily Report Ready', message: 'Your daily platform report for March 4th is ready. 1,120 journeys, UGX 28.4M revenue.', category: 'system', timestamp: '2026-03-05T08:00:00', read: true },
  { id: 'N-014', title: 'Wallet Top-up Received', message: 'Paul Walugembe topped up wallet with UGX 100,000 via Airtel Money.', category: 'payment', timestamp: '2026-03-05T07:30:00', read: true },
  { id: 'N-015', title: 'New Operator Online', message: 'Bashir Mubiru (OP-013) just came online in Makindye area. Currently 342 operators online.', category: 'journey', timestamp: '2026-03-05T07:00:00', read: true },
  { id: 'N-016', title: 'API Rate Limit Warning', message: 'Geo-service approaching rate limit: 8,500/10,000 requests per minute.', category: 'security', timestamp: '2026-03-04T23:00:00', read: true },
];

const categoryConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  journey: { icon: Navigation, color: 'text-travo-orange', bg: 'bg-travo-orange/10' },
  payment: { icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50' },
  system: { icon: Settings, color: 'text-blue-600', bg: 'bg-blue-50' },
  security: { icon: ShieldCheck, color: 'text-red-600', bg: 'bg-red-50' },
};

const categoryTabs: { label: string; value: NotificationCategory }[] = [
  { label: 'All', value: 'all' },
  { label: 'Journey', value: 'journey' },
  { label: 'Payment', value: 'payment' },
  { label: 'System', value: 'system' },
  { label: 'Security', value: 'security' },
];

export default function NotificationsPage() {
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('all');
  const [notifs, setNotifs] = useState(notifications);

  const filtered = notifs.filter((n) =>
    activeCategory === 'all' ? true : n.category === activeCategory,
  );

  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    );
  };

  const deleteNotification = (id: string) => {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div>
      <Header title="Notifications" subtitle="Stay updated on platform events" />

      <div className="p-8 space-y-6">
        {/* Header actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl gradient-orange text-white">
              <Bell size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-travo-black">
                {unreadCount > 0 ? `${unreadCount} Unread Notification${unreadCount > 1 ? 's' : ''}` : 'All Caught Up!'}
              </h2>
              <p className="text-sm text-travo-gray-500">
                {notifs.length} total notifications
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-travo-orange border border-travo-orange/30 hover:bg-travo-orange/5 transition-colors"
            >
              <CheckCheck size={16} />
              Mark all read
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categoryTabs.map((tab) => {
            const count = notifs.filter((n) =>
              tab.value === 'all' ? true : n.category === tab.value,
            ).length;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveCategory(tab.value)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200',
                  activeCategory === tab.value
                    ? 'bg-travo-orange text-white shadow-travo'
                    : 'bg-white text-travo-gray-600 hover:bg-travo-gray-50 border border-travo-gray-200',
                )}
              >
                {tab.label}
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  activeCategory === tab.value ? 'bg-white/20 text-white' : 'bg-travo-gray-100 text-travo-gray-500',
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {filtered.map((notif) => {
            const config = categoryConfig[notif.category];
            const Icon = config.icon;
            return (
              <div
                key={notif.id}
                className={cn(
                  'glass-card p-5 transition-all duration-200 hover:shadow-card-hover group',
                  !notif.read && 'border-l-4 border-l-travo-orange bg-travo-orange/[0.02]',
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={cn('p-2.5 rounded-xl flex-shrink-0', config.bg)}>
                    <Icon size={18} className={config.color} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={cn('text-sm font-bold', notif.read ? 'text-travo-gray-600' : 'text-travo-black')}>
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-travo-orange flex-shrink-0" />
                      )}
                    </div>
                    <p className={cn('text-sm leading-relaxed', notif.read ? 'text-travo-gray-400' : 'text-travo-gray-600')}>
                      {notif.message}
                    </p>
                    <p className="text-xs text-travo-gray-400 mt-2">{formatRelativeTime(notif.timestamp)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={() => toggleRead(notif.id)}
                      className="p-1.5 rounded-lg hover:bg-travo-gray-100 text-travo-gray-400 hover:text-travo-orange transition-colors"
                      title={notif.read ? 'Mark as unread' : 'Mark as read'}
                    >
                      <CheckCheck size={14} />
                    </button>
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-travo-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="glass-card p-12 text-center">
            <Bell size={48} className="mx-auto text-travo-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-travo-gray-600">No notifications</h3>
            <p className="text-sm text-travo-gray-400 mt-1">You&apos;re all caught up! No notifications in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
