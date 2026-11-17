'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Loader2, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';

type Invitation = { email: string; firstName: string; lastName: string; hasPassword: boolean };

export default function AcceptStaffInvitePage() {
  const [token, setToken] = useState('');
  const [invite, setInvite] = useState<Invitation>();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const submitting = useRef(false);

  useEffect(() => {
    let active = true;
    const value = new URLSearchParams(window.location.hash.slice(1)).get('token') || '';
    setToken(value);
    if (!/^[a-f0-9]{64}$/.test(value)) {
      setLoading(false);
      setError('Open the invitation link from your email to continue.');
      return;
    }
    api.adminPost<{ data: Invitation }>('/auth/staff-invitations/preview', { token: value })
      .then(result => { if (active) setInvite(result.data); })
      .catch(error => { if (active) setError(error instanceof Error ? error.message : 'Could not check this invitation.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function accept(event: FormEvent) {
    event.preventDefault();
    if (submitting.current || !invite) return;
    if (!invite.hasPassword && password !== confirm) { setError('The passwords do not match.'); return; }
    submitting.current = true;
    setBusy(true);
    setError('');
    try {
      await api.adminPost('/auth/staff-invitations/accept', { token, password });
      window.history.replaceState(null, '', window.location.pathname);
      setToken('');
      setPassword('');
      setConfirm('');
      setDone(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Could not accept this invitation. Please retry.');
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  return <main className="flex min-h-[100svh] items-center justify-center bg-[#F5F6F7] p-5 text-[#18354F]">
    <div className="w-full max-w-md rounded-3xl border border-[#E5E9EC] bg-white p-7 shadow-sm">
      <Link href="/login" className="text-3xl font-semibold tracking-tight">Lookiy</Link>
      <ShieldCheck className="mt-7 text-[#18354F]" size={30} aria-hidden />
      <h1 className="mt-4 text-2xl font-semibold">{done ? 'Welcome to the team' : 'Accept your staff invitation'}</h1>
      {loading && <p role="status" className="mt-4 flex items-center gap-2 text-sm"><Loader2 size={16} className="animate-spin" aria-hidden />Checking your invitation…</p>}
      {done ? <>
        <p className="mt-4 text-sm leading-6 text-slate-600">Your staff access is ready. Sign in with your Lookiy email or phone and password.</p>
        <Link href="/login" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#102B48] px-5 text-sm font-semibold text-white">Sign in to the dashboard</Link>
      </> : invite && <form onSubmit={accept} className="mt-4 space-y-5">
        <p className="text-sm leading-6 text-slate-600">Hi {invite.firstName}. This invitation is for <strong className="break-all">{invite.email}</strong>.</p>
        <p className="text-sm leading-6 text-slate-600">{invite.hasPassword ? 'Enter your current Lookiy password to accept.' : 'Create your Lookiy password. Use it for the dashboard, client and rider accounts.'}</p>
        <label className="block text-sm">{invite.hasPassword ? 'Lookiy password' : 'Create password'}
          <input type="password" required autoComplete={invite.hasPassword ? 'current-password' : 'new-password'} minLength={invite.hasPassword ? 1 : 8} maxLength={128} value={password} onChange={event => setPassword(event.target.value)} disabled={busy}
            className="mt-2 block min-h-12 w-full rounded-xl border border-[#DCE3E8] px-3 outline-none focus:border-[#18354F]" />
        </label>
        {!invite.hasPassword && <label className="block text-sm">Confirm password
          <input type="password" required autoComplete="new-password" minLength={8} maxLength={128} value={confirm} onChange={event => setConfirm(event.target.value)} disabled={busy}
            className="mt-2 block min-h-12 w-full rounded-xl border border-[#DCE3E8] px-3 outline-none focus:border-[#18354F]" />
        </label>}
        <button disabled={busy} type="submit" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#102B48] px-4 text-sm font-semibold text-white disabled:opacity-50">
          {busy && <Loader2 size={16} className="animate-spin" aria-hidden />}{busy ? 'Accepting invitation…' : 'Accept invitation'}
        </button>
      </form>}
      {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
      {!done && !loading && !invite && <Link href="/login" className="mt-5 inline-block text-sm underline">Back to sign in</Link>}
    </div>
  </main>;
}
