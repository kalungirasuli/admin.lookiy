'use client';

import Header from '@/components/layout/Header';
import { cn, formatCurrency, getInitials } from '@/lib/utils';
import {
  Search,
  Filter,
  Star,
  LayoutGrid,
  List,
  MapPin,
  Phone,
  Navigation,
  Users,
  ShieldCheck,
  Wifi,
  ChevronDown,
  MoreHorizontal,
  TrendingUp,
  Car,
  Bike,
  Bus,
} from 'lucide-react';
import { useState } from 'react';

const operators = [
  { id: 'OP-001', firstName: 'James', lastName: 'Mukasa', phone: '+256 701 234 567', vehicle: 'Boda', rating: 4.9, journeys: 847, earnings: 12500000, status: 'ONLINE', company: null, location: 'Kololo', joined: 'Jan 2025', avatar: null },
  { id: 'OP-002', firstName: 'Peter', lastName: 'Nalwoga', phone: '+256 702 345 678', vehicle: 'Car', rating: 4.8, journeys: 692, earnings: 28400000, status: 'ONLINE', company: 'SafeRide Ltd', location: 'Ntinda', joined: 'Mar 2025', avatar: null },
  { id: 'OP-003', firstName: 'Abdul', lastName: 'Ssempijja', phone: '+256 703 456 789', vehicle: 'Boda', rating: 4.7, journeys: 581, earnings: 8900000, status: 'BUSY', company: null, location: 'Wandegeya', joined: 'Feb 2025', avatar: null },
  { id: 'OP-004', firstName: 'Charles', lastName: 'Kato', phone: '+256 704 567 890', vehicle: 'Car', rating: 4.9, journeys: 534, earnings: 22100000, status: 'ONLINE', company: 'CityDrive UG', location: 'Kampala CBD', joined: 'Dec 2024', avatar: null },
  { id: 'OP-005', firstName: 'Joseph', lastName: 'Okwi', phone: '+256 705 678 901', vehicle: 'Boda', rating: 4.6, journeys: 423, earnings: 6300000, status: 'OFFLINE', company: null, location: 'Kabalagala', joined: 'Apr 2025', avatar: null },
  { id: 'OP-006', firstName: 'Samuel', lastName: 'Waswa', phone: '+256 706 789 012', vehicle: 'Car', rating: 4.8, journeys: 389, earnings: 19800000, status: 'ONLINE', company: 'SafeRide Ltd', location: 'Entebbe', joined: 'May 2025', avatar: null },
  { id: 'OP-007', firstName: 'Godfrey', lastName: 'Mugisha', phone: '+256 707 890 123', vehicle: 'Taxi', rating: 4.5, journeys: 356, earnings: 14200000, status: 'ONLINE', company: 'Metro Taxis', location: 'Nakasero', joined: 'Jun 2025', avatar: null },
  { id: 'OP-008', firstName: 'Isaac', lastName: 'Lubega', phone: '+256 708 901 234', vehicle: 'Boda', rating: 4.4, journeys: 312, earnings: 4800000, status: 'OFFLINE', company: null, location: 'Muyenga', joined: 'Jul 2025', avatar: null },
  { id: 'OP-009', firstName: 'Ronald', lastName: 'Kizza', phone: '+256 709 012 345', vehicle: 'Car', rating: 4.7, journeys: 289, earnings: 15600000, status: 'BUSY', company: 'CityDrive UG', location: 'Bugolobi', joined: 'Aug 2025', avatar: null },
  { id: 'OP-010', firstName: 'Denis', lastName: 'Kiggundu', phone: '+256 710 123 456', vehicle: 'Car', rating: 4.9, journeys: 267, earnings: 13400000, status: 'ONLINE', company: null, location: 'Lubowa', joined: 'Sep 2025', avatar: null },
  { id: 'OP-011', firstName: 'Moses', lastName: 'Kibirige', phone: '+256 711 234 567', vehicle: 'Boda', rating: 4.3, journeys: 234, earnings: 3500000, status: 'ONLINE', company: null, location: 'Kisementi', joined: 'Oct 2025', avatar: null },
  { id: 'OP-012', firstName: 'Andrew', lastName: 'Ssali', phone: '+256 712 345 678', vehicle: 'Taxi', rating: 4.6, journeys: 198, earnings: 9200000, status: 'OFFLINE', company: 'Metro Taxis', location: 'Naguru', joined: 'Nov 2025', avatar: null },
  { id: 'OP-013', firstName: 'Bashir', lastName: 'Mubiru', phone: '+256 713 456 789', vehicle: 'Boda', rating: 4.8, journeys: 456, earnings: 7100000, status: 'ONLINE', company: null, location: 'Makindye', joined: 'Jan 2025', avatar: null },
];

const stats = [
  { label: 'Total Operators', value: '1,456', icon: Users, change: '+42 this month', color: 'gradient-orange' },
  { label: 'Online Now', value: '342', icon: Wifi, change: '23.5% of total', color: 'bg-green-600' },
  { label: 'Verified', value: '1,312', icon: ShieldCheck, change: '90.1% verified', color: 'bg-blue-600' },
  { label: 'Avg Rating', value: '4.7', icon: Star, change: '+0.2 vs last month', color: 'bg-yellow-500' },
];

const vehicleFilters = ['All', 'Boda', 'Car', 'Taxi'];
const statusFilters = ['All', 'ONLINE', 'BUSY', 'OFFLINE'];
const typeFilters = ['All', 'Individual', 'Company'];

function VehicleIcon({ type }: { type: string }) {
  if (type === 'Car') return <Car size={14} />;
  if (type === 'Boda') return <Bike size={14} />;
  return <Bus size={14} />;
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={12}
          className={cn(
            star <= Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-travo-gray-300',
          )}
        />
      ))}
      <span className="ml-1 text-xs font-semibold text-travo-gray-700">{rating}</span>
    </div>
  );
}

export default function OperatorsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [vehicleFilter, setVehicleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = operators.filter((op) => {
    if (vehicleFilter !== 'All' && op.vehicle !== vehicleFilter) return false;
    if (statusFilter !== 'All' && op.status !== statusFilter) return false;
    if (typeFilter === 'Company' && !op.company) return false;
    if (typeFilter === 'Individual' && op.company) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        op.firstName.toLowerCase().includes(q) ||
        op.lastName.toLowerCase().includes(q) ||
        op.id.toLowerCase().includes(q) ||
        op.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div>
      <Header title="Operators" subtitle="Manage and monitor all platform operators" />

      <div className="p-8 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center text-white', stat.color)}>
                  <stat.icon size={22} />
                </div>
              </div>
              <p className="text-sm text-travo-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-travo-black mt-1">{stat.value}</p>
              <p className="text-xs text-travo-gray-400 mt-1">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="glass-card p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-travo-gray-400" />
              <input
                type="text"
                placeholder="Search operators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field !pl-10 !py-2.5 text-sm"
              />
            </div>

            {/* Vehicle Filter */}
            <div className="flex items-center gap-2">
              {vehicleFilters.map((v) => (
                <button
                  key={v}
                  onClick={() => setVehicleFilter(v)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-xs font-semibold transition-colors',
                    vehicleFilter === v
                      ? 'bg-travo-orange text-white'
                      : 'bg-travo-gray-100 text-travo-gray-600 hover:bg-travo-gray-200',
                  )}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field !w-auto !py-2 text-xs font-semibold"
            >
              {statusFilters.map((s) => (
                <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field !w-auto !py-2 text-xs font-semibold"
            >
              {typeFilters.map((t) => (
                <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>
              ))}
            </select>

            {/* View Toggle */}
            <div className="flex items-center bg-travo-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'grid' ? 'bg-white shadow-sm text-travo-orange' : 'text-travo-gray-400',
                )}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'list' ? 'bg-white shadow-sm text-travo-orange' : 'text-travo-gray-400',
                )}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Operators Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {filtered.map((op) => (
              <div key={op.id} className="glass-card p-5 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full gradient-orange flex items-center justify-center text-white font-bold text-sm">
                        {getInitials(op.firstName, op.lastName)}
                      </div>
                      <div className={cn(
                        'absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white',
                        op.status === 'ONLINE' ? 'bg-green-500' : op.status === 'BUSY' ? 'bg-orange-500' : 'bg-travo-gray-400',
                      )} />
                    </div>
                    <div>
                      <p className="font-semibold text-travo-black">{op.firstName} {op.lastName}</p>
                      <p className="text-xs text-travo-gray-500">{op.id}</p>
                    </div>
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-travo-gray-100 text-travo-gray-400 opacity-0 group-hover:opacity-100 transition-all">
                    <MoreHorizontal size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="badge-orange flex items-center gap-1">
                    <VehicleIcon type={op.vehicle} />
                    {op.vehicle}
                  </span>
                  {op.company && (
                    <span className="badge bg-blue-50 text-blue-700">{op.company}</span>
                  )}
                </div>

                <RatingStars rating={op.rating} />

                <div className="mt-4 pt-4 border-t border-travo-gray-100 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-travo-gray-400">Journeys</p>
                    <p className="text-sm font-bold text-travo-black">{op.journeys.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-travo-gray-400">Earnings</p>
                    <p className="text-sm font-bold text-travo-black">{formatCurrency(op.earnings)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mt-3 text-xs text-travo-gray-500">
                  <MapPin size={11} />
                  {op.location}
                  <span className="ml-auto text-travo-gray-400">Joined {op.joined}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="glass-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-travo-gray-500 text-xs uppercase tracking-wider bg-travo-gray-50/50">
                  <th className="px-6 py-4 font-semibold">Operator</th>
                  <th className="px-6 py-4 font-semibold">Vehicle</th>
                  <th className="px-6 py-4 font-semibold">Rating</th>
                  <th className="px-6 py-4 font-semibold">Journeys</th>
                  <th className="px-6 py-4 font-semibold">Earnings</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Location</th>
                  <th className="px-6 py-4 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((op) => (
                  <tr key={op.id} className="table-row group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-9 h-9 rounded-full gradient-orange flex items-center justify-center text-white text-xs font-bold">
                            {getInitials(op.firstName, op.lastName)}
                          </div>
                          <div className={cn(
                            'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white',
                            op.status === 'ONLINE' ? 'bg-green-500' : op.status === 'BUSY' ? 'bg-orange-500' : 'bg-travo-gray-400',
                          )} />
                        </div>
                        <div>
                          <p className="font-semibold text-travo-black">{op.firstName} {op.lastName}</p>
                          <p className="text-xs text-travo-gray-400">{op.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="badge-orange">{op.vehicle}</span></td>
                    <td className="px-6 py-4"><RatingStars rating={op.rating} /></td>
                    <td className="px-6 py-4 font-semibold">{op.journeys.toLocaleString()}</td>
                    <td className="px-6 py-4 font-semibold">{formatCurrency(op.earnings)}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        'badge',
                        op.status === 'ONLINE' ? 'bg-green-100 text-green-700' : op.status === 'BUSY' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600',
                      )}>
                        {op.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-travo-gray-500 text-xs">{op.location}</td>
                    <td className="px-6 py-4">
                      <button className="p-1.5 rounded-lg hover:bg-travo-gray-100 text-travo-gray-400 opacity-0 group-hover:opacity-100 transition-all">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
