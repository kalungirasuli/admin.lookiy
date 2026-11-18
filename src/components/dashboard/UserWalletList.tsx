'use client';
import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

type Account = { _id: string; firstName?: string; lastName?: string; email?: string; phone?: string };
type Wallet = { _id: string; userId: string; walletType: string; balance: number; reserved?: number; [key: string]: unknown };
const labels: Record<string, string> = { USER: 'Personal wallet', OPERATOR: 'Rider wallet', BUSINESS: 'Business visibility', AD_AIRTIME: 'Advertising airtime', FLEET: 'Fleet wallet' };
const accountName = (user: Account) => [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email || user.phone || 'Unnamed account';

export default function UserWalletList({ revision = 0, onSelect }: { revision?: number; onSelect: (wallet: Wallet) => void }) {
  const [users, setUsers] = useState<Account[]>([]), [total, setTotal] = useState(0), [page, setPage] = useState(1), [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true), [error, setError] = useState(''), [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [wallets, setWallets] = useState<Record<string, { items?: Wallet[]; error?: string }>>({});
  const generation = useRef(0), pending = useRef(new Set<string>());
  useEffect(() => {
    const version = ++generation.current, controller = new AbortController();
    setLoading(true); setError(''); setExpanded({}); setWallets({}); pending.current.clear();
    const timer = setTimeout(() => {
      const deadline = setTimeout(() => controller.abort(), 10000);
      void api.adminGet<{ data: Account[]; pagination: { total: number } }>(`/auth/admin/users?${new URLSearchParams({ page: String(page), limit: '25', search: search.trim() })}`, { signal: controller.signal })
        .then(result => { if (version === generation.current) { setUsers(result.data); setTotal(result.pagination.total); } })
        .catch(() => { if (version === generation.current) setError('Could not load accounts. Refresh to try again.'); })
        .finally(() => { clearTimeout(deadline); if (version === generation.current) setLoading(false); });
    }, 200);
    return () => { generation.current++; clearTimeout(timer); controller.abort(); };
  }, [page, search, revision]);
  async function open(user: Account, retry = false) {
    setExpanded(previous => ({ ...previous, [user._id]: retry || !previous[user._id] }));
    if ((!retry && wallets[user._id]?.items) || pending.current.has(user._id)) return;
    const version = generation.current;
    const controller = new AbortController(), deadline = setTimeout(() => controller.abort(), 10000);
    pending.current.add(user._id); setWallets(previous => ({ ...previous, [user._id]: {} }));
    try {
      const result = await api.adminGet<{ data: Wallet[] }>(`/wallet/admin/wallets?userId=${encodeURIComponent(user._id)}&limit=100`, { signal: controller.signal });
      if (version === generation.current) setWallets(previous => ({ ...previous, [user._id]: { items: result.data } }));
    } catch {
      if (version === generation.current) setWallets(previous => ({ ...previous, [user._id]: { error: 'Could not load these wallets.' } }));
    } finally { clearTimeout(deadline); if (version === generation.current) pending.current.delete(user._id); }
  }
  return <section className="overflow-hidden rounded-2xl border bg-white">
    <div className="border-b p-5"><label className="text-sm font-semibold">Find a user<input aria-label="Find wallet owner" value={search} onChange={event => { setSearch(event.target.value); setPage(1); }} placeholder="Name, email or phone" className="mt-2 block min-h-11 w-full max-w-lg rounded-xl border px-3 text-sm" /></label><p className="mt-2 text-xs text-slate-500">Expand a user to see their wallets. Balances remain separate for each wallet.</p></div>
    {loading ? <p role="status" className="p-6 text-sm text-slate-500">Loading users…</p> : error ? <p role="alert" className="p-6 text-sm text-red-700">{error}</p> : !users.length ? <p className="p-6 text-sm text-slate-500">No matching users.</p> : users.map(user => <div className="border-b last:border-b-0" key={user._id}>
      <button aria-expanded={!!expanded[user._id]} aria-controls={'wallets-' + user._id} onClick={() => void open(user)} className="flex min-h-16 w-full items-center justify-between gap-4 p-5 text-left hover:bg-slate-50"><span><strong className="block text-sm">{accountName(user)}</strong><span className="mt-1 block text-xs text-slate-500">{user._id}{user.phone ? ' · ' + user.phone : ''}</span></span><span aria-hidden>{expanded[user._id] ? '−' : '+'}</span></button>
      {expanded[user._id] && <div id={'wallets-' + user._id} className="space-y-2 bg-slate-50 px-5 pb-5 pt-2">{wallets[user._id]?.error ? <button className="text-sm text-red-700" onClick={() => void open(user, true)}>{wallets[user._id].error} Retry</button> : !wallets[user._id]?.items ? <p role="status" className="text-sm text-slate-500">Loading wallets…</p> : !wallets[user._id].items!.length ? <p className="text-sm text-slate-500">No wallets created for this user yet.</p> : wallets[user._id].items!.map(wallet => <button key={wallet._id} onClick={() => onSelect({ ...wallet, ownerName: accountName(user) })} className="flex w-full items-center justify-between gap-4 rounded-xl border bg-white p-4 text-left"><span><strong className="block text-sm">{labels[wallet.walletType] || wallet.walletType.replaceAll('_', ' ')}</strong><span className="mt-1 block text-xs text-slate-500">{wallet._id}</span></span><span className="text-sm font-semibold">{formatCurrency(wallet.balance)}</span></button>)}</div>}
    </div>)}
    <div className="flex items-center justify-between gap-3 border-t p-4 text-sm"><button disabled={page <= 1 || loading} onClick={() => setPage(value => value - 1)} className="min-h-11 rounded-xl border px-4 disabled:opacity-40">Previous</button><span>{total} users · Page {page}</span><button disabled={page * 25 >= total || loading} onClick={() => setPage(value => value + 1)} className="min-h-11 rounded-xl border px-4 disabled:opacity-40">Next</button></div>
  </section>;
}
