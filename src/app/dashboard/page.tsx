'use client';

import Header from '@/components/layout/Header';
import {
  Navigation,
  Users,
  Car,
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  Clock,
  Activity,
  Megaphone,
  ShieldCheck,
  DollarSign,
  Eye,
  Zap,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

// Mock data for demo
const stats = [
  {
    label: 'Total Journeys',
    value: '24,847',
    change: '+12.5%',
    trend: 'up',
    icon: Navigation,
    color: 'bg-travo-orange/10 text-travo-orange',
    iconBg: 'gradient-orange',
  },
  {
    label: 'Active Users',
    value: '8,234',
    change: '+8.2%',
    trend: 'up',
    icon: Users,
    color: 'bg-blue-50 text-blue-600',
    iconBg: 'bg-blue-600',
  },
  {
    label: 'Online Operators',
    value: '1,456',
    change: '+3.1%',
    trend: 'up',
    icon: Car,
    color: 'bg-green-50 text-green-600',
    iconBg: 'bg-green-600',
  },
  {
    label: 'Ad Revenue',
    value: formatCurrency(12450000),
    change: '+24.8%',
    trend: 'up',
    icon: Megaphone,
    color: 'bg-purple-50 text-purple-600',
    iconBg: 'bg-purple-600',
  },
];

const recentJourneys = [
  { id: 'J-2847', client: 'Sarah K.', operator: 'James M.', route: 'Kololo → Ntinda', vehicle: 'Boda', price: 8000, status: 'COMPLETED', time: '2m ago' },
  { id: 'J-2846', client: 'David O.', operator: 'Peter N.', route: 'Kampala → Entebbe', vehicle: 'Car', price: 45000, status: 'ACTIVE', time: '5m ago' },
  { id: 'J-2845', client: 'Grace A.', operator: 'Abdul R.', route: 'Wandegeya → Makerere', vehicle: 'Boda', price: 5000, status: 'EN_ROUTE', time: '8m ago' },
  { id: 'J-2844', client: 'Moses T.', operator: '—', route: 'Nakasero → Bugolobi', vehicle: 'Taxi', price: 15000, status: 'SEARCHING_OPERATOR', time: '12m ago' },
  { id: 'J-2843', client: 'Linda W.', operator: 'Charles K.', route: 'Kisementi → Lubowa', vehicle: 'Car', price: 35000, status: 'COMPLETED', time: '15m ago' },
];

const pendingVerifications = [
  { name: 'John Okello', type: 'Operator - Boda', submitted: '2h ago', docs: 'NID + License' },
  { name: 'Smart Fleet Ltd', type: 'Company', submitted: '4h ago', docs: 'Business Registration' },
  { name: 'Grace Namutebi', type: 'Operator - Car', submitted: '6h ago', docs: 'NID + License + Insurance' },
];

const topOperators = [
  { name: 'James Mukasa', journeys: 847, rating: 4.9, earnings: 12500000, vehicle: 'Boda' },
  { name: 'Peter Nalwoga', journeys: 692, rating: 4.8, earnings: 28400000, vehicle: 'Car' },
  { name: 'Abdul Ssempijja', journeys: 581, rating: 4.7, earnings: 8900000, vehicle: 'Boda' },
  { name: 'Charles Kato', journeys: 534, rating: 4.9, earnings: 22100000, vehicle: 'Car' },
];

const liveMetrics = [
  { label: 'Active Journeys', value: '342', icon: Activity, color: 'text-green-500' },
  { label: 'Avg Wait Time', value: '2.4 min', icon: Clock, color: 'text-travo-orange' },
  { label: 'Matching Rate', value: '94.2%', icon: Zap, color: 'text-blue-500' },
  { label: 'Ad Impressions Today', value: '48,291', icon: Eye, color: 'text-purple-500' },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    COMPLETED: 'bg-green-100 text-green-700',
    ACTIVE: 'bg-blue-100 text-blue-700',
    EN_ROUTE: 'bg-cyan-100 text-cyan-700',
    SEARCHING_OPERATOR: 'bg-yellow-100 text-yellow-700',
    CANCELLED: 'bg-red-100 text-red-700',
    LOCKED: 'bg-indigo-100 text-indigo-700',
  };
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold', styles[status] || 'bg-gray-100 text-gray-700')}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export default function DashboardPage() {
  return (
    <div>
      <Header title="Dashboard" subtitle="Welcome back, Kalungi. Here's your platform overview." />

      <div className="p-8 space-y-8">
        {/* Live Metrics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {liveMetrics.map((metric) => (
            <div key={metric.label} className="flex items-center gap-3 glass-card px-5 py-4">
              <div className={cn('p-2 rounded-lg bg-travo-gray-50')}>
                <metric.icon size={18} className={metric.color} />
              </div>
              <div>
                <p className="text-xs text-travo-gray-500 font-medium">{metric.label}</p>
                <p className="text-lg font-bold text-travo-black">{metric.value}</p>
              </div>
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card group">
              <div className="flex items-center justify-between mb-4">
                <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center text-white', stat.iconBg)}>
                  <stat.icon size={22} />
                </div>
                <div className={cn(
                  'flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg',
                  stat.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600',
                )}>
                  {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.change}
                </div>
              </div>
              <p className="text-sm text-travo-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-travo-black mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Revenue Chart Placeholder + Top Operators */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="xl:col-span-2 glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-travo-black">Revenue Overview</h3>
                <p className="text-sm text-travo-gray-500">Ad revenue & platform metrics</p>
              </div>
              <div className="flex gap-2">
                {['7D', '1M', '3M', '1Y'].map((period) => (
                  <button
                    key={period}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                      period === '1M'
                        ? 'bg-travo-orange text-white'
                        : 'bg-travo-gray-100 text-travo-gray-600 hover:bg-travo-gray-200',
                    )}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            {/* Chart Area */}
            <div className="h-[300px] flex items-end gap-2 px-4">
              {[65, 45, 78, 52, 90, 68, 85, 72, 95, 60, 82, 70, 88, 55, 92, 75, 80, 62, 88, 95, 72, 85, 90, 68, 76, 82, 91, 78, 86, 94].map((value, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md gradient-orange opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                    style={{ height: `${value * 2.6}px` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between px-4 mt-3 text-xs text-travo-gray-400">
              <span>1 Feb</span>
              <span>10 Feb</span>
              <span>20 Feb</span>
              <span>1 Mar</span>
            </div>
          </div>

          {/* Top Operators */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-travo-black mb-1">Top Operators</h3>
            <p className="text-sm text-travo-gray-500 mb-5">This month's best performers</p>
            <div className="space-y-4">
              {topOperators.map((op, i) => (
                <div key={op.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-travo-gray-50 transition-colors">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold',
                    i === 0 ? 'gradient-orange' : i === 1 ? 'bg-travo-gray-700' : 'bg-travo-gray-400',
                  )}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-travo-black truncate">{op.name}</p>
                    <div className="flex items-center gap-2 text-xs text-travo-gray-500">
                      <span>{op.journeys} rides</span>
                      <span>•</span>
                      <span>⭐ {op.rating}</span>
                      <span>•</span>
                      <span className="badge-orange text-[10px]">{op.vehicle}</span>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-travo-black">{formatCurrency(op.earnings)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Journeys + Pending Verifications */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Journeys */}
          <div className="xl:col-span-2 glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-travo-black">Recent Journeys</h3>
                <p className="text-sm text-travo-gray-500">Latest platform activity</p>
              </div>
              <button className="btn-outline text-xs !px-4 !py-2">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-travo-gray-500 text-xs uppercase tracking-wider">
                    <th className="pb-3 font-semibold">ID</th>
                    <th className="pb-3 font-semibold">Client</th>
                    <th className="pb-3 font-semibold">Operator</th>
                    <th className="pb-3 font-semibold">Route</th>
                    <th className="pb-3 font-semibold">Vehicle</th>
                    <th className="pb-3 font-semibold">Price</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentJourneys.map((j) => (
                    <tr key={j.id} className="table-row">
                      <td className="py-3 font-mono text-xs font-semibold text-travo-orange">{j.id}</td>
                      <td className="py-3 font-medium">{j.client}</td>
                      <td className="py-3 text-travo-gray-600">{j.operator}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={12} className="text-travo-orange flex-shrink-0" />
                          <span className="text-xs truncate max-w-[140px]">{j.route}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="badge-orange">{j.vehicle}</span>
                      </td>
                      <td className="py-3 font-semibold">{formatCurrency(j.price)}</td>
                      <td className="py-3"><StatusBadge status={j.status} /></td>
                      <td className="py-3 text-xs text-travo-gray-500">{j.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Verifications */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-travo-black">Verifications</h3>
                <p className="text-sm text-travo-gray-500">Awaiting review</p>
              </div>
              <span className="badge-warning">{pendingVerifications.length} Pending</span>
            </div>
            <div className="space-y-4">
              {pendingVerifications.map((v, i) => (
                <div key={i} className="p-4 rounded-xl border border-travo-gray-200 hover:border-travo-orange/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-travo-black">{v.name}</p>
                    <span className="text-xs text-travo-gray-400">{v.submitted}</span>
                  </div>
                  <p className="text-xs text-travo-gray-500 mb-3">{v.type} • {v.docs}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 text-xs font-semibold rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
                      Approve
                    </button>
                    <button className="flex-1 py-2 text-xs font-semibold rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Health */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-travo-black mb-4">Platform Health</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'API Gateway', status: 'healthy', latency: '12ms' },
              { name: 'Auth Service', status: 'healthy', latency: '8ms' },
              { name: 'Journey Service', status: 'healthy', latency: '15ms' },
              { name: 'Matching Engine', status: 'healthy', latency: '5ms' },
              { name: 'Tracking Service', status: 'healthy', latency: '3ms' },
              { name: 'Redis Cluster', status: 'healthy', latency: '1ms' },
            ].map((service) => (
              <div key={service.name} className="text-center p-4 rounded-xl bg-travo-gray-50">
                <div className="w-3 h-3 rounded-full bg-green-500 mx-auto mb-2 animate-pulse" />
                <p className="text-xs font-semibold text-travo-black">{service.name}</p>
                <p className="text-[10px] text-travo-gray-500 mt-1">{service.latency}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
