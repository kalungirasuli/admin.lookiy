'use client';

import Header from '@/components/layout/Header';
import { cn, formatCurrency } from '@/lib/utils';
import {
  Building2,
  Users,
  Car,
  DollarSign,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Mail,
  Star,
  Search,
  Plus,
  MoreHorizontal,
  Bike,
  Bus,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';

const stats = [
  { label: 'Total Companies', value: '24', icon: Building2, change: '+3 this month', color: 'gradient-orange' },
  { label: 'Total Fleet Vehicles', value: '487', icon: Car, change: '+28 this month', color: 'bg-blue-600' },
  { label: 'Active Operators', value: '392', icon: Users, change: '80.5% active', color: 'bg-green-600' },
  { label: 'Fleet Revenue', value: formatCurrency(248000000), icon: DollarSign, change: '+18.2% vs last month', color: 'bg-purple-600' },
];

const companies = [
  {
    id: 'C-001',
    name: 'SafeRide Ltd',
    email: 'info@saferide.ug',
    phone: '+256 414 234 567',
    location: 'Plot 14, Kampala Road',
    vehicleTypes: ['Car', 'Taxi'],
    operators: 45,
    vehicles: 52,
    rating: 4.8,
    revenue: 68000000,
    status: 'ACTIVE',
    verified: true,
    joined: 'Dec 2024',
    operatorList: [
      { name: 'Peter Nalwoga', vehicle: 'Car', rating: 4.8, status: 'ONLINE' },
      { name: 'Samuel Waswa', vehicle: 'Car', rating: 4.8, status: 'ONLINE' },
      { name: 'Diana Namutebi', vehicle: 'Taxi', rating: 4.6, status: 'BUSY' },
    ],
  },
  {
    id: 'C-002',
    name: 'CityDrive UG',
    email: 'hello@citydrive.co.ug',
    phone: '+256 414 345 678',
    location: 'Nakasero Hill, Kampala',
    vehicleTypes: ['Car'],
    operators: 38,
    vehicles: 42,
    rating: 4.7,
    revenue: 54000000,
    status: 'ACTIVE',
    verified: true,
    joined: 'Jan 2025',
    operatorList: [
      { name: 'Charles Kato', vehicle: 'Car', rating: 4.9, status: 'ONLINE' },
      { name: 'Ronald Kizza', vehicle: 'Car', rating: 4.7, status: 'BUSY' },
    ],
  },
  {
    id: 'C-003',
    name: 'Metro Taxis',
    email: 'ops@metrotaxis.ug',
    phone: '+256 414 456 789',
    location: 'Ntinda Trading Center',
    vehicleTypes: ['Taxi'],
    operators: 22,
    vehicles: 25,
    rating: 4.5,
    revenue: 32000000,
    status: 'ACTIVE',
    verified: true,
    joined: 'Mar 2025',
    operatorList: [
      { name: 'Godfrey Mugisha', vehicle: 'Taxi', rating: 4.5, status: 'ONLINE' },
      { name: 'Andrew Ssali', vehicle: 'Taxi', rating: 4.6, status: 'OFFLINE' },
    ],
  },
  {
    id: 'C-004',
    name: 'BodaPro Services',
    email: 'admin@bodapro.ug',
    phone: '+256 414 567 890',
    location: 'Wandegeya',
    vehicleTypes: ['Boda'],
    operators: 85,
    vehicles: 90,
    rating: 4.4,
    revenue: 42000000,
    status: 'ACTIVE',
    verified: true,
    joined: 'Feb 2025',
    operatorList: [
      { name: 'Francis Okello', vehicle: 'Boda', rating: 4.6, status: 'ONLINE' },
      { name: 'Hassan Mulindwa', vehicle: 'Boda', rating: 4.3, status: 'ONLINE' },
      { name: 'Richard Ssemakula', vehicle: 'Boda', rating: 4.5, status: 'BUSY' },
    ],
  },
  {
    id: 'C-005',
    name: 'Entebbe Express',
    email: 'book@entebbeexpress.ug',
    phone: '+256 414 678 901',
    location: 'Entebbe Road',
    vehicleTypes: ['Car', 'Taxi'],
    operators: 18,
    vehicles: 22,
    rating: 4.6,
    revenue: 28000000,
    status: 'ACTIVE',
    verified: true,
    joined: 'May 2025',
    operatorList: [
      { name: 'Emmanuel Buyinza', vehicle: 'Car', rating: 4.7, status: 'ONLINE' },
      { name: 'Patrick Wakabi', vehicle: 'Taxi', rating: 4.5, status: 'OFFLINE' },
    ],
  },
  {
    id: 'C-006',
    name: 'Pearl Transit Co.',
    email: 'contact@pearltransit.ug',
    phone: '+256 414 789 012',
    location: 'Bugolobi, Kampala',
    vehicleTypes: ['Car', 'Boda', 'Taxi'],
    operators: 64,
    vehicles: 71,
    rating: 4.3,
    revenue: 38000000,
    status: 'PENDING',
    verified: false,
    joined: 'Jan 2026',
    operatorList: [
      { name: 'Simon Mugabi', vehicle: 'Car', rating: 4.4, status: 'ONLINE' },
    ],
  },
];

function VehicleBadge({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    Car: <Car size={12} />,
    Boda: <Bike size={12} />,
    Taxi: <Bus size={12} />,
  };
  return (
    <span className="badge-orange flex items-center gap-1">
      {icons[type]}
      {type}
    </span>
  );
}

export default function CompaniesPage() {
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = companies.filter((c) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div>
      <Header title="Companies" subtitle="Manage fleet companies and their operators" />

      <div className="p-8 space-y-6">
        {/* Stats */}
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

        {/* Search & Actions */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-travo-gray-400" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field !pl-10 !py-2.5 text-sm"
            />
          </div>
          <button className="btn-primary flex items-center gap-2 !py-2.5 text-sm">
            <Plus size={16} />
            Add Company
          </button>
        </div>

        {/* Company Cards */}
        <div className="space-y-4">
          {filtered.map((company) => (
            <div key={company.id} className="glass-card overflow-hidden hover:shadow-card-hover transition-all duration-300">
              {/* Company Header */}
              <div className="p-6">
                <div className="flex items-start gap-5">
                  {/* Logo Placeholder */}
                  <div className="w-16 h-16 rounded-2xl gradient-orange flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {company.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-travo-black">{company.name}</h3>
                      {company.verified && (
                        <ShieldCheck size={16} className="text-green-600" />
                      )}
                      <span className={cn(
                        'badge',
                        company.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700',
                      )}>
                        {company.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-travo-gray-500 mb-3">
                      <span className="flex items-center gap-1"><MapPin size={12} />{company.location}</span>
                      <span className="flex items-center gap-1"><Phone size={12} />{company.phone}</span>
                      <span className="flex items-center gap-1"><Mail size={12} />{company.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {company.vehicleTypes.map((vt) => (
                        <VehicleBadge key={vt} type={vt} />
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden lg:flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-xs text-travo-gray-400">Operators</p>
                      <p className="text-xl font-bold text-travo-black">{company.operators}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-travo-gray-400">Vehicles</p>
                      <p className="text-xl font-bold text-travo-black">{company.vehicles}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-travo-gray-400">Rating</p>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <p className="text-xl font-bold text-travo-black">{company.rating}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-travo-gray-400">Revenue</p>
                      <p className="text-lg font-bold text-travo-black">{formatCurrency(company.revenue)}</p>
                    </div>
                  </div>

                  {/* Expand */}
                  <button
                    onClick={() => setExpandedCompany(expandedCompany === company.id ? null : company.id)}
                    className="p-2 rounded-lg hover:bg-travo-gray-100 transition-colors text-travo-gray-400"
                  >
                    {expandedCompany === company.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>

                {/* Mobile Stats */}
                <div className="grid grid-cols-4 gap-4 mt-4 lg:hidden">
                  <div className="text-center p-3 rounded-xl bg-travo-gray-50">
                    <p className="text-xs text-travo-gray-400">Operators</p>
                    <p className="text-lg font-bold text-travo-black">{company.operators}</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-travo-gray-50">
                    <p className="text-xs text-travo-gray-400">Vehicles</p>
                    <p className="text-lg font-bold text-travo-black">{company.vehicles}</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-travo-gray-50">
                    <p className="text-xs text-travo-gray-400">Rating</p>
                    <p className="text-lg font-bold text-travo-black">{company.rating}</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-travo-gray-50">
                    <p className="text-xs text-travo-gray-400">Revenue</p>
                    <p className="text-sm font-bold text-travo-black">{formatCurrency(company.revenue)}</p>
                  </div>
                </div>
              </div>

              {/* Expanded Operators List */}
              {expandedCompany === company.id && (
                <div className="border-t border-travo-gray-100 bg-travo-gray-50/50 p-6 animate-fade-in">
                  <h4 className="text-sm font-bold text-travo-black mb-4">Operators ({company.operatorList.length} shown)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {company.operatorList.map((op, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-travo-gray-200">
                        <div className="relative">
                          <div className="w-9 h-9 rounded-full gradient-orange flex items-center justify-center text-white text-xs font-bold">
                            {op.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className={cn(
                            'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white',
                            op.status === 'ONLINE' ? 'bg-green-500' : op.status === 'BUSY' ? 'bg-orange-500' : 'bg-travo-gray-400',
                          )} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-travo-black truncate">{op.name}</p>
                          <div className="flex items-center gap-2 text-xs text-travo-gray-500">
                            <span className="badge-orange text-[10px] !py-0">{op.vehicle}</span>
                            <span>⭐ {op.rating}</span>
                          </div>
                        </div>
                        <span className={cn(
                          'text-xs font-semibold px-2 py-1 rounded-lg',
                          op.status === 'ONLINE' ? 'bg-green-50 text-green-700' : op.status === 'BUSY' ? 'bg-orange-50 text-orange-700' : 'bg-gray-50 text-gray-600',
                        )}>
                          {op.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 text-sm font-semibold text-travo-orange hover:underline">
                    View all {company.operators} operators →
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
