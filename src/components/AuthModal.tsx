import React, { useState } from 'react';
import {
  X,
  Heart,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Phone,
  Mail,
  Lock,
  KeyRound,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SRI_LANKA_PROVINCES, SRI_LANKA_DISTRICTS, validateSriLankanPhone } from '../data/sriLankaData';
import { BloodGroup } from '../types';

interface AuthModalProps {
  initialMode: 'login' | 'register';
  setCurrentTab?: (tab: string) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ initialMode, setCurrentTab, onClose }) => {
  const { login, register, sendOtp, verifyOtp } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'otp'>(initialMode);
  const [role, setRole] = useState<'donor' | 'requester'>('donor');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Show/Hide password states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // OTP Login & Reset state
  const [otpIdentifier, setOtpIdentifier] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpPreviewCode, setOtpPreviewCode] = useState('');

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
      if (setCurrentTab) {
        if (result.user?.role === 'admin') setCurrentTab('admin-dashboard');
        else if (result.user?.role === 'donor') setCurrentTab('donor-dashboard');
        else setCurrentTab('requester-dashboard');
      }
      onClose();
    } else {
      setError(result.error || 'Invalid email or password. Please verify and try again.');
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!otpIdentifier) {
      setError('Please enter your registered email address or phone number (+94).');
      return;
    }

    setLoading(true);
    const res = await sendOtp(otpIdentifier);
    setLoading(false);

    if (res.success) {
      setOtpSent(true);
      if (res.otpPreview) setOtpPreviewCode(res.otpPreview);
      setSuccessMsg(`OTP sent to phone (${res.phone || otpIdentifier}) and email (${res.email || otpIdentifier})!`);
    } else {
      setError(res.error || 'User not found. Please verify your email or phone.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!otpCode) {
      setError('Please enter the 6-digit OTP verification code.');
      return;
    }

    setLoading(true);
    const res = await verifyOtp(otpIdentifier, otpCode, newPassword || undefined);
    setLoading(false);

    if (res.success) {
      if (setCurrentTab) {
        if (res.user?.role === 'admin') setCurrentTab('admin-dashboard');
        else if (res.user?.role === 'donor') setCurrentTab('donor-dashboard');
        else setCurrentTab('requester-dashboard');
      }
      onClose();
    } else {
      setError(res.error || 'Invalid OTP code. Please try again.');
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
      setError('Please enter a valid Sri Lankan mobile number (e.g. +94 77 123 4567 or 0771234567).');
      return;
    }

    setLoading(true);
    const result = await register({
      ...registerData,
      role,
    });
    setLoading(false);
    if (result.success) {
      setMode('login');
      setLoginEmail(registerData.email);
      setLoginPassword('');
      setError('');
      setSuccessMsg('Registration completed successfully! Please sign in with your email and password to continue.');
      setRegisterData((prev) => ({
        ...prev,
        password: '',
        confirmPassword: '',
      }));
    } else {
      setError(result.error || 'Registration failed. This email may already be registered.');
    }
  };

  const availableDistricts = SRI_LANKA_PROVINCES[registerData.province]?.districts || ['Jaffna'];
  const availableCities = SRI_LANKA_DISTRICTS[registerData.district]?.cities || ['Jaffna Town'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-rose-100 relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#B80024] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white text-[#B80024] flex items-center justify-center shadow-xs">
              <Heart className="w-5 h-5 fill-[#B80024]" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">
                {mode === 'login'
                  ? 'Sign In to LifeLink'
                  : mode === 'register'
                  ? 'Create New Account'
                  : 'OTP & Password Reset'}
              </h3>
              <p className="text-xs text-rose-200">Sri Lanka Blood Donor Network • Sri Lanka</p>
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
              setSuccessMsg('');
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
              setSuccessMsg('');
            }}
            className={`flex-1 py-3 text-xs font-extrabold transition ${
              mode === 'register'
                ? 'text-[#B80024] border-b-2 border-[#B80024] bg-white'
                : 'text-slate-600 hover:text-[#B80024]'
            }`}
          >
            Register
          </button>
          <button
            onClick={() => {
              setMode('otp');
              setError('');
              setSuccessMsg('');
            }}
            className={`px-3 py-3 text-xs font-extrabold transition ${
              mode === 'otp'
                ? 'text-[#B80024] border-b-2 border-[#B80024] bg-white'
                : 'text-slate-600 hover:text-[#B80024]'
            }`}
          >
            SMS / OTP
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

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SIGN IN VIEW */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-[#B80024] focus:outline-none transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpIdentifier(loginEmail);
                      setMode('otp');
                      setError('');
                    }}
                    className="text-[11px] font-bold text-[#B80024] hover:underline"
                  >
                    Forgot Password / Get OTP?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3.5 py-2.5 pr-10 text-sm border border-slate-200 rounded-xl focus:border-[#B80024] focus:outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-sm font-bold text-white bg-[#B80024] hover:bg-[#98001E] rounded-xl shadow-md transition disabled:opacity-50"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              <div className="pt-2 text-center text-xs text-slate-500">
                Don&apos;t have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError('');
                    setSuccessMsg('');
                  }}
                  className="font-bold text-[#B80024] hover:underline cursor-pointer"
                >
                  Create New Account
                </button>
              </div>
            </form>
          )}

          {/* OTP / PASSWORD RESET VIEW */}
          {mode === 'otp' && (
            <div className="space-y-4">
              <div className="bg-rose-50/70 p-3 rounded-2xl border border-rose-100 text-xs text-slate-700">
                <p className="font-bold text-[#B80024] flex items-center gap-1.5 mb-1">
                  <KeyRound className="w-4 h-4" />
                  SMS & Email Login OTP
                </p>
                <p className="text-[11px] leading-relaxed">
                  Enter your registered Sri Lankan phone number (+94) or Gmail address to receive an instant verification code.
                </p>
              </div>

              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email or Phone Number (+94)
                    </label>
                    <input
                      type="text"
                      required
                      value={otpIdentifier}
                      onChange={(e) => setOtpIdentifier(e.target.value)}
                      placeholder="e.g. +94 77 123 4567 or email@gmail.com"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-[#B80024] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 text-sm font-bold text-white bg-[#B80024] hover:bg-[#98001E] rounded-xl shadow-md transition disabled:opacity-50"
                  >
                    {loading ? 'Sending Code...' : 'Send OTP to Phone & Email'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                  {otpPreviewCode && (
                    <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
                      <span>SMS & Email OTP Code:</span>
                      <span className="font-mono font-black text-sm text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-300">
                        {otpPreviewCode}
                      </span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Enter 6-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full px-3.5 py-2.5 text-center font-mono tracking-widest text-lg font-bold border border-slate-200 rounded-xl focus:border-[#B80024] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Set New Password (Optional)
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password to reset"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-[#B80024] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 text-sm font-bold text-white bg-[#B80024] hover:bg-[#98001E] rounded-xl shadow-md transition disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP & Log In'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-700"
                  >
                    Change Email or Phone
                  </button>
                </form>
              )}
            </div>
          )}

          {/* REGISTER VIEW */}
          {mode === 'register' && (
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

              <div className="bg-rose-50/50 p-2.5 rounded-xl border border-rose-100">
                <p className="text-[11px] font-bold text-[#B80024] mb-1.5">
                  Set Your Login Password
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        placeholder="Min 6 chars"
                        className="w-full px-3 py-2 pr-8 text-xs border border-slate-200 rounded-xl focus:border-[#B80024] focus:outline-none bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Confirm *
                    </label>
                    <div className="relative">
                      <input
                        type={showRegConfirm ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        placeholder="Re-enter password"
                        className="w-full px-3 py-2 pr-8 text-xs border border-slate-200 rounded-xl focus:border-[#B80024] focus:outline-none bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegConfirm(!showRegConfirm)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showRegConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Remember this password to log in with your email address later.
                </p>
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
                  className="mt-0.5 rounded text-[#B80024] focus:ring-[#B80024]"
                />
                <label htmlFor="consent" className="text-[11px] leading-tight text-slate-600">
                  I agree to receive emergency blood match alerts on my phone (+94) and email under Sri Lanka NBTS regulations.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-sm font-bold text-white bg-[#B80024] hover:bg-[#98001E] rounded-xl shadow-md transition disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>

              <div className="pt-2 text-center text-xs text-slate-500">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                    setSuccessMsg('');
                  }}
                  className="font-bold text-[#B80024] hover:underline cursor-pointer"
                >
                  Sign In here
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
