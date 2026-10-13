import React, { useState, useEffect, useRef } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { EmergencyNotice } from './components/EmergencyNotice';
import { AuthModal } from './components/AuthModal';
import { SecurityAlertBanner } from './components/SecurityAlertBanner';

import { HomePage } from './pages/HomePage';
import { FindDonorsPage } from './pages/FindDonorsPage';
import { RequestBloodPage } from './pages/RequestBloodPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { DonorDashboard } from './pages/DonorDashboard';
import { RequesterDashboard } from './pages/RequesterDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'login' | 'register' }>({
    open: false,
    mode: 'login',
  });

  const { role, isAuthenticated } = useAuth();
  const prevAuthRef = useRef(isAuthenticated);

  // Route protection and auto-redirect on login
  useEffect(() => {
    if (!prevAuthRef.current && isAuthenticated) {
      if (role === 'donor') setCurrentTab('donor-dashboard');
      else if (role === 'admin') setCurrentTab('admin-dashboard');
      else if (role === 'requester') setCurrentTab('requester-dashboard');
    }
    prevAuthRef.current = isAuthenticated;

    if (!isAuthenticated) {
      if (['admin-dashboard', 'donor-dashboard', 'requester-dashboard', 'urgent-requests'].includes(currentTab)) {
        setCurrentTab('home');
      }
    } else if (role !== 'admin' && currentTab === 'admin-dashboard') {
      setCurrentTab('home');
    }
  }, [isAuthenticated, role, currentTab]);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'find-donors':
        return <FindDonorsPage setCurrentTab={handleTabChange} />;
      case 'request-blood':
        return <RequestBloodPage setCurrentTab={handleTabChange} />;
      case 'campaigns':
        return <CampaignsPage />;
      case 'about':
        return (
          <AboutPage
            setCurrentTab={handleTabChange}
            openAuthModal={(mode) => setAuthModal({ open: true, mode })}
          />
        );
      case 'contact':
        return <ContactPage />;
      case 'urgent-requests':
        if (!isAuthenticated) {
          return (
            <HomePage
              setCurrentTab={handleTabChange}
              openAuthModal={(mode) => setAuthModal({ open: true, mode })}
            />
          );
        }
        return <DonorDashboard setCurrentTab={handleTabChange} initialSection="urgent-requests" />;
      case 'donor-dashboard':
        if (!isAuthenticated) {
          return (
            <HomePage
              setCurrentTab={handleTabChange}
              openAuthModal={(mode) => setAuthModal({ open: true, mode })}
            />
          );
        }
        return <DonorDashboard setCurrentTab={handleTabChange} />;
      case 'requester-dashboard':
        if (!isAuthenticated) {
          return (
            <HomePage
              setCurrentTab={handleTabChange}
              openAuthModal={(mode) => setAuthModal({ open: true, mode })}
            />
          );
        }
        return <RequesterDashboard setCurrentTab={handleTabChange} />;
      case 'admin-dashboard':
        if (!isAuthenticated || role !== 'admin') {
          return (
            <HomePage
              setCurrentTab={handleTabChange}
              openAuthModal={(mode) => setAuthModal({ open: true, mode })}
            />
          );
        }
        return <AdminDashboard setCurrentTab={handleTabChange} />;
      case 'home':
      default:
        return (
          <HomePage
            setCurrentTab={handleTabChange}
            openAuthModal={(mode) => setAuthModal({ open: true, mode })}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F8] selection:bg-[#B80024] selection:text-white">
      {/* 24/7 Sri Lanka Medical Emergency Hotline Banner */}
      <EmergencyNotice />

      {/* Navigation matching reference image */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        openAuthModal={(mode) => setAuthModal({ open: true, mode })}
      />

      {/* Main View Area */}
      <main className="flex-1">{renderContent()}</main>

      {/* Deep Blood Red Curved Footer matching reference image */}
      <Footer setCurrentTab={handleTabChange} />

      {/* Authentication Modal */}
      {authModal.open && (
        <AuthModal
          initialMode={authModal.mode}
          setCurrentTab={handleTabChange}
          onClose={() => setAuthModal({ open: false, mode: 'login' })}
        />
      )}

      {/* Real-time Phone & Email Security Notification Banner */}
      <SecurityAlertBanner />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LanguageProvider>
  );
}
