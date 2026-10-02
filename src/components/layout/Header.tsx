'use client';

import { motion } from 'framer-motion';
import { Bell, Search, ChevronDown, Sparkles } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#F7F8F6]/90 backdrop-blur-2xl border-b border-[#E5E9E8]">
      <div className="flex items-center justify-between px-10 py-5">
        {/* Title Section with Animation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1"
        >
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-travo-black tracking-tight leading-tight">
              {title}
            </h1>
            <Sparkles className="text-travo-orange" size={16} />
          </div>
          {subtitle && (
             <p className="text-sm font-medium text-travo-gray-500 mt-1 max-w-[400px] leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Action Controls */}
        <div className="flex items-center gap-6">
          {/* Search Bar - Modern Glass style */}
          <div className="relative hidden lg:block group">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-travo-gray-500 group-focus-within:text-travo-lemon transition-colors duration-300"
            />
            <input
              type="text"
              placeholder="Search platform metrics..."
              className="pl-12 pr-6 py-3 bg-white border border-[#E5E9E8] rounded-2xl text-[13px] font-medium text-travo-black w-[320px] focus:outline-none focus:ring-2 focus:ring-travo-orange/20 focus:border-travo-orange/40 transition-all duration-300 placeholder:text-travo-gray-400"
            />
          </div>

          {/* Controls Cluster */}
          <div className="flex items-center gap-3">
            {/* Notification Center */}
             <button className="relative p-3 rounded-2xl bg-white border border-[#E5E9E8] text-travo-gray-500 hover:text-travo-black hover:bg-white transition-all duration-300 group">
              <Bell size={20} className="group-hover:scale-110 transition-transform" />
               <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-travo-orange rounded-full shadow-[0_0_10px_rgba(245,155,36,0.6)]" />
            </button>

            {/* Profile Action */}
             <button className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-2xl bg-white border border-[#E5E9E8] hover:bg-white transition-all duration-300 group">
               <div className="w-10 h-10 rounded-xl bg-travo-orange flex items-center justify-center text-white text-sm font-black shadow-[0_0_15px_rgba(245,155,36,0.2)]">
                KA
              </div>
              <div className="text-left hidden xl:block">
                <p className="text-[13px] font-bold text-white leading-none">Kalungi</p>
                <div className="flex items-center gap-1 mt-1">
                   <div className="w-1 h-1 rounded-full bg-travo-orange" />
                   <p className="text-[10px] text-travo-gray-500 font-bold uppercase tracking-wider">Online</p>
                </div>
              </div>
              <ChevronDown size={14} className="text-travo-gray-500 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
