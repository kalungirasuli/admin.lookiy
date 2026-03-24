'use client';

import { motion } from 'framer-motion';
import { Globe, Map as MapIcon } from 'lucide-react';

export default function DensityMap() {
  return (
    <div className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 flex flex-col h-full relative overflow-hidden">
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-travo-lemon/10 flex items-center justify-center">
            <MapIcon size={26} className="text-travo-lemon" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">Traffic Density</h3>
            <p className="text-[11px] text-travo-gray-500 font-bold uppercase tracking-widest mt-1">Spatial Intent Heatmap</p>
          </div>
        </div>
        <div className="flex bg-travo-black/40 p-1 rounded-xl border border-white/5">
           <button className="px-3 py-1.5 rounded-lg text-[9px] font-black bg-travo-lemon text-travo-black uppercase tracking-wider">H3-L8</button>
           <button className="px-3 py-1.5 rounded-lg text-[9px] font-black text-travo-gray-500 hover:text-white uppercase tracking-wider transition-colors">H3-L9</button>
        </div>
      </div>

      <div className="flex-1 rounded-[32px] bg-travo-black/60 border border-white/5 relative overflow-hidden flex items-center justify-center">
         {/* Mock Map Background */}
         <div className="absolute inset-0 opacity-20 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/32.5825,0.3476,12/800x600?access_token=YOUR_TOKEN')] bg-cover" />
         
         {/* Animated Heatmap Ripples */}
         {[
           { top: '30%', left: '40%', size: 'w-40 h-40', delay: 0 },
           { top: '50%', left: '60%', size: 'w-60 h-60', delay: 1 },
           { top: '70%', left: '30%', size: 'w-32 h-32', delay: 0.5 },
           { top: '20%', left: '70%', size: 'w-48 h-48', delay: 1.5 },
         ].map((ripple, i) => (
           <motion.div
             key={i}
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: [0.8, 1.2, 1], opacity: [0, 0.3, 0.2] }}
             transition={{ repeat: Infinity, duration: 4, delay: ripple.delay }}
             style={{ top: ripple.top, left: ripple.left }}
             className={`absolute rounded-full bg-travo-lemon/40 blur-3xl -translate-x-1/2 -translate-y-1/2 ${ripple.size}`}
           />
         ))}

         <div className="relative z-10 text-center">
            <Globe size={48} className="text-travo-lemon/20 mx-auto mb-4" />
            <p className="text-[10px] text-travo-gray-500 font-black uppercase tracking-[0.3em]">Kampala Metropolitan Engine</p>
         </div>
      </div>

      <div className="mt-8 flex items-center gap-6 relative z-10">
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-travo-lemon" />
            <span className="text-[10px] text-travo-gray-400 font-bold uppercase tracking-widest">High Intent</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-travo-lemon/30" />
            <span className="text-[10px] text-travo-gray-400 font-bold uppercase tracking-widest">Low Intent</span>
         </div>
      </div>
    </div>
  );
}
