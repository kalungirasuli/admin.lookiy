'use client';

import { useState } from 'react';
import { Navigation, Eye, EyeOff, ArrowRight, Smartphone } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-1/2 gradient-orange relative overflow-hidden items-center justify-center">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white/20"
              style={{
                width: `${100 + i * 60}px`,
                height: `${100 + i * 60}px`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-12">
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center mx-auto mb-8">
            <Navigation className="text-white" size={40} />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">TRAVO</h1>
          <p className="text-xl text-white/80 mb-2">Ride-Hailing & Map Commerce</p>
          <p className="text-white/60 max-w-md mx-auto">
            The future of mobility. Manage your platform, operators, journeys, and map-based advertising from one powerful dashboard.
          </p>

          {/* Stats */}
          <div className="flex gap-8 justify-center mt-12">
            {[
              { label: 'Active Users', value: '8,000+' },
              { label: 'Daily Rides', value: '24,000+' },
              { label: 'Operators', value: '1,400+' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="w-14 h-14 rounded-2xl gradient-orange flex items-center justify-center mx-auto mb-4">
              <Navigation className="text-white" size={28} />
            </div>
            <h1 className="text-3xl font-bold text-travo-black">TRAVO</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-travo-black">Welcome back</h2>
            <p className="text-travo-gray-500 mt-2">Sign in to your admin dashboard</p>
          </div>

          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setIsLoading(true); }}>
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-travo-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="admin@travo.app"
                className="input-field"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-travo-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="input-field pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-travo-gray-400 hover:text-travo-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-travo-gray-300 text-travo-orange focus:ring-travo-orange" />
                <span className="text-sm text-travo-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm font-semibold text-travo-orange hover:text-travo-orange-dark">
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary !py-4 flex items-center justify-center gap-2 text-base"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-travo-gray-200" />
            <span className="text-xs text-travo-gray-400 font-medium">OR CONTINUE WITH</span>
            <div className="flex-1 h-px bg-travo-gray-200" />
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-3 border border-travo-gray-200 rounded-xl hover:bg-travo-gray-50 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              <span className="text-sm font-semibold text-travo-gray-700">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 border border-travo-gray-200 rounded-xl hover:bg-travo-gray-50 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#000"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.32-2.11 4.45-3.74 4.25z"/></svg>
              <span className="text-sm font-semibold text-travo-gray-700">Apple</span>
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-travo-gray-400 mt-8">
            TRAVO Admin v1.0 • Protected by enterprise security
          </p>
        </div>
      </div>
    </div>
  );
}
