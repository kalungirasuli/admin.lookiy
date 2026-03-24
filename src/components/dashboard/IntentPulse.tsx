'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const mockIntents = [
  { term: 'Kololo', count: 145, size: 'text-3xl' },
  { term: 'Boda', count: 98, size: 'text-2xl' },
  { term: 'Ntinda', count: 87, size: 'text-xl' },
  { term: 'Entebbe', count: 76, size: 'text-2xl' },
  { term: 'Pharmacy', count: 65, size: 'text-lg' },
  { term: 'Supermarket', count: 54, size: 'text-md' },
  { term: 'Fuel', count: 43, size: 'text-xl' },
  { term: 'Wandegeya', count: 32, size: 'text-lg' },
  { term: 'Hardware', count: 21, size: 'text-md' },
  { term: 'Salon', count: 15, size: 'text-sm' },
];

export default function IntentPulse() {
  return (
    <div className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 flex flex-col h-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-3xl bg-travo-lemon/10 flex items-center justify-center">
          <Sparkles size={26} className="text-travo-lemon" />
        </div>
        <div>
          <h3 className="text-xl font-black text-white tracking-tight">Intent Pulse</h3>
          <p className="text-[11px] text-travo-gray-500 font-bold uppercase tracking-widest mt-1">Live Search Trending</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-center flex-1">
        {mockIntents.map((intent, i) => (
          <motion.span
            key={intent.term}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className={`font-black uppercase tracking-tighter cursor-default transition-all duration-300 hover:text-travo-lemon hover:scale-110 ${intent.size} ${i % 2 === 0 ? 'text-white' : 'text-travo-gray-400'}`}
          >
            {intent.term}
          </motion.span>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
        <p className="text-[10px] text-travo-gray-600 font-black uppercase tracking-widest">Last 60 Minutes</p>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-travo-lemon animate-pulse" />
           <p className="text-[10px] text-travo-lemon font-black uppercase tracking-tighter">Live Capture</p>
        </div>
      </div>
    </div>
  );
}
