import React, { useState } from 'react';
import { X, Heart, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SRI_LANKA_PROVINCES, SRI_LANKA_DISTRICTS, validateSriLankanPhone } from '../data/sriLankaData';
import { BloodGroup } from '../types';

interface AuthModalProps {
  initialMode: 'login' | 'register';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ initialMode, onClose }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [role, setRole] = useState<'donor' | 'requester'>('donor');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    bloodGroup: 'O+' as BloodGroup,
    province: 'Northern',
    district: 'Jaffna',
    city: 'Jaffna Town',
    address: '',
    consentGiven: true,
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(loginEmail, loginPassword);
    setLoading(false);
    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Invalid email or password.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!registerData.fullName || !registerData.email || !registerData.phone) {
      setError('Please fill all mandatory personal and contact fields.');
      return;
    }

    if (!registerData.password) {
      setError('Please create a password for your account.');
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match. Please re-enter identical passwords.');
      return;
    }

    if (!validateSriLankanPhone(registerData.phone)) {
      setError('Please enter a valid Sri Lankan phone number (e.g. +94 77 123 4567 or 0771234567).');
      return;
    }

    setLoading(true);
    const result = await register({
      ...registerData,
      role,
    });
    setLoading(false);
    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Registration failed. This email may already be in use.');
    }
  };

  const handleQuickLogin = async (email: string, pass: string) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    setLoading(true);
    await login(email, pass);
    setLoading(false);
    onClose();
  };

  const availableDistricts = SRI_LANKA_PROVINCES[registerData.province]?.districts || ['Jaffna'];
  const availableCities = SRI_LANKA_DISTRICTS[registerData.district]?.cities || ['Jaffna Town'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-rose-100 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#B80024] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white text-[#B80024] flex items-center justify-center">
              <Heart className="w-5 h-5 fill-[#B80024]" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">
                {mode === 'login' ? 'Welcome to LifeLink' : 'Create an Account'}
              </h3>
              <p className="text-xs text-rose-200">Sri Lanka Blood Donor Network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode switcher tabs */}
        <div className="flex border-b border-rose-100 bg-rose-50/50">
          <button
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`flex-1 py-3 text-xs font-extrabold transition ${
              mode === 'login'
                ? 'text-[#B80024] border-b-2 border-[#B80024] bg-white'
                : 'text-slate-600 hover:text-[#B80024]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`flex-1 py-3 text-xs font-extrabold transition ${
              mode === 'register'
                ? 'text-[#B80024] border-b-2 border-[#B80024] bg-white'
                : 'text-slate-600 hover:text-[#B80024]'
            }`}
          >
            Register
          </button>
        </div>

        {/* Content area */}
        <div className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. admin@lifelink.lk"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-[#B80024] focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Password
                  </label>
                  <span className="text-[10px] text-slate-400">Default: Admin@1234</span>
                </div>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-[#B80024] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-sm font-bold text-white bg-[#B80024] hover:bg-[#98001E] rounded-xl shadow-md transition disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              {/* Fast 1-Click Login options for reviewers */}
              <div className="pt-3 border-t border-rose-100">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
                  Quick Demo Accounts
                </p>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('divya@lifelink.lk', 'Donor@1234')}
                    className="w-full text-left px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-medium text-slate-800 flex items-center justify-between transition"
                  >
                    <span>
                      <strong className="text-[#B80024]">Divya K.</strong> (Donor • Jaffna • O+)
                    </span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-bold text-[#B80024]">
                      Login
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('ravi@lifelink.lk', 'Requester@1234')}
                    className="w-full text-left px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-medium text-slate-800 flex items-center justify-between transition"
                  >
                    <span>
                      <strong className="text-slate-900">Ravi S.</strong> (Requester • Jaffna)
                    </span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-bold text-slate-700">
                      Login
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin@lifelink.lk', 'Admin@1234')}
                    className="w-full text-left px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-medium text-slate-800 flex items-center justify-between transition"
                  >
                    <span>
                      <strong className="text-slate-900">Dr. Ketheeswaran</strong> (Admin)
                    </span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-bold text-slate-800">
                      Login
                    </span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Role selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  I want to register as
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('donor')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition ${
                      role === 'donor'
                        ? 'border-[#B80024] bg-rose-50 text-[#B80024]'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Blood Donor
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('requester')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition ${
                      role === 'requester'
                        ? 'border-[#B80024] bg-rose-50 text-[#B80024]'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Blood Requester
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={registerData.fullName}
                  onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                  placeholder="e.g. Senthil Nathan"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-[#B80024] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    placeholder="email@example.lk"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-[#B80024] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone (+94) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    placeholder="+94 77 123 4567"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-[#B80024] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Create Password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    placeholder="Min 6 characters"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-[#B80024] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    placeholder="Re-enter password"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-[#B80024] focus:outline-none"
                  />
                </div>
              </div>

              {role === 'donor' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Blood Group *
                  </label>
                  <select
                    value={registerData.bloodGroup}
                    onChange={(e) => setRegisterData({ ...registerData, bloodGroup: e.target.value as BloodGroup })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-[#B80024] focus:outline-none font-semibold text-[#B80024]"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Province
                  </label>
                  <select
                    value={registerData.province}
                    onChange={(e) => {
                      const newProv = e.target.value;
                      const newDist = SRI_LANKA_PROVINCES[newProv]?.districts[0] || 'Jaffna';
                      setRegisterData({
                        ...registerData,
                        province: newProv,
                        district: newDist,
                        city: SRI_LANKA_DISTRICTS[newDist]?.cities[0] || '',
                      });
                    }}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-[#B80024] focus:outline-none"
                  >
                    {Object.keys(SRI_LANKA_PROVINCES).map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    District
                  </label>
                  <select
                    value={registerData.district}
                    onChange={(e) => {
                      const newDist = e.target.value;
                      setRegisterData({
                        ...registerData,
                        district: newDist,
                        city: SRI_LANKA_DISTRICTS[newDist]?.cities[0] || '',
                      });
                    }}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-[#B80024] focus:outline-none"
                  >
                    {availableDistricts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City / Village
                </label>
                <select
                  value={registerData.city}
                  onChange={(e) => setRegisterData({ ...registerData, city: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-[#B80024] focus:outline-none"
                >
                  {availableCities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-start gap-2 pt-1 text-xs text-slate-600">
                <input
                  type="checkbox"
                  id="consent"
                  checked={registerData.consentGiven}
                  onChange={(e) => setRegisterData({ ...registerData, consentGiven: e.target.checked })}
                  className="mt-0.5 rounded-sm text-[#B80024] focus:ring-[#B80024]"
                />
                <label htmlFor="consent">
                  I agree to receive emergency blood requests via LifeLink and confirm that medical eligibility will be validated by hospital healthcare staff.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-sm font-bold text-white bg-[#B80024] hover:bg-[#98001E] rounded-xl shadow-md transition disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
