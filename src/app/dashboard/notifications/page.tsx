'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Bell, CircleDollarSign, Navigation2, RefreshCw, ShieldCheck } from 'lucide-react';
import Header from '@/components/layout/Header';
import { api } from '@/lib/api';

type Activity = { id: string; title: string; detail: string; when?: string; href: string; type: 'journey' | 'verification' | 'wallet' };
const relative = (value?: string) => value ? new Date(value).toLocaleString('en-UG', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
const kinds = [{ key: 'all', label: 'All' }, { key: 'journey', label: 'Journeys' }, { key: 'verification', label: 'Verification' }, { key: 'wallet', label: 'Wallet' }];
export default function NotificationsPage() {
  const [items, setItems] = useState<Activity[]>([]);
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setLoading(true); setError('');
    const results = await Promise.allSettled([
      api.adminGet('/journeys/admin/all?limit=20'),
      api.adminGet('/verification/admin/all?status=PENDING&limit=20'),
      api.adminGet('/wallet/admin/transactions?limit=20'),
    ]);
    const next: Activity[] = [];
    if (results[0].status === 'fulfilled') (results[0].value?.data || []).forEach((record: any) => next.push({ id: `journey:${record._id}`, title: `Journey ${String(record.status || '').replace(/_/g, ' ').toLowerCase()}`, detail: `${record.pickupLocation?.address || 'Pickup'} → ${record.destination?.address || 'Destination'}`, when: record.updatedAt || record.createdAt, href: '/dashboard/journeys', type: 'journey' }));
    if (results[1].status === 'fulfilled') (results[1].value?.data || []).forEach((record: any) => next.push({ id: `verification:${record._id}`, title: 'Verification needs review', detail: `${record.type || 'Identity'} · ${String(record.userId || '').slice(-8)}`, when: record.submittedAt || record.createdAt, href: '/dashboard/verifications', type: 'verification' }));
    if (results[2].status === 'fulfilled') (results[2].value?.data || []).forEach((record: any) => next.push({ id: `wallet:${record._id}`, title: `${String(record.type || 'Wallet action').replace(/_/g, ' ').toLowerCase()}`, detail: record.description || `${Number(record.amount || 0).toLocaleString('en-UG')} UGX · ${record.status || ''}`, when: record.createdAt, href: '/dashboard/wallet', type: 'wallet' }));
    next.sort((a, b) => new Date(b.when || 0).getTime() - new Date(a.when || 0).getTime());
    setItems(next);
    if (results.some(result => result.status === 'rejected')) setError('Some activity sources are unavailable. Available records are shown.');
    setLoading(false);
  }, []);
  useEffect(() => { void load(); }, [load]);
  const visible = useMemo(() => items.filter(item => tab === 'all' || item.type === tab), [items, tab]);
  const icon = { journey: Navigation2, verification: ShieldCheck, wallet: CircleDollarSign };
  return <div className="min-h-screen bg-[#F5F6F7]"><Header title="Activity" subtitle="Recent journey, verification and wallet records." /><main className="mx-auto max-w-[1050px] space-y-5 p-5 sm:p-8"><div className="flex items-end justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[.17em] text-[#D98B2B]">Operations feed</p><h1 className="mt-1 text-[29px] font-semibold tracking-[-.05em] text-[#102B48]">Latest activity</h1><p className="mt-2 text-xs text-[#83919F]">A live record feed. Use the source pages for full lists and actions.</p></div><button onClick={() => void load()} disabled={loading} className="flex items-center gap-2 rounded-xl border border-[#E1E6EA] bg-white px-4 py-2.5 text-xs font-semibold text-[#334D62] disabled:opacity-50"><RefreshCw size={15} className={loading ? 'animate-spin' : ''} />Refresh</button></div>{error && <p role="alert" className="rounded-xl border border-[#F0D9D2] bg-[#FFF6F3] p-4 text-xs text-[#A35C52]">{error}</p>}<div className="flex gap-2 overflow-x-auto rounded-[21px] border border-[#E5E9EC] bg-white p-2">{kinds.map(kind => <button key={kind.key} onClick={() => setTab(kind.key)} className={`rounded-xl px-4 py-2.5 text-xs font-semibold ${tab === kind.key ? 'bg-[#102B48] text-white' : 'text-[#6D7D8D] hover:bg-[#F2F5F7]'}`}>{kind.label}</button>)}</div><section className="overflow-hidden rounded-[24px] border border-[#E5E9EC] bg-white shadow-sm">{loading ? <p className="p-12 text-center text-xs text-[#8B98A4]">Loading activity…</p> : visible.length ? <div className="divide-y divide-[#EDF0F2]">{visible.map(item => { const Icon = icon[item.type]; return <Link href={item.href} key={item.id} className="flex items-center gap-4 p-5 transition hover:bg-[#FAFBFC]"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#EEF3F6] text-[#3D718F]"><Icon size={18} /></span><span className="min-w-0 flex-1"><strong className="block truncate text-sm text-[#213A51]">{item.title}</strong><span className="mt-1 block truncate text-xs text-[#81909E]">{item.detail}</span></span><span className="hidden text-[11px] text-[#9AA5AF] sm:block">{relative(item.when)}</span><ArrowRight size={15} className="text-[#AEB9C1]" /></Link>; })}</div> : <div className="p-14 text-center"><Bell size={22} className="mx-auto text-[#9EACB8]" /><p className="mt-3 text-sm font-semibold text-[#50667A]">No activity in this view</p></div>}</section></main></div>;
}
