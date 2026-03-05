'use client';

import Header from '@/components/layout/Header';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowDownRight,
  DollarSign,
  TrendingUp,
  Clock,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  ArrowRightLeft,
  Banknote,
  Eye,
  MoreHorizontal,
} from 'lucide-react';
import { useState } from 'react';

const balances = [
  { label: 'System Revenue', value: 148500000, change: '+18.2%', trend: 'up', icon: DollarSign, color: 'gradient-orange', description: 'Total platform commissions' },
  { label: 'Total Transactions', value: 2847, change: '+12.5%', trend: 'up', icon: ArrowRightLeft, color: 'bg-blue-600', description: 'This month' },
  { label: 'Pending Payouts', value: 24300000, change: '32 operators', trend: 'neutral', icon: Clock, color: 'bg-yellow-500', description: 'Awaiting disbursement' },
  { label: 'Monthly Volume', value: 892000000, change: '+22.4%', trend: 'up', icon: TrendingUp, color: 'bg-green-600', description: 'Gross transaction value' },
];

const transactions = [
  { id: 'TXN-4821', from: 'Sarah Nakamatte', to: 'James Mukasa', amount: 8000, type: 'JOURNEY_PAYMENT', status: 'COMPLETED', date: '2026-03-05T14:32:00' },
  { id: 'TXN-4820', from: 'David Okiror', to: 'Peter Nalwoga', amount: 85000, type: 'JOURNEY_PAYMENT', status: 'COMPLETED', date: '2026-03-05T14:28:00' },
  { id: 'TXN-4819', from: 'Platform', to: 'James Mukasa', amount: 450000, type: 'PAYOUT', status: 'PENDING', date: '2026-03-05T14:15:00' },
  { id: 'TXN-4818', from: 'Grace Amongin', to: 'Abdul Ssempijja', amount: 5000, type: 'JOURNEY_PAYMENT', status: 'COMPLETED', date: '2026-03-05T14:02:00' },
  { id: 'TXN-4817', from: 'Kampala Eats', to: 'Platform', amount: 2500000, type: 'AD_PAYMENT', status: 'COMPLETED', date: '2026-03-05T13:45:00' },
  { id: 'TXN-4816', from: 'Platform', to: 'SafeRide Ltd', amount: 12500000, type: 'PAYOUT', status: 'PROCESSING', date: '2026-03-05T13:30:00' },
  { id: 'TXN-4815', from: 'Moses Tumusiime', to: 'System', amount: 15000, type: 'JOURNEY_PAYMENT', status: 'REFUNDED', date: '2026-03-05T13:12:00' },
  { id: 'TXN-4814', from: 'Patricia Nambi', to: 'Joseph Okwi', amount: 6000, type: 'JOURNEY_PAYMENT', status: 'COMPLETED', date: '2026-03-05T12:58:00' },
  { id: 'TXN-4813', from: 'Rolex Hub', to: 'Platform', amount: 1800000, type: 'AD_PAYMENT', status: 'COMPLETED', date: '2026-03-05T12:40:00' },
  { id: 'TXN-4812', from: 'Platform', to: 'CityDrive UG', amount: 8400000, type: 'PAYOUT', status: 'COMPLETED', date: '2026-03-05T12:20:00' },
  { id: 'TXN-4811', from: 'Joan Namutebi', to: 'Samuel Waswa', amount: 35000, type: 'JOURNEY_PAYMENT', status: 'COMPLETED', date: '2026-03-05T12:05:00' },
  { id: 'TXN-4810', from: 'Kenneth Ouma', to: 'Godfrey Mugisha', amount: 12000, type: 'JOURNEY_PAYMENT', status: 'COMPLETED', date: '2026-03-05T11:48:00' },
  { id: 'TXN-4809', from: 'Florence Adeke', to: 'Isaac Lubega', amount: 7000, type: 'JOURNEY_PAYMENT', status: 'COMPLETED', date: '2026-03-05T11:32:00' },
  { id: 'TXN-4808', from: 'MTN MoMo Hub', to: 'Platform', amount: 3200000, type: 'AD_PAYMENT', status: 'COMPLETED', date: '2026-03-05T11:15:00' },
  { id: 'TXN-4807', from: 'Platform', to: 'BodaPro Services', amount: 6800000, type: 'PAYOUT', status: 'PENDING', date: '2026-03-05T11:00:00' },
  { id: 'TXN-4806', from: 'Robert Ssebaggala', to: 'System', amount: 55000, type: 'JOURNEY_PAYMENT', status: 'REFUNDED', date: '2026-03-05T10:42:00' },
  { id: 'TXN-4805', from: 'Agnes Tusiime', to: 'Ronald Kizza', amount: 8000, type: 'JOURNEY_PAYMENT', status: 'COMPLETED', date: '2026-03-05T10:25:00' },
  { id: 'TXN-4804', from: 'User Top-up', to: 'Martin Odongo', amount: 50000, type: 'WALLET_TOPUP', status: 'COMPLETED', date: '2026-03-05T10:10:00' },
  { id: 'TXN-4803', from: 'Irene Nalubega', to: 'Denis Kiggundu', amount: 65000, type: 'JOURNEY_PAYMENT', status: 'COMPLETED', date: '2026-03-05T09:55:00' },
  { id: 'TXN-4802', from: 'User Top-up', to: 'Paul Walugembe', amount: 100000, type: 'WALLET_TOPUP', status: 'COMPLETED', date: '2026-03-05T09:38:00' },
  { id: 'TXN-4801', from: 'Platform', to: 'Metro Taxis', amount: 4200000, type: 'PAYOUT', status: 'COMPLETED', date: '2026-03-05T09:20:00' },
];

const typeFilters = ['All', 'JOURNEY_PAYMENT', 'PAYOUT', 'AD_PAYMENT', 'WALLET_TOPUP', 'REFUNDED'];
const typeLabels: Record<string, string> = {
  JOURNEY_PAYMENT: 'Journey',
  PAYOUT: 'Payout',
  AD_PAYMENT: 'Ad Payment',
  WALLET_TOPUP: 'Top-up',
  REFUNDED: 'Refund',
};

function TypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    JOURNEY_PAYMENT: 'bg-blue-100 text-blue-700',
    PAYOUT: 'bg-purple-100 text-purple-700',
    AD_PAYMENT: 'bg-travo-orange/10 text-travo-orange',
    WALLET_TOPUP: 'bg-green-100 text-green-700',
    REFUNDED: 'bg-red-100 text-red-700',
  };
  const icons: Record<string, React.ReactNode> = {
    JOURNEY_PAYMENT: <ArrowRightLeft size={10} />,
    PAYOUT: <ArrowUpRight size={10} />,
    AD_PAYMENT: <CreditCard size={10} />,
    WALLET_TOPUP: <Banknote size={10} />,
    REFUNDED: <ArrowDownLeft size={10} />,
  };
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold', styles[type] || 'bg-gray-100 text-gray-700')}>
      {icons[type]}
      {typeLabels[type] || type}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    COMPLETED: 'bg-green-500',
    PENDING: 'bg-yellow-500',
    PROCESSING: 'bg-blue-500',
    REFUNDED: 'bg-red-500',
  };
  return (
    <div className="flex items-center gap-2">
      <div className={cn('w-2 h-2 rounded-full', colors[status] || 'bg-gray-400')} />
      <span className="text-xs font-medium text-travo-gray-600">{status}</span>
    </div>
  );
}

export default function WalletPage() {
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const filtered = transactions.filter((t) => {
    if (typeFilter !== 'All' && t.type !== typeFilter && t.status !== typeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        t.from.toLowerCase().includes(q) ||
        t.to.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div>
      <Header title="Wallet" subtitle="Financial overview and transaction management" />

      <div className="p-8 space-y-6">
        {/* Balance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {balances.map((b) => (
            <div key={b.label} className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center text-white', b.color)}>
                  <b.icon size={22} />
                </div>
                {b.trend === 'up' && (
                  <div className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-green-50 text-green-600">
                    <ArrowUpRight size={14} />
                    {b.change}
                  </div>
                )}
              </div>
              <p className="text-sm text-travo-gray-500 font-medium">{b.label}</p>
              <p className="text-2xl font-bold text-travo-black mt-1">
                {typeof b.value === 'number' && b.label !== 'Total Transactions'
                  ? formatCurrency(b.value)
                  : b.value.toLocaleString()}
              </p>
              <p className="text-xs text-travo-gray-400 mt-1">{b.description}</p>
            </div>
          ))}
        </div>

        {/* Transaction Filters */}
        <div className="glass-card p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-travo-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="input-field !pl-10 !py-2.5 text-sm"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={14} className="text-travo-gray-400" />
              {typeFilters.map((tf) => (
                <button
                  key={tf}
                  onClick={() => { setTypeFilter(tf); setCurrentPage(1); }}
                  className={cn(
                    'px-3 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap',
                    typeFilter === tf
                      ? 'bg-travo-orange text-white'
                      : 'bg-travo-gray-100 text-travo-gray-600 hover:bg-travo-gray-200',
                  )}
                >
                  {tf === 'All' ? 'All' : typeLabels[tf] || tf}
                </button>
              ))}
            </div>

            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-travo-gray-200 text-sm font-semibold text-travo-gray-600 hover:bg-travo-gray-50 transition-colors">
              <Download size={14} />
              Export
            </button>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-travo-gray-500 text-xs uppercase tracking-wider bg-travo-gray-50/50">
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">From</th>
                  <th className="px-6 py-4 font-semibold">To</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((t) => (
                  <tr key={t.id} className="table-row group">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-travo-orange">{t.id}</td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-travo-black">{t.from}</span>
                    </td>
                    <td className="px-6 py-4 text-travo-gray-600">{t.to}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        'font-bold',
                        t.type === 'PAYOUT' || t.status === 'REFUNDED' ? 'text-red-600' : 'text-green-600',
                      )}>
                        {t.type === 'PAYOUT' || t.status === 'REFUNDED' ? '-' : '+'}{formatCurrency(t.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4"><TypeBadge type={t.type} /></td>
                    <td className="px-6 py-4"><StatusDot status={t.status} /></td>
                    <td className="px-6 py-4 text-xs text-travo-gray-500">{formatDate(t.date)}</td>
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
              <span className="font-semibold text-travo-black">{filtered.length}</span> transactions
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
