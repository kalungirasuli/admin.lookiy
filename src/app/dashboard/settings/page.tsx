'use client';

import Header from '@/components/layout/Header';
import { cn } from '@/lib/utils';
import {
  User,
  Mail,
  Phone,
  Camera,
  Globe,
  DollarSign,
  Shield,
  Bell,
  Key,
  Database,
  Smartphone,
  Wifi,
  Eye,
  EyeOff,
  Save,
  Settings2,
  Lock,
  LogOut,
  MapPin,
  Smile,
  Flame,
  CreditCard,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  ChevronRight,
  Monitor,
} from 'lucide-react';
import { useState } from 'react';

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
  label: string;
  description?: string;
}

function ToggleSwitch({ enabled, onToggle, label, description }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-semibold text-travo-black">{label}</p>
        {description && <p className="text-xs text-travo-gray-400 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={onToggle}
        className={cn(
          'relative w-11 h-6 rounded-full transition-colors duration-200',
          enabled ? 'bg-travo-orange' : 'bg-travo-gray-300',
        )}
      >
        <div className={cn(
          'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200',
          enabled ? 'translate-x-[22px]' : 'translate-x-0.5',
        )} />
      </button>
    </div>
  );
}

const sections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'platform', label: 'Platform', icon: Globe },
  { id: 'api', label: 'API Keys', icon: Key },
  { id: 'integrations', label: 'Integrations', icon: Database },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

const integrations = [
  { name: 'Google Maps Platform', icon: MapPin, status: 'connected', description: 'Geocoding, routing, and map tiles', color: 'text-green-600' },
  { name: 'Smile ID', icon: Smile, status: 'connected', description: 'Identity verification and KYC', color: 'text-blue-600' },
  { name: 'Firebase', icon: Flame, status: 'connected', description: 'Push notifications and analytics', color: 'text-orange-600' },
  { name: 'MTN MoMo API', icon: CreditCard, status: 'connected', description: 'Mobile money payments', color: 'text-yellow-600' },
  { name: 'Airtel Money API', icon: CreditCard, status: 'connected', description: 'Mobile money payments', color: 'text-red-600' },
  { name: 'Twilio', icon: Smartphone, status: 'disconnected', description: 'SMS notifications', color: 'text-travo-gray-400' },
];

const sessions = [
  { device: 'Chrome · Windows 11', location: 'Kololo, Kampala', ip: '102.68.45.12', lastActive: 'Active now', current: true },
  { device: 'Safari · iPhone 15', location: 'Ntinda, Kampala', ip: '102.68.45.15', lastActive: '2 hours ago', current: false },
  { device: 'Firefox · MacOS', location: 'Entebbe', ip: '41.210.32.8', lastActive: '1 day ago', current: false },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [showApiKey, setShowApiKey] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [twoFA, setTwoFA] = useState(true);
  const [notifPrefs, setNotifPrefs] = useState({
    journeyAlerts: true,
    paymentAlerts: true,
    securityAlerts: true,
    systemUpdates: true,
    emailDigest: false,
    smsAlerts: false,
  });

  const [profile, setProfile] = useState({
    firstName: 'Kalungi',
    lastName: 'Admin',
    email: 'kalungi@travo.ug',
    phone: '+256 700 123 456',
  });

  const [platform, setPlatform] = useState({
    name: 'TRAVO',
    currency: 'UGX',
    country: 'Uganda',
    timezone: 'Africa/Kampala',
  });

  return (
    <div>
      <Header title="Settings" subtitle="Configure your admin profile and platform settings" />

      <div className="p-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-56 flex-shrink-0 hidden lg:block">
            <nav className="glass-card p-3 sticky top-24">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-1',
                    activeSection === section.id
                      ? 'bg-travo-orange text-white shadow-travo'
                      : 'text-travo-gray-600 hover:bg-travo-gray-50 hover:text-travo-black',
                  )}
                >
                  <section.icon size={16} />
                  {section.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-6 max-w-3xl">
            {/* Profile Settings */}
            {(activeSection === 'profile' || activeSection === 'all') && (
              <div className="glass-card p-6 animate-fade-in" id="profile">
                <h3 className="text-lg font-bold text-travo-black mb-1">Profile Settings</h3>
                <p className="text-sm text-travo-gray-500 mb-6">Manage your admin profile information</p>

                {/* Avatar */}
                <div className="flex items-center gap-5 mb-8">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl gradient-orange flex items-center justify-center text-white text-2xl font-bold">
                      KA
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow-card border border-travo-gray-200 flex items-center justify-center hover:bg-travo-gray-50 transition-colors">
                      <Camera size={12} className="text-travo-gray-600" />
                    </button>
                  </div>
                  <div>
                    <p className="font-semibold text-travo-black">{profile.firstName} {profile.lastName}</p>
                    <p className="text-xs text-travo-gray-500">Platform Administrator</p>
                    <button className="text-xs text-travo-orange font-semibold mt-1 hover:underline">
                      Change avatar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-travo-gray-600 mb-1.5">First Name</label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-travo-gray-600 mb-1.5">Last Name</label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-travo-gray-600 mb-1.5">Email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-travo-gray-400" />
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="input-field !pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-travo-gray-600 mb-1.5">Phone Number</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-travo-gray-400" />
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="input-field !pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button className="btn-primary flex items-center gap-2 text-sm">
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Platform Settings */}
            {(activeSection === 'platform' || activeSection === 'all') && (
              <div className="glass-card p-6 animate-fade-in" id="platform">
                <h3 className="text-lg font-bold text-travo-black mb-1">Platform Settings</h3>
                <p className="text-sm text-travo-gray-500 mb-6">Configure TRAVO platform settings</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-semibold text-travo-gray-600 mb-1.5">Platform Name</label>
                    <input
                      type="text"
                      value={platform.name}
                      onChange={(e) => setPlatform({ ...platform, name: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-travo-gray-600 mb-1.5">Default Currency</label>
                    <select
                      value={platform.currency}
                      onChange={(e) => setPlatform({ ...platform, currency: e.target.value })}
                      className="input-field"
                    >
                      <option value="UGX">UGX - Ugandan Shilling</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="KES">KES - Kenyan Shilling</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-travo-gray-600 mb-1.5">Country</label>
                    <input
                      type="text"
                      value={platform.country}
                      readOnly
                      className="input-field bg-travo-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-travo-gray-600 mb-1.5">Timezone</label>
                    <input
                      type="text"
                      value={platform.timezone}
                      readOnly
                      className="input-field bg-travo-gray-50"
                    />
                  </div>
                </div>

                <div className="border-t border-travo-gray-100 pt-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-red-50/50 border border-red-200/50">
                    <div className="flex items-center gap-3">
                      <AlertTriangle size={18} className="text-red-600" />
                      <div>
                        <p className="text-sm font-semibold text-red-800">Maintenance Mode</p>
                        <p className="text-xs text-red-600">Disables access for non-admin users</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setMaintenanceMode(!maintenanceMode)}
                      className={cn(
                        'relative w-11 h-6 rounded-full transition-colors duration-200',
                        maintenanceMode ? 'bg-red-500' : 'bg-travo-gray-300',
                      )}
                    >
                      <div className={cn(
                        'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200',
                        maintenanceMode ? 'translate-x-[22px]' : 'translate-x-0.5',
                      )} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* API Keys */}
            {(activeSection === 'api' || activeSection === 'all') && (
              <div className="glass-card p-6 animate-fade-in" id="api">
                <h3 className="text-lg font-bold text-travo-black mb-1">API Keys</h3>
                <p className="text-sm text-travo-gray-500 mb-6">Manage your platform API keys</p>

                <div className="space-y-4">
                  {[
                    { label: 'Production API Key', key: 'trv_prod_sk_4f8a9b2c1d3e5f6a7b8c9d0e', created: 'Jan 15, 2025' },
                    { label: 'Staging API Key', key: 'trv_stg_sk_1a2b3c4d5e6f7a8b9c0d1e2f', created: 'Feb 20, 2025' },
                    { label: 'Webhook Secret', key: 'whsec_8f7e6d5c4b3a2918f7e6d5c4', created: 'Jan 15, 2025' },
                  ].map((api) => (
                    <div key={api.label} className="p-4 rounded-xl border border-travo-gray-200 hover:border-travo-gray-300 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-travo-black">{api.label}</p>
                        <span className="text-xs text-travo-gray-400">Created {api.created}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 bg-travo-gray-50 rounded-lg px-3 py-2 text-xs font-mono text-travo-gray-600">
                          {showApiKey ? api.key : api.key.replace(/./g, '•').slice(0, 32) + api.key.slice(-4)}
                        </code>
                        <button
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="p-2 rounded-lg hover:bg-travo-gray-100 text-travo-gray-400 hover:text-travo-black transition-colors"
                        >
                          {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button className="p-2 rounded-lg hover:bg-travo-gray-100 text-travo-gray-400 hover:text-travo-black transition-colors">
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-4 btn-outline text-sm !py-2 flex items-center gap-2">
                  <Key size={14} />
                  Generate New Key
                </button>
              </div>
            )}

            {/* Integrations */}
            {(activeSection === 'integrations' || activeSection === 'all') && (
              <div className="glass-card p-6 animate-fade-in" id="integrations">
                <h3 className="text-lg font-bold text-travo-black mb-1">Integrations</h3>
                <p className="text-sm text-travo-gray-500 mb-6">Connected third-party services</p>

                <div className="space-y-3">
                  {integrations.map((integration) => (
                    <div key={integration.name} className="flex items-center gap-4 p-4 rounded-xl border border-travo-gray-200 hover:border-travo-gray-300 transition-colors group">
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center bg-travo-gray-50', integration.color)}>
                        <integration.icon size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-travo-black">{integration.name}</p>
                        <p className="text-xs text-travo-gray-400">{integration.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {integration.status === 'connected' ? (
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
                            <CheckCircle2 size={13} />
                            Connected
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-travo-gray-400">
                            Disconnected
                          </span>
                        )}
                        <button className="p-1.5 rounded-lg hover:bg-travo-gray-100 text-travo-gray-400 opacity-0 group-hover:opacity-100 transition-all">
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notification Preferences */}
            {(activeSection === 'notifications' || activeSection === 'all') && (
              <div className="glass-card p-6 animate-fade-in" id="notifications">
                <h3 className="text-lg font-bold text-travo-black mb-1">Notification Preferences</h3>
                <p className="text-sm text-travo-gray-500 mb-6">Choose what notifications you receive</p>

                <div className="divide-y divide-travo-gray-100">
                  <ToggleSwitch
                    enabled={notifPrefs.journeyAlerts}
                    onToggle={() => setNotifPrefs({ ...notifPrefs, journeyAlerts: !notifPrefs.journeyAlerts })}
                    label="Journey Alerts"
                    description="Notifications about journey events, cancellations, and speed alerts"
                  />
                  <ToggleSwitch
                    enabled={notifPrefs.paymentAlerts}
                    onToggle={() => setNotifPrefs({ ...notifPrefs, paymentAlerts: !notifPrefs.paymentAlerts })}
                    label="Payment Alerts"
                    description="Payout confirmations, failed transactions, and budget warnings"
                  />
                  <ToggleSwitch
                    enabled={notifPrefs.securityAlerts}
                    onToggle={() => setNotifPrefs({ ...notifPrefs, securityAlerts: !notifPrefs.securityAlerts })}
                    label="Security Alerts"
                    description="Login attempts, API rate limits, and suspicious activity"
                  />
                  <ToggleSwitch
                    enabled={notifPrefs.systemUpdates}
                    onToggle={() => setNotifPrefs({ ...notifPrefs, systemUpdates: !notifPrefs.systemUpdates })}
                    label="System Updates"
                    description="Maintenance schedules, new registrations, and platform health"
                  />
                  <ToggleSwitch
                    enabled={notifPrefs.emailDigest}
                    onToggle={() => setNotifPrefs({ ...notifPrefs, emailDigest: !notifPrefs.emailDigest })}
                    label="Daily Email Digest"
                    description="Receive a daily summary of platform activity at 8 AM EAT"
                  />
                  <ToggleSwitch
                    enabled={notifPrefs.smsAlerts}
                    onToggle={() => setNotifPrefs({ ...notifPrefs, smsAlerts: !notifPrefs.smsAlerts })}
                    label="SMS Alerts"
                    description="Critical alerts via SMS (security and high-priority only)"
                  />
                </div>
              </div>
            )}

            {/* Security */}
            {(activeSection === 'security' || activeSection === 'all') && (
              <div className="glass-card p-6 animate-fade-in" id="security">
                <h3 className="text-lg font-bold text-travo-black mb-1">Security</h3>
                <p className="text-sm text-travo-gray-500 mb-6">Protect your admin account</p>

                {/* Change Password */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-travo-black mb-4">Change Password</h4>
                  <div className="space-y-3 max-w-sm">
                    <div>
                      <label className="block text-xs font-semibold text-travo-gray-600 mb-1.5">Current Password</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-travo-gray-400" />
                        <input type="password" placeholder="••••••••" className="input-field !pl-10" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-travo-gray-600 mb-1.5">New Password</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-travo-gray-400" />
                        <input type="password" placeholder="••••••••" className="input-field !pl-10" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-travo-gray-600 mb-1.5">Confirm New Password</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-travo-gray-400" />
                        <input type="password" placeholder="••••••••" className="input-field !pl-10" />
                      </div>
                    </div>
                    <button className="btn-secondary text-sm !py-2.5">Update Password</button>
                  </div>
                </div>

                {/* 2FA */}
                <div className="border-t border-travo-gray-100 pt-6 mb-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-green-50/50 border border-green-200/50">
                    <div className="flex items-center gap-3">
                      <Shield size={18} className="text-green-600" />
                      <div>
                        <p className="text-sm font-semibold text-green-800">Two-Factor Authentication</p>
                        <p className="text-xs text-green-600">{twoFA ? 'Enabled — Your account is secured' : 'Disabled — Recommended for security'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setTwoFA(!twoFA)}
                      className={cn(
                        'relative w-11 h-6 rounded-full transition-colors duration-200',
                        twoFA ? 'bg-green-500' : 'bg-travo-gray-300',
                      )}
                    >
                      <div className={cn(
                        'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200',
                        twoFA ? 'translate-x-[22px]' : 'translate-x-0.5',
                      )} />
                    </button>
                  </div>
                </div>

                {/* Active Sessions */}
                <div className="border-t border-travo-gray-100 pt-6">
                  <h4 className="text-sm font-bold text-travo-black mb-4">Active Sessions</h4>
                  <div className="space-y-3">
                    {sessions.map((session, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-travo-gray-200">
                        <div className="w-10 h-10 rounded-xl bg-travo-gray-50 flex items-center justify-center text-travo-gray-500">
                          <Monitor size={18} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-travo-black">{session.device}</p>
                            {session.current && (
                              <span className="badge bg-green-100 text-green-700">Current</span>
                            )}
                          </div>
                          <p className="text-xs text-travo-gray-400">{session.location} · {session.ip} · {session.lastActive}</p>
                        </div>
                        {!session.current && (
                          <button className="text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                            Revoke
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button className="mt-4 flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
                    <LogOut size={14} />
                    Sign out all other sessions
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
