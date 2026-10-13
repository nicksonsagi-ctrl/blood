import React, { useState, useEffect } from 'react';
import { Search, MapPin, SlidersHorizontal, UserCheck, ShieldCheck, PhoneCall, ChevronDown, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { DonorMap } from '../components/DonorMap';
import { ContactDonorModal } from '../components/ContactDonorModal';
import { DonorProfile } from '../types';
import { SRI_LANKA_DISTRICTS } from '../data/sriLankaData';

interface FindDonorsPageProps {
  setCurrentTab?: (tab: string) => void;
}

export const FindDonorsPage: React.FC<FindDonorsPageProps> = ({ setCurrentTab }) => {
  const { t, language } = useLanguage();
  const { user, role, donorProfile } = useAuth();
  const [bloodGroup, setBloodGroup] = useState<string>('O+');
  const [location, setLocation] = useState<string>('Jaffna');
  const [radius, setRadius] = useState<string>('10 km');
  const [sortBy, setSortBy] = useState<'nearest' | 'donations'>('nearest');

  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<any | null>(null);
  const [contactModalDonor, setContactModalDonor] = useState<any | null>(null);

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (bloodGroup && bloodGroup !== 'all') params.append('bloodGroup', bloodGroup);
      if (location && location !== 'all') params.append('district', location);
      params.append('availability', 'available');

      const res = await fetch(`/api/donors?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        let list = data.donors || [];
        if (sortBy === 'donations') {
          list = [...list].sort((a, b) => (b.totalDonations || 0) - (a.totalDonations || 0));
        }
        setDonors(list);
        if (list.length > 0 && !selectedDonor) {
          setSelectedDonor(list[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [bloodGroup, location, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDonors();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Friendly Guide Banner if logged in as a Donor */}
      {user && role === 'donor' && (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#B80024] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <p className="font-extrabold text-sm text-slate-900">
                {language === 'ta'
                  ? `வணக்கம் ${user.fullName}, நீங்கள் ஒரு இரத்த தானியாளர் (${donorProfile?.bloodGroup || 'O+'})!`
                  : `Hello ${user.fullName}, you are logged in as a Blood Donor (${donorProfile?.bloodGroup || 'O+'})!`}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                {language === 'ta'
                  ? 'இந்த பக்கம் இரத்தம் தேடும் நோயாளிகளுக்கானது. இரத்தம் தேவைப்படும் நோயாளிகளைப் பார்க்க அல்லது தானம் செய்ய உங்கள் டேஷ்போர்டிற்கு செல்லவும்.'
                  : 'This directory is for patients & attendants seeking donors. To view hospital patients urgently requesting your blood, check your Donor Dashboard.'}
              </p>
            </div>
          </div>

          {setCurrentTab && (
            <button
              onClick={() => setCurrentTab('donor-dashboard')}
              className="px-5 py-2.5 bg-[#B80024] hover:bg-[#98001E] text-white font-extrabold text-xs rounded-xl shadow-md shadow-rose-900/20 whitespace-nowrap transition"
            >
              {language === 'ta' ? 'என் டேஷ்போர்டு செல்க' : 'Go to My Donor Dashboard'}
            </button>
          )}
        </div>
      )}

      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t.searchTitle}
        </h1>
        <p className="text-sm sm:text-base text-slate-500 font-medium">
          {t.searchSubtitle}
        </p>
      </div>

      {/* Search Filters Panel matching reference image */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white p-5 sm:p-6 rounded-3xl shadow-xl border border-rose-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
      >
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            {t.filterBloodGroup}
          </label>
          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm font-semibold border border-slate-200 rounded-2xl focus:border-[#B80024] focus:outline-none bg-slate-50/50"
          >
            <option value="all">All Blood Groups</option>
            <option value="O+">O+ (Universal RBC)</option>
            <option value="A+">A+</option>
            <option value="B+">B+</option>
            <option value="AB+">AB+ (Universal Plasma)</option>
            <option value="O-">O- (Emergency Universal)</option>
            <option value="A-">A-</option>
            <option value="B-">B-</option>
            <option value="AB-">AB-</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            {t.filterLocation}
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm font-semibold border border-slate-200 rounded-2xl focus:border-[#B80024] focus:outline-none bg-slate-50/50"
          >
            <option value="all">All Sri Lanka Districts</option>
            <option value="Jaffna">Jaffna (Northern)</option>
            <option value="Kilinochchi">Kilinochchi</option>
            <option value="Mannar">Mannar</option>
            <option value="Mullaitivu">Mullaitivu</option>
            <option value="Vavuniya">Vavuniya</option>
            <option value="Colombo">Colombo (Western)</option>
            <option value="Gampaha">Gampaha</option>
            <option value="Kandy">Kandy (Central)</option>
            <option value="Galle">Galle (Southern)</option>
            <option value="Trincomalee">Trincomalee (Eastern)</option>
            <option value="Batticaloa">Batticaloa</option>
            <option value="Kurunegala">Kurunegala</option>
            <option value="Anuradhapura">Anuradhapura</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            {t.filterRadius}
          </label>
          <select
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm font-semibold border border-slate-200 rounded-2xl focus:border-[#B80024] focus:outline-none bg-slate-50/50"
          >
            <option value="5 km">5 km</option>
            <option value="10 km">10 km</option>
            <option value="25 km">25 km</option>
            <option value="50 km">50 km</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#B80024] hover:bg-[#98001E] text-white text-sm font-extrabold rounded-2xl shadow-md shadow-rose-900/20 transition hover:scale-102"
          >
            <Search className="w-4 h-4" />
            <span>{t.btnSearch}</span>
          </button>
        </div>
      </form>

      {/* Main Results Split Screen matching reference image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Available Donors List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-lg font-black text-slate-900">
              {t.availableDonors} ({donors.length})
            </h2>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <span>{t.sortBy}:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-none text-[#B80024] font-black focus:outline-none cursor-pointer"
              >
                <option value="nearest">{t.nearest}</option>
                <option value="donations">Total Donations</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm font-bold text-slate-400">
              Loading verified donors...
            </div>
          ) : donors.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl text-center border border-rose-100 shadow-sm space-y-3">
              <UserCheck className="w-10 h-10 text-rose-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No donors found with current criteria.</p>
              <button
                onClick={() => {
                  setBloodGroup('all');
                  setLocation('all');
                }}
                className="text-xs font-bold text-[#B80024] underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {donors.map((donor) => {
                const isSelected = selectedDonor?.id === donor.id;
                return (
                  <div
                    key={donor.id}
                    onClick={() => setSelectedDonor(donor)}
                    className={`p-4 rounded-3xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-rose-50/70 border-[#B80024] shadow-md'
                        : 'bg-white border-rose-100 hover:border-rose-300 hover:shadow-xs'
                    }`}
                  >
                    {/* Avatar & Info */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={donor.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={donor.fullName}
                        className="w-12 h-12 rounded-full object-cover border border-rose-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-sm text-slate-900 truncate">
                          {donor.fullName}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-0.5">
                          <span className="text-[#B80024] font-black">{donor.bloodGroup}</span>
                          <span>•</span>
                          <span>{donor.distanceKm || 2} km {t.away}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                          {donor.city}, Sri Lanka
                        </p>
                      </div>
                    </div>

                    {/* Status Pill & Contact Button */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {t.availableBadge}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setContactModalDonor(donor);
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-white border border-[#B80024] text-[#B80024] hover:bg-[#B80024] hover:text-white text-xs font-bold rounded-xl transition shadow-xs"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>{t.contactDonorBtn}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Interactive OpenStreetMap matching reference image */}
        <div className="lg:col-span-7">
          <DonorMap
            donors={donors}
            selectedDonor={selectedDonor}
            onSelectDonor={(d) => {
              setSelectedDonor(d);
              setContactModalDonor(d);
            }}
            centerDistrict={location}
          />
        </div>
      </div>

      {/* Secure Contact Modal */}
      {contactModalDonor && (
        <ContactDonorModal
          donor={contactModalDonor}
          onClose={() => setContactModalDonor(null)}
          onSuccess={() => {
            // refresh or toast
          }}
        />
      )}
    </div>
  );
};
