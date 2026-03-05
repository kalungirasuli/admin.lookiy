'use client';

import Header from '@/components/layout/Header';
import { cn, formatCurrency } from '@/lib/utils';
import {
  Megaphone,
  Building2,
  DollarSign,
  BarChart3,
  Eye,
  MousePointerClick,
  MapPin,
  Plus,
  Search,
  MoreHorizontal,
  TrendingUp,
  Image,
  Globe,
  Calendar,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

const stats = [
  { label: 'Active Campaigns', value: '32', icon: Megaphone, change: '+5 this week', color: 'gradient-orange' },
  { label: 'Total Businesses', value: '48', icon: Building2, change: '+8 this month', color: 'bg-blue-600' },
  { label: 'Ad Revenue', value: formatCurrency(42500000), icon: DollarSign, change: '+24.8%', color: 'bg-green-600' },
  { label: 'Avg CTR', value: '3.8%', icon: BarChart3, change: '+0.6% vs avg', color: 'bg-purple-600' },
];

const campaigns = [
  {
    id: 'AD-001',
    business: 'Kampala Eats',
    title: 'Lunch Delivery Promo',
    type: 'MAP_PIN',
    budget: 5000000,
    spent: 3200000,
    impressions: 124500,
    clicks: 4815,
    ctr: 3.87,
    status: 'ACTIVE',
    startDate: '2026-02-15',
    endDate: '2026-03-15',
    location: 'Kololo, Nakasero, Kisementi',
  },
  {
    id: 'AD-002',
    business: 'MTN Uganda',
    title: 'MoMo Pay Campaign',
    type: 'BANNER',
    budget: 15000000,
    spent: 8900000,
    impressions: 342000,
    clicks: 14280,
    ctr: 4.18,
    status: 'ACTIVE',
    startDate: '2026-02-01',
    endDate: '2026-03-31',
    location: 'Kampala Metro',
  },
  {
    id: 'AD-003',
    business: 'Rolex Hub',
    title: 'Late Night Rolex Deal',
    type: 'MAP_PIN',
    budget: 2000000,
    spent: 1800000,
    impressions: 67800,
    clicks: 2890,
    ctr: 4.26,
    status: 'ACTIVE',
    startDate: '2026-02-20',
    endDate: '2026-03-10',
    location: 'Wandegeya, Makerere',
  },
  {
    id: 'AD-004',
    business: 'Java House',
    title: 'Morning Coffee Special',
    type: 'BANNER',
    budget: 8000000,
    spent: 5600000,
    impressions: 198000,
    clicks: 6530,
    ctr: 3.30,
    status: 'ACTIVE',
    startDate: '2026-01-15',
    endDate: '2026-04-15',
    location: 'All Kampala',
  },
  {
    id: 'AD-005',
    business: 'Pearl Marina',
    title: 'Weekend Getaway',
    type: 'MAP_PIN',
    budget: 3500000,
    spent: 3500000,
    impressions: 89200,
    clicks: 2140,
    ctr: 2.40,
    status: 'COMPLETED',
    startDate: '2026-01-01',
    endDate: '2026-02-28',
    location: 'Entebbe, Lubowa',
  },
  {
    id: 'AD-006',
    business: 'Acacia Mall',
    title: 'Shopping Season Sale',
    type: 'BANNER',
    budget: 12000000,
    spent: 4200000,
    impressions: 156000,
    clicks: 5690,
    ctr: 3.65,
    status: 'ACTIVE',
    startDate: '2026-02-25',
    endDate: '2026-03-25',
    location: 'Kisementi, Kololo, Naguru',
  },
  {
    id: 'AD-007',
    business: 'Endiro Coffee',
    title: 'Study & Sip Promo',
    type: 'MAP_PIN',
    budget: 1500000,
    spent: 900000,
    impressions: 34500,
    clicks: 1480,
    ctr: 4.29,
    status: 'ACTIVE',
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    location: 'Makerere, Wandegeya, Ntinda',
  },
  {
    id: 'AD-008',
    business: 'Cafe Javas',
    title: 'Family Brunch Sundays',
    type: 'BANNER',
    budget: 6000000,
    spent: 1200000,
    impressions: 42000,
    clicks: 1570,
    ctr: 3.74,
    status: 'ACTIVE',
    startDate: '2026-03-01',
    endDate: '2026-05-01',
    location: 'Kampala Metro Wide',
  },
  {
    id: 'AD-009',
    business: 'Nandos Uganda',
    title: 'Peri-Peri Festival',
    type: 'MAP_PIN',
    budget: 4000000,
    spent: 200000,
    impressions: 8500,
    clicks: 340,
    ctr: 4.0,
    status: 'PAUSED',
    startDate: '2026-03-03',
    endDate: '2026-04-03',
    location: 'Bugolobi, Kabalagala',
  },
];

const businesses = [
  { name: 'Kampala Eats', campaigns: 3, totalSpend: 8400000, sector: 'Food & Delivery' },
  { name: 'MTN Uganda', campaigns: 2, totalSpend: 22000000, sector: 'Telecom' },
  { name: 'Rolex Hub', campaigns: 1, totalSpend: 1800000, sector: 'Food & Beverage' },
  { name: 'Java House', campaigns: 2, totalSpend: 12500000, sector: 'Hospitality' },
  { name: 'Acacia Mall', campaigns: 1, totalSpend: 4200000, sector: 'Retail' },
  { name: 'Endiro Coffee', campaigns: 1, totalSpend: 900000, sector: 'Food & Beverage' },
  { name: 'Cafe Javas', campaigns: 2, totalSpend: 8200000, sector: 'Hospitality' },
  { name: 'Nandos Uganda', campaigns: 1, totalSpend: 200000, sector: 'Food & Beverage' },
];

export default function AdsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = campaigns.filter((c) => {
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.business.toLowerCase().includes(q) || c.title.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div>
      <Header title="Advertisements" subtitle="Manage ad campaigns and business partnerships" />

      <div className="p-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center text-white', stat.color)}>
                  <stat.icon size={22} />
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-green-50 text-green-600">
                  <TrendingUp size={12} />
                  {stat.change}
                </div>
              </div>
              <p className="text-sm text-travo-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-travo-black mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-travo-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns or businesses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field !pl-10 !py-2.5 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            {['All', 'ACTIVE', 'PAUSED', 'COMPLETED'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  'px-3 py-2 rounded-lg text-xs font-semibold transition-colors',
                  statusFilter === s
                    ? 'bg-travo-orange text-white'
                    : 'bg-travo-gray-100 text-travo-gray-600 hover:bg-travo-gray-200',
                )}
              >
                {s === 'All' ? 'All Campaigns' : s}
              </button>
            ))}
          </div>
          <button className="btn-primary flex items-center gap-2 !py-2.5 text-sm ml-auto">
            <Plus size={16} />
            New Campaign
          </button>
        </div>

        {/* Campaign Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map((campaign) => {
            const spentPercent = Math.round((campaign.spent / campaign.budget) * 100);
            return (
              <div key={campaign.id} className="glass-card p-6 hover:shadow-card-hover transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* Thumbnail placeholder */}
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      campaign.type === 'MAP_PIN' ? 'bg-travo-orange/10 text-travo-orange' : 'bg-blue-50 text-blue-600',
                    )}>
                      {campaign.type === 'MAP_PIN' ? <MapPin size={20} /> : <Image size={20} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-travo-black">{campaign.title}</h3>
                      <p className="text-xs text-travo-gray-500">{campaign.business}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'badge',
                      campaign.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                      campaign.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-600',
                    )}>
                      {campaign.status}
                    </span>
                    <button className="p-1.5 rounded-lg hover:bg-travo-gray-100 text-travo-gray-400 opacity-0 group-hover:opacity-100 transition-all">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>

                {/* Budget Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-travo-gray-500">Budget spent</span>
                    <span className="font-semibold text-travo-black">{formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}</span>
                  </div>
                  <div className="h-2 bg-travo-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        spentPercent > 90 ? 'bg-red-500' : spentPercent > 70 ? 'bg-yellow-500' : 'gradient-orange',
                      )}
                      style={{ width: `${spentPercent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-travo-gray-400 mt-1">{spentPercent}% utilized</p>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-2 rounded-lg bg-travo-gray-50">
                    <div className="flex items-center justify-center gap-1 text-travo-gray-400 mb-1">
                      <Eye size={11} />
                      <span className="text-[10px] uppercase font-semibold">Impressions</span>
                    </div>
                    <p className="text-sm font-bold text-travo-black">{campaign.impressions.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-travo-gray-50">
                    <div className="flex items-center justify-center gap-1 text-travo-gray-400 mb-1">
                      <MousePointerClick size={11} />
                      <span className="text-[10px] uppercase font-semibold">Clicks</span>
                    </div>
                    <p className="text-sm font-bold text-travo-black">{campaign.clicks.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-travo-gray-50">
                    <div className="flex items-center justify-center gap-1 text-travo-gray-400 mb-1">
                      <Target size={11} />
                      <span className="text-[10px] uppercase font-semibold">CTR</span>
                    </div>
                    <p className="text-sm font-bold text-travo-orange">{campaign.ctr}%</p>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between pt-3 border-t border-travo-gray-100 text-xs text-travo-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin size={11} />
                    <span className="truncate max-w-[200px]">{campaign.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={11} />
                    <span>{campaign.startDate} – {campaign.endDate}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Business Directory */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-travo-black">Business Directory</h3>
              <p className="text-sm text-travo-gray-500">All registered advertisers</p>
            </div>
            <button className="btn-outline text-xs !px-4 !py-2">View All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {businesses.map((biz) => (
              <div key={biz.name} className="p-4 rounded-xl border border-travo-gray-200 hover:border-travo-orange/30 hover:shadow-sm transition-all duration-200 cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg gradient-orange flex items-center justify-center text-white text-xs font-bold">
                    {biz.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-travo-black">{biz.name}</p>
                    <p className="text-xs text-travo-gray-400">{biz.sector}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-travo-gray-500">{biz.campaigns} campaigns</span>
                  <span className="font-semibold text-travo-black">{formatCurrency(biz.totalSpend)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
