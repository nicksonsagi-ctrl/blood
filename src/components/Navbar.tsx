import React, { useState } from 'react';
import {
  Heart,
  Droplet,
  Globe,
  Bell,
  Menu,
  X,
  ChevronDown,
  User as UserIcon,
  LayoutDashboard,
  LogOut,
  Phone,
  Shield,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Language } from '../i18n/translations';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openAuthModal: (mode: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, openAuthModal }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, role, logout, switchRole, notifications, unreadCount, markNotificationAsRead } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: t.home },
    { id: 'find-donors', label: t.findDonors },
    { id: 'request-blood', label: t.requestBlood },
    { id: 'campaigns', label: t.campaigns },
    { id: 'about', label: t.about },
    { id: 'contact', label: t.contact },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  const getDashboardTab = () => {
    if (role === 'admin') return 'admin-dashboard';
    if (role === 'donor') return 'donor-dashboard';
    return 'requester-dashboard';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Tagline */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-[#B80024] to-[#8E001C] text-white shadow-md shadow-rose-900/20 group-hover:scale-105 transition-transform duration-300">
              <Heart className="w-6 h-6 fill-white" />
              <Droplet className="w-3.5 h-3.5 fill-[#FFF0F3] text-[#FFF0F3] absolute -bottom-0.5 -right-0.5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-[#B80024] font-['Plus_Jakarta_Sans',sans-serif]">
                  LifeLink
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-rose-100 text-[#B80024] px-1.5 py-0.5 rounded-sm">
                  Sri Lanka
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 hidden sm:block tracking-tight">
                {t.tagline}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'text-[#B80024] bg-rose-50 font-bold'
                      : 'text-slate-700 hover:text-[#B80024] hover:bg-rose-50/50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200 text-xs font-semibold text-slate-700 hover:bg-rose-50 transition"
                title="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#B80024]" />
                <span className="uppercase">{language}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-rose-100 rounded-xl shadow-xl py-1 z-50">
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between ${
                      language === 'en' ? 'bg-rose-50 text-[#B80024] font-bold' : 'text-slate-700 hover:bg-rose-50/50'
                    }`}
                  >
                    <span>English</span>
                    <span className="text-[10px] text-slate-400">EN</span>
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('ta');
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between font-['Noto_Sans_Tamil',sans-serif] ${
                      language === 'ta' ? 'bg-rose-50 text-[#B80024] font-bold' : 'text-slate-700 hover:bg-rose-50/50'
                    }`}
                  >
                    <span>தமிழ்</span>
                    <span className="text-[10px] text-slate-400">TA</span>
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('si');
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between font-['Noto_Sans_Sinhala',sans-serif] ${
                      language === 'si' ? 'bg-rose-50 text-[#B80024] font-bold' : 'text-slate-700 hover:bg-rose-50/50'
                    }`}
                  >
                    <span>සිංහල</span>
                    <span className="text-[10px] text-slate-400">SI</span>
                  </button>
                </div>
              )}
            </div>


            {/* Notifications Button */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setNotifMenuOpen(!notifMenuOpen)}
                  className="relative p-2 rounded-full text-slate-600 hover:text-[#B80024] hover:bg-rose-50 transition"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#B80024] text-[10px] font-extrabold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-rose-100 rounded-2xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-rose-100 flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">Notifications</span>
                      <span className="text-xs text-rose-600 font-semibold">{unreadCount} new</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-rose-50">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markNotificationAsRead(n.id);
                              if (n.linkUrl) handleNavClick(n.linkUrl.replace('/', ''));
                              setNotifMenuOpen(false);
                            }}
                            className={`p-3 text-left cursor-pointer transition hover:bg-rose-50/50 ${
                              !n.isRead ? 'bg-rose-50/30' : ''
                            }`}
                          >
                            <p className="text-xs font-bold text-slate-800">{n.title}</p>
                            <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile or Login/Register */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-rose-200 hover:border-[#B80024] bg-white transition shadow-xs"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      className="w-7 h-7 rounded-full object-cover border border-rose-200"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-rose-100 text-[#B80024] flex items-center justify-center font-bold text-xs">
                      {user.fullName[0]}
                    </div>
                  )}
                  <span className="text-xs font-bold text-slate-800 max-w-[90px] truncate hidden sm:inline">
                    {user.fullName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-rose-100 rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-rose-50">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.fullName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <span className="mt-1 inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-[#B80024]">
                        Role: {role}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        handleNavClick(getDashboardTab());
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#B80024]" />
                      {role === 'admin' ? 'Admin Dashboard' : role === 'donor' ? 'Donor Dashboard' : 'Requester Dashboard'}
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-[#B80024] transition rounded-lg hover:bg-rose-50"
                >
                  {t.login}
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#B80024] hover:bg-[#98001E] rounded-lg shadow-sm shadow-rose-900/20 transition hover:scale-102"
                >
                  {t.register}
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-rose-50"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-rose-100 bg-white px-4 pt-3 pb-6 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
                currentTab === link.id
                  ? 'bg-rose-50 text-[#B80024] font-bold'
                  : 'text-slate-700 hover:bg-rose-50/50'
              }`}
            >
              {link.label}
            </button>
          ))}
          {user && (
            <button
              onClick={() => handleNavClick(getDashboardTab())}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-[#B80024] bg-rose-50"
            >
              {t.dashboard}
            </button>
          )}
        </div>
      )}
    </header>
  );
};
