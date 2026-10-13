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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { DonorContactRequest, DonationRecord } from '../types';

interface DonorDashboardProps {
  setCurrentTab: (tab: string) => void;
}

export const DonorDashboard: React.FC<DonorDashboardProps> = ({ setCurrentTab }) => {
  const { user, donorProfile, updateDonorProfile } = useAuth();
  const { t } = useLanguage();

  const [isAvailable, setIsAvailable] = useState<boolean>(donorProfile?.isAvailable ?? true);
  const [preferredLocations, setPreferredLocations] = useState<string[]>(
    donorProfile?.preferredLocations || ['Jaffna', 'Vaddukoddai', 'Chulipuram', 'Araly']
  );
  const [newLocationInput, setNewLocationInput] = useState('');
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Incoming contact requests
  const [contactRequests, setContactRequests] = useState<DonorContactRequest[]>([]);
  const [donationHistory, setDonationHistory] = useState<DonationRecord[]>([]);

  useEffect(() => {
    if (donorProfile) {
      setIsAvailable(donorProfile.isAvailable);
      if (donorProfile.preferredLocations) {
        setPreferredLocations(donorProfile.preferredLocations);
      }
    }
  }, [donorProfile]);

  // Fetch incoming contact requests and history
  const fetchDonorData = async () => {
    try {
      // In this demo, fetch pending contact requests
      const res = await fetch('/api/notifications');
      if (res.ok) {
        // mock contact request for Divya
        setContactRequests([
          {
            id: 'CR-901',
            requesterId: 'usr-requester-1',
            requesterName: 'Ravi S.',
            requesterPhone: '+94 71 889 9001',
            donorId: donorProfile?.id || 'dp-1',
            patientName: 'Kalaivani S.',
            hospitalName: 'Teaching Hospital Jaffna',
            bloodGroup: 'O+',
            units: 2,
            urgency: 'urgent',
            message: 'Urgent need for O+ blood for surgery tomorrow morning at Jaffna Teaching Hospital Surgical Ward 3.',
            status: 'pending',
            createdAt: '2024-10-12T10:00:00Z',
          },
        ]);
      }

      setDonationHistory([
        {
          id: 'DH-301',
          donorId: 'dp-1',
          donorName: 'Divya K.',
          bloodGroup: 'O+',
          hospitalName: 'Teaching Hospital Jaffna',
          district: 'Jaffna',
          donationDate: '2024-07-10',
          units: 1,
          verifiedByStaff: 'Dr. T. Sivarajah (Blood Bank)',
          status: 'Completed',
        },
        {
          id: 'DH-284',
          donorId: 'dp-1',
          donorName: 'Divya K.',
          bloodGroup: 'O+',
          hospitalName: 'Base Hospital Tellippalai',
          district: 'Jaffna',
          donationDate: '2024-03-12',
          units: 1,
          verifiedByStaff: 'Dr. N. Kugathas',
          status: 'Completed',
        },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDonorData();
  }, [donorProfile]);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Donor Profile Header matching reference image */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
              alt={user?.fullName || 'Divya K.'}
              className="w-20 h-20 sm:w-24 sm:sum-24 rounded-full object-cover border-4 border-rose-100 shadow-md"
            />
            <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {user?.fullName || 'Divya K.'}
              </h1>
              <span className="bg-rose-100 text-[#B80024] font-black text-xs px-2.5 py-1 rounded-full">
                {donorProfile?.bloodGroup || 'O+'}
              </span>
            </div>
            <p className="text-sm font-bold text-slate-500 mt-0.5">{t.bloodDonor}</p>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>{user?.city || 'Vaddukoddai'}, Jaffna, Sri Lanka</span>
            </p>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-4">
          <div className="px-4 py-2.5 rounded-2xl bg-rose-50 border border-rose-100 text-center">
            <p className="text-xl font-black text-[#B80024]">{donorProfile?.totalDonations ?? 10}</p>
            <p className="text-[11px] font-bold text-slate-500">Donations</p>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-rose-50 border border-rose-100 text-center">
            <p className="text-xl font-black text-[#B80024]">{donorProfile?.livesHelped ?? 4}</p>
            <p className="text-[11px] font-bold text-slate-500">Lives Saved</p>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-rose-50 border border-rose-100 text-center">
            <p className="text-xl font-black text-[#B80024]">{donorProfile?.communityPoints ?? 150}</p>
            <p className="text-[11px] font-bold text-slate-500">Points</p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Content matching reference image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Card: Information matching screenshot */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-rose-100 space-y-6">
          <h2 className="text-lg font-black text-slate-900 border-b border-rose-100 pb-3">
            {t.information}
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
                Phone Number
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
                {user?.email || 'divya@example.com'}
              </span>
            </div>

            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t.location}
              </span>
              <span className="text-base font-extrabold text-slate-800">
                Jaffna, Sri Lanka
              </span>
            </div>

            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t.address}
              </span>
              <span className="text-base font-extrabold text-slate-800">
                {user?.address || 'Vaddukoddai, Jaffna'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Card: Availability Status & Preferred Locations matching screenshot */}
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
                    {t.availableForDonation}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Allow nearby verified emergency requesters to contact you.
                  </p>
                </div>
                {/* Toggle button */}
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

            {/* Preferred Locations Checkboxes matching screenshot */}
            <div className="space-y-3">
              <h2 className="text-lg font-black text-slate-900">
                {t.preferredLocations}
              </h2>
              <p className="text-xs text-slate-500">
                Select areas in Jaffna where you are willing to travel to donate blood:
              </p>

              <div className="space-y-2.5 pt-1">
                {['Jaffna', 'Vaddukoddai', 'Chulipuram', 'Araly', 'Nallur', 'Chavakachcheri', 'Point Pedro'].map(
                  (loc) => {
                    const isChecked = preferredLocations.includes(loc);
                    return (
                      <label
                        key={loc}
                        className="flex items-center gap-3 text-sm font-bold text-slate-700 cursor-pointer select-none hover:text-[#B80024]"
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

              {/* Add Location row */}
              {showAddLocation ? (
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={newLocationInput}
                    onChange={(e) => setNewLocationInput(e.target.value)}
                    placeholder="Enter city or village"
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
                  <span>+ Add Location</span>
                </button>
              )}
            </div>
          </div>

          {/* Save Changes button */}
          <div className="pt-6">
            <button
              onClick={handleSavePreferences}
              disabled={saving}
              className="w-full py-3.5 bg-[#B80024] hover:bg-[#98001E] text-white text-sm font-extrabold rounded-2xl shadow-xl shadow-rose-900/20 transition hover:scale-101 flex items-center justify-center gap-2"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Preferences Saved!</span>
                </>
              ) : saving ? (
                <span>Saving to Database...</span>
              ) : (
                <span>{t.saveChanges}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Incoming Patient Contact Requests */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-100 space-y-4">
        <div className="flex items-center justify-between border-b border-rose-100 pb-3">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B80024] animate-pulse"></span>
            Incoming Emergency Contact Requests
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
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-xl uppercase ${
                      req.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {req.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verified Donation History */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-100 space-y-4">
        <h2 className="text-xl font-black text-slate-900 border-b border-rose-100 pb-3">
          Verified Donation History
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-rose-100 text-slate-400 font-extrabold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Hospital</th>
                <th className="py-3 px-2">Blood Group</th>
                <th className="py-3 px-2">Units</th>
                <th className="py-3 px-2">Verified By Staff</th>
                <th className="py-3 px-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50">
              {donationHistory.map((h) => (
                <tr key={h.id} className="hover:bg-rose-50/40">
                  <td className="py-3.5 px-2 font-bold text-slate-700">{h.donationDate}</td>
                  <td className="py-3.5 px-2 font-bold text-slate-900">{h.hospitalName}</td>
                  <td className="py-3.5 px-2 font-black text-[#B80024]">{h.bloodGroup}</td>
                  <td className="py-3.5 px-2 font-bold text-slate-700">{h.units} Unit</td>
                  <td className="py-3.5 px-2 text-slate-600">{h.verifiedByStaff}</td>
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
    </div>
  );
};
