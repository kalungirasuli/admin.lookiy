'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart3, CircleDollarSign, Navigation2, RefreshCw, ShoppingBag } from 'lucide-react';
import Header from '@/components/layout/Header';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

type Result = { data?: Record<string, any>[]; pagination?: { total?: number }; meta?: { total?: number } };
const journeyGroups = [
  { label: 'Unmatched', status: 'CREATED,SEARCHING_OPERATOR,NEGOTIATING', color: '#D99141' },
  { label: 'Matched', status: 'MATCHED,EN_ROUTE,ARRIVED,LOCKED', color: '#5285A8' },
  { label: 'Underway', status: 'STARTED,ACTIVE', color: '#1D9A84' },
  { label: 'Completed', status: 'COMPLETED', color: '#6A7BBD' },
  { label: 'Cancelled', status: 'CANCELLED', color: '#C56B6B' },
];

export default function AnalyticsPage() {
  const [counts, setCounts] = useState<Record<string, number | null>>({});
  const [transactions, setTransactions] = useState<Record<string, any>[]>([]);
  const [ads, setAds] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const load = useCallback(async () => {
    setLoading(true);
    const sources = [
      ...journeyGroups.map(group => ({ key: group.label, path: `/journeys/admin/all?status=${group.status}&limit=1` })),
      { key: 'Riders', path: '/operators?limit=1' },
      { key: 'Clients', path: '/auth/admin/users?role=CLIENT&limit=1' },
      { key: 'Fleets', path: '/companies?limit=1' },
      { key: 'Shops', path: '/ads/admin/businesses?limit=1' },
      { key: 'Running ads', path: '/ads/admin/ads?status=running&limit=100' },
      { key: 'Wallet actions', path: '/wallet/admin/transactions?limit=100' },
    ];
    const results = await Promise.allSettled(sources.map(source => api.adminGet<Result>(source.path)));
    const nextCounts: Record<string, number | null> = {};
    const failed: string[] = [];
    results.forEach((result, index) => {
      const key = sources[index].key;
      if (result.status === 'fulfilled') {
        nextCounts[key] = result.value?.pagination?.total ?? result.value?.meta?.total ?? result.value?.data?.length ?? 0;
        if (key === 'Running ads') setAds(result.value?.data || []);
        if (key === 'Wallet actions') setTransactions(result.value?.data || []);
      } else { nextCounts[key] = null; failed.push(key); }
    });
    setCounts(nextCounts); setErrors(failed); setLoading(false);
  }, []);
  useEffect(() => { void load(); }, [load]);
  const peak = Math.max(1, ...journeyGroups.map(group => counts[group.label] || 0));
  const walletSample = useMemo(() => transactions.filter(item => item.status === 'COMPLETED'), [transactions]);
  const walletMovement = walletSample.reduce((total, item) => total + Number(item.amount || 0), 0);
  const adViews = ads.reduce((total, item) => total + Number(item.impressions || 0), 0);
  const cards = [
    { label: 'Riders', href: '/dashboard/operators', icon: Navigation2 },
    { label: 'Clients', href: '/dashboard/users', icon: BarChart3 },
    { label: 'Fleets', href: '/dashboard/companies', icon: Navigation2 },
    { label: 'Shops', href: '/dashboard/ads', icon: ShoppingBag },
  ];
  return <div className="min-h-screen bg-[#F5F6F7]"><Header title="Insights" subtitle="Operations data from the live platform." /><main className="mx-auto max-w-[1500px] space-y-6 p-5 sm:p-8"><div className="flex items-end justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[.17em] text-[#D98B2B]">Platform pulse</p><h1 className="mt-1 text-[29px] font-semibold tracking-[-.05em] text-[#102B48]">What is happening now</h1><p className="mt-2 text-xs text-[#7D8B99]">Counts are live. Financial and ad summaries show the latest 100 records.</p></div><button onClick={() => void load()} disabled={loading} className="flex items-center gap-2 rounded-xl border border-[#E1E6EA] bg-white px-4 py-2.5 text-xs font-semibold text-[#334D62] disabled:opacity-50"><RefreshCw size={15} className={loading ? 'animate-spin' : ''} />Refresh</button></div>
    {errors.length > 0 && <p role="alert" className="rounded-xl border border-[#F0D9D2] bg-[#FFF6F3] p-4 text-xs text-[#A35C52]">Unavailable sources: {errors.join(', ')}. Their values are left blank.</p>}
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(card => { const Icon = card.icon; return <Link href={card.href} key={card.label} className="group rounded-[22px] border border-[#E5E9EC] bg-white p-5 shadow-[0_8px_34px_rgba(16,43,72,.04)]"><div className="flex justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#EEF3F6] text-[#2B668F]"><Icon size={20} /></span><ArrowRight size={16} className="text-[#A7B4BE] transition group-hover:translate-x-1" /></div><strong className="mt-6 block text-[29px] tracking-[-.05em] text-[#102B48]">{loading ? '…' : counts[card.label]?.toLocaleString('en-UG') ?? '—'}</strong><span className="text-xs text-[#7F8E9B]">{card.label}</span></Link>; })}</section>
    <div className="grid gap-5 xl:grid-cols-[1.3fr_.7fr]"><section className="rounded-[24px] border border-[#E5E9EC] bg-white p-6 shadow-[0_8px_34px_rgba(16,43,72,.04)]"><div className="flex items-center justify-between"><div><h2 className="text-base font-semibold text-[#102B48]">Journeys by state</h2><p className="mt-1 text-xs text-[#8795A2]">Current totals across all recorded journeys</p></div><Link href="/dashboard/journeys" className="text-xs font-semibold text-[#2E6F98]">View journeys</Link></div><div className="mt-7 space-y-5">{journeyGroups.map(group => <div key={group.label} className="grid grid-cols-[90px_1fr_55px] items-center gap-4 text-xs"><span className="font-medium text-[#52677A]">{group.label}</span><div className="h-3 overflow-hidden rounded-full bg-[#F0F3F5]"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${counts[group.label] == null ? 0 : Math.max(2, (counts[group.label] || 0) / peak * 100)}%`, backgroundColor: group.color }} /></div><strong className="text-right text-[#183650]">{counts[group.label] == null ? '—' : counts[group.label]?.toLocaleString('en-UG')}</strong></div>)}</div></section><section className="space-y-4"><div className="rounded-[24px] border border-[#E5E9EC] bg-white p-6 shadow-[0_8px_34px_rgba(16,43,72,.04)]"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#ECF4F1] text-[#1D9079]"><CircleDollarSign size={20} /></span><p className="mt-6 text-xs text-[#7E8B98]">Completed wallet actions · latest {transactions.length}</p><strong className="mt-2 block text-[27px] tracking-[-.05em] text-[#102B48]">{loading ? '…' : formatCurrency(walletMovement)}</strong><p className="mt-2 text-xs text-[#8795A2]">Sum of recorded transaction amounts in this sample. This is wallet movement, not platform revenue.</p><Link href="/dashboard/wallet" className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-[#2E6F98]">Review wallet <ArrowRight size={14} /></Link></div><div className="rounded-[24px] border border-[#E5E9EC] bg-white p-6 shadow-[0_8px_34px_rgba(16,43,72,.04)]"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#FFF3E5] text-[#C27B2A]"><ShoppingBag size={20} /></span><p className="mt-6 text-xs text-[#7E8B98]">Running ads</p><strong className="mt-2 block text-[27px] tracking-[-.05em] text-[#102B48]">{loading ? '…' : counts['Running ads']?.toLocaleString('en-UG') ?? '—'}</strong><p className="mt-2 text-xs text-[#8795A2]">{adViews.toLocaleString('en-UG')} impressions in the latest {ads.length} running ads.</p><Link href="/dashboard/ads" className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-[#2E6F98]">Review ads <ArrowRight size={14} /></Link></div></section></div>
  </main></div>;
}
