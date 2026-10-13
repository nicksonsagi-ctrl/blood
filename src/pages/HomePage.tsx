import React, { useEffect, useState } from 'react';
import {
  Heart,
  Droplet,
  Search,
  ArrowRight,
  ShieldCheck,
  Users,
  MapPin,
  Calendar,
  CheckCircle2,
  Activity,
  Award,
  Sparkles,
  PhoneCall,
  Clock,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { AppStats, BloodCampaign } from '../types';

interface HomePageProps {
  setCurrentTab: (tab: string) => void;
  openAuthModal: (mode: 'login' | 'register') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setCurrentTab, openAuthModal }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [stats, setStats] = useState<AppStats>({
    registeredDonors: 5200,
    activeRequests: 4,
    completedDonations: 1200,
    livesSaved: 1200,
    supportedDistricts: 25,
    verifiedDonors: 9,
    availableDonors: 8,
    pendingRequests: 1,
    unreadMessages: 1,
  });
  const [campaigns, setCampaigns] = useState<BloodCampaign[]>([]);

  useEffect(() => {
    // Fetch live statistics from backend
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setStats((prev) => ({
            ...prev,
            registeredDonors: data.registeredDonors || 5200,
            activeRequests: data.activeRequests || 4,
            completedDonations: data.totalDonations || 1200,
            livesSaved: data.livesSaved || 1200,
            supportedDistricts: data.supportedDistricts || 25,
          }));
        }
      })
      .catch((err) => console.error(err));

    // Fetch campaigns
    fetch('/api/campaigns')
      .then((res) => res.json())
      .then((data) => setCampaigns(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION matching reference image */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100/80 border border-rose-200 text-[#B80024] text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#B80024] animate-pulse"></span>
                <span>Sri Lanka Emergency Blood Coordination</span>
              </div>

              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                {t.heroTitlePrefix}{' '}
                <span className="text-[#B80024] underline decoration-rose-200 decoration-wavy decoration-2">
                  Blood Donors
                </span>
                <br />
                {t.heroTitleSuffix}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
                {t.heroSubtitle}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setCurrentTab('find-donors')}
                  className="flex items-center gap-2 px-6 py-3.5 bg-[#B80024] hover:bg-[#98001E] text-white text-sm font-extrabold rounded-2xl shadow-lg shadow-rose-900/25 transition-all hover:scale-103"
                >
                  <span>{t.btnFindDonors}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => (user ? setCurrentTab('donor-dashboard') : openAuthModal('register'))}
                  className="px-6 py-3.5 bg-white hover:bg-rose-50 text-[#B80024] border-2 border-rose-200 text-sm font-extrabold rounded-2xl shadow-sm transition hover:scale-103"
                >
                  {t.btnBecomeDonor}
                </button>

                <button
                  onClick={() => setCurrentTab('request-blood')}
                  className="px-6 py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-900 text-sm font-extrabold rounded-2xl border border-rose-200 transition"
                >
                  {t.btnRequestBlood}
                </button>
              </div>

              <div className="flex items-center gap-6 pt-4 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Free & Humanitarian</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-[#B80024]" />
                  <span>Jaffna & All 25 Districts</span>
                </div>
              </div>
            </div>

            {/* Right Visual with Heart Hands Illustration and Floating Badges */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Central Visual Card */}
              <div className="relative w-full max-w-[420px] aspect-square rounded-[36px] bg-gradient-to-tr from-rose-200 via-rose-100 to-white p-3 shadow-2xl border border-white">
                <div className="w-full h-full rounded-[30px] overflow-hidden relative shadow-inner bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80"
                    alt="Hands holding red blood drop heart"
                    className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-xs uppercase tracking-widest font-extrabold text-rose-300">
                      National Blood Bank Partner
                    </span>
                    <h3 className="text-xl font-bold leading-tight">
                      Teaching Hospital Jaffna & NHSL
                    </h3>
                  </div>
                </div>

                {/* Floating Badge 1: Donate */}
                <div
                  onClick={() => (user ? setCurrentTab('donor-dashboard') : openAuthModal('register'))}
                  className="absolute -top-4 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-rose-100 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#B80024] flex items-center justify-center font-bold">
                    <Heart className="w-5 h-5 fill-[#B80024]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800">{t.badgeDonate}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{t.badgeDonateSub}</p>
                  </div>
                </div>

                {/* Floating Badge 2: Request */}
                <div
                  onClick={() => setCurrentTab('request-blood')}
                  className="absolute top-1/2 -right-6 sm:-right-8 -translate-y-1/2 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-rose-100 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#B80024] flex items-center justify-center font-bold">
                    <Droplet className="w-5 h-5 fill-[#B80024]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800">{t.badgeRequest}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{t.badgeRequestSub}</p>
                  </div>
                </div>

                {/* Floating Badge 3: Search */}
                <div
                  onClick={() => setCurrentTab('find-donors')}
                  className="absolute -bottom-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-rose-100 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#B80024] flex items-center justify-center font-bold">
                    <Search className="w-5 h-5 text-[#B80024]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800">{t.badgeSearch}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{t.badgeSearchSub}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE DATABASE STATS BAR matching reference image */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-rose-100 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-rose-100">
          <div className="pt-4 md:pt-0">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#B80024] tracking-tight">
              {stats.registeredDonors.toLocaleString()}+
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
              {t.statRegisteredDonors}
            </p>
          </div>

          <div className="pt-4 md:pt-0">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#B80024] tracking-tight">
              {stats.livesSaved.toLocaleString()}+
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
              {t.statLivesSaved}
            </p>
          </div>

          <div className="pt-4 md:pt-0">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#B80024] tracking-tight">
              8
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
              {t.statBloodGroups} (All ABO/Rh)
            </p>
          </div>

          <div className="pt-4 md:pt-0">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#B80024] tracking-tight">
              {stats.supportedDistricts}
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
              {t.statDistricts}
            </p>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS matching reference image */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t.howItWorksTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium">
            {t.howItWorksSubtitle}
          </p>
        </div>

        {/* 4 Step Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-3xl shadow-md border border-rose-50 flex flex-col items-center text-center space-y-4 hover:shadow-xl transition group">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-[#B80024] flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900">{t.step1Title}</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
              {t.step1Desc}
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-3xl shadow-md border border-rose-50 flex flex-col items-center text-center space-y-4 hover:shadow-xl transition group">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-[#B80024] flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900">{t.step2Title}</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
              {t.step2Desc}
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-3xl shadow-md border border-rose-50 flex flex-col items-center text-center space-y-4 hover:shadow-xl transition group">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-[#B80024] flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition">
              <PhoneCall className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900">{t.step3Title}</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
              {t.step3Desc}
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-3xl shadow-md border border-rose-50 flex flex-col items-center text-center space-y-4 hover:shadow-xl transition group">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-[#B80024] flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition">
              <Heart className="w-8 h-8 fill-[#B80024]" />
            </div>
            <h3 className="text-lg font-black text-slate-900">{t.step4Title}</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
              {t.step4Desc}
            </p>
          </div>
        </div>
      </section>

      {/* 4. WHY DONATE BLOOD? matching reference image */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t.whyDonateTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            A small decision that creates life-long ripples of hope in Sri Lanka.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-md border border-rose-100 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-[#B80024] flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-800">{t.whyReason1Title}</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {t.whyReason1Desc}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-md border border-rose-100 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-[#B80024] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-800">{t.whyReason2Title}</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {t.whyReason2Desc}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-md border border-rose-100 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-[#B80024] flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-800">{t.whyReason3Title}</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {t.whyReason3Desc}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-md border border-rose-100 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-[#B80024] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-800">{t.whyReason4Title}</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {t.whyReason4Desc}
            </p>
          </div>
        </div>
      </section>

      {/* 5. UPCOMING BLOOD CAMPAIGNS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Upcoming Blood Donation Campaigns
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Organized with hospital blood banks across Jaffna and other districts.
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('campaigns')}
            className="text-xs font-bold text-[#B80024] hover:underline flex items-center gap-1"
          >
            <span>View All Campaigns</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {campaigns.slice(0, 3).map((camp) => (
            <div
              key={camp.id}
              className="bg-white rounded-3xl overflow-hidden shadow-md border border-rose-100 flex flex-col hover:shadow-xl transition"
            >
              <div className="h-44 relative bg-slate-100">
                <img
                  src={camp.image || 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=600&q=80'}
                  alt={camp.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[#B80024] text-[11px] font-black px-2.5 py-1 rounded-full shadow-xs">
                  {camp.district}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#B80024] mb-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{camp.date}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{camp.startTime}</span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 leading-snug line-clamp-2">
                    {camp.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {camp.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-rose-50 flex items-center justify-between">
                  <div className="text-xs text-slate-600 font-semibold">
                    Target: <strong className="text-slate-900">{camp.targetUnits} Units</strong>
                  </div>
                  <button
                    onClick={() => setCurrentTab('campaigns')}
                    className="px-3.5 py-1.5 bg-rose-50 text-[#B80024] text-xs font-bold rounded-xl hover:bg-[#B80024] hover:text-white transition"
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER matching reference image */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-rose-50 via-rose-100/60 to-rose-50 rounded-3xl p-8 sm:p-14 text-center border border-rose-200/80 shadow-inner space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#B80024] text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-900/20">
            <Heart className="w-8 h-8 fill-white" />
          </div>
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {t.ctaTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-normal">
              {t.ctaSubtitle}
            </p>
          </div>
          <div>
            <button
              onClick={() => (user ? setCurrentTab('donor-dashboard') : openAuthModal('register'))}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#B80024] hover:bg-[#98001E] text-white font-black text-sm rounded-2xl shadow-xl shadow-rose-900/30 transition hover:scale-105"
            >
              <span>{t.ctaButton}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
