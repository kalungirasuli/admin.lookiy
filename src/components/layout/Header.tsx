'use client';

import { Bell, Search, ChevronDown } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-travo-gray-100">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-travo-black">{title}</h1>
          {subtitle && <p className="text-sm text-travo-gray-500 mt-0.5">{subtitle}</p>}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-travo-gray-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="pl-10 pr-4 py-2.5 bg-travo-gray-50 border border-travo-gray-200 rounded-xl text-sm w-[280px] focus:outline-none focus:ring-2 focus:ring-travo-orange/20 focus:border-travo-orange transition-all"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2.5 rounded-xl hover:bg-travo-gray-50 transition-colors">
            <Bell size={20} className="text-travo-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-travo-orange rounded-full animate-pulse-orange" />
          </button>

          {/* Profile dropdown */}
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-travo-gray-50 transition-colors">
            <div className="w-8 h-8 rounded-full gradient-orange flex items-center justify-center text-white text-xs font-bold">
              KA
            </div>
            <span className="text-sm font-medium text-travo-black hidden sm:block">Kalungi</span>
            <ChevronDown size={14} className="text-travo-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
