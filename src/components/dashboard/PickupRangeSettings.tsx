'use client';
import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
type Band = { maxFareUGX: number | null; radiusKm: number };
type Policy = { bands: Band[]; defaults: Band[]; revision: number };
export default function PickupRangeSettings() {
  const [policy, setPolicy] = useState<Policy | null>(null), [bands, setBands] = useState<Band[]>([]);
  const [error, setError] = useState(''), [message, setMessage] = useState(''), [busy, setBusy] = useState(false);
  const lock = useRef(false), generation = useRef(0);
  async function load() {
    const version = ++generation.current; setError(''); setBusy(true);
    try { const result = await api.adminGet<{ data: Policy }>('/geo/admin/pickup-ranges'); if (version === generation.current) { setPolicy(result.data); setBands(result.data.bands); } }
    catch (failure) { if (version === generation.current) setError(failure instanceof Error ? failure.message : 'Could not load pickup ranges'); }
    finally { if (version === generation.current) setBusy(false); }
  }
  useEffect(() => { void load(); const current = generation; return () => { current.current++; }; }, []);
  async function save() {
    if (!policy || lock.current) return;
    lock.current = true; setBusy(true); setError(''); setMessage('');
    try { const result = await api.adminPut<{ data: Omit<Policy, 'defaults'> }>('/geo/admin/pickup-ranges', { bands, revision: policy.revision }); setPolicy({ ...result.data, defaults: policy.defaults }); setBands(result.data.bands); setMessage('Pickup ranges saved. New availability checks and bookings use these settings.'); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Could not save pickup ranges'); }
    finally { lock.current = false; setBusy(false); }
  }
  return <section className="rounded-2xl border bg-white p-5 sm:p-6"><h2 className="text-lg font-semibold">Fare-based pickup ranges</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Applies to bodas, cars, vans and trucks, using the journey fare before a pickup surcharge. Normal pickup is capped at 2 km. Premium cars alone can extend up to 10 km when the client accepts the 10% pickup fee.</p>
    {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}{message && <p role="status" className="mt-4 text-sm text-emerald-700">{message}</p>}
    {!policy ? <button disabled={busy} onClick={() => void load()} className="mt-4 min-h-11 rounded-xl border px-4 text-sm">{busy ? 'Loading pickup defaults…' : 'Retry pickup ranges'}</button> : <>
      <fieldset disabled={busy} className="mt-5"><div className="grid grid-cols-2 gap-4 border-b pb-3 text-xs font-semibold text-slate-500"><span>Journey fare up to · UGX</span><span>Pickup radius · km</span></div>{bands.map((band, index) => <div key={index} className="grid grid-cols-2 items-center gap-4 border-b py-3">{band.maxFareUGX === null ? <span className="text-sm">All higher fares</span> : <input aria-label={`Fare upper limit ${index + 1}`} type="number" min="1" max="10000000" step="1" value={band.maxFareUGX} onChange={event => setBands(previous => previous.map((row, i) => i === index ? { ...row, maxFareUGX: Number(event.target.value) } : row))} className="min-h-11 rounded-xl border px-3 text-sm" />}<input aria-label={`Pickup radius ${index + 1}`} type="number" min="0.1" max="2" step="0.1" value={band.radiusKm} onChange={event => setBands(previous => previous.map((row, i) => i === index ? { ...row, radiusKm: Number(event.target.value) } : row))} className="min-h-11 rounded-xl border px-3 text-sm" /></div>)}<p className="mt-3 text-xs text-slate-500">Each band starts above the previous upper fare limit. The first includes all lower fares. Keep limits and radii in increasing order.</p></fieldset>
      <div className="mt-5 flex flex-wrap gap-3"><button disabled={busy} onClick={() => void save()} className="min-h-11 rounded-xl bg-[#18334E] px-4 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Saving…' : 'Save pickup ranges'}</button><button disabled={busy} onClick={() => { setBands(policy.defaults.map(band => ({ ...band }))); setMessage('Default ranges restored in this form. Save to apply them.'); }} className="min-h-11 rounded-xl border px-4 text-sm">Restore agreed defaults</button><button disabled={busy} onClick={() => void load()} className="min-h-11 rounded-xl border px-4 text-sm">Reload saved ranges</button></div>
    </>}
  </section>;
}
