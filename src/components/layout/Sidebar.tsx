'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BadgeCheck, Bike, Building2, BarChart3, CircleDollarSign, LayoutDashboard, LogOut, MapPinned, Menu, Navigation2, Settings2, ShieldCheck, ShoppingBag, Users, X } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

const items = [
  { group: 'Overview', links: [{ label: 'Control center', href: '/dashboard', icon: LayoutDashboard }, { label: 'Live tracking', href: '/dashboard/map', icon: MapPinned }] },
  { group: 'Operations', links: [{ label: 'Journeys', href: '/dashboard/journeys', icon: Navigation2 }, { label: 'Riders', href: '/dashboard/operators', icon: Bike }, { label: 'Clients', href: '/dashboard/users', icon: Users }, { label: 'Fleets', href: '/dashboard/companies', icon: Building2 }] },
  { group: 'Commerce & care', links: [{ label: 'Shops & ads', href: '/dashboard/ads', icon: ShoppingBag }, { label: 'Wallet & finance', href: '/dashboard/wallet', icon: CircleDollarSign }, { label: 'Verifications', href: '/dashboard/verifications', icon: BadgeCheck }, { label: 'Staff', href: '/dashboard/staff', icon: ShieldCheck }] },
  { group: 'Insights', links: [{ label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 }, { label: 'Settings', href: '/dashboard/settings', icon: Settings2 }] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('Staff account');
  useEffect(() => { api.getMe().then(response => { const user = response?.data; if (user) setName([user.firstName, user.lastName].filter(Boolean).join(' ') || user.email || 'Staff account'); }).catch(() => {}); }, []);
  const logout = () => { api.clearToken(); router.replace('/login'); };
  return <><button aria-label="Open navigation" onClick={() => setOpen(true)} className="fixed left-4 top-4 z-40 rounded-2xl border border-[#E1E5E9] bg-white p-3 text-[#102B48] shadow-sm lg:hidden"><Menu size={20} /></button>{open && <button aria-label="Close navigation" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-[#102B48]/35 backdrop-blur-[3px] lg:hidden" />}
    <aside className={cn('fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-white/10 bg-[#102B48] text-white transition-transform duration-300', open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')}>
      <div className="flex h-[90px] items-center justify-between border-b border-white/10 px-6"><Link href="/dashboard" className="flex items-center gap-2 text-[29px] font-semibold tracking-[-.065em]">Look<span className="text-[#F59B24]">i</span>y</Link><button aria-label="Close navigation" onClick={() => setOpen(false)} className="lg:hidden"><X size={19} /></button></div>
      <nav className="flex-1 overflow-y-auto px-3 py-5">{items.map(section => <div key={section.group} className="mb-6"><p className="px-4 pb-2 text-[10px] font-semibold uppercase tracking-[.18em] text-[#8398AE]">{section.group}</p>{section.links.map(link => { const selected = pathname === link.href; const Icon = link.icon; return <Link key={link.href} title={link.label} href={link.href} onClick={() => setOpen(false)} aria-current={selected ? 'page' : undefined} className={cn('mb-1 flex h-11 items-center gap-3 rounded-[13px] px-4 text-[13px] font-medium transition-colors', selected ? 'bg-white text-[#102B48] shadow-sm' : 'text-[#B5C5D4] hover:bg-white/10 hover:text-white')}><Icon size={18} strokeWidth={selected ? 2.2 : 1.8} /><span>{link.label}</span></Link>; })}</div>)}</nav>
      <div className="border-t border-white/10 p-3"><div className="flex items-center gap-3 rounded-2xl bg-white/[.07] p-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F59B24] text-xs font-bold text-[#102B48]">{name.split(' ').slice(0, 2).map(part => part[0]).join('').toUpperCase()}</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold">{name}</span><span className="text-[10px] text-[#9DB1C4]">Control center</span></span><button aria-label="Sign out" title="Sign out" onClick={logout} className="rounded-lg p-2 text-[#9DB1C4] hover:bg-white/10 hover:text-white"><LogOut size={16} /></button></div></div>
    </aside>
  </>;
}
