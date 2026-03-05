'use client';

import Header from '@/components/layout/Header';
import { cn, formatCurrency } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Car,
  Bike,
  Bus,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  Clock,
  BarChart3,
  Activity,
  Zap,
  Navigation,
  Calendar,
} from 'lucide-react';
import { useState } from 'react';

const keyMetrics = [
  { label: 'Total Revenue', value: formatCurrency(892000000), change: '+22.4%', trend: 'up', icon: DollarSign, color: 'gradient-orange' },
  { label: 'Growth Rate', value: '18.5%', change: '+3.2% vs last month', trend: 'up', icon: TrendingUp, color: 'bg-green-600' },
  { label: 'Active Users', value: '8,234', change: '+680 this week', trend: 'up', icon: Users, color: 'bg-blue-600' },
  { label: 'Most Popular', value: 'Boda', change: '64% of journeys', trend: 'up', icon: Bike, color: 'bg-purple-600' },
];

// Daily journeys data (last 30 days)
const dailyJourneys = [
  820, 780, 910, 875, 940, 1020, 980, 890, 850, 920,
  960, 1050, 1100, 1030, 970, 915, 880, 950, 1010, 1080,
  1120, 1060, 990, 935, 870, 920, 980, 1040, 1090, 1150,
];

// Demand heatmap data (7 days x 24 hours)
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 24 }, (_, i) => i);
const heatmapData = days.map(() =>
  hours.map(() => Math.floor(Math.random() * 100))
);
// Make rush hours hotter
heatmapData.forEach((day) => {
  [7, 8, 9].forEach(h => { day[h] = 60 + Math.floor(Math.random() * 40); });
  [17, 18, 19].forEach(h => { day[h] = 70 + Math.floor(Math.random() * 30); });
  [12, 13].forEach(h => { day[h] = 50 + Math.floor(Math.random() * 30); });
  [1, 2, 3, 4, 5].forEach(h => { day[h] = Math.floor(Math.random() * 20); });
});

const vehicleDistribution = [
  { type: 'Boda', percentage: 64, count: 15900, color: 'bg-travo-orange', icon: Bike },
  { type: 'Car', percentage: 24, count: 5960, color: 'bg-blue-500', icon: Car },
  { type: 'Taxi', percentage: 12, count: 2980, color: 'bg-green-500', icon: Bus },
];

const busiestRoutes = [
  { from: 'Kololo', to: 'Ntinda', journeys: 1240, avgFare: 8000 },
  { from: 'Kampala CBD', to: 'Entebbe Airport', journeys: 890, avgFare: 85000 },
  { from: 'Wandegeya', to: 'Makerere', journeys: 780, avgFare: 5000 },
  { from: 'Nakasero', to: 'Bugolobi', journeys: 650, avgFare: 15000 },
  { from: 'Kisementi', to: 'Lubowa', journeys: 520, avgFare: 45000 },
  { from: 'Muyenga', to: 'Kabalagala', journeys: 490, avgFare: 6000 },
  { from: 'Ntinda', to: 'Bukoto', journeys: 450, avgFare: 4000 },
  { from: 'Naguru', to: 'Kololo', journeys: 420, avgFare: 5000 },
];

const peakHours = [
  { hour: '6 AM', value: 35 },
  { hour: '7 AM', value: 68 },
  { hour: '8 AM', value: 92 },
  { hour: '9 AM', value: 85 },
  { hour: '10 AM', value: 55 },
  { hour: '11 AM', value: 48 },
  { hour: '12 PM', value: 62 },
  { hour: '1 PM', value: 70 },
  { hour: '2 PM', value: 52 },
  { hour: '3 PM', value: 45 },
  { hour: '4 PM', value: 58 },
  { hour: '5 PM', value: 78 },
  { hour: '6 PM', value: 95 },
  { hour: '7 PM', value: 88 },
  { hour: '8 PM', value: 65 },
  { hour: '9 PM', value: 48 },
  { hour: '10 PM', value: 32 },
  { hour: '11 PM', value: 20 },
];

function getHeatColor(value: number) {
  if (value < 20) return 'bg-green-100';
  if (value < 40) return 'bg-green-300';
  if (value < 60) return 'bg-yellow-300';
  if (value < 80) return 'bg-orange-400';
  return 'bg-red-500';
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30D');
  const maxJourney = Math.max(...dailyJourneys);

  return (
    <div>
      <Header title="Analytics" subtitle="Platform insights and performance metrics" />

      <div className="p-8 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {keyMetrics.map((metric) => (
            <div key={metric.label} className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center text-white', metric.color)}>
                  <metric.icon size={22} />
                </div>
                <div className={cn(
                  'flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg',
                  metric.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600',
                )}>
                  {metric.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {metric.change}
                </div>
              </div>
              <p className="text-sm text-travo-gray-500 font-medium">{metric.label}</p>
              <p className="text-2xl font-bold text-travo-black mt-1">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Daily Journeys Chart */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-travo-black">Daily Journeys</h3>
              <p className="text-sm text-travo-gray-500">Journey volume over time</p>
            </div>
            <div className="flex gap-2">
              {['7D', '14D', '30D', '90D'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeRange(period)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                    timeRange === period
                      ? 'bg-travo-orange text-white'
                      : 'bg-travo-gray-100 text-travo-gray-600 hover:bg-travo-gray-200',
                  )}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[280px] flex items-end gap-1.5 px-2">
            {dailyJourneys.map((value, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="hidden group-hover:block text-[10px] font-semibold text-travo-black bg-white shadow-lg rounded-md px-2 py-1 mb-1 whitespace-nowrap">
                  {value} journeys
                </div>
                <div
                  className="w-full rounded-t-md gradient-orange opacity-75 hover:opacity-100 transition-all duration-200 cursor-pointer"
                  style={{ height: `${(value / maxJourney) * 240}px` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between px-2 mt-3 text-xs text-travo-gray-400">
            <span>Feb 4</span>
            <span>Feb 11</span>
            <span>Feb 18</span>
            <span>Feb 25</span>
            <span>Mar 5</span>
          </div>
        </div>

        {/* Heatmap + Vehicle Distribution */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Demand Heatmap */}
          <div className="xl:col-span-2 glass-card p-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-travo-black">Demand Heatmap</h3>
              <p className="text-sm text-travo-gray-500">Journey demand by day and hour</p>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                {/* Hour labels */}
                <div className="flex items-center gap-0.5 mb-1 pl-10">
                  {hours.filter((_, i) => i % 3 === 0).map((h) => (
                    <div key={h} className="text-[9px] text-travo-gray-400 font-medium" style={{ width: `${(100 / 8)}%` }}>
                      {h === 0 ? '12am' : h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`}
                    </div>
                  ))}
                </div>
                {/* Heatmap grid */}
                {days.map((day, dayIdx) => (
                  <div key={day} className="flex items-center gap-0.5 mb-0.5">
                    <span className="text-[10px] font-semibold text-travo-gray-500 w-8">{day}</span>
                    <div className="flex gap-0.5 flex-1">
                      {heatmapData[dayIdx].map((val, hourIdx) => (
                        <div
                          key={hourIdx}
                          className={cn('flex-1 h-6 rounded-sm transition-all hover:scale-110 cursor-pointer', getHeatColor(val))}
                          title={`${day} ${hourIdx}:00 - ${val} journeys`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                {/* Legend */}
                <div className="flex items-center gap-3 mt-4 pl-10">
                  <span className="text-[10px] text-travo-gray-400">Low</span>
                  <div className="flex gap-1">
                    {['bg-green-100', 'bg-green-300', 'bg-yellow-300', 'bg-orange-400', 'bg-red-500'].map((c) => (
                      <div key={c} className={cn('w-5 h-3 rounded-sm', c)} />
                    ))}
                  </div>
                  <span className="text-[10px] text-travo-gray-400">High</span>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Distribution */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-travo-black mb-1">Vehicle Distribution</h3>
            <p className="text-sm text-travo-gray-500 mb-6">Journey share by vehicle type</p>

            <div className="space-y-5">
              {vehicleDistribution.map((v) => (
                <div key={v.type}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-white', v.color)}>
                        <v.icon size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-travo-black">{v.type}</p>
                        <p className="text-xs text-travo-gray-400">{v.count.toLocaleString()} journeys</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-travo-black">{v.percentage}%</span>
                  </div>
                  <div className="h-3 bg-travo-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-700', v.color)}
                      style={{ width: `${v.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-travo-gray-100">
              <p className="text-xs text-travo-gray-400 mb-2">Total This Month</p>
              <p className="text-2xl font-bold text-travo-black">24,840</p>
              <p className="text-xs text-green-600 font-semibold mt-1 flex items-center gap-1">
                <ArrowUpRight size={12} /> +12.5% vs last month
              </p>
            </div>
          </div>
        </div>

        {/* Busiest Routes + Peak Hours */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Busiest Routes */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-travo-black mb-1">Busiest Routes</h3>
            <p className="text-sm text-travo-gray-500 mb-5">Top routes by journey count</p>
            <div className="space-y-3">
              {busiestRoutes.map((route, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-travo-gray-50 transition-colors">
                  <div className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold',
                    i < 3 ? 'gradient-orange' : 'bg-travo-gray-300',
                  )}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-travo-black">
                      <MapPin size={12} className="text-travo-orange flex-shrink-0" />
                      <span className="truncate">{route.from} → {route.to}</span>
                    </div>
                    <p className="text-xs text-travo-gray-400">Avg fare: {formatCurrency(route.avgFare)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-travo-black">{route.journeys.toLocaleString()}</p>
                    <p className="text-[10px] text-travo-gray-400">journeys</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Peak Hours */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-travo-black mb-1">Peak Hours</h3>
            <p className="text-sm text-travo-gray-500 mb-5">Average journey volume by hour</p>
            <div className="h-[300px] flex items-end gap-1 px-1">
              {peakHours.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="hidden group-hover:block text-[10px] font-semibold text-travo-black bg-white shadow-lg rounded-md px-2 py-1 mb-1 whitespace-nowrap">
                    {h.hour}: {h.value}%
                  </div>
                  <div
                    className={cn(
                      'w-full rounded-t-md transition-all duration-200 cursor-pointer',
                      h.value >= 80 ? 'gradient-orange opacity-100' : h.value >= 60 ? 'gradient-orange opacity-70' : 'bg-travo-gray-200',
                    )}
                    style={{ height: `${h.value * 2.8}px` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between px-1 mt-3 text-[9px] text-travo-gray-400">
              {peakHours.filter((_, i) => i % 3 === 0).map((h) => (
                <span key={h.hour}>{h.hour}</span>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-travo-gray-100">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-travo-orange" />
                <div>
                  <p className="text-xs text-travo-gray-400">Morning Rush</p>
                  <p className="text-sm font-bold text-travo-black">7 – 9 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-travo-orange" />
                <div>
                  <p className="text-xs text-travo-gray-400">Evening Rush</p>
                  <p className="text-sm font-bold text-travo-black">5 – 7 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <Zap size={14} className="text-travo-lemon" />
                <div>
                  <p className="text-xs text-travo-gray-400">Peak</p>
                  <p className="text-sm font-bold text-travo-black">6 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
