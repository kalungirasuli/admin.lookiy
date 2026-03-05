'use client';

import Header from '@/components/layout/Header';
import { cn, formatCurrency, getStatusColor } from '@/lib/utils';
import {
  Search,
  Filter,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Calendar,
  ArrowUpDown,
  Eye,
  MoreHorizontal,
  Navigation,
  Clock,
} from 'lucide-react';
import { useState } from 'react';

const journeys = [
  { id: 'J-3012', client: 'Sarah Nakamatte', operator: 'James Mukasa', from: 'Kololo', to: 'Ntinda', vehicle: 'Boda', price: 8000, status: 'COMPLETED', time: '2m ago', date: '2026-03-05' },
  { id: 'J-3011', client: 'David Okiror', operator: 'Peter Nalwoga', from: 'Kampala CBD', to: 'Entebbe Airport', vehicle: 'Car', price: 85000, status: 'ACTIVE', time: '5m ago', date: '2026-03-05' },
  { id: 'J-3010', client: 'Grace Amongin', operator: 'Abdul Ssempijja', from: 'Wandegeya', to: 'Makerere University', vehicle: 'Boda', price: 5000, status: 'EN_ROUTE', time: '8m ago', date: '2026-03-05' },
  { id: 'J-3009', client: 'Moses Tumusiime', operator: '—', from: 'Nakasero', to: 'Bugolobi', vehicle: 'Taxi', price: 15000, status: 'SEARCHING_OPERATOR', time: '12m ago', date: '2026-03-05' },
  { id: 'J-3008', client: 'Linda Wamala', operator: 'Charles Kato', from: 'Kisementi', to: 'Lubowa', vehicle: 'Car', price: 45000, status: 'COMPLETED', time: '15m ago', date: '2026-03-05' },
  { id: 'J-3007', client: 'Patricia Nambi', operator: 'Joseph Okwi', from: 'Muyenga', to: 'Kabalagala', vehicle: 'Boda', price: 6000, status: 'COMPLETED', time: '22m ago', date: '2026-03-05' },
  { id: 'J-3006', client: 'Brian Sserunjogi', operator: '—', from: 'Ntinda', to: 'Bukoto', vehicle: 'Boda', price: 4000, status: 'CANCELLED', time: '30m ago', date: '2026-03-05' },
  { id: 'J-3005', client: 'Joan Namutebi', operator: 'Samuel Waswa', from: 'Entebbe Road', to: 'Kajjansi', vehicle: 'Car', price: 35000, status: 'COMPLETED', time: '35m ago', date: '2026-03-05' },
  { id: 'J-3004', client: 'Kenneth Ouma', operator: 'Godfrey Mugisha', from: 'Wandegeya', to: 'Kawempe', vehicle: 'Taxi', price: 12000, status: 'COMPLETED', time: '40m ago', date: '2026-03-05' },
  { id: 'J-3003', client: 'Florence Adeke', operator: 'Isaac Lubega', from: 'Kololo', to: 'Naguru', vehicle: 'Boda', price: 7000, status: 'COMPLETED', time: '48m ago', date: '2026-03-05' },
  { id: 'J-3002', client: 'Robert Ssebaggala', operator: '—', from: 'Kampala CBD', to: 'Naalya', vehicle: 'Car', price: 55000, status: 'CANCELLED', time: '1h ago', date: '2026-03-05' },
  { id: 'J-3001', client: 'Agnes Tusiime', operator: 'Ronald Kizza', from: 'Bugolobi', to: 'Luzira', vehicle: 'Boda', price: 8000, status: 'COMPLETED', time: '1h ago', date: '2026-03-05' },
  { id: 'J-3000', client: 'Martin Odongo', operator: 'Bashir Mubiru', from: 'Nakasero', to: 'Rubaga', vehicle: 'Taxi', price: 10000, status: 'COMPLETED', time: '1h ago', date: '2026-03-05' },
  { id: 'J-2999', client: 'Irene Nalubega', operator: 'Denis Kiggundu', from: 'Lubowa', to: 'Entebbe', vehicle: 'Car', price: 65000, status: 'ACTIVE', time: '2h ago', date: '2026-03-04' },
  { id: 'J-2998', client: 'Paul Walugembe', operator: 'Moses Kibirige', from: 'Muyenga', to: 'Makindye', vehicle: 'Boda', price: 5000, status: 'COMPLETED', time: '2h ago', date: '2026-03-04' },
  { id: 'J-2997', client: 'Esther Nakato', operator: '—', from: 'Ntinda', to: 'Kisaasi', vehicle: 'Boda', price: 6000, status: 'SEARCHING_OPERATOR', time: '3h ago', date: '2026-03-04' },
  { id: 'J-2996', client: 'Joseph Mugume', operator: 'Andrew Ssali', from: 'Kabalagala', to: 'Ggaba', vehicle: 'Boda', price: 5000, status: 'COMPLETED', time: '3h ago', date: '2026-03-04' },
];

const statusTabs = [
  { label: 'All', value: 'all', count: 17 },
  { label: 'Active', value: 'ACTIVE', count: 2 },
  { label: 'En Route', value: 'EN_ROUTE', count: 1 },
  { label: 'Completed', value: 'COMPLETED', count: 10 },
  { label: 'Cancelled', value: 'CANCELLED', count: 2 },
  { label: 'Searching', value: 'SEARCHING_OPERATOR', count: 2 },
];

const vehicleTypes = ['All', 'Boda', 'Car', 'Taxi'];

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold', getStatusColor(status))}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export default function JourneysPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [vehicleFilter, setVehicleFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const filtered = journeys.filter((j) => {
    if (activeTab !== 'all' && j.status !== activeTab) return false;
    if (vehicleFilter !== 'All' && j.vehicle !== vehicleFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        j.id.toLowerCase().includes(q) ||
        j.client.toLowerCase().includes(q) ||
        j.operator.toLowerCase().includes(q) ||
        j.from.toLowerCase().includes(q) ||
        j.to.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div>
      <Header title="Journeys" subtitle="Track and manage all platform journeys" />

      <div className="p-8 space-y-6">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setActiveTab(tab.value); setCurrentPage(1); }}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200',
                activeTab === tab.value
                  ? 'bg-travo-orange text-white shadow-travo'
                  : 'bg-white text-travo-gray-600 hover:bg-travo-gray-50 border border-travo-gray-200',
              )}
            >
              {tab.label}
              <span className={cn(
                'text-xs px-2 py-0.5 rounded-full',
                activeTab === tab.value ? 'bg-white/20 text-white' : 'bg-travo-gray-100 text-travo-gray-500',
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filters Bar */}
        <div className="glass-card p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[240px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-travo-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, client, operator, location..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="input-field !pl-10 !py-2.5 text-sm"
              />
            </div>

            {/* Vehicle Type Filter */}
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-travo-gray-400" />
              {vehicleTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => { setVehicleFilter(type); setCurrentPage(1); }}
                  className={cn(
                    'px-3 py-2 rounded-lg text-xs font-semibold transition-colors',
                    vehicleFilter === type
                      ? 'bg-travo-black text-white'
                      : 'bg-travo-gray-100 text-travo-gray-600 hover:bg-travo-gray-200',
                  )}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-2 px-3 py-2 bg-travo-gray-50 rounded-lg border border-travo-gray-200">
              <Calendar size={14} className="text-travo-gray-400" />
              <span className="text-xs text-travo-gray-600 font-medium">Mar 1 – Mar 5, 2026</span>
            </div>
          </div>
        </div>

        {/* Journey Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-travo-gray-500 text-xs uppercase tracking-wider bg-travo-gray-50/50">
                  <th className="px-6 py-4 font-semibold">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-travo-black">
                      ID <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th className="px-6 py-4 font-semibold">Client</th>
                  <th className="px-6 py-4 font-semibold">Operator</th>
                  <th className="px-6 py-4 font-semibold">Route</th>
                  <th className="px-6 py-4 font-semibold">Vehicle</th>
                  <th className="px-6 py-4 font-semibold">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-travo-black">
                      Price <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Time</th>
                  <th className="px-6 py-4 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((j) => (
                  <tr key={j.id} className="table-row group">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-travo-orange">{j.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-travo-gray-100 flex items-center justify-center text-xs font-bold text-travo-gray-600">
                          {j.client.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium text-travo-black">{j.client}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-travo-gray-600">{j.operator}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-travo-orange flex-shrink-0" />
                        <span className="text-xs truncate max-w-[180px]">{j.from} → {j.to}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="badge-orange">{j.vehicle}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold">{formatCurrency(j.price)}</td>
                    <td className="px-6 py-4"><StatusBadge status={j.status} /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-xs text-travo-gray-500">
                        <Clock size={12} />
                        {j.time}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg hover:bg-travo-gray-100 text-travo-gray-400 hover:text-travo-orange transition-colors">
                          <Eye size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-travo-gray-100 text-travo-gray-400 hover:text-travo-black transition-colors">
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-travo-gray-100 bg-travo-gray-50/30">
            <p className="text-sm text-travo-gray-500">
              Showing <span className="font-semibold text-travo-black">{(currentPage - 1) * perPage + 1}</span> to{' '}
              <span className="font-semibold text-travo-black">{Math.min(currentPage * perPage, filtered.length)}</span> of{' '}
              <span className="font-semibold text-travo-black">{filtered.length}</span> journeys
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-travo-gray-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} className="text-travo-gray-600" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    'w-9 h-9 rounded-lg text-sm font-semibold transition-colors',
                    page === currentPage
                      ? 'bg-travo-orange text-white shadow-travo'
                      : 'border border-travo-gray-200 text-travo-gray-600 hover:bg-white',
                  )}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-travo-gray-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} className="text-travo-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Today\'s Journeys', value: '342', icon: Navigation, color: 'text-travo-orange' },
            { label: 'Avg Fare', value: formatCurrency(18500), icon: ArrowUpDown, color: 'text-green-600' },
            { label: 'Completion Rate', value: '94.2%', icon: Navigation, color: 'text-blue-600' },
            { label: 'Avg Wait Time', value: '2.4 min', icon: Clock, color: 'text-purple-600' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card px-5 py-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-travo-gray-50">
                <stat.icon size={18} className={stat.color} />
              </div>
              <div>
                <p className="text-xs text-travo-gray-500 font-medium">{stat.label}</p>
                <p className="text-lg font-bold text-travo-black">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
