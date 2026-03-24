'use client';

import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import {
  Navigation,
  Users,
  Car,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  Clock,
  Activity,
  Megaphone,
  Eye,
  Zap,
  Sparkles,
  BarChart3,
  Globe,
  ShieldCheck,
  X,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import IntentPulse from '@/components/dashboard/IntentPulse';
import DensityMap from '@/components/dashboard/DensityMap';

// Variants for Framer Motion
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] } },
};

// Mock data for demo
const stats = [
  {
    label: 'Total Journeys',
    value: '24,847',
    change: '+12.5%',
    trend: 'up',
    icon: Navigation,
    color: 'text-travo-lemon',
    iconBg: 'bg-travo-lemon/10',
  },
  {
    label: 'Active Users',
    value: '8,234',
    change: '+8.2%',
    trend: 'up',
    icon: Users,
    color: 'text-blue-400',
    iconBg: 'bg-blue-400/10',
  },
  {
    label: 'Online Operators',
    value: '1,456',
    change: '+3.1%',
    trend: 'up',
    icon: Car,
    color: 'text-travo-lemon',
    iconBg: 'bg-travo-lemon/10',
  },
  {
    label: 'Ad Revenue',
    value: formatCurrency(12450000),
    change: '+24.8%',
    trend: 'up',
    icon: Megaphone,
    color: 'text-purple-400',
    iconBg: 'bg-purple-400/10',
  },
];

const recentJourneys = [
  { id: 'J-2847', client: 'Sarah K.', operator: 'James M.', route: 'Kololo → Ntinda', vehicle: 'Boda', price: 8000, status: 'COMPLETED', time: '2m ago' },
  { id: 'J-2846', client: 'David O.', operator: 'Peter N.', route: 'Kampala → Entebbe', vehicle: 'Car', price: 45000, status: 'ACTIVE', time: '5m ago' },
  { id: 'J-2845', client: 'Grace A.', operator: 'Abdul R.', route: 'Wandegeya → Makerere', vehicle: 'Boda', price: 5000, status: 'EN_ROUTE', time: '8m ago' },
  { id: 'J-2844', client: 'Moses T.', operator: '—', route: 'Nakasero → Bugolobi', vehicle: 'Taxi', price: 15000, status: 'SEARCHING_OPERATOR', time: '12m ago' },
  { id: 'J-2843', client: 'Linda W.', operator: 'Charles K.', route: 'Kisementi → Lubowa', vehicle: 'Car', price: 35000, status: 'COMPLETED', time: '15m ago' },
];

const pendingVerifications = [
  { name: 'John Okello', type: 'Operator - Boda', submitted: '2h ago', docs: 'NID + License' },
  { name: 'Smart Fleet Ltd', type: 'Company', submitted: '4h ago', docs: 'Business Registration' },
  { name: 'Grace Namutebi', type: 'Operator - Car', submitted: '6h ago', docs: 'NID + License + Insurance' },
];

const topOperators = [
  { name: 'James Mukasa', journeys: 847, rating: 4.9, earnings: 12500000, vehicle: 'Boda' },
  { name: 'Peter Nalwoga', journeys: 692, rating: 4.8, earnings: 28400000, vehicle: 'Car' },
  { name: 'Abdul Ssempijja', journeys: 581, rating: 4.7, earnings: 8900000, vehicle: 'Boda' },
  { name: 'Charles Kato', journeys: 534, rating: 4.9, earnings: 22100000, vehicle: 'Car' },
];

const liveMetrics = [
  { label: 'Active Journeys', value: '342', icon: Activity, color: 'text-travo-lemon' },
  { label: 'Avg Wait Time', value: '2.4 min', icon: Clock, color: 'text-travo-orange' },
  { label: 'Matching Rate', value: '94.2%', icon: Zap, color: 'text-blue-400' },
  { label: 'Ad Impressions Today', value: '48,291', icon: Eye, color: 'text-purple-400' },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    COMPLETED: 'bg-travo-lemon/10 text-travo-lemon border-travo-lemon/20',
    ACTIVE: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
    EN_ROUTE: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',
    SEARCHING_OPERATOR: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
    CANCELLED: 'bg-red-400/10 text-red-400 border-red-400/20',
    LOCKED: 'bg-indigo-400/10 text-indigo-400 border-indigo-400/20',
  };
  return (
    <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border', styles[status] || 'bg-white/5 text-travo-gray-400 border-white/5')}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-travo-black text-white selection:bg-travo-lemon selection:text-travo-black">
      <Header title="Overview" subtitle="Welcome back, Kalungi. Analyzing platform performance in real-time." />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="p-10 space-y-10"
      >
        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {liveMetrics.map((metric) => (
            <motion.div
              key={metric.label}
              variants={item}
              className="flex items-center gap-4 bg-white/5 backdrop-blur-3xl border border-white/5 rounded-3xl p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/10 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <metric.icon size={22} className={metric.color} />
              </div>
              <div>
                <p className="text-[11px] text-travo-gray-500 font-bold uppercase tracking-widest">{metric.label}</p>
                <p className="text-2xl font-black text-white mt-0.5">{metric.value}</p>
              </div>
              <div className="ml-auto flex flex-col items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-travo-lemon animate-pulse shadow-[0_0_8px_rgba(168,225,12,0.8)]" />
                <p className="text-[10px] text-travo-lemon font-black uppercase tracking-tighter">Live</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={item}
              className="relative group p-8 rounded-[40px] bg-white/5 border border-white/5 overflow-hidden transition-all duration-500 hover:bg-white/10"
            >
              {/* Background Accent */}
              <div className={cn("absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[80px] opacity-10 transition-opacity group-hover:opacity-20", stat.iconBg)} />

              <div className="flex items-start justify-between relative z-10">
                <div className={cn('w-16 h-16 rounded-[24px] flex items-center justify-center shadow-xl', stat.iconBg)}>
                  <stat.icon size={28} className={stat.color} />
                </div>
                <div className={cn(
                  'flex items-center gap-1.5 text-[11px] font-black px-3 py-1.5 rounded-2xl border backdrop-blur-md',
                  stat.trend === 'up' ? 'bg-travo-lemon/10 text-travo-lemon border-travo-lemon/20' : 'bg-red-400/10 text-red-400 border-red-400/20',
                )}>
                  {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.change}
                </div>
              </div>

              <div className="mt-8 relative z-10">
                <p className="text-[11px] text-travo-gray-500 font-bold uppercase tracking-[0.2em]">{stat.label}</p>
                <h2 className="text-4xl font-black text-white mt-2 tracking-tighter">{stat.value}</h2>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Secondary Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Main Chart Card */}
          <motion.div variants={item} className="xl:col-span-2 bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 overflow-hidden relative">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-3xl bg-travo-lemon/10 flex items-center justify-center">
                  <BarChart3 size={26} className="text-travo-lemon" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">Platform Performance</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Globe size={14} className="text-travo-gray-600" />
                    <p className="text-[11px] text-travo-gray-500 font-bold uppercase tracking-widest">Global Analytics Cluster v2.4</p>
                  </div>
                </div>
              </div>
              <div className="flex bg-travo-black/40 p-1.5 rounded-2xl border border-white/5">
                {['7D', '1M', '3M', '1Y'].map((period) => (
                  <button
                    key={period}
                    className={cn(
                      'px-5 py-2.5 rounded-xl text-[11px] font-black transition-all duration-300 uppercase tracking-wider',
                      period === '1M'
                        ? 'bg-travo-lemon text-travo-black shadow-lg'
                        : 'text-travo-gray-500 hover:text-white',
                    )}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Futuristic Chart Area */}
            <div className="h-[340px] flex items-end gap-3 px-2">
              {[65, 45, 78, 52, 90, 68, 85, 72, 95, 60, 82, 70, 88, 55, 92, 75, 80, 62, 88, 95, 72, 85, 90, 68, 76, 82, 91, 78, 86, 94].map((value, i) => (
                <div key={i} className="flex-1 group/bar relative">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${value * 2.8}px` }}
                    transition={{ delay: 0.5 + i * 0.02, duration: 1, ease: [0.23, 1, 0.32, 1] }}
                    className={cn(
                      "w-full rounded-full transition-all duration-300 relative",
                      i === 29 ? "bg-travo-lemon shadow-[0_0_20px_rgba(168,225,12,0.6)]" : "bg-white/10 hover:bg-travo-lemon/40"
                    )}
                  >
                    {i === 29 && (
                       <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-travo-lemon text-travo-black text-[10px] font-black px-2 py-1 rounded-lg">
                         NOW
                       </div>
                    )}
                  </motion.div>
                </div>
              ))}
            </div>
            <div className="flex justify-between px-4 mt-6 text-[10px] text-travo-gray-600 font-black uppercase tracking-[0.3em]">
              <span>February 01</span>
              <span>March 20</span>
            </div>
          </motion.div>

          {/* Performance Rankings Card */}
          <motion.div variants={item} className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 flex flex-col">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-3xl bg-travo-lemon/10 flex items-center justify-center">
                <Sparkles size={26} className="text-travo-lemon" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">Top Performers</h3>
                <p className="text-[11px] text-travo-gray-500 font-bold uppercase tracking-widest mt-1">Monthly Leaderboard</p>
              </div>
            </div>

            <div className="space-y-6 flex-1">
              {topOperators.map((op, i) => (
                <div key={op.name} className="flex items-center gap-4 p-5 rounded-[32px] bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300 group">
                  <div className={cn(
                    'w-12 h-12 rounded-2xl flex items-center justify-center text-travo-black text-sm font-black transition-transform group-hover:scale-110 duration-500',
                    i === 0 ? 'bg-travo-lemon shadow-[0_0_15px_rgba(168,225,12,0.4)]' : 'bg-white/10 text-white',
                  )}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-black text-white truncate leading-tight">{op.name}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-black text-travo-lemon uppercase tracking-tighter bg-travo-lemon/10 px-2 py-0.5 rounded-md">{op.vehicle}</span>
                      <div className="w-1 h-1 rounded-full bg-white/10" />
                      <span className="text-[11px] font-bold text-travo-gray-500 tracking-tight">⭐ {op.rating}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-white">{formatCurrency(op.earnings)}</p>
                    <p className="text-[10px] font-bold text-travo-gray-600 uppercase mt-0.5">{op.journeys} rides</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-8 w-full py-5 rounded-[24px] bg-travo-lemon text-travo-black text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-xl">
              View Detailed Rankings
            </button>
          </motion.div>
        </div>

        {/* Action Center Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Journeys Table Section */}
          <motion.div variants={item} className="xl:col-span-2 bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[48px] p-10">
             <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-3xl bg-travo-lemon/10 flex items-center justify-center">
                    <Navigation size={26} className="text-travo-lemon" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight">Live Activity</h3>
                    <p className="text-[11px] text-travo-gray-500 font-bold uppercase tracking-widest mt-1">Recent Journeys across Kampala</p>
                  </div>
                </div>
                <button className="px-6 py-3 rounded-2xl bg-white/5 text-[11px] font-black uppercase tracking-wider text-travo-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5">
                  See Real-time Map
                </button>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-travo-gray-600 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                      <th className="pb-5 pl-4">ID</th>
                      <th className="pb-5">Client</th>
                      <th className="pb-5">Operator</th>
                      <th className="pb-5">Route</th>
                      <th className="pb-5">Price</th>
                      <th className="pb-5">Status</th>
                      <th className="pb-5 text-right pr-4">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentJourneys.map((j) => (
                      <tr key={j.id} className="group hover:bg-white/5 transition-colors duration-300">
                        <td className="py-6 pl-4 font-black text-[11px] text-travo-lemon tracking-widest">{j.id}</td>
                        <td className="py-6 font-bold text-[14px] text-white">{j.client}</td>
                        <td className="py-6 text-[14px] text-travo-gray-400 font-medium">{j.operator}</td>
                        <td className="py-6">
                           <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-travo-lemon" />
                             <span className="text-[12px] font-bold text-white tracking-tight">{j.route}</span>
                           </div>
                        </td>
                        <td className="py-6 font-black text-[14px] text-white">{formatCurrency(j.price)}</td>
                        <td className="py-6"><StatusBadge status={j.status} /></td>
                        <td className="py-6 text-right pr-4 text-[11px] font-bold text-travo-gray-600 uppercase tracking-tighter">{j.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </motion.div>

          {/* Verification Actions Card */}
          <motion.div variants={item} className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[48px] p-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-3xl bg-travo-lemon/10 flex items-center justify-center">
                  <ShieldCheck size={26} className="text-travo-lemon" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">Vetting</h3>
                  <p className="text-[11px] text-travo-gray-500 font-bold uppercase tracking-widest mt-1">Critical Review Queue</p>
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-travo-orange/10 border border-travo-orange/20 text-travo-orange text-[10px] font-black uppercase">
                {pendingVerifications.length} Alerts
              </div>
            </div>

            <div className="space-y-6">
              {pendingVerifications.map((v, i) => (
                <div key={i} className="p-6 rounded-[32px] bg-travo-black/40 border border-white/5 group hover:border-travo-lemon/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[15px] font-black text-white tracking-tight">{v.name}</p>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                       <Clock size={10} className="text-travo-gray-500" />
                       <span className="text-[9px] text-travo-gray-500 font-black uppercase tracking-tighter">{v.submitted}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-6">
                     <span className="text-[10px] font-black text-travo-gray-400 uppercase tracking-widest">{v.type}</span>
                     <div className="w-1 h-1 rounded-full bg-white/10" />
                     <span className="text-[10px] font-black text-travo-lemon uppercase tracking-widest">{v.docs}</span>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 py-4 text-[11px] font-black uppercase tracking-widest rounded-2xl bg-travo-lemon text-travo-black hover:scale-[1.02] transition-transform">
                      Verify
                    </button>
                    <button className="px-5 py-4 rounded-2xl bg-white/5 text-travo-gray-400 hover:text-white hover:bg-white/10 transition-all">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Platform Architecture Status */}
        <motion.div variants={item} className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[48px] p-10">
          <div className="flex items-center gap-4 mb-10">
             <div className="w-14 h-14 rounded-3xl bg-travo-lemon/10 flex items-center justify-center">
                <Zap size={26} className="text-travo-lemon" />
             </div>
             <div>
                <h3 className="text-2xl font-black text-white tracking-tight">System Infrastructure</h3>
                <p className="text-[11px] text-travo-gray-500 font-bold uppercase tracking-widest mt-1">Multi-Service Micro-Latency Monitoring</p>
             </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'API Gateway', latency: '12ms' },
              { name: 'Auth Node', latency: '8ms' },
              { name: 'Journey Engine', latency: '15ms' },
              { name: 'Matching Bus', latency: '5ms' },
              { name: 'Spatial Geo', latency: '3ms' },
              { name: 'Redis Edge', latency: '1ms' },
            ].map((service) => (
              <div key={service.name} className="relative group p-6 rounded-[32px] bg-travo-black/40 border border-white/5 text-center transition-all duration-300 hover:border-travo-lemon/20">
                <div className="w-2.5 h-2.5 rounded-full bg-travo-lemon mx-auto mb-4 animate-pulse shadow-[0_0_8px_rgba(168,225,12,0.8)]" />
                <p className="text-[11px] font-black text-white uppercase tracking-wider">{service.name}</p>
                <div className="mt-3 flex items-center justify-center gap-1.5">
                   <Activity size={10} className="text-travo-gray-600" />
                   <p className="text-[12px] font-black text-travo-lemon tracking-tighter">{service.latency}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
