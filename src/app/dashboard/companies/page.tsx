'use client';

import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import {
  Building2,
  Users,
  Car,
  TrendingUp,
  MapPin,
  ShieldCheck,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  Globe,
  Settings2,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

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

const companies = [
  {
    id: 'C-101',
    name: 'Smart Fleet Kampala',
    owner: 'James Mukasa',
    operators: 45,
    vehicles: 52,
    earnings: 45000000,
    status: 'VERIFIED',
    location: 'Central Kampala',
    commission: '15% / Ride',
  },
  {
    id: 'C-102',
    name: 'Swift Boda Co.',
    owner: 'Sarah Nalwoga',
    operators: 120,
    vehicles: 115,
    earnings: 82000000,
    status: 'VERIFIED',
    location: 'Nakawa Division',
    commission: '2,000 UGX / Day',
  },
  {
    id: 'C-103',
    name: 'Elite Rides UG',
    owner: 'Abdul Ssempijja',
    operators: 28,
    vehicles: 30,
    earnings: 12500000,
    status: 'PENDING',
    location: 'Entebbe Road',
    commission: '10% / Ride',
  },
  {
    id: 'C-104',
    name: 'Kla Logistics',
    owner: 'Grace Namutebi',
    operators: 15,
    vehicles: 20,
    earnings: 8900000,
    status: 'VERIFIED',
    location: 'Kiwatule',
    commission: '500 UGX / KM',
  },
];

export default function CompaniesPage() {
  return (
    <div className="min-h-screen bg-travo-black text-white">
      <Header 
        title="Tenant Management" 
        subtitle="Orchestrating fleet companies and logistics partners on the TRAVO network." 
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="p-10 space-y-10"
      >
        {/* Top Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <motion.div variants={item}>
              <h2 className="text-3xl font-black tracking-tight">Active Tenants</h2>
              <p className="text-travo-gray-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">48 Total Partners • 12 Pending</p>
           </motion.div>
           <motion.div variants={item} className="flex items-center gap-4">
              <div className="relative group">
                 <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-travo-gray-600 group-focus-within:text-travo-lemon transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search companies..." 
                   className="bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-sm w-[300px] focus:outline-none focus:border-travo-lemon/40 transition-all placeholder:text-travo-gray-700" 
                 />
              </div>
              <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-travo-lemon text-travo-black font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_10px_20px_rgba(168,225,12,0.2)]">
                 <Plus size={16} />
                 <span>Register Tenant</span>
              </button>
           </motion.div>
        </div>

        {/* Company Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
           {companies.map((company) => (
             <motion.div 
               key={company.id} 
               variants={item}
               className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 group hover:bg-white/10 transition-all duration-500 relative overflow-hidden"
             >
                {/* Background Decor */}
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-travo-lemon/5 rounded-full blur-[80px] group-hover:bg-travo-lemon/10 transition-all" />
                
                <div className="flex items-start justify-between relative z-10">
                   <div className="flex items-center gap-5">
                      <div className="w-20 h-20 rounded-[32px] bg-travo-lemon/10 flex items-center justify-center border border-travo-lemon/20 group-hover:scale-110 transition-transform duration-500">
                         <Building2 size={36} className="text-travo-lemon" />
                      </div>
                      <div>
                         <div className="flex items-center gap-3">
                            <h3 className="text-2xl font-black tracking-tight">{company.name}</h3>
                            {company.status === 'VERIFIED' ? (
                               <div className="px-2 py-0.5 rounded-md bg-travo-lemon/10 border border-travo-lemon/20 text-travo-lemon text-[9px] font-black uppercase">Verified</div>
                            ) : (
                               <div className="px-2 py-0.5 rounded-md bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-[9px] font-black uppercase">Pending Review</div>
                            )}
                         </div>
                         <div className="flex items-center gap-2 mt-1.5 text-travo-gray-500">
                            <MapPin size={12} />
                            <span className="text-[12px] font-bold">{company.location}</span>
                         </div>
                      </div>
                   </div>
                   <button className="p-3 rounded-2xl bg-white/5 text-travo-gray-500 hover:text-white transition-colors border border-white/5">
                      <Settings2 size={18} />
                   </button>
                </div>

                <div className="grid grid-cols-3 gap-6 mt-12 relative z-10">
                   <div className="bg-travo-black/40 border border-white/5 rounded-3xl p-5">
                      <p className="text-[10px] font-black text-travo-gray-600 uppercase tracking-widest">Operators</p>
                      <div className="flex items-center gap-2 mt-1">
                         <Users size={14} className="text-travo-lemon" />
                         <span className="text-xl font-black">{company.operators}</span>
                      </div>
                   </div>
                   <div className="bg-travo-black/40 border border-white/5 rounded-3xl p-5">
                      <p className="text-[10px] font-black text-travo-gray-600 uppercase tracking-widest">Vehicles</p>
                      <div className="flex items-center gap-2 mt-1">
                         <Car size={14} className="text-travo-lemon" />
                         <span className="text-xl font-black">{company.vehicles}</span>
                      </div>
                   </div>
                   <div className="bg-travo-black/40 border border-white/5 rounded-3xl p-5">
                      <p className="text-[10px] font-black text-travo-gray-600 uppercase tracking-widest">Earning (Mo)</p>
                      <div className="flex items-center gap-2 mt-1">
                         <TrendingUp size={14} className="text-travo-lemon" />
                         <span className="text-lg font-black">{formatCurrency(company.earnings).split('.')[0]}</span>
                      </div>
                   </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-travo-gray-600 uppercase tracking-widest">Active Model</span>
                      <span className="text-[13px] font-black text-white mt-1">{company.commission}</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <button className="px-6 py-3 rounded-2xl bg-white/5 text-[11px] font-black uppercase tracking-widest text-travo-gray-400 hover:text-white transition-all border border-white/5">
                         View Analytics
                      </button>
                      <button className="px-6 py-3 rounded-2xl bg-travo-lemon text-travo-black text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                         Manage Fleet
                      </button>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Global Network Stats */}
        <motion.div variants={item} className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 relative overflow-hidden">
           <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 rounded-3xl bg-travo-lemon/10 flex items-center justify-center">
                    <Globe size={26} className="text-travo-lemon" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black tracking-tight">Spatial Coverage</h3>
                    <p className="text-[11px] text-travo-gray-500 font-bold uppercase tracking-widest mt-1">Global H3 Connectivity Map</p>
                 </div>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-[11px] font-black uppercase tracking-widest text-travo-gray-400 hover:text-white transition-all">
                 <ArrowUpRight size={14} />
                 <span>Expand View</span>
              </button>
           </div>
           
           <div className="mt-12 h-64 bg-travo-black/60 rounded-[32px] border border-white/5 flex items-center justify-center group cursor-crosshair">
              <div className="text-center">
                 <div className="w-12 h-12 rounded-full border-2 border-travo-lemon animate-ping mx-auto" />
                 <p className="mt-4 text-[11px] font-black text-travo-gray-500 uppercase tracking-[0.3em]">Map Engine Initializing...</p>
                 <p className="text-[10px] text-travo-lemon font-bold mt-1 uppercase">Kampala Cluster v4.2</p>
              </div>
           </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
