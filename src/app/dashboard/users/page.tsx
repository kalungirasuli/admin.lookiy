'use client';

import Header from '@/components/layout/Header';
import { cn, formatDate, getInitials } from '@/lib/utils';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Activity,
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
  Clock,
} from 'lucide-react';
import { useState } from 'react';

const stats = [
  { label: 'Total Users', value: '12,847', icon: Users, change: '+1,230 this month', color: 'gradient-orange' },
  { label: 'New This Month', value: '1,230', icon: UserPlus, change: '+18% vs last month', color: 'bg-blue-600' },
  { label: 'Verified', value: '10,432', icon: ShieldCheck, change: '81.2% of total', color: 'bg-green-600' },
  { label: 'Active Today', value: '3,456', icon: Activity, change: '26.9% of total', color: 'bg-purple-600' },
];

const users = [
  { id: 'U-001', firstName: 'Sarah', lastName: 'Nakamatte', email: 'sarah.n@gmail.com', phone: '+256 701 234 567', roles: ['CLIENT'], verified: true, joined: '2025-01-15T10:00:00', lastActive: '2026-03-05T14:30:00' },
  { id: 'U-002', firstName: 'James', lastName: 'Mukasa', email: 'jamesmukasa@gmail.com', phone: '+256 702 345 678', roles: ['OPERATOR', 'CLIENT'], verified: true, joined: '2025-01-20T08:00:00', lastActive: '2026-03-05T14:28:00' },
  { id: 'U-003', firstName: 'David', lastName: 'Okiror', email: 'david.okiror@yahoo.com', phone: '+256 703 456 789', roles: ['CLIENT'], verified: true, joined: '2025-02-10T12:00:00', lastActive: '2026-03-05T14:15:00' },
  { id: 'U-004', firstName: 'Grace', lastName: 'Amongin', email: 'grace.a@outlook.com', phone: '+256 704 567 890', roles: ['CLIENT'], verified: false, joined: '2025-03-05T09:00:00', lastActive: '2026-03-05T13:45:00' },
  { id: 'U-005', firstName: 'Peter', lastName: 'Nalwoga', email: 'peter.n@saferide.ug', phone: '+256 705 678 901', roles: ['OPERATOR'], verified: true, joined: '2025-03-12T14:00:00', lastActive: '2026-03-05T14:32:00' },
  { id: 'U-006', firstName: 'Moses', lastName: 'Tumusiime', email: 'moses.t@gmail.com', phone: '+256 706 789 012', roles: ['CLIENT', 'ADMIN'], verified: true, joined: '2024-12-01T10:00:00', lastActive: '2026-03-05T14:00:00' },
  { id: 'U-007', firstName: 'Linda', lastName: 'Wamala', email: 'linda.w@hotmail.com', phone: '+256 707 890 123', roles: ['CLIENT'], verified: true, joined: '2025-04-20T11:00:00', lastActive: '2026-03-05T12:30:00' },
  { id: 'U-008', firstName: 'Patricia', lastName: 'Nambi', email: 'patricia.nambi@gmail.com', phone: '+256 708 901 234', roles: ['CLIENT'], verified: true, joined: '2025-05-15T08:00:00', lastActive: '2026-03-04T18:00:00' },
  { id: 'U-009', firstName: 'Brian', lastName: 'Sserunjogi', email: 'brian.s@citydrive.ug', phone: '+256 709 012 345', roles: ['OPERATOR', 'COMPANY_ADMIN'], verified: true, joined: '2025-01-01T10:00:00', lastActive: '2026-03-05T13:20:00' },
  { id: 'U-010', firstName: 'Joan', lastName: 'Namutebi', email: 'joan.n@gmail.com', phone: '+256 710 123 456', roles: ['CLIENT'], verified: false, joined: '2026-02-28T09:00:00', lastActive: '2026-03-05T11:45:00' },
  { id: 'U-011', firstName: 'Kenneth', lastName: 'Ouma', email: 'kenneth.o@gmail.com', phone: '+256 711 234 567', roles: ['CLIENT'], verified: true, joined: '2025-06-10T14:00:00', lastActive: '2026-03-05T10:30:00' },
  { id: 'U-012', firstName: 'Florence', lastName: 'Adeke', email: 'florence.a@yahoo.com', phone: '+256 712 345 678', roles: ['CLIENT', 'OPERATOR'], verified: true, joined: '2025-07-22T08:00:00', lastActive: '2026-03-04T22:00:00' },
  { id: 'U-013', firstName: 'Robert', lastName: 'Ssebaggala', email: 'robert.s@gmail.com', phone: '+256 713 456 789', roles: ['CLIENT'], verified: true, joined: '2025-08-05T10:00:00', lastActive: '2026-03-03T15:00:00' },
  { id: 'U-014', firstName: 'Agnes', lastName: 'Tusiime', email: 'agnes.t@outlook.com', phone: '+256 714 567 890', roles: ['ADMIN'], verified: true, joined: '2024-11-15T08:00:00', lastActive: '2026-03-05T14:35:00' },
  { id: 'U-015', firstName: 'Martin', lastName: 'Odongo', email: 'martin.o@gmail.com', phone: '+256 715 678 901', roles: ['CLIENT'], verified: true, joined: '2025-09-18T12:00:00', lastActive: '2026-03-05T09:15:00' },
  { id: 'U-016', firstName: 'Irene', lastName: 'Nalubega', email: 'irene.n@bodapro.ug', phone: '+256 716 789 012', roles: ['COMPANY_ADMIN'], verified: true, joined: '2025-02-01T10:00:00', lastActive: '2026-03-05T13:50:00' },
  { id: 'U-017', firstName: 'Paul', lastName: 'Walugembe', email: 'paul.w@gmail.com', phone: '+256 717 890 123', roles: ['CLIENT', 'OPERATOR'], verified: false, joined: '2026-01-10T09:00:00', lastActive: '2026-03-04T20:00:00' },
];

const roleTabs = [
  { label: 'All Users', value: 'all', count: 17 },
  { label: 'Clients', value: 'CLIENT', count: 13 },
  { label: 'Operators', value: 'OPERATOR', count: 5 },
  { label: 'Admins', value: 'ADMIN', count: 2 },
  { label: 'Company Admins', value: 'COMPANY_ADMIN', count: 2 },
];

const roleColors: Record<string, string> = {
  CLIENT: 'bg-blue-100 text-blue-700',
  OPERATOR: 'bg-travo-orange/10 text-travo-orange',
  ADMIN: 'bg-red-100 text-red-700',
  COMPANY_ADMIN: 'bg-purple-100 text-purple-700',
};

export default function UsersPage() {
  const [activeRole, setActiveRole] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const filtered = users.filter((u) => {
    if (activeRole !== 'all' && !u.roles.includes(activeRole)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q)
      );
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div>
      <Header title="Users" subtitle="Manage all platform users and their roles" />

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

        {/* Role Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {roleTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setActiveRole(tab.value); setCurrentPage(1); }}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200',
                activeRole === tab.value
                  ? 'bg-travo-orange text-white shadow-travo'
                  : 'bg-white text-travo-gray-600 hover:bg-travo-gray-50 border border-travo-gray-200',
              )}
            >
              {tab.label}
              <span className={cn(
                'text-xs px-2 py-0.5 rounded-full',
                activeRole === tab.value ? 'bg-white/20 text-white' : 'bg-travo-gray-100 text-travo-gray-500',
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-travo-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="input-field !pl-10 !py-2.5 text-sm"
          />
        </div>

        {/* Users Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-travo-gray-500 text-xs uppercase tracking-wider bg-travo-gray-50/50">
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Contact</th>
                  <th className="px-6 py-4 font-semibold">Roles</th>
                  <th className="px-6 py-4 font-semibold">Verified</th>
                  <th className="px-6 py-4 font-semibold">Joined</th>
                  <th className="px-6 py-4 font-semibold">Last Active</th>
                  <th className="px-6 py-4 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((u) => (
                  <tr key={u.id} className="table-row group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full gradient-orange flex items-center justify-center text-white text-sm font-bold">
                          {getInitials(u.firstName, u.lastName)}
                        </div>
                        <div>
                          <p className="font-semibold text-travo-black">{u.firstName} {u.lastName}</p>
                          <p className="text-xs text-travo-gray-400 font-mono">{u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-travo-gray-600">
                          <Mail size={11} />
                          {u.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-travo-gray-500">
                          <Phone size={11} />
                          {u.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {u.roles.map((role) => (
                          <span key={role} className={cn('badge', roleColors[role] || 'bg-gray-100 text-gray-700')}>
                            {role.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {u.verified ? (
                        <div className="flex items-center gap-1.5 text-green-600">
                          <ShieldCheck size={14} />
                          <span className="text-xs font-semibold">Verified</span>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-travo-gray-400">Unverified</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-travo-gray-500">
                        <Calendar size={11} />
                        {formatDate(u.joined)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-travo-gray-500">
                        <Clock size={11} />
                        {formatDate(u.lastActive)}
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
              <span className="font-semibold text-travo-black">{filtered.length}</span> users
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
      </div>
    </div>
  );
}
