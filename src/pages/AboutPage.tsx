import React from 'react';
import { Heart, Users, ShieldCheck, CheckCircle2, Mail, Phone, MapPin, Building, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AboutPageProps {
  setCurrentTab: (tab: string) => void;
  openAuthModal: (mode: 'login' | 'register') => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setCurrentTab, openAuthModal }) => {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Top Banner matching reference image */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          About LifeLink
        </h1>
        <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
          {t.aboutMissionText}
        </p>
      </div>

      {/* Main Split Content matching reference image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Side: Medical Blood Drop in Hands Visual */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="relative w-full max-w-[420px] aspect-square rounded-[36px] bg-gradient-to-tr from-rose-200 via-rose-100 to-white p-3 shadow-2xl border border-white">
            <div className="w-full h-full rounded-[30px] overflow-hidden relative shadow-inner">
              <img
                src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80"
                alt="Heart in hands holding blood drop"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs uppercase tracking-widest font-black text-rose-300">
                  Voluntary • Humanitarian • Free
                </span>
                <h3 className="text-xl font-bold leading-tight">
                  LifeLink Sri Lanka
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Our Mission & 4 Core Values */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 border-l-4 border-[#B80024] pl-3">
              {t.aboutMissionTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              To ensure that no one suffers due to the lack of blood by building a reliable, secure, and accessible platform for blood donation and support across Sri Lanka, starting with Jaffna District and expanding to all 25 districts.
            </p>
          </div>

          {/* 4 Core Value Badges matching screenshot */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-md text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#B80024] flex items-center justify-center mx-auto">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800">{t.valCommunityDriven}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-md text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#B80024] flex items-center justify-center mx-auto">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800">{t.valSafeSecure}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-md text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#B80024] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800">{t.valEasyToUse}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-md text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#B80024] flex items-center justify-center mx-auto">
                <Heart className="w-5 h-5 fill-[#B80024]" />
              </div>
              <p className="text-xs font-bold text-slate-800">{t.valSaveLives}</p>
            </div>
          </div>

          {/* Contact Us Card matching reference image */}
          <div className="bg-rose-50/70 p-6 rounded-3xl border border-rose-200/80 space-y-3">
            <h3 className="font-extrabold text-base text-slate-900">
              {t.contactUsCardTitle}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700 font-semibold">
              <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-rose-100">
                <Mail className="w-4 h-4 text-[#B80024] shrink-0" />
                <span className="truncate">support@lifelink.lk</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-rose-100">
                <Phone className="w-4 h-4 text-[#B80024] shrink-0" />
                <span>+94 77 123 4567</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-rose-100">
                <MapPin className="w-4 h-4 text-[#B80024] shrink-0" />
                <span>Jaffna, Sri Lanka</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
