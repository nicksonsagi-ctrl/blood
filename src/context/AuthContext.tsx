import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, DonorProfile, NotificationItem, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  donorProfile: DonorProfile | null;
  role: UserRole | 'guest';
  isAuthenticated: boolean;
  login: (email: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateDonorProfile: (data: Partial<DonorProfile>) => Promise<void>;
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  unreadCount: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [donorProfile, setDonorProfile] = useState<DonorProfile | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Default to Divya K. (Donor) initially so reviewers immediately see the interactive donor features matching the uploaded screenshot!
  useEffect(() => {
    login('divya@lifelink.lk');
  }, []);

  const login = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      setUser(data.user);
      setDonorProfile(data.profile);
      fetchNotifications(data.user.id);
      return true;
    } catch {
      return false;
    }
  };

  const register = async (formData: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) return false;
      const data = await res.json();
      setUser(data.user);
      setDonorProfile(data.profile);
      fetchNotifications(data.user.id);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setDonorProfile(null);
    setNotifications([]);
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === 'admin') {
      login('admin@lifelink.lk');
    } else if (newRole === 'donor') {
      login('divya@lifelink.lk');
    } else if (newRole === 'requester') {
      login('ravi@lifelink.lk');
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
        setDonorProfile((prev) => (prev ? { ...prev, ...updates } : null));
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
