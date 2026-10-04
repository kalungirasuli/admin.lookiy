'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<'checking' | 'allowed' | 'denied'>('checking');
  useEffect(() => {
    if (!api.getToken()) { router.replace('/login'); setState('denied'); return; }
    let live = true;
    api.getMe().then(response => {
      if (!live) return;
      const roles = (response?.data?.roles || []).map((role: string) => String(role).toUpperCase());
      if (roles.includes('ADMIN') || roles.includes('STAFF')) setState('allowed');
      else { api.clearToken(); setState('denied'); router.replace('/login'); }
    }).catch(() => { if (live) { setState('denied'); router.replace('/login'); } });
    return () => { live = false; };
  }, [router]);
  if (state !== 'allowed') return <div className="min-h-screen grid place-items-center bg-[#F5F6F7] text-[#627082] text-sm">{state === 'checking' ? 'Checking access…' : 'Redirecting…'}</div>;
  return <>{children}</>;
}
