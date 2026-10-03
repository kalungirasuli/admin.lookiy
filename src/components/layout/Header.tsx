'use client';

import { Bell, MapPinned } from 'lucide-react';
import Link from 'next/link';

export default function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return <header className="sticky top-0 z-30 flex min-h-[90px] items-center justify-between gap-4 border-b border-[#E5E9EC] bg-white/90 px-6 pl-[76px] backdrop-blur-xl sm:px-8 lg:pl-9"><div><p className="mb-1 text-[10px] font-bold uppercase tracking-[.2em] text-[#E19129]">Lookiy control center</p><h1 className="text-[25px] font-semibold leading-tight tracking-[-.045em] text-[#102B48]">{title}</h1>{subtitle && <p className="mt-1 text-xs text-[#718092]">{subtitle}</p>}</div><div className="flex items-center gap-2"><Link href="/dashboard/map" aria-label="Live tracking" title="Live tracking" className="hidden rounded-xl border border-[#E8ECF0] p-2.5 text-[#506174] hover:bg-[#F4F6F8] sm:block"><MapPinned size={18} /></Link><Link href="/dashboard/notifications" aria-label="Recent activity" title="Recent activity" className="rounded-xl border border-[#E8ECF0] p-2.5 text-[#506174] hover:bg-[#F4F6F8]"><Bell size={18} /></Link></div></header>;
}
