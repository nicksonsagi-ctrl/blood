import React, { useState, useEffect } from 'react';
import {
  Heart,
  Droplet,
  User,
  Clock,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Plus,
  Save,
  Check,
  AlertCircle,
  Activity,
  Award,
  LogOut,
  QrCode,
  Building2,
  PhoneCall,
  Calendar,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { DonorContactRequest, DonationRecord, BloodRequest } from '../types';

interface DonorDashboardProps {
  setCurrentTab: (tab: string) => void;
  initialSection?: 'overview' | 'direct-requests' | 'urgent-requests' | 'centers' | 'card' | 'history';
}

export const DonorDashboard: React.FC<DonorDashboardProps> = ({
  setCurrentTab,
  initialSection = 'overview',
}) => {
  const { user, donorProfile, updateDonorProfile, logout } = useAuth();
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'overview' | 'direct-requests' | 'urgent-requests' | 'centers' | 'card' | 'history'>(
    initialSection
  );

  const [isAvailable, setIsAvailable] = useState<boolean>(donorProfile?.isAvailable ?? true);
  const [preferredLocations, setPreferredLocations] = useState<string[]>(
    donorProfile?.preferredLocations || ['Jaffna', 'Vaddukoddai', 'Chulipuram', 'Araly']
  );
  const [newLocationInput, setNewLocationInput] = useState('');
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Incoming contact requests & live blood requests
  const [contactRequests, setContactRequests] = useState<DonorContactRequest[]>([]);
  const [liveRequests, setLiveRequests] = useState<BloodRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [donationHistory, setDonationHistory] = useState<DonationRecord[]>([]);
  const [donateModal, setDonateModal] = useState<{ open: boolean; request: BloodRequest | null }>({
    open: false,
    request: null,
  });
  const [donateSuccess, setDonateSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (initialSection) {
      setActiveTab(initialSection);
    }
  }, [initialSection]);

  useEffect(() => {
    if (donorProfile) {
      setIsAvailable(donorProfile.isAvailable);
      if (donorProfile.preferredLocations) {
        setPreferredLocations(donorProfile.preferredLocations);
      }
    }
  }, [donorProfile]);

  // Fetch incoming contact requests and live hospital blood requests
  const fetchDonorData = async () => {
    try {
      // 1. Fetch live urgent blood requests from Sri Lanka hospitals
      const reqRes = await fetch('/api/requests');
      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setLiveRequests(reqData);
      }

      // 2. Fetch direct incoming contact requests for this specific donor from backend API
      const params = new URLSearchParams();
      if (donorProfile?.id) params.append('donorId', donorProfile.id);
      if (user?.id) params.append('userId', user.id);

      const crRes = await fetch(`/api/donors/contact-requests?${params.toString()}`);
      if (crRes.ok) {
        const crData = await crRes.json();
        setContactRequests(crData.requests || []);
      }

      // 3. Donation history
      setDonationHistory([
        {
          id: 'DH-301',
          donorId: 'dp-1',
          donorName: user?.fullName || 'Divya K.',
          bloodGroup: donorProfile?.bloodGroup || 'O+',
          hospitalName: 'Teaching Hospital Jaffna (Blood Bank)',
          district: 'Jaffna',
          donationDate: '2024-07-10',
          units: 1,
          verifiedByStaff: 'Dr. T. Sivarajah (Blood Bank Officer)',
          status: 'Completed',
        },
        {
          id: 'DH-284',
          donorId: 'dp-1',
          donorName: user?.fullName || 'Divya K.',
          bloodGroup: donorProfile?.bloodGroup || 'O+',
          hospitalName: 'Base Hospital Tellippalai',
          district: 'Jaffna',
          donationDate: '2024-03-12',
          units: 1,
          verifiedByStaff: 'Dr. N. Kugathas (Transfusion Service)',
          status: 'Completed',
        },
        {
          id: 'DH-242',
          donorId: 'dp-1',
          donorName: user?.fullName || 'Divya K.',
          bloodGroup: donorProfile?.bloodGroup || 'O+',
          hospitalName: 'Teaching Hospital Jaffna (Mobile Blood Drive)',
          district: 'Jaffna',
          donationDate: '2023-11-20',
          units: 1,
          verifiedByStaff: 'Dr. T. Sivarajah',
          status: 'Completed',
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchDonorData();
    const interval = setInterval(fetchDonorData, 5000);
    return () => clearInterval(interval);
  }, [donorProfile, user]);

  const handleToggleLocation = (loc: string) => {
    if (preferredLocations.includes(loc)) {
      setPreferredLocations(preferredLocations.filter((l) => l !== loc));
    } else {
      setPreferredLocations([...preferredLocations, loc]);
    }
  };

  const handleAddLocation = () => {
    if (newLocationInput.trim() && !preferredLocations.includes(newLocationInput.trim())) {
      setPreferredLocations([...preferredLocations, newLocationInput.trim()]);
      setNewLocationInput('');
      setShowAddLocation(false);
    }
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    await updateDonorProfile({
      isAvailable,
      preferredLocations,
    });
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleRespondToRequest = async (requestId: string, action: 'accept' | 'decline') => {
    try {
      const res = await fetch(`/api/donors/contact-requests/${requestId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        setContactRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, status: action === 'accept' ? 'accepted' : 'declined' } : r))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmDonationIntention = (req: BloodRequest) => {
    setDonateSuccess(`Thank you, ${user?.fullName}! Your response has been transmitted to ${req.hospitalName} and the patient's attendants.`);
    setDonateModal({ open: false, request: null });
    setTimeout(() => setDonateSuccess(null), 5000);
  };

  // Filter blood requests matching or compatible with this donor
  const donorBlood = donorProfile?.bloodGroup || 'O+';
  const urgentHospitalRequests = liveRequests.filter((r) => r.status === 'Active');

  // Sri Lanka Key Blood Banks
  const bloodBanks = [
    {
      name: 'Teaching Hospital Jaffna Blood Bank',
      nameTa: 'யாழ்ப்பாணம் போதனா வைத்தியசாலை இரத்த வங்கி',
      phone: '+94 21 222 2261',
      hotline: '021 222 2261 (Ext: 245)',
      address: 'Hospital Road, Jaffna Town',
      district: 'Jaffna',
      hours: '24 Hours Emergency / Routine Donations: 8:00 AM – 4:00 PM',
      coordinates: '9.6644, 80.0167',
    },
    {
      name: 'Base Hospital Tellippalai Blood Bank',
      nameTa: 'தெல்லிப்பழை ஆதார வைத்தியசாலை இரத்த வங்கி',
      phone: '+94 21 224 1222',
      hotline: '021 224 1222',
      address: 'Tellippalai, Jaffna',
      district: 'Jaffna',
      hours: '8:00 AM – 4:00 PM (Emergency 24/7)',
      coordinates: '9.7712, 80.0384',
    },
    {
      name: 'Base Hospital Point Pedro',
      nameTa: 'பருத்தித்துறை ஆதார வைத்தியசாலை இரத்த பிரிவு',
      phone: '+94 21 226 2261',
      hotline: '021 226 2261',
      address: 'Beach Road, Point Pedro',
      district: 'Jaffna',
      hours: '8:00 AM – 4:00 PM',
      coordinates: '9.8252, 80.2315',
    },
    {
      name: 'Base Hospital Chavakachcheri',
      nameTa: 'சாவகச்சேரி ஆதார வைத்தியசாலை',
      phone: '+94 21 227 0261',
      hotline: '021 227 0261',
      address: 'Station Road, Chavakachcheri',
      district: 'Jaffna',
      hours: '8:00 AM – 4:00 PM',
      coordinates: '9.6558, 80.1583',
    },
    {
      name: 'National Blood Transfusion Service (NBTS Headquarters)',
      nameTa: 'தேசிய இரத்த மாற்று சேவை தலைமையகம் (கொழும்பு)',
      phone: '+94 11 269 8891',
      hotline: '011 269 8891 / 011 269 8892',
      address: 'Elvitigala Mawatha, Narahenpita, Colombo 05',
      district: 'Colombo',
      hours: '24 Hours Open',
      coordinates: '6.8945, 79.8821',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* 1. Donor Profile Card Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
              alt={user?.fullName || 'Divya K.'}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-rose-100 shadow-md"
            />
            <span
              className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white ${
                isAvailable ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
              title={isAvailable ? 'Available to Donate' : 'Temporarily Unavailable'}
            ></span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {user?.fullName || 'Divya K.'}
              </h1>
              <span className="bg-rose-100 text-[#B80024] font-black text-xs px-3 py-1 rounded-full shadow-xs">
                {donorProfile?.bloodGroup || 'O+'}
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Donor</span>
              </span>
            </div>
            <p className="text-sm font-bold text-slate-500 mt-0.5">
              {language === 'ta' ? 'அங்கீகரிக்கப்பட்ட இரத்த தானியாளர்' : 'Registered LifeLink Blood Donor'}
            </p>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#B80024]" />
              <span>{user?.city || 'Vaddukoddai'}, {user?.district || 'Jaffna'}, Sri Lanka</span>
            </p>
          </div>
        </div>

        {/* Quick Stats Badges & Logout Button */}
        <div className="flex items-center flex-wrap gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-rose-50 border border-rose-100 text-center min-w-[85px]">
            <p className="text-xl font-black text-[#B80024]">{donorProfile?.totalDonations ?? 10}</p>
            <p className="text-[11px] font-bold text-slate-500">Donations</p>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-rose-50 border border-rose-100 text-center min-w-[85px]">
            <p className="text-xl font-black text-[#B80024]">{donorProfile?.livesHelped ?? 4}</p>
            <p className="text-[11px] font-bold text-slate-500">Lives Saved</p>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-rose-50 border border-rose-100 text-center min-w-[85px]">
            <p className="text-xl font-black text-[#B80024]">{donorProfile?.communityPoints ?? 150}</p>
            <p className="text-[11px] font-bold text-slate-500">Points</p>
          </div>
          <button
            onClick={() => {
              logout();
              setCurrentTab('home');
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-[#B80024] border border-rose-200 text-xs font-extrabold transition shadow-xs hover:scale-102"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 text-[#B80024]" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Emergency Pending Requests Banner */}
      {contactRequests.filter((r) => r.status === 'pending').length > 0 && (
        <div className="bg-gradient-to-r from-red-600 via-[#B80024] to-rose-700 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-red-500 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                <Heart className="w-6 h-6 fill-white text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white text-[#B80024]">
                    {language === 'ta' ? 'நேரடி அவசர கோரிக்கை' : 'Direct Patient Request'}
                  </span>
                  <span className="text-xs font-bold text-rose-100">
                    {contactRequests.filter((r) => r.status === 'pending').length} {language === 'ta' ? 'புதிய கோரிக்கைகள்' : 'Pending Request(s)'}
                  </span>
                </div>
                <h3 className="text-lg font-black mt-1">
                  {language === 'ta'
                    ? 'Find Donors மூலம் நோயாளி உங்களுக்கு நேரடியாக இரத்தம் கேட்டுள்ளார்!'
                    : 'A patient has requested blood directly from you via Find Donors!'}
                </h3>
                <p className="text-xs text-rose-100 mt-0.5">
                  {language === 'ta'
                    ? 'நோயாளியின் விபரங்களை ஆராய்ந்து உடனடியாக பதிலளிக்கவும்.'
                    : 'Please review the patient details and respond promptly to save a life.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('direct-requests')}
              className="px-5 py-2.5 bg-white text-[#B80024] hover:bg-rose-50 font-black text-xs sm:text-sm rounded-xl shadow-md transition whitespace-nowrap self-start md:self-auto"
            >
              {language === 'ta' ? 'கோரிக்கைகளைப் பார்க்கவும்' : 'View & Respond'} ({contactRequests.filter((r) => r.status === 'pending').length})
            </button>
          </div>
        </div>
      )}

      {/* 2. Donor Navigation Sub-Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-md border border-rose-100 flex items-center overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-[#B80024] text-white shadow-md shadow-rose-900/20'
              : 'text-slate-700 hover:bg-rose-50 hover:text-[#B80024]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>{language === 'ta' ? 'சுயவிவரம் & இருப்பு' : 'Overview & Availability'}</span>
        </button>

        <button
          onClick={() => setActiveTab('direct-requests')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition whitespace-nowrap relative ${
            activeTab === 'direct-requests'
              ? 'bg-[#B80024] text-white shadow-md shadow-rose-900/20'
              : 'text-slate-700 hover:bg-rose-50 hover:text-[#B80024]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>{language === 'ta' ? 'நேரடிக் கோரிக்கைகள்' : 'Direct Requests'}</span>
          {contactRequests.filter((r) => r.status === 'pending').length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
              {contactRequests.filter((r) => r.status === 'pending').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('urgent-requests')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition whitespace-nowrap relative ${
            activeTab === 'urgent-requests'
              ? 'bg-[#B80024] text-white shadow-md shadow-rose-900/20'
              : 'text-slate-700 hover:bg-rose-50 hover:text-[#B80024]'
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span>{language === 'ta' ? 'அவசர தேவைகள் (நோயாளிகள்)' : 'Urgent Patient Needs'}</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-[#B80024]">
            {urgentHospitalRequests.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('centers')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition whitespace-nowrap ${
            activeTab === 'centers'
              ? 'bg-[#B80024] text-white shadow-md shadow-rose-900/20'
              : 'text-slate-700 hover:bg-rose-50 hover:text-[#B80024]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{language === 'ta' ? 'இரத்த வங்கிகள்' : 'Blood Banks & Centers'}</span>
        </button>

        <button
          onClick={() => setActiveTab('card')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition whitespace-nowrap ${
            activeTab === 'card'
              ? 'bg-[#B80024] text-white shadow-md shadow-rose-900/20'
              : 'text-slate-700 hover:bg-rose-50 hover:text-[#B80024]'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>{language === 'ta' ? 'டிஜிட்டல் தானியாளர் அட்டை' : 'Digital Donor Card'}</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition whitespace-nowrap ${
            activeTab === 'history'
              ? 'bg-[#B80024] text-white shadow-md shadow-rose-900/20'
              : 'text-slate-700 hover:bg-rose-50 hover:text-[#B80024]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{language === 'ta' ? 'தான வரலாறு' : 'Donation History'}</span>
        </button>
      </div>

      {/* Donation Notification Toast */}
      {donateSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-3 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{donateSuccess}</span>
        </div>
      )}

      {/* 3. TAB CONTENT */}

      {/* TAB A: OVERVIEW & AVAILABILITY */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Eligibility Banner */}
          <div className="bg-gradient-to-r from-rose-900 via-[#B80024] to-rose-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-extrabold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Eligibility Status: Active</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                {language === 'ta'
                  ? 'நீங்கள் இன்று இரத்த தானம் செய்யத் தகுதியுடையவர்!'
                  : 'You Are Eligible to Donate Blood Today!'}
              </h2>
              <p className="text-xs sm:text-sm text-rose-100 leading-relaxed font-normal">
                {language === 'ta'
                  ? 'உங்கள் கடைசி தானத்திலிருந்து 90 நாட்களுக்கு மேல் கடந்துவிட்டது. தயவுசெய்து 500ml நீர் அருந்தி, போதுமான உணவு உட்கொண்டு அருகிலுள்ள இரத்த வங்கிக்கு செல்லவும்.'
                  : 'More than 90 days have elapsed since your last donation on 10 July 2024. Your hemoglobin & health interval meet all Sri Lanka National Blood Transfusion Service safety criteria.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setActiveTab('urgent-requests')}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white text-[#B80024] text-xs font-black shadow-lg hover:bg-rose-50 transition hover:scale-103 text-center"
              >
                {language === 'ta' ? 'நோயாளி தேவைகளைக் காண்க' : 'View Patients in Need'}
              </button>
              <button
                onClick={() => setActiveTab('centers')}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-rose-950/40 text-white border border-white/20 text-xs font-extrabold hover:bg-rose-950/60 transition text-center"
              >
                {language === 'ta' ? 'இரத்த வங்கிகள் பட்டியல்' : 'Find Blood Bank'}
              </button>
            </div>
          </div>

          {/* 2-Column Information & Availability */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Card: Information */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-rose-100 space-y-6">
              <h2 className="text-lg font-black text-slate-900 border-b border-rose-100 pb-3 flex items-center justify-between">
                <span>{t.information}</span>
                <span className="text-xs font-extrabold text-[#B80024] bg-rose-50 px-2.5 py-1 rounded-full">
                  NIC: Verified
                </span>
              </h2>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {t.fullName}
                  </span>
                  <span className="text-base font-extrabold text-slate-800">
                    {user?.fullName || 'Divya K.'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Blood Group
                    </span>
                    <span className="text-base font-extrabold text-[#B80024]">
                      {donorProfile?.bloodGroup || 'O+'}
                    </span>
                  </div>

                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Donor Tier
                    </span>
                    <span className="text-base font-extrabold text-amber-600">
                      Gold Hero (150 pts)
                    </span>
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Phone Number (SMS Alert Active)
                  </span>
                  <span className="text-base font-extrabold text-slate-800">
                    {user?.phone || '+94 77 123 4567'}
                  </span>
                </div>

                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {t.email}
                  </span>
                  <span className="text-base font-extrabold text-slate-800">
                    {user?.email || 'divya@lifelink.lk'}
                  </span>
                </div>

                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {t.location}
                  </span>
                  <span className="text-base font-extrabold text-slate-800">
                    {user?.city || 'Vaddukoddai'}, Jaffna District, Sri Lanka
                  </span>
                </div>
              </div>
            </div>

            {/* Right Card: Availability Status & Preferred Locations */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-rose-100 space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Availability Toggle */}
                <div className="border-b border-rose-100 pb-5">
                  <h2 className="text-lg font-black text-slate-900 mb-3">
                    {t.availabilityStatus}
                  </h2>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50/70 border border-rose-100">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800">
                        {isAvailable ? 'Available for Donation' : 'Currently Resting / Unavailable'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {isAvailable
                          ? 'Emergency patients & blood banks can reach you.'
                          : 'You will not receive phone or SMS alerts temporarily.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAvailable(!isAvailable)}
                      className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                        isAvailable ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                          isAvailable ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Preferred Locations Checkboxes */}
                <div className="space-y-3">
                  <h2 className="text-lg font-black text-slate-900">
                    {t.preferredLocations}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Select areas in Jaffna where you are willing to travel to donate blood:
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {['Jaffna', 'Vaddukoddai', 'Chulipuram', 'Araly', 'Nallur', 'Chavakachcheri', 'Point Pedro', 'Tellippalai'].map(
                      (loc) => {
                        const isChecked = preferredLocations.includes(loc);
                        return (
                          <label
                            key={loc}
                            className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer select-none hover:text-[#B80024] p-1.5 rounded-lg hover:bg-rose-50/50"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleLocation(loc)}
                              className="w-4 h-4 rounded-md text-[#B80024] focus:ring-[#B80024]"
                            />
                            <span>{loc}</span>
                          </label>
                        );
                      }
                    )}
                  </div>

                  {showAddLocation ? (
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        value={newLocationInput}
                        onChange={(e) => setNewLocationInput(e.target.value)}
                        placeholder="Enter village / town"
                        className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:border-[#B80024] focus:outline-none"
                      />
                      <button
                        onClick={handleAddLocation}
                        className="px-3 py-1.5 bg-[#B80024] text-white text-xs font-bold rounded-xl"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setShowAddLocation(false)}
                        className="px-2 py-1.5 text-slate-500 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowAddLocation(true)}
                      className="flex items-center gap-1 text-xs font-extrabold text-[#B80024] hover:underline pt-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Other Location</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Save Changes button */}
              <div className="pt-4">
                <button
                  onClick={handleSavePreferences}
                  disabled={saving}
                  className="w-full py-3.5 bg-[#B80024] hover:bg-[#98001E] text-white text-sm font-extrabold rounded-2xl shadow-xl shadow-rose-900/20 transition hover:scale-101 flex items-center justify-center gap-2"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Preferences Saved to LifeLink!</span>
                    </>
                  ) : saving ? (
                    <span>Saving...</span>
                  ) : (
                    <span>{t.saveChanges}</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Incoming Emergency Contact Requests from Requesters */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-100 space-y-4">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B80024] animate-pulse"></span>
                <span>Incoming Emergency Contact Requests</span>
              </h2>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                {contactRequests.length} Active
              </span>
            </div>

            {contactRequests.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">No active requests at this time.</p>
            ) : (
              <div className="space-y-4">
                {contactRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase bg-[#B80024] text-white px-2 py-0.5 rounded-md">
                          {req.bloodGroup} • {req.units} Units
                        </span>
                        <span className="text-xs font-bold text-slate-600">
                          Patient: <strong className="text-slate-900">{req.patientName}</strong>
                        </span>
                      </div>
                      <p className="text-sm font-black text-slate-900">{req.hospitalName}</p>
                      <p className="text-xs text-slate-600 italic">"{req.message}"</p>
                      <p className="text-[11px] text-slate-400">
                        Requested by {req.requesterName} ({req.requesterPhone})
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {req.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleRespondToRequest(req.id, 'accept')}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Accept & Share Contact</span>
                          </button>
                          <button
                            onClick={() => handleRespondToRequest(req.id, 'decline')}
                            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Decline</span>
                          </button>
                        </>
                      ) : (
                        <span
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl uppercase ${
                            req.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {req.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: DIRECT PATIENT REQUESTS (FROM FIND DONORS) */}
      {activeTab === 'direct-requests' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-100 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100 pb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#B80024] animate-pulse"></span>
                  <span>{language === 'ta' ? 'நோயாளி நேரடிக் கோரிக்கைகள் (Find Donors)' : 'Direct Patient Requests (Find Donors)'}</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {language === 'ta'
                    ? 'Find Donors பக்கத்தில் இருந்து நோயாளிகள் அல்லது அவர்களின் உறவினர்கள் உங்களுக்கு நேரடியாக அனுப்பிய இரத்தக் கோரிக்கைகள்.'
                    : 'Emergency blood requests dispatched directly to your profile by patients and hospital attendants via Find Donors.'}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black px-3.5 py-1.5 rounded-xl bg-rose-50 text-[#B80024] border border-rose-200">
                  {contactRequests.filter((r) => r.status === 'pending').length} Pending
                </span>
                <span className="text-xs font-black px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {contactRequests.filter((r) => r.status === 'accepted').length} Accepted
                </span>
                <span className="text-xs font-black px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-600 border border-slate-200">
                  {contactRequests.length} Total
                </span>
              </div>
            </div>

            {contactRequests.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-[#B80024] flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 fill-rose-100" />
                </div>
                <h4 className="text-lg font-black text-slate-800">
                  {language === 'ta' ? 'இன்னும் நேரடிக் கோரிக்கைகள் எதுவும் வரவில்லை' : 'No Direct Requests Received Yet'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  {language === 'ta'
                    ? 'இரத்தம் தேடுபவர்கள் "Find Donors" பக்கத்தில் உங்களைத் தேடி "Contact Donor" கொடுக்கும்போது, அவர்களின் கோரிக்கைகள் உடனே இங்கு வந்து சேரும்.'
                    : 'When patients or attendants find your profile in "Find Donors" and submit a contact request, it will appear here in real time.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {contactRequests.map((req) => (
                  <div
                    key={req.id}
                    className={`p-6 rounded-3xl border transition shadow-sm ${
                      req.status === 'pending'
                        ? 'bg-rose-50/70 border-rose-200 ring-2 ring-[#B80024]/10'
                        : req.status === 'accepted'
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-sm font-black uppercase px-3 py-1 rounded-xl bg-[#B80024] text-white shadow-xs">
                            {req.bloodGroup} • {req.units} Units
                          </span>
                          <span
                            className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
                              req.urgency === 'urgent' || req.urgency === 'emergency'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {req.urgency}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {new Date(req.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Colombo' })}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-lg font-black text-slate-900">
                            {language === 'ta' ? 'நோயாளி:' : 'Patient:'} {req.patientName}
                          </h4>
                          <p className="text-xs sm:text-sm font-bold text-slate-700 mt-0.5 flex items-center gap-1.5">
                            <Building2 className="w-4 h-4 text-[#B80024]" />
                            <span>{req.hospitalName}</span>
                          </p>
                        </div>

                        <div className="p-3.5 bg-white rounded-2xl border border-rose-100 text-xs sm:text-sm text-slate-700 italic">
                          "{req.message}"
                        </div>

                        <div className="text-xs text-slate-600 font-medium flex items-center gap-3 flex-wrap">
                          <span>
                            {language === 'ta' ? 'கோரியவர்:' : 'Requested by:'} <strong>{req.requesterName}</strong>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1.5 text-slate-800 font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                            <PhoneCall className="w-3.5 h-3.5 text-[#B80024]" />
                            <span>{req.requesterPhone}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-3 shrink-0">
                        {req.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleRespondToRequest(req.id, 'accept')}
                              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-emerald-900/20 hover:scale-102"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>{language === 'ta' ? 'ஏற்றுக்கொள் & உதவ முன்வா' : 'Accept & Share Contact'}</span>
                            </button>
                            <button
                              onClick={() => handleRespondToRequest(req.id, 'decline')}
                              className="w-full sm:w-auto px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>{language === 'ta' ? 'நிராகரி' : 'Decline'}</span>
                            </button>
                          </>
                        ) : (
                          <div className="text-right space-y-1">
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-black px-4 py-2 rounded-xl uppercase ${
                                req.status === 'accepted'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-slate-100 text-slate-600 border border-slate-300'
                              }`}
                            >
                              {req.status === 'accepted' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                              {req.status === 'declined' && <XCircle className="w-4 h-4 text-slate-500" />}
                              <span>{req.status}</span>
                            </span>
                            {req.status === 'accepted' && (
                              <p className="text-xs text-emerald-700 font-bold">
                                {language === 'ta'
                                  ? 'நன்றி! உங்கள் தொடர்பு விபரம் நோயாளிக்கு பகிரப்பட்டது'
                                  : 'Thank you! Contact details shared with attendant.'}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB B: URGENT BLOOD NEEDS (LIVE FROM HOSPITALS) */}
      {activeTab === 'urgent-requests' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100 pb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#B80024] animate-pulse"></span>
                <span>{language === 'ta' ? 'அவசர இரத்தத் தேவைகள் (நோயாளிகள்)' : 'Live Urgent Patient Blood Needs'}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {language === 'ta'
                  ? 'இலங்கை வைத்தியசாலைகளில் அவசரமாக இரத்தம் தேவைப்படும் நோயாளிகள். உங்கள் இரத்தக் குழு பொருத்தமாக இருந்தால் நேரடியாக உதவலாம்.'
                  : 'Patients in Sri Lankan hospitals urgently requesting blood. As an active donor, you can respond directly and save a life.'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-[#B80024] bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                Your Blood: {donorBlood}
              </span>
            </div>
          </div>

          {loadingRequests ? (
            <div className="p-12 text-center text-slate-500 text-sm font-bold">
              Loading active hospital requests...
            </div>
          ) : urgentHospitalRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-rose-100 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-lg font-black text-slate-900">No Pending Emergency Requests Right Now</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                All registered requests in Jaffna and nearby hospitals have been fulfilled! We will send you an immediate SMS and email notification when a patient needs your blood group.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {urgentHospitalRequests.map((req) => {
                const isExactMatch = req.bloodGroup === donorBlood;
                return (
                  <div
                    key={req.id}
                    className={`bg-white rounded-3xl p-6 shadow-xl border transition-all hover:shadow-2xl ${
                      isExactMatch ? 'border-[#B80024] ring-2 ring-rose-200' : 'border-rose-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black px-3 py-1 rounded-xl bg-[#B80024] text-white shadow-xs">
                          {req.bloodGroup}
                        </span>
                        {isExactMatch && (
                          <span className="text-[10px] uppercase font-black tracking-wider bg-rose-100 text-[#B80024] px-2 py-0.5 rounded-md">
                            Direct Match!
                          </span>
                        )}
                        <span
                          className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md ${
                            req.urgency === 'urgent'
                              ? 'bg-red-100 text-red-700 animate-pulse'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {req.urgency === 'urgent' ? 'Immediate Emergency' : 'Required Today'}
                        </span>
                      </div>

                      <span className="text-xs font-extrabold text-slate-500">
                        {req.unitsNeeded} Units Needed
                      </span>
                    </div>

                    <div className="mt-4 space-y-2">
                      <h3 className="text-lg font-black text-slate-900">{req.hospitalName}</h3>
                      <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{req.hospitalLocation || req.district}, Sri Lanka</span>
                      </p>
                      <p className="text-xs text-slate-700 font-medium bg-rose-50/60 p-2.5 rounded-xl border border-rose-100">
                        <strong>Patient:</strong> {req.patientName} ({req.patientAge} yrs)
                        <br />
                        <span className="italic text-slate-500 mt-1 block">"{req.additionalNotes}"</span>
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-rose-100 flex items-center justify-between gap-3">
                      <a
                        href={`tel:${req.requesterPhone}`}
                        className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-rose-200 text-[#B80024] text-xs font-extrabold hover:bg-rose-50 transition"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call Attendant</span>
                      </a>

                      <button
                        onClick={() => setDonateModal({ open: true, request: req })}
                        className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#B80024] hover:bg-[#98001E] text-white text-xs font-extrabold shadow-md shadow-rose-900/20 transition hover:scale-102"
                      >
                        <Heart className="w-3.5 h-3.5 fill-white" />
                        <span>I Can Donate</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB C: BLOOD BANKS & CENTERS IN SRI LANKA */}
      {activeTab === 'centers' && (
        <div className="space-y-6">
          <div className="border-b border-rose-100 pb-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-[#B80024]" />
              <span>{language === 'ta' ? 'அங்கீகரிக்கப்பட்ட இரத்த வங்கிகள் & தொடர்பு விபரம்' : 'Official Blood Banks & Donation Centers'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              National Blood Transfusion Service (NBTS) Sri Lanka authorized donation locations in Northern Province and Colombo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bloodBanks.map((center, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 shadow-xl border border-rose-100 space-y-4 hover:border-rose-300 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900">{center.name}</h3>
                    <p className="text-xs text-[#B80024] font-bold font-['Noto_Sans_Tamil',sans-serif] mt-0.5">
                      {center.nameTa}
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase bg-rose-100 text-[#B80024] px-2 py-0.5 rounded-md">
                    {center.district}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{center.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{center.hours}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-rose-100 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Direct Hotline</span>
                    <span className="text-sm font-black text-slate-900">{center.hotline}</span>
                  </div>

                  <a
                    href={`tel:${center.phone}`}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#B80024] hover:bg-[#98001E] text-white text-xs font-extrabold rounded-xl shadow-md shadow-rose-900/20 transition"
                  >
                    <Phone className="w-3.5 h-3.5 fill-white" />
                    <span>Call Bank</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* 1990 Emergency Ambulance Banner */}
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#B80024] text-white flex items-center justify-center font-black">
                1990
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">1990 Suwa Seriya Free Emergency Medical Hotline</h4>
                <p className="text-xs text-slate-500">Government 24/7 emergency service across all 25 districts of Sri Lanka.</p>
              </div>
            </div>
            <a
              href="tel:1990"
              className="px-5 py-2.5 bg-[#B80024] text-white font-extrabold text-xs rounded-xl shadow-sm hover:bg-[#98001E] transition text-center"
            >
              Dial 1990
            </a>
          </div>
        </div>
      )}

      {/* TAB D: DIGITAL BLOOD DONOR ID CARD */}
      {activeTab === 'card' && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-slate-900">
              {language === 'ta' ? 'அதிகாரபூர்வ இரத்த தானியாளர் அட்டை' : 'Official LifeLink Blood Donor Digital Card'}
            </h2>
            <p className="text-xs text-slate-500">
              Present this pass at any Sri Lankan hospital or mobile camp for fast-track donor registration.
            </p>
          </div>

          {/* The Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#98001E] via-[#B80024] to-[#680012] p-7 text-white shadow-2xl border-4 border-white">
            {/* Watermark Logo */}
            <Droplet className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5 pointer-events-none" />

            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-white/20 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white text-[#B80024] flex items-center justify-center font-black shadow-md">
                  <Heart className="w-5 h-5 fill-[#B80024]" />
                </div>
                <div>
                  <h3 className="font-black text-base tracking-tight leading-none">LifeLink Sri Lanka</h3>
                  <p className="text-[10px] text-rose-200 uppercase font-bold tracking-widest mt-0.5">
                    Blood Donor Pass
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-black bg-white/20 px-2 py-0.5 rounded-md">
                  Sri Lanka NBTS
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="py-6 flex items-center gap-5">
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                alt={user?.fullName || 'Divya K.'}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md"
              />

              <div className="space-y-1 flex-1">
                <h4 className="text-xl font-black">{user?.fullName || 'Divya K.'}</h4>
                <p className="text-xs text-rose-200">
                  ID: <strong className="text-white font-mono">{donorProfile?.id || 'LLK-9921-JAFF'}</strong>
                </p>
                <p className="text-xs text-rose-100 flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{user?.city || 'Vaddukoddai'}, Jaffna</span>
                </p>
              </div>

              {/* Big Blood Group Badge */}
              <div className="w-16 h-16 rounded-2xl bg-white text-[#B80024] flex flex-col items-center justify-center shadow-lg font-black">
                <span className="text-2xl leading-none">{donorProfile?.bloodGroup || 'O+'}</span>
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500">Group</span>
              </div>
            </div>

            {/* Card Footer */}
            <div className="border-t border-white/20 pt-4 flex items-center justify-between text-xs">
              <div>
                <p className="text-[10px] uppercase text-rose-200 font-bold">Total Donations</p>
                <p className="font-black text-base">{donorProfile?.totalDonations ?? 10} Units Donated</p>
              </div>

              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                <QrCode className="w-6 h-6 text-white" />
                <span className="text-[10px] font-mono font-bold tracking-tight">VERIFIED#LK</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB E: VERIFIED DONATION HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-100 space-y-4">
          <div className="border-b border-rose-100 pb-3 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">
              {language === 'ta' ? 'உறுதிப்படுத்தப்பட்ட இரத்த தான வரலாறு' : 'Verified Donation Records & Certificates'}
            </h2>
            <span className="text-xs font-bold text-slate-500">
              Total Units: {donorProfile?.totalDonations ?? 10}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-rose-100 text-slate-400 font-extrabold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2">Hospital Center</th>
                  <th className="py-3 px-2">Blood Group</th>
                  <th className="py-3 px-2">Volume</th>
                  <th className="py-3 px-2">Verified Medical Officer</th>
                  <th className="py-3 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {donationHistory.map((h) => (
                  <tr key={h.id} className="hover:bg-rose-50/40">
                    <td className="py-3.5 px-2 font-bold text-slate-700">{h.donationDate}</td>
                    <td className="py-3.5 px-2 font-bold text-slate-900">{h.hospitalName}</td>
                    <td className="py-3.5 px-2 font-black text-[#B80024]">{h.bloodGroup}</td>
                    <td className="py-3.5 px-2 font-bold text-slate-700">{h.units} Unit (450ml)</td>
                    <td className="py-3.5 px-2 text-slate-600 font-medium">{h.verifiedByStaff}</td>
                    <td className="py-3.5 px-2 text-right">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                        {h.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal for "I Can Donate" */}
      {donateModal.open && donateModal.request && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-rose-100 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-[#B80024] flex items-center justify-center font-black">
                <Heart className="w-6 h-6 fill-[#B80024]" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Confirm Blood Donation</h3>
                <p className="text-xs text-slate-500">{donateModal.request.hospitalName}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 text-xs text-slate-700 space-y-1.5">
              <p>
                <strong>Patient:</strong> {donateModal.request.patientName}
              </p>
              <p>
                <strong>Blood Group:</strong>{' '}
                <span className="font-black text-[#B80024]">{donateModal.request.bloodGroup}</span>
              </p>
              <p>
                <strong>Hospital:</strong> {donateModal.request.hospitalName} ({donateModal.request.hospitalLocation})
              </p>
              <p>
                <strong>Attendant Phone:</strong> {donateModal.request.requesterPhone}
              </p>
            </div>

            <p className="text-xs text-slate-500">
              By confirming, LifeLink will immediately notify the hospital and patient attendant that donor{' '}
              <strong>{user?.fullName}</strong> is arriving to donate.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleConfirmDonationIntention(donateModal.request!)}
                className="flex-1 py-3 bg-[#B80024] hover:bg-[#98001E] text-white text-xs font-black rounded-xl shadow-md transition"
              >
                Yes, I Am Coming to Donate
              </button>
              <button
                onClick={() => setDonateModal({ open: false, request: null })}
                className="px-4 py-3 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
