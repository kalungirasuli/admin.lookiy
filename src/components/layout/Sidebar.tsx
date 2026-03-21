'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Navigation,
  Users,
  Car,
  Building2,
  Wallet,
  Megaphone,
  BarChart3,
  Shield,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Journeys', href: '/dashboard/journeys', icon: Navigation },
  { name: 'Users', href: '/dashboard/users', icon: Users },
  { name: 'Operators', href: '/dashboard/operators', icon: Car },
  { name: 'Companies', href: '/dashboard/companies', icon: Building2 },
  { name: 'Wallet & Finance', href: '/dashboard/wallet', icon: Wallet },
  { name: 'Advertisements', href: '/dashboard/ads', icon: Megaphone },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Verifications', href: '/dashboard/verifications', icon: Shield },
  { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-xl bg-travo-black text-white shadow-2xl border border-white/10"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-md"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full z-40 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]',
          'bg-travo-black text-white border-r border-white/5 shadow-[20px_0_40px_rgba(0,0,0,0.3)]',
          collapsed ? 'w-[84px]' : 'w-[280px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-6 py-8 relative">
          <div className="w-12 h-12 rounded-2xl bg-travo-lemon shadow-[0_0_20px_rgba(168,225,12,0.4)] flex items-center justify-center flex-shrink-0 transform transition-transform duration-500 hover:rotate-12">
            <Zap className="text-travo-black fill-travo-black" size={26} />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-2xl font-bold tracking-tighter text-white">
                TRAVO<span className="text-travo-lemon">.</span>
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-travo-lemon animate-pulse" />
                <p className="text-[10px] text-travo-gray-400 font-bold uppercase tracking-[0.2em]">
                  Pro Platform
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
          {navigation.map((item, index) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'group flex items-center gap-3 py-3.5 px-4 rounded-2xl transition-all duration-300 relative overflow-hidden',
                  isActive
                    ? 'bg-travo-lemon text-travo-black shadow-[0_10px_20px_rgba(168,225,12,0.2)]'
                    : 'text-travo-gray-400 hover:bg-white/5 hover:text-white',
                  collapsed && 'justify-center px-0 mx-auto w-12',
                )}
              >
                <item.icon
                  size={20}
                  className={cn(
                    'flex-shrink-0 transition-transform duration-300 group-hover:scale-110',
                    isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]',
                  )}
                />
                {!collapsed && (
                  <span className={cn('text-[15px] font-semibold', isActive ? 'tracking-tight' : '')}>
                    {item.name}
                  </span>
                )}
                {!collapsed && isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-travo-black"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User / Logout Section */}
        <div className="p-4 mt-auto">
          <div
            className={cn(
              'rounded-3xl bg-white/5 border border-white/5 p-4 flex items-center gap-4',
              collapsed && 'flex-col p-2 gap-2',
            )}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-travo-lemon flex items-center justify-center text-travo-black text-sm font-black shadow-[0_0_15px_rgba(168,225,12,0.2)]">
                KA
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-travo-lemon border-2 border-travo-black flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-travo-black" />
              </div>
            </div>

            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate leading-none">
                  Kalungi Admin
                </p>
                <p className="text-[11px] text-travo-gray-500 font-bold mt-1 uppercase tracking-wider">
                  Super Admin
                </p>
              </div>
            )}

            {!collapsed && (
              <button className="p-2.5 rounded-xl bg-white/5 text-travo-gray-400 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10">
                <LogOut size={18} />
              </button>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="mt-4 w-full h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-travo-gray-500 hover:text-white hover:bg-white/10 transition-all group"
          >
            <ChevronRight
              size={18}
              className={cn(
                'transition-transform duration-500',
                collapsed ? '' : 'rotate-180',
                'group-hover:scale-125',
              )}
            />
          </button>
        </div>
      </aside>
    </>
  );
}
