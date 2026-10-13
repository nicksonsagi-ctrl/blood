import React from 'react';
import { PhoneCall, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const EmergencyNotice: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-rose-950 via-[#B80024] to-rose-900 text-white py-2 px-4 text-xs sm:text-sm font-medium shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
          <AlertTriangle className="w-4 h-4 text-rose-200 shrink-0" />
          <span>
            Sri Lanka 24/7 Medical Emergency: Call <strong className="text-rose-100 underline decoration-rose-400 font-bold">1990 (1990 Suwa Seriya)</strong> or your nearest hospital directly.
          </span>
        </div>
        <div className="flex items-center gap-4 text-rose-100">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            Verified NBTS Coordination
          </span>
          <a
            href="tel:1990"
            className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2.5 py-0.5 rounded-full transition text-white font-semibold"
          >
            <PhoneCall className="w-3 h-3" />
            Call 1990
          </a>
        </div>
      </div>
    </div>
  );
};
