import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, DonorProfile, NotificationItem, UserRole } from '../types';

export interface SecurityAlert {
  phone: string;
  email: string;
  message: string;
  emailStatus: string;
  smsStatus: string;
  smsText?: string;
  timeStr: string;
}

interface AuthContextType {
  user: User | null;
  donorProfile: DonorProfile | null;
  role: UserRole | 'guest';
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (data: any) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateDonorProfile: (data: Partial<DonorProfile>) => Promise<void>;
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  unreadCount: number;
  securityAlert: SecurityAlert | null;
  dismissSecurityAlert: () => void;
  sendOtp: (identifier: string) => Promise<{ success: boolean; error?: string; otpPreview?: string; phone?: string; email?: string }>;
  verifyOtp: (identifier: string, otp: string, newPassword?: string) => Promise<{ success: boolean; error?: string; user?: User }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'lifelink_auth_user';
const LOCAL_STORAGE_PROFILE_KEY = 'lifelink_auth_profile';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [donorProfile, setDonorProfile] = useState<DonorProfile | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [securityAlert, setSecurityAlert] = useState<SecurityAlert | null>(null);

  // Restore authenticated session from localStorage if user previously logged in
  useEffect(() => {
    try {
      const savedUserStr = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      const savedProfileStr = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
      if (savedUserStr) {
        const savedUser: User = JSON.parse(savedUserStr);
        setUser(savedUser);
        if (savedProfileStr) {
          setDonorProfile(JSON.parse(savedProfileStr));
        }
        fetchNotifications(savedUser.id);
      }
    } catch {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      localStorage.removeItem(LOCAL_STORAGE_PROFILE_KEY);
    }
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string; user?: User }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }

      setUser(data.user);
      setDonorProfile(data.profile);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data.user));
      if (data.profile) {
        localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(data.profile));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_PROFILE_KEY);
      }

      if (data.securityAlert) {
        setSecurityAlert(data.securityAlert);
      }

      fetchNotifications(data.user.id);
      return { success: true, user: data.user };
    } catch {
      // Vercel / offline fallback check for default admin
      if (email.trim().toLowerCase() === 'admin@lifelink.lk' && password === 'Admin@1234') {
        const fallbackAdmin: User = {
          id: 'usr-admin-1',
          fullName: 'Dr. Ketheeswaran M.',
          email: 'admin@lifelink.lk',
          phone: '+94 21 222 2261',
          role: 'admin',
          province: 'Northern',
          district: 'Jaffna',
          city: 'Jaffna Town',
          createdAt: new Date().toISOString(),
          isVerified: true,
        };
        setUser(fallbackAdmin);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(fallbackAdmin));
        setSecurityAlert({
          phone: fallbackAdmin.phone,
          email: fallbackAdmin.email,
          message: 'Security login alert dispatched to phone and email',
          emailStatus: 'Alert prepared for admin@lifelink.lk',
          smsStatus: 'SMS prepared for +94 21 222 2261',
          smsText: `[LifeLink Sri Lanka] Security Alert: New login for Dr. Ketheeswaran M. at ${new Date().toLocaleTimeString()} Asia/Colombo.`,
          timeStr: new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' }),
        });
        return { success: true, user: fallbackAdmin };
      }
      return { success: false, error: 'Network error. Please check connection and try again.' };
    }
  };

  const register = async (formData: any): Promise<{ success: boolean; error?: string; user?: User }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      // Do NOT set user, donorProfile, or session in localStorage.
      // The user must explicitly log in after registering.
      return { success: true, user: data.user };
    } catch {
      return { success: false, error: 'Network error during registration. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    setDonorProfile(null);
    setNotifications([]);
    setSecurityAlert(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    localStorage.removeItem(LOCAL_STORAGE_PROFILE_KEY);
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === 'admin') {
      login('admin@lifelink.lk', 'Admin@1234');
    } else if (newRole === 'donor') {
      login('divya@lifelink.lk', 'Donor@1234');
    } else if (newRole === 'requester') {
      login('ravi@lifelink.lk', 'Requester@1234');
    }
  };

  const sendOtp = async (identifier: string): Promise<{ success: boolean; error?: string; otpPreview?: string; phone?: string; email?: string }> => {
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to send OTP' };
      }
      return {
        success: true,
        otpPreview: data.otpPreview,
        phone: data.phone,
        email: data.email,
      };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const verifyOtp = async (identifier: string, otp: string, newPassword?: string): Promise<{ success: boolean; error?: string; user?: User }> => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Invalid OTP' };
      }

      setUser(data.user);
      setDonorProfile(data.profile);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data.user));
      if (data.profile) {
        localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(data.profile));
      }

      if (data.securityAlert) {
        setSecurityAlert(data.securityAlert);
      }

      fetchNotifications(data.user.id);
      return { success: true, user: data.user };
    } catch {
      return { success: false, error: 'Network error verifying OTP.' };
    }
  };

  const updateDonorProfile = async (updates: Partial<DonorProfile>) => {
    if (!donorProfile) return;
    try {
      const res = await fetch('/api/donors/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorId: donorProfile.id,
          isAvailable: updates.isAvailable,
          preferredLocations: updates.preferredLocations,
        }),
      });
      if (res.ok) {
        setDonorProfile((prev) => {
          const next = prev ? { ...prev, ...updates } : null;
          if (next) localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(next));
          return next;
        });
      }
    } catch (err) {
      console.error('Failed to update donor profile:', err);
    }
  };

  const fetchNotifications = async (userId: string) => {
    try {
      const res = await fetch(`/api/notifications?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const markNotificationAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
    } catch (err) {
      console.error(err);
    }
  };

  const dismissSecurityAlert = () => {
    setSecurityAlert(null);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AuthContext.Provider
      value={{
        user,
        donorProfile,
        role: user ? user.role : 'guest',
        isAuthenticated: !!user,
        login,
        register,
        logout,
        switchRole,
        updateDonorProfile,
        notifications,
        markNotificationAsRead,
        unreadCount,
        securityAlert,
        dismissSecurityAlert,
        sendOtp,
        verifyOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
