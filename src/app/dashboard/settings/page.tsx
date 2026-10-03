'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { KeyRound, Laptop, LockKeyhole, MapPin, RefreshCw, ShieldCheck, Trash2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import { api } from '@/lib/api';

type Account = { firstName?: string; lastName?: string; email?: string; phone?: string; roles?: string[]; twoFactorEnabled?: boolean; hasPassword?: boolean };
type Session = { sessionId: string; deviceName?: string; platform?: string; ipAddress?: string; lastActivityAt?: string; createdAt?: string };
const when = (value?: string) => value ? new Date(value).toLocaleString('en-UG', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
export default function SettingsPage() {
  const [account, setAccount] = useState<Account | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const load = useCallback(async () => {
    setBusy(true); setError('');
    const [user, devices] = await Promise.allSettled([api.getMe(), api.adminGet('/auth/sessions')]);
    if (user.status === 'fulfilled') setAccount(user.value?.data || null); else setError('Could not load your account.');
    if (devices.status === 'fulfilled') setSessions(Array.isArray(devices.value?.data) ? devices.value.data : []); else setError('Could not load device sessions.');
    setBusy(false);
  }, []);
  useEffect(() => { void load(); }, [load]);
  async function changePassword(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    try { await api.adminPost('/auth/change-password', { currentPassword, newPassword }); setMessage('Password changed.'); setCurrentPassword(''); setNewPassword(''); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Could not change password.'); }
    finally { setBusy(false); }
  }
  async function revoke(sessionId: string) {
    if (!window.confirm('Sign out this device?')) return;
    setBusy(true); setError('');
    try { await api.adminDelete(`/auth/sessions/${encodeURIComponent(sessionId)}`); setSessions(previous => previous.filter(session => session.sessionId !== sessionId)); setMessage('Device session revoked.'); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Could not revoke session.'); }
    finally { setBusy(false); }
  }
  return <div className="min-h-screen bg-[#F5F6F7]"><Header title="Settings" subtitle="Your control center account and security." /><main className="mx-auto max-w-[1120px] space-y-6 p-5 sm:p-8"><div className="flex items-end justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[.17em] text-[#D98B2B]">Personal workspace</p><h1 className="mt-1 text-[29px] font-semibold tracking-[-.05em] text-[#102B48]">Account & security</h1></div><button onClick={() => void load()} disabled={busy} className="flex items-center gap-2 rounded-xl border border-[#E1E6EA] bg-white px-4 py-2.5 text-xs font-semibold text-[#334D62] disabled:opacity-50"><RefreshCw size={15} />Refresh</button></div>{error && <p role="alert" className="rounded-xl border border-[#F0D9D2] bg-[#FFF6F3] p-4 text-xs text-[#A35C52]">{error}</p>}{message && <p role="status" className="rounded-xl bg-[#E8F5F0] p-4 text-xs text-[#248066]">{message}</p>}
  <div className="grid gap-5 lg:grid-cols-2"><section className="rounded-[24px] border border-[#E5E9EC] bg-white p-6 shadow-sm"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#EEF3F6] text-[#2D6E93]"><ShieldCheck size={20} /></span><h2 className="mt-5 text-lg font-semibold text-[#102B48]">Team account</h2><p className="mt-1 text-xs text-[#8393A1]">Identity and access attached to your sign-in.</p><dl className="mt-6 space-y-4 text-xs">{[['Name', [account?.firstName, account?.lastName].filter(Boolean).join(' ')], ['Email', account?.email], ['Phone', account?.phone], ['Access', account?.roles?.join(' · ')], ['Two-factor authentication', account?.twoFactorEnabled ? 'Enabled' : 'Not enabled']].map(([label, value]) => <div key={label} className="flex justify-between gap-4 border-b border-[#EDF0F2] pb-3"><dt className="text-[#7F8E9D]">{label}</dt><dd className="text-right font-semibold text-[#28445B]">{value || '—'}</dd></div>)}</dl></section>
  <section className="rounded-[24px] border border-[#E5E9EC] bg-white p-6 shadow-sm"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#FFF3E4] text-[#BF7B2E]"><LockKeyhole size={20} /></span><h2 className="mt-5 text-lg font-semibold text-[#102B48]">Change password</h2><p className="mt-1 text-xs text-[#8393A1]">Use your current password to protect staff access.</p><form onSubmit={changePassword} className="mt-6 space-y-4"><label className="block text-xs font-semibold text-[#53677A]">Current password<input type="password" autoComplete="current-password" required value={currentPassword} onChange={event => setCurrentPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-[#E3E8EC] bg-[#FAFBFC] p-3 text-sm outline-none focus:border-[#9FB8C9]" /></label><label className="block text-xs font-semibold text-[#53677A]">New password<input type="password" autoComplete="new-password" minLength={8} required value={newPassword} onChange={event => setNewPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-[#E3E8EC] bg-[#FAFBFC] p-3 text-sm outline-none focus:border-[#9FB8C9]" /></label><button disabled={busy} className="rounded-xl bg-[#102B48] px-5 py-3 text-xs font-semibold text-white disabled:opacity-50">Save password</button></form></section></div>
  <section className="rounded-[24px] border border-[#E5E9EC] bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#EEF3F6] text-[#2D6E93]"><Laptop size={20} /></span><div><h2 className="text-lg font-semibold text-[#102B48]">Signed-in devices</h2><p className="text-xs text-[#8393A1]">Revoke a session you no longer recognize.</p></div></div><div className="mt-5 divide-y divide-[#EDF0F2]">{sessions.length ? sessions.map(session => <div key={session.sessionId} className="flex items-center gap-4 py-4"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#F4F6F8] text-[#6B7D8F]"><KeyRound size={18} /></span><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-[#2B4258]">{session.deviceName || session.platform || 'Unknown device'}</p><p className="mt-1 text-[11px] text-[#8996A2]">{session.ipAddress || 'IP unavailable'} · Last active {when(session.lastActivityAt)}</p></div><button onClick={() => void revoke(session.sessionId)} disabled={busy} aria-label="Revoke session" className="rounded-xl border border-[#E7E9EC] p-2.5 text-[#A65755] disabled:opacity-50"><Trash2 size={16} /></button></div>) : <p className="py-6 text-xs text-[#8996A2]">No active sessions returned.</p>}</div></section>
  <section className="rounded-[24px] border border-[#E5E9EC] bg-white p-6 shadow-sm"><div className="flex items-center gap-3 text-[#476680]"><MapPin size={18} /><strong className="text-sm text-[#102B48]">Map integration</strong></div><p className="mt-3 text-xs leading-6 text-[#81909E]">Google Maps displays all live rider positions and the available journey paths on the tracking screen. Configure a browser-restricted Maps JavaScript key in the admin environment.</p><p className="mt-2 text-xs font-semibold text-[#4D6477]">Status: {process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ? 'Key provided' : 'Key not configured'}</p></section>
  </main></div>;
}
