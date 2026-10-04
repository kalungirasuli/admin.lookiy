'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const response = tempToken ? await api.verifyTwoFactor(tempToken, code) : await api.login(email.trim(), password);
      const result = response?.data || response;
      if (result?.requiresTwoFactor && result?.tempToken) { setTempToken(result.tempToken); return; }
      const roles = (result?.user?.roles || []).map((role: string) => String(role).toUpperCase());
      if (!roles.includes('ADMIN') && !roles.includes('STAFF')) throw new Error('This account cannot access the control center.');
      if (!result?.accessToken) throw new Error('Sign in did not return an access token.');
      api.setToken(result.accessToken);
      router.replace('/dashboard');
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Sign in failed.'); }
    finally { setBusy(false); }
  }
  return <main className="min-h-screen bg-[#F5F6F7] p-3 md:p-5 lg:p-7"><div className="mx-auto grid min-h-[calc(100vh-24px)] max-w-[1440px] overflow-hidden rounded-[32px] border border-[#E3E7EB] bg-white shadow-[0_18px_80px_rgba(16,43,72,.08)] lg:grid-cols-[.92fr_1fr]">
    <section className="relative hidden flex-col justify-between overflow-hidden bg-[#102B48] p-12 text-white lg:flex"><div className="absolute -right-40 top-1/4 h-[440px] w-[440px] rounded-full border border-white/10" /><div className="absolute -right-20 top-[20%] h-[440px] w-[440px] rounded-full border border-white/10" /><div className="relative text-[31px] font-semibold tracking-[-.065em]">Look<span className="text-[#F59B24]">i</span>y<span className="ml-3 align-middle text-[10px] font-bold uppercase tracking-[.25em] text-white/45">Control</span></div><div className="relative max-w-lg"><span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs"><ShieldCheck size={15} /> Private operations workspace</span><h1 className="mt-8 text-5xl font-semibold leading-[1.08] tracking-[-.055em]">One clear view of every journey.</h1><p className="mt-5 max-w-md text-sm leading-7 text-[#B9C8D7]">Track live rides, care for riders and clients, review fleets and shops, and follow every settlement from one place.</p></div><p className="relative text-xs text-white/45">Lookiy · Uganda</p></section>
    <section className="flex items-center justify-center p-7 sm:p-12 lg:p-20"><div className="w-full max-w-[420px]"><div className="mb-12 text-3xl font-semibold tracking-[-.065em] text-[#102B48] lg:hidden">Look<span className="text-[#F59B24]">i</span>y</div><div className="mb-9 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EDF2F6] text-[#102B48]"><LockKeyhole size={22} /></div><p className="text-xs font-semibold uppercase tracking-[.19em] text-[#E39024]">Admin access</p><h2 className="mt-2 text-[34px] font-semibold tracking-[-.05em] text-[#102B48]">{tempToken ? 'Check your code' : 'Welcome back'}</h2><p className="mt-2 text-sm leading-6 text-[#6A7685]">{tempToken ? 'Enter the code from your authenticator to continue.' : 'Sign in with your Lookiy staff account.'}</p><form onSubmit={submit} className="mt-9 space-y-5">{tempToken ? <label className="block text-xs font-semibold text-[#465264]">Authentication code<input autoFocus inputMode="numeric" autoComplete="one-time-code" value={code} onChange={event => setCode(event.target.value)} required className="mt-2 h-13 w-full rounded-2xl border border-[#E1E6EB] bg-[#F9FAFB] px-4 py-3 text-base tracking-[.25em] outline-none focus:border-[#8DAFC8]" /></label> : <><label className="block text-xs font-semibold text-[#465264]">Email address<input type="email" autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} required placeholder="you@lookiy.com" className="mt-2 w-full rounded-2xl border border-[#E1E6EB] bg-[#F9FAFB] px-4 py-3 text-sm outline-none focus:border-[#8DAFC8]" /></label><label className="block text-xs font-semibold text-[#465264]">Password<div className="relative mt-2"><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required className="w-full rounded-2xl border border-[#E1E6EB] bg-[#F9FAFB] px-4 py-3 pr-12 text-sm outline-none focus:border-[#8DAFC8]" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[#758295]">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label></>}{error && <p role="alert" className="rounded-xl bg-[#FFF1EF] px-4 py-3 text-xs text-[#B64043]">{error}</p>}<button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#102B48] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#183E62] disabled:opacity-50">{busy ? 'Checking…' : tempToken ? 'Verify code' : 'Sign in'}<ArrowRight size={17} /></button></form>{tempToken && <button onClick={() => { setTempToken(''); setCode(''); setError(''); }} className="mt-5 text-xs font-semibold text-[#6A7685]">Use a different account</button>}<p className="mt-12 text-xs text-[#9AA4AE]">Access is limited to authorized Lookiy administrators and staff.</p></div></section>
  </div></main>;
}
