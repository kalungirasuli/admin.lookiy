'use client';

import { useCallback, useEffect, useState } from 'react';
import { ArrowUpRight, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

type Summary = {
  balance: number;
  reserved: number;
  walletId: string | null;
  revenue: Record<string, number>;
  revenueToday: number;
  revenueWeek: number;
  revenueAllTime: number;
  counts: Record<string, number>;
  recentTransactions: Array<Record<string, any>>;
};
type Method = { _id: string; type?: string; provider?: string; accountNumber?: string; isDefault?: boolean };

const streams: Array<{ key: string; label: string }> = [
  { key: 'verification', label: 'Rider verification' },
  { key: 'weekly', label: 'Rider weekly fees' },
  { key: 'hooking', label: 'Fleet hooking' },
  { key: 'adCampaign', label: 'Ad campaigns' },
  { key: 'adShop', label: 'Shop map pins' },
];
const moment = (value: unknown) => value ? new Date(String(value)).toLocaleString('en-UG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';
const Card = ({ label, value, hint }: { label: string; value: string; hint?: string }) => <div className="rounded-[22px] border border-[#E5E9EC] bg-white p-5 shadow-[0_8px_34px_rgba(16,43,72,.04)]"><p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#758394]">{label}</p><p className="mt-2 text-2xl font-semibold tracking-[-.04em] text-[#102B48]">{value}</p>{hint && <p className="mt-1 text-[11px] text-[#8794A3]">{hint}</p>}</div>;

export default function SystemWalletPanel() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [methods, setMethods] = useState<Method[]>([]);
  const [methodId, setMethodId] = useState('');
  const [amount, setAmount] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    setBusy(true); setError('');
    try {
      const [wallet, payoutMethods] = await Promise.all([
        api.getSystemWallet() as Promise<{ data: Summary }>,
        api.adminGet<{ data: Method[] }>('/payments/methods').catch(() => ({ data: [] as Method[] })),
      ]);
      setSummary(wallet?.data || null);
      const active = (payoutMethods?.data || []).filter(method => String(method.type).toUpperCase() === 'MOBILE_MONEY');
      setMethods(active);
      setMethodId(previous => previous || active.find(method => method.isDefault)?._id || active[0]?._id || '');
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not load the system wallet.');
    } finally { setBusy(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function payout() {
    setSubmitting(true); setError(''); setNotice('');
    try {
      if (!methodId) throw new Error('Add a mobile money number to your account before paying out.');
      const value = Number(amount);
      if (!Number.isFinite(value) || value < 1000) throw new Error('Enter a payout of at least 1,000 UGX.');
      const response = await api.adminSystemWithdraw({ amount: value, paymentMethodId: methodId, twoFactorCode: code.trim() }) as { data: { transactionId: string; status: string } };
      setNotice(`Payout of ${formatCurrency(value)} submitted · ${response?.data?.status || 'PROCESSING'}.`);
      setAmount(''); setCode('');
      await load();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Payout failed.');
    } finally { setSubmitting(false); }
  }

  if (busy && !summary) return <div className="rounded-[24px] border border-[#E5E9EC] bg-white p-12 text-center text-xs text-[#8090A0]">Loading system wallet…</div>;
  if (!summary) return <div className="rounded-[24px] border border-[#E5E9EC] bg-white p-12 text-center"><p className="text-sm font-semibold text-[#A94D4B]">Could not load the system wallet</p>{error && <p className="mt-2 text-xs text-[#7B8998]">{error}</p>}<button onClick={() => void load()} className="mt-5 rounded-xl bg-[#102B48] px-4 py-2 text-xs font-semibold text-white">Try again</button></div>;

  const revenue = summary.revenue || {};
  return <div className="space-y-6">
    <div className="flex items-center justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-[.17em] text-[#E0912B]">Platform revenue</p><h2 className="mt-1 text-[22px] font-semibold tracking-[-.04em] text-[#102B48]">System wallet</h2><p className="mt-1 text-xs text-[#728093]">Fees collected by the platform. Payouts are sent to your saved mobile money number with a 2FA code.</p></div><button onClick={() => void load()} disabled={busy} className="flex items-center gap-2 rounded-xl border border-[#E1E6EA] bg-white px-4 py-2.5 text-xs font-semibold text-[#334D62] hover:bg-[#F9FAFB] disabled:opacity-50"><RefreshCw size={15} />Refresh</button></div>

    <div className="grid gap-4 sm:grid-cols-3"><Card label="Available balance" value={formatCurrency(Math.max(0, (summary.balance || 0) - (summary.reserved || 0)))} /><Card label="Reserved" value={formatCurrency(summary.reserved || 0)} hint="Held for in-flight payouts" /><Card label="All-time revenue" value={formatCurrency(summary.revenueAllTime || 0)} /></div>

    <section className="rounded-[24px] border border-[#E5E9EC] bg-white p-5 shadow-[0_8px_34px_rgba(16,43,72,.04)]"><div className="mb-4 flex items-center justify-between"><span className="text-[11px] font-bold uppercase tracking-[.14em] text-[#758394]">Revenue split</span><span className="text-xs text-[#8794A3]">Today {formatCurrency(summary.revenueToday || 0)} · Week {formatCurrency(summary.revenueWeek || 0)}</span></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{streams.map(stream => <div key={stream.key} className="rounded-2xl border border-[#EDF0F2] bg-[#FAFBFC] p-4"><p className="text-xs text-[#758394]">{stream.label}</p><p className="mt-1 text-lg font-semibold text-[#102B48]">{formatCurrency(revenue[stream.key] || 0)}</p><p className="mt-1 text-[11px] text-[#8794A3]">{summary.counts?.[stream.key] || 0} payments</p></div>)}<div className="rounded-2xl border border-[#102B48] bg-[#102B48] p-4 text-white"><p className="text-xs text-[#C4D2DE]">Total</p><p className="mt-1 text-lg font-semibold">{formatCurrency(revenue.total || summary.revenueAllTime || 0)}</p><p className="mt-1 text-[11px] text-[#9FB2C2]">All streams</p></div></div></section>

    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-[24px] border border-[#E5E9EC] bg-white p-5 shadow-[0_8px_34px_rgba(16,43,72,.04)]"><h3 className="text-sm font-semibold text-[#102B48]">Owner payout</h3><p className="mt-1 text-xs text-[#6E7D8C]">Withdraw platform revenue to your own mobile money number.</p>
        <div className="mt-4 space-y-3">
          <label className="block text-[11px] text-[#718092]">Mobile money number<select value={methodId} onChange={event => setMethodId(event.target.value)} className="mt-1 w-full rounded-xl border border-[#E2E8ED] p-2.5 text-xs">{methods.map(method => <option key={method._id} value={method._id}>{[method.provider, method.accountNumber].filter(Boolean).join(' · ') || method._id.slice(-8)}</option>)}{!methods.length && <option value="">No mobile money number on file</option>}</select></label>
          <label className="block text-[11px] text-[#718092]">Amount (UGX)<input value={amount} inputMode="numeric" placeholder="e.g. 100000" onChange={event => setAmount(event.target.value.replace(/[^0-9]/g, ''))} className="mt-1 w-full rounded-xl border border-[#E2E8ED] p-2.5 text-xs" /></label>
          <label className="block text-[11px] text-[#718092]">2FA code<input value={code} inputMode="numeric" placeholder="6-digit code" maxLength={6} onChange={event => setCode(event.target.value.replace(/[^0-9]/g, ''))} className="mt-1 w-full rounded-xl border border-[#E2E8ED] p-2.5 text-xs" /></label>
          <button disabled={submitting || !methodId || !amount || code.length < 6} onClick={() => void payout()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#102B48] p-3 text-xs font-semibold text-white disabled:opacity-50"><ArrowUpRight size={15} />{submitting ? 'Submitting…' : 'Send payout'}</button>
          {notice && <p role="status" className="rounded-xl bg-[#EAF5EF] p-3 text-xs text-[#24634A]">{notice}</p>}{error && <p role="alert" className="rounded-xl bg-[#FFF0EE] p-3 text-xs text-[#A64949]">{error}</p>}
        </div>
      </section>

      <section className="rounded-[24px] border border-[#E5E9EC] bg-white p-5 shadow-[0_8px_34px_rgba(16,43,72,.04)]"><h3 className="text-sm font-semibold text-[#102B48]">Recent collections</h3><div className="mt-4 space-y-2">{(summary.recentTransactions || []).map(transaction => <div key={String(transaction._id)} className="flex items-center justify-between gap-3 rounded-xl border border-[#EDF0F2] p-3 text-xs"><span className="min-w-0"><strong className="block truncate text-[#203B53]">{transaction.description || transaction.type}</strong><span className="mt-1 block text-[#8794A2]">{moment(transaction.createdAt)} · {transaction.status}</span></span><span className="shrink-0 font-semibold text-[#1B8063]">{formatCurrency(transaction.amount || 0)}</span></div>)}{!(summary.recentTransactions || []).length && <p className="text-xs text-[#8894A1]">No platform revenue collected yet.</p>}</div></section>
    </div>
  </div>;
}
