'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-xl bg-travo-black text-white shadow-lg"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full z-40 flex flex-col transition-all duration-300 ease-in-out',
          'bg-white border-r border-travo-gray-100',
          collapsed ? 'w-20' : 'w-[280px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-travo-gray-100">
          <div className="w-10 h-10 rounded-xl gradient-orange flex items-center justify-center flex-shrink-0">
            <Navigation className="text-white" size={22} />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-xl font-bold text-travo-black tracking-tight">TRAVO</h1>
              <p className="text-[10px] text-travo-gray-500 font-medium uppercase tracking-widest">
                Admin Panel
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  isActive ? 'sidebar-item-active' : 'sidebar-item',
                  collapsed && 'justify-center px-0',
                )}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
                {!collapsed && isActive && (
                  <ChevronRight size={16} className="ml-auto opacity-60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-travo-gray-100 p-4">
          <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
            <div className="w-9 h-9 rounded-full gradient-dark flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              KA
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0 animate-fade-in">
                <p className="text-sm font-semibold text-travo-black truncate">Kalungi Admin</p>
                <p className="text-xs text-travo-gray-500">Super Admin</p>
              </div>
            )}
            {!collapsed && (
              <button className="p-2 rounded-lg hover:bg-travo-gray-100 text-travo-gray-400 transition-colors">
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Collapse toggle - desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-travo-gray-200 shadow-sm items-center justify-center hover:bg-travo-gray-50 transition-colors"
        >
          <ChevronRight
            size={14}
            className={cn(
              'text-travo-gray-500 transition-transform',
              collapsed ? '' : 'rotate-180',
            )}
          />
        </button>
      </aside>
    </>
  );
}
