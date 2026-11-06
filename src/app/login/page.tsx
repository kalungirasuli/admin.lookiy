'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, LockKeyhole, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';

const inputClass = 'mt-2 block h-[50px] w-full rounded-xl border border-[#D9D5CF] bg-white px-4 text-base text-[#181B26] outline-none placeholder:text-[#767783] focus:border-[#7752A7] focus:ring-2 focus:ring-[#7752A7]/25 sm:text-sm';
const focusClass = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7752A7]';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    setBusy(true);
    setError('');
    try {
      const response = tempToken
        ? await api.verifyTwoFactor(tempToken, code)
        : await api.login(email.trim(), password);
      const result = response?.data || response;

      if (result?.requiresTwoFactor && result?.tempToken) {
        setTempToken(result.tempToken);
        setPassword('');
        setShowPassword(false);
        return;
      }

      const roles = (result?.user?.roles || []).map((role: string) => String(role).toUpperCase());
      if (!roles.includes('ADMIN') && !roles.includes('STAFF')) {
        throw new Error('This account cannot access the control center.');
      }
      if (!result?.accessToken) throw new Error('Sign in did not return an access token.');

      api.setToken(result.accessToken);
      router.replace('/dashboard');
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Sign in failed.');
    } finally {
      setBusy(false);
    }
  }

  function switchAccount() {
    setTempToken('');
    setCode('');
    setError('');
  }

  return (
    <main className="min-h-[100svh] bg-[#F7F5F1] text-[#181B26]">
      <div className="mx-auto grid min-h-[100svh] max-w-[1520px] px-5 py-5 sm:px-9 sm:py-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:grid-rows-[auto_1fr_auto] lg:gap-x-12 lg:px-8 lg:py-8 xl:gap-x-20">
        <header className="mx-auto flex w-full max-w-[500px] items-center gap-4 pb-5 lg:col-start-1 lg:row-start-1 lg:pb-0">
          <span className="text-[31px] font-semibold leading-none tracking-[-.07em]">
            Look<span className="text-[#A85110]">i</span>y
          </span>
          <span className="border-l border-[#D9D5CF] pl-4 text-[10px] font-semibold uppercase tracking-[.18em] text-[#555866]">
            Control Center
          </span>
        </header>

        <div className="relative isolate mx-auto h-28 w-full max-w-[500px] overflow-hidden rounded-[20px] bg-[#24243B] sm:h-36 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:h-auto lg:min-h-[620px] lg:max-w-none lg:rounded-[28px]">
          <picture aria-hidden="true" className="absolute inset-0">
            <source media="(min-width: 1024px)" srcSet="/images/admin-login/signin.jpg" />
            <img src="/images/admin-login/discovery.jpg" alt="" decoding="async" className="h-full w-full object-cover object-[center_83%] lg:object-[center_65%]" />
          </picture>
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#161427] via-transparent to-transparent lg:from-[#161427] lg:via-[#161427]/10 lg:to-transparent" />
          <div className="relative flex h-full flex-col justify-end p-4 text-white lg:p-9 xl:p-12">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.22em] text-[#FFE0BD]">
              <span className="h-px w-5 bg-[#FFB875]" aria-hidden="true" />
              Lookiy operations
            </div>
            <p className="mt-4 hidden max-w-[11ch] text-[clamp(2.5rem,4.5vw,4.25rem)] font-semibold leading-[.98] tracking-[-.055em] lg:block">
              A clear view of every journey.
            </p>
            <p className="mt-4 hidden max-w-[35ch] text-sm leading-6 text-white/90 lg:block">
              Follow live rides and manage riders, fleets, and shops from one workspace.
            </p>
          </div>
        </div>

        <section aria-labelledby="login-title" className="mx-auto flex w-full max-w-[500px] items-center py-8 sm:py-10 lg:col-start-1 lg:row-start-2">
          <div className="mx-auto w-full max-w-[390px]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E8D8CA] bg-[#FFF1E3] px-3 py-1.5 text-xs font-semibold text-[#7E461C]">
              <LockKeyhole size={13} aria-hidden="true" />
              {tempToken ? 'Two-step verification' : 'Staff access'}
            </div>
            <h1 id="login-title" className="text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-[1.02] tracking-[-.055em]">
              {tempToken ? 'Check your code' : 'Welcome back.'}
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#555866]">
              {tempToken ? 'Enter the code from your authenticator app.' : 'Sign in with your Lookiy staff account.'}
            </p>

            <form onSubmit={submit} aria-busy={busy} className="mt-7 space-y-4">
              {tempToken ? (
                <div>
                  <label htmlFor="login-code" className="text-sm font-medium">Authentication code</label>
                  <input id="login-code" name="code" autoFocus inputMode="numeric" autoComplete="one-time-code" value={code} onChange={event => setCode(event.target.value)} required className={inputClass + ' tracking-[.2em]'} />
                </div>
              ) : (
                <>
                  <div>
                    <label htmlFor="login-email" className="text-sm font-medium">Email address</label>
                    <input id="login-email" name="email" type="email" autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} required placeholder="you@example.com" className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="login-password" className="text-sm font-medium">Password</label>
                    <div className="relative">
                      <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required className={inputClass + ' pr-14'} />
                      <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-controls="login-password" onClick={() => setShowPassword(!showPassword)} className={'absolute inset-y-1 right-1 grid w-11 place-items-center rounded-lg text-[#555866] hover:bg-[#F1ECF5] ' + focusClass}>
                        {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {error && <p role="alert" className="break-words rounded-xl border border-[#F0CFCB] bg-[#FFF1EF] px-4 py-3 text-sm text-[#922F37]">{error}</p>}

              <button type="submit" disabled={busy} className={'flex h-[52px] w-full items-center justify-center gap-2.5 rounded-xl bg-[#242039] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#382E51] disabled:cursor-wait disabled:opacity-70 ' + focusClass}>
                {busy ? 'Checking…' : tempToken ? 'Verify code' : 'Sign in'}
                {busy ? <Loader2 size={17} aria-hidden="true" className="motion-safe:animate-spin" /> : <ArrowRight size={17} aria-hidden="true" />}
              </button>
            </form>

            {tempToken && (
              <button type="button" disabled={busy} onClick={switchAccount} className={'mt-5 inline-flex min-h-10 items-center gap-2 rounded text-sm font-medium text-[#534173] hover:underline disabled:opacity-70 ' + focusClass}>
                <ArrowLeft size={15} aria-hidden="true" />
                Use a different account
              </button>
            )}
          </div>
        </section>

        <footer className="mx-auto flex w-full max-w-[500px] items-center gap-2 border-t border-[#E3DED6] pt-4 text-xs leading-5 text-[#555866] lg:col-start-1 lg:row-start-3">
          <ShieldCheck size={15} className="shrink-0" aria-hidden="true" />
          For authorized Lookiy administrators and staff.
        </footer>
      </div>
    </main>
  );
}
