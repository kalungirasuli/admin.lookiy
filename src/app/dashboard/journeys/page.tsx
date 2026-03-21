'use client';

import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import {
  Navigation,
  MapPin,
  Clock,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Car,
  Calendar,
  Layers,
  Globe,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

// Variants for Framer Motion
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } },
};

const recentJourneys = [
  { id: 'J-2847', client: 'Sarah K.', operator: 'James M.', route: 'Kololo → Ntinda', vehicle: 'Boda', price: 8000, status: 'COMPLETED', time: '2m ago', date: 'Mar 20, 2026' },
  { id: 'J-2846', client: 'David O.', operator: 'Peter N.', route: 'Kampala → Entebbe', vehicle: 'Car', price: 45000, status: 'ACTIVE', time: '5m ago', date: 'Mar 20, 2026' },
  { id: 'J-2845', client: 'Grace A.', operator: 'Abdul R.', route: 'Wandegeya → Makerere', vehicle: 'Boda', price: 5000, status: 'EN_ROUTE', time: '8m ago', date: 'Mar 20, 2026' },
  { id: 'J-2844', client: 'Moses T.', operator: '—', route: 'Nakasero → Bugolobi', vehicle: 'Taxi', price: 15000, status: 'SEARCHING', time: '12m ago', date: 'Mar 20, 2026' },
  { id: 'J-2843', client: 'Linda W.', operator: 'Charles K.', route: 'Kisementi → Lubowa', vehicle: 'Car', price: 35000, status: 'COMPLETED', time: '15m ago', date: 'Mar 20, 2026' },
  { id: 'J-2842', client: 'John B.', operator: 'Sarah N.', route: 'Muyenga → Kabalagala', vehicle: 'Boda', price: 4000, status: 'COMPLETED', time: '18m ago', date: 'Mar 20, 2026' },
  { id: 'J-2841', client: 'Emma L.', operator: 'Tom O.', route: 'Bukoto → Naguru', vehicle: 'Boda', price: 3500, status: 'CANCELLED', time: '22m ago', date: 'Mar 20, 2026' },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    COMPLETED: 'bg-travo-lemon/10 text-travo-lemon border-travo-lemon/20',
    ACTIVE: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
    EN_ROUTE: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',
    SEARCHING: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
    CANCELLED: 'bg-red-400/10 text-red-400 border-red-400/20',
    LOCKED: 'bg-indigo-400/10 text-indigo-400 border-indigo-400/20',
  };
  return (
    <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border', styles[status] || 'bg-white/5 text-travo-gray-400 border-white/5')}>
      {status}
    </span>
  );
}

export default function JourneysPage() {
  return (
    <div className="min-h-screen bg-travo-black text-white selection:bg-travo-lemon selection:text-travo-black">
      <Header title="Journeys" subtitle="Monitoring real-time transportation activity across the spatial network." />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="p-10 space-y-8"
      >
        {/* Analytics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Live Traffic', value: '184', icon: Activity, color: 'text-travo-lemon', trend: '+12%', sub: 'Active requests' },
            { label: 'Success Rate', value: '98.2%', icon: Globe, color: 'text-blue-400', trend: '+0.4%', sub: 'Last 24 hours' },
            { label: 'Avg Distance', value: '8.4 km', icon: MapPin, color: 'text-travo-orange', trend: '-2.1%', sub: 'Per journey' },
          ].map((stat) => (
            <motion.div key={stat.label} variants={item} className="bg-white/5 border border-white/5 rounded-[32px] p-6 relative overflow-hidden group">
               <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-travo-lemon/10 transition-all" />
               <div className="flex items-center justify-between relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                    <stat.icon size={22} className={stat.color} />
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-black text-travo-gray-400">
                    {stat.trend}
                  </div>
               </div>
               <div className="mt-6 relative z-10">
                 <p className="text-[10px] font-black text-travo-gray-500 uppercase tracking-widest">{stat.label}</p>
                 <div className="flex items-end gap-2 mt-1">
                    <h2 className="text-3xl font-black">{stat.value}</h2>
                    <p className="text-[10px] text-travo-gray-600 mb-1.5 font-bold uppercase">{stat.sub}</p>
                 </div>
               </div>
            </motion.div>
          ))}
        </div>

        {/* Toolbar */}
        <motion.div variants={item} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/5 border border-white/5 rounded-[32px] p-4 pl-8 pr-6">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-travo-lemon animate-pulse" />
                 <h3 className="text-[13px] font-black uppercase tracking-wider">Operational Log</h3>
              </div>
              <div className="h-4 w-[1px] bg-white/10 hidden lg:block" />
              <div className="relative group hidden lg:block">
                 <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-travo-gray-600 group-focus-within:text-travo-lemon transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Filter by ID, client or driver..." 
                   className="bg-travo-black/40 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-[12px] w-[300px] focus:outline-none focus:border-travo-lemon/40 transition-all placeholder:text-travo-gray-700" 
                 />
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/5 text-[11px] font-black uppercase tracking-widest text-travo-gray-400 hover:text-white transition-all">
                 <Filter size={14} />
                 <span>Advanced Filters</span>
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-travo-lemon text-travo-black text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_5px_15px_rgba(168,225,12,0.2)]">
                 <Layers size={14} />
                 <span>Export Data</span>
              </button>
           </div>
        </motion.div>

        {/* Table Section */}
        <motion.div variants={item} className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[48px] overflow-hidden relative">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-travo-gray-600 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                  <th className="py-8 pl-10">Network ID</th>
                  <th className="py-8">Passenger / Client</th>
                  <th className="py-8">Assigned Operator</th>
                  <th className="py-8">Route Vector</th>
                  <th className="py-8 text-center">Value</th>
                  <th className="py-8">Network Status</th>
                  <th className="py-8 text-right pr-10">Time Vector</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentJourneys.map((j) => (
                  <tr key={j.id} className="group hover:bg-white/5 transition-colors duration-300">
                    <td className="py-7 pl-10">
                       <div className="flex flex-col">
                          <span className="font-black text-[12px] text-travo-lemon tracking-widest">{j.id}</span>
                          <span className="text-[9px] font-bold text-travo-gray-600 uppercase mt-0.5">{j.date}</span>
                       </div>
                    </td>
                    <td className="py-7">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[11px] font-black text-travo-gray-400 group-hover:border-travo-lemon/30 transition-all">
                             {j.client.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="font-bold text-[14px] text-white tracking-tight">{j.client}</span>
                       </div>
                    </td>
                    <td className="py-7">
                       <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-travo-gray-700" />
                          <span className="text-[13px] text-travo-gray-400 font-bold group-hover:text-white transition-colors">{j.operator}</span>
                       </div>
                    </td>
                    <td className="py-7">
                       <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                             <MapPin size={12} className="text-travo-lemon" />
                          </div>
                          <span className="text-[13px] font-black text-white tracking-tight">{j.route}</span>
                       </div>
                    </td>
                    <td className="py-7 text-center">
                       <p className="font-black text-[15px] text-white">{formatCurrency(j.price)}</p>
                       <span className="text-[9px] font-black text-travo-gray-600 uppercase tracking-tighter">UGX Currency</span>
                    </td>
                    <td className="py-7">
                       <StatusBadge status={j.status} />
                    </td>
                    <td className="py-7 text-right pr-10">
                       <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1.5">
                             <Clock size={12} className="text-travo-gray-600" />
                             <span className="text-[12px] font-black text-white">{j.time}</span>
                          </div>
                          <span className="text-[9px] font-bold text-travo-gray-700 uppercase tracking-widest mt-1">Latency OK</span>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-travo-black/40 border-t border-white/5 px-10 py-6 flex items-center justify-between">
             <p className="text-[11px] font-bold text-travo-gray-500 uppercase tracking-widest">Showing 1-7 of 24,847 entries</p>
             <div className="flex items-center gap-2">
                <button className="p-2 rounded-xl bg-white/5 text-travo-gray-600 hover:text-white transition-all">
                   <ChevronLeft size={18} />
                </button>
                <div className="flex items-center gap-1 mx-2">
                   {[1, 2, 3].map(p => (
                      <button key={p} className={cn(
                        "w-8 h-8 rounded-lg text-[11px] font-black transition-all",
                        p === 1 ? "bg-travo-lemon text-travo-black" : "text-travo-gray-500 hover:text-white"
                      )}>
                         {p}
                      </button>
                   ))}
                   <span className="text-travo-gray-700 mx-1">...</span>
                </div>
                <button className="p-2 rounded-xl bg-white/5 text-travo-gray-600 hover:text-white transition-all">
                   <ChevronRight size={18} />
                </button>
             </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
