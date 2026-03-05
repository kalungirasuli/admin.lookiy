'use client';

import Header from '@/components/layout/Header';
import { cn, formatRelativeTime } from '@/lib/utils';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  User,
  Building2,
  Camera,
  CreditCard,
  Car,
  Search,
  Filter,
  Eye,
  ChevronDown,
  Upload,
} from 'lucide-react';
import { useState } from 'react';

const stats = [
  { label: 'Pending Review', value: '12', icon: Clock, color: 'bg-yellow-500', description: 'Awaiting verification' },
  { label: 'Processing', value: '4', icon: AlertTriangle, color: 'bg-blue-600', description: 'Under review' },
  { label: 'Approved Today', value: '8', icon: CheckCircle2, color: 'bg-green-600', description: 'Successfully verified' },
  { label: 'Rejected', value: '2', icon: XCircle, color: 'bg-red-600', description: 'Requires resubmission' },
];

const verifications = [
  {
    id: 'VER-001',
    name: 'John Okello',
    type: 'OPERATOR',
    vehicleType: 'Boda',
    phone: '+256 770 123 456',
    documents: ['National ID', 'Driving License', 'Passport Photo'],
    submitted: '2026-03-05T12:00:00',
    status: 'PENDING',
    notes: 'New operator registration from Wandegeya area',
  },
  {
    id: 'VER-002',
    name: 'Smart Fleet Ltd',
    type: 'COMPANY',
    vehicleType: null,
    phone: '+256 414 234 567',
    documents: ['Business Registration', 'Tax Certificate', 'Company Profile', 'Director NID'],
    submitted: '2026-03-05T10:30:00',
    status: 'PENDING',
    notes: 'Fleet company with 15 vehicles, requesting registration',
  },
  {
    id: 'VER-003',
    name: 'Grace Namutebi',
    type: 'OPERATOR',
    vehicleType: 'Car',
    phone: '+256 771 234 567',
    documents: ['National ID', 'Driving License', 'Vehicle Insurance', 'Vehicle Registration'],
    submitted: '2026-03-05T09:15:00',
    status: 'PENDING',
    notes: 'Experienced driver, previously with SafeRide',
  },
  {
    id: 'VER-004',
    name: 'Hussein Kateregga',
    type: 'OPERATOR',
    vehicleType: 'Boda',
    phone: '+256 772 345 678',
    documents: ['National ID', 'Driving License', 'Passport Photo'],
    submitted: '2026-03-05T08:00:00',
    status: 'PROCESSING',
    notes: 'Smile ID check in progress',
  },
  {
    id: 'VER-005',
    name: 'Kampala Rides Co.',
    type: 'COMPANY',
    vehicleType: null,
    phone: '+256 414 345 678',
    documents: ['Business Registration', 'Tax Certificate', 'Fleet List'],
    submitted: '2026-03-04T16:00:00',
    status: 'PROCESSING',
    notes: 'New company registration, fleet of 8 cars',
  },
  {
    id: 'VER-006',
    name: 'Emmanuel Buyinza',
    type: 'OPERATOR',
    vehicleType: 'Car',
    phone: '+256 773 456 789',
    documents: ['National ID', 'Driving License', 'Vehicle Insurance'],
    submitted: '2026-03-04T14:30:00',
    status: 'PENDING',
    notes: 'Want to join Entebbe Express fleet',
  },
  {
    id: 'VER-007',
    name: 'Fatuma Nankya',
    type: 'OPERATOR',
    vehicleType: 'Boda',
    phone: '+256 774 567 890',
    documents: ['National ID', 'Driving License', 'Passport Photo'],
    submitted: '2026-03-04T11:00:00',
    status: 'PENDING',
    notes: 'Female boda rider, Makindye area',
  },
  {
    id: 'VER-008',
    name: 'Richard Ssemakula',
    type: 'OPERATOR',
    vehicleType: 'Taxi',
    phone: '+256 775 678 901',
    documents: ['National ID', 'Driving License', 'PSV License', 'Vehicle Inspection Report'],
    submitted: '2026-03-04T09:00:00',
    status: 'PENDING',
    notes: 'Taxi operator for Metro Taxis',
  },
  {
    id: 'VER-009',
    name: 'Patrick Wakabi',
    type: 'OPERATOR',
    vehicleType: 'Car',
    phone: '+256 776 789 012',
    documents: ['National ID', 'Driving License'],
    submitted: '2026-03-03T15:00:00',
    status: 'REJECTED',
    notes: 'Missing vehicle insurance document. Requested resubmission.',
  },
  {
    id: 'VER-010',
    name: 'Mubende Transport Ltd',
    type: 'COMPANY',
    vehicleType: null,
    phone: '+256 414 456 789',
    documents: ['Business Registration'],
    submitted: '2026-03-03T10:00:00',
    status: 'REJECTED',
    notes: 'Incomplete documentation. Tax certificate and director ID missing.',
  },
];

const docIcons: Record<string, React.ReactNode> = {
  'National ID': <CreditCard size={12} />,
  'Driving License': <Car size={12} />,
  'Passport Photo': <Camera size={12} />,
  'Business Registration': <Building2 size={12} />,
  'Vehicle Insurance': <FileText size={12} />,
  'Vehicle Registration': <FileText size={12} />,
  'Tax Certificate': <FileText size={12} />,
  'Company Profile': <FileText size={12} />,
  'Director NID': <CreditCard size={12} />,
  'Fleet List': <FileText size={12} />,
  'PSV License': <FileText size={12} />,
  'Vehicle Inspection Report': <FileText size={12} />,
};

const statusFilters = ['All', 'PENDING', 'PROCESSING', 'REJECTED'];

export default function VerificationsPage() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const filtered = verifications.filter((v) => {
    if (statusFilter !== 'All' && v.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return v.name.toLowerCase().includes(q) || v.id.toLowerCase().includes(q);
    }
    return true;
  });

  const handleApprove = (id: string) => {
    // In production, this would call an API
    alert(`Approved verification ${id}`);
  };

  const handleReject = (id: string) => {
    // In production, this would call an API
    alert(`Rejected verification ${id}`);
  };

  return (
    <div>
      <Header title="Verifications" subtitle="Review and manage identity verifications" />

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
              <p className="text-xs text-travo-gray-400 mt-1">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-travo-gray-400" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field !pl-10 !py-2.5 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            {statusFilters.map((s) => (
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
                {s === 'All' ? 'All Status' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Verification Cards */}
        <div className="space-y-4">
          {filtered.map((v) => (
            <div key={v.id} className="glass-card overflow-hidden hover:shadow-card-hover transition-all duration-300">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0',
                    v.type === 'OPERATOR' ? 'gradient-orange' : 'bg-blue-600',
                  )}>
                    {v.type === 'OPERATOR' ? <User size={20} /> : <Building2 size={20} />}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-base font-bold text-travo-black">{v.name}</h3>
                      <span className={cn(
                        'badge',
                        v.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        v.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' :
                        v.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                        'bg-green-100 text-green-700',
                      )}>
                        {v.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-travo-gray-500 mb-3">
                      <span className="badge-orange">{v.type === 'OPERATOR' ? `Operator – ${v.vehicleType}` : 'Company'}</span>
                      <span>ID: {v.id}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {formatRelativeTime(v.submitted)}
                      </span>
                    </div>

                    {/* Documents */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {v.documents.map((doc) => (
                        <div
                          key={doc}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-travo-gray-50 border border-travo-gray-200 text-xs font-medium text-travo-gray-600 hover:border-travo-orange/30 hover:bg-travo-orange/5 transition-colors cursor-pointer"
                        >
                          {docIcons[doc] || <FileText size={12} />}
                          {doc}
                          <Eye size={10} className="ml-1 text-travo-gray-400" />
                        </div>
                      ))}
                    </div>

                    {v.notes && (
                      <p className="text-xs text-travo-gray-500 italic">💬 {v.notes}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {v.status === 'PENDING' || v.status === 'PROCESSING' ? (
                      <>
                        <button
                          onClick={() => handleApprove(v.id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-700 text-xs font-semibold hover:bg-green-100 transition-colors"
                        >
                          <CheckCircle2 size={14} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(v.id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition-colors"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      </>
                    ) : v.status === 'REJECTED' ? (
                      <span className="text-xs text-red-600 font-semibold px-3 py-2 bg-red-50 rounded-lg">
                        Rejected
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Document Preview Placeholder */}
              {expandedCard === v.id && (
                <div className="border-t border-travo-gray-100 bg-travo-gray-50/50 p-6 animate-fade-in">
                  <h4 className="text-sm font-bold text-travo-black mb-4">Document Previews</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {v.documents.map((doc) => (
                      <div key={doc} className="aspect-[4/3] rounded-xl bg-travo-gray-200 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-travo-gray-300">
                        <Upload size={20} className="text-travo-gray-400" />
                        <p className="text-[10px] text-travo-gray-500 font-medium text-center px-2">{doc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expand toggle */}
              <button
                onClick={() => setExpandedCard(expandedCard === v.id ? null : v.id)}
                className="w-full py-2 text-xs font-semibold text-travo-gray-400 hover:text-travo-orange hover:bg-travo-gray-50 transition-colors border-t border-travo-gray-100 flex items-center justify-center gap-1"
              >
                <ChevronDown size={14} className={cn('transition-transform', expandedCard === v.id && 'rotate-180')} />
                {expandedCard === v.id ? 'Hide Documents' : 'Preview Documents'}
              </button>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="glass-card p-12 text-center">
            <ShieldCheck size={48} className="mx-auto text-travo-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-travo-gray-600">No verifications found</h3>
            <p className="text-sm text-travo-gray-400 mt-1">All caught up! No pending verifications match your filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
