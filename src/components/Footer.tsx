import React from 'react';
import { Heart, Droplet, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  const { t } = useLanguage();

  return (
    <footer className="relative bg-[#B80024] text-white pt-16 pb-12 overflow-hidden mt-20">
      {/* Decorative subtle curve on top */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-white rounded-b-[40px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-rose-800/60">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white text-[#B80024] shadow-md">
                <Heart className="w-6 h-6 fill-[#B80024]" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
                  LifeLink
                </span>
                <p className="text-xs text-rose-200 font-medium">
                  {t.tagline}
                </p>
              </div>
            </div>

            <p className="text-sm text-rose-100/90 leading-relaxed max-w-sm">
              Sri Lanka's dedicated voluntary blood donor coordination network. Connecting emergency patients with consenting donors across Jaffna and all 25 districts with privacy, speed, and humanitarian compassion.
            </p>

            <div className="pt-2 text-xs text-rose-200 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-300 shrink-0" />
                <span>Hospital Road, Jaffna & National Blood Center, Colombo, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-300 shrink-0" />
                <span>Emergency Ambulance: 1990 | Jaffna Teaching Hospital: +94 21 222 2222</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-300 shrink-0" />
                <span>support@lifelink.lk</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-rose-200">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-rose-100">
              <li>
                <button
                  onClick={() => {
                    setCurrentTab('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  {t.home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentTab('find-donors');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  {t.findDonors}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentTab('request-blood');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  {t.requestBlood}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentTab('campaigns');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  {t.campaigns}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentTab('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  {t.about}
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-rose-200">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-rose-100">
              <li>
                <button
                  onClick={() => {
                    setCurrentTab('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  Donor Eligibility Guidelines
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentTab('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  Hospital Verification
                </button>
              </li>
              <li>
                <span className="text-rose-200/80">Privacy & Consent Policy</span>
              </li>
              <li>
                <span className="text-rose-200/80">Terms & Conditions</span>
              </li>
              <li>
                <span className="text-rose-200/80">Help Center Sri Lanka</span>
              </li>
            </ul>
          </div>

          {/* Connect & Social */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-rose-200">
              Connect
            </h4>
            <p className="text-xs text-rose-100/90 leading-relaxed">
              Join our humanitarian mission and follow verified blood donation campaigns across the island.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#facebook"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              >
                <Facebook className="w-4 h-4 text-white" />
              </a>
              <a
                href="#twitter"
                aria-label="Twitter"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              >
                <Twitter className="w-4 h-4 text-white" />
              </a>
              <a
                href="#youtube"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              >
                <Youtube className="w-4 h-4 text-white" />
              </a>
              <a
                href="#instagram"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              >
                <Instagram className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright and emergency medical disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-rose-200/90 gap-4">
          <p>© 2024 LifeLink. All rights reserved. Sri Lanka Blood Donor Management Platform.</p>
          <div className="flex items-center gap-2 text-[11px] text-rose-200 bg-rose-950/40 px-3 py-1.5 rounded-full border border-rose-800/40">
            <Shield className="w-3.5 h-3.5 text-rose-300" />
            <span>Community volunteer matching platform. For acute medical emergencies call 1990 immediately.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
