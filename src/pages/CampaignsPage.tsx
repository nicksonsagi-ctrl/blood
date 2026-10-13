import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Heart, CheckCircle2, Plus, Phone, AlertCircle } from 'lucide-react';
import { BloodCampaign, BloodGroup } from '../types';
import { useAuth } from '../context/AuthContext';
import { validateSriLankanPhone } from '../data/sriLankaData';

export const CampaignsPage: React.FC = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<BloodCampaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<BloodCampaign | null>(null);

  // Registration modal form state
  const [regForm, setRegForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    bloodGroup: 'O+' as BloodGroup,
    preferredTime: '10:00 AM',
  });
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/campaigns');
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regForm.fullName || !regForm.phone) {
      setRegError('Please provide your name and phone number.');
      return;
    }

    if (!validateSriLankanPhone(regForm.phone)) {
      setRegError('Please provide a valid Sri Lankan phone number (+94 7X or 07X).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/campaigns/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: selectedCampaign?.id,
          fullName: regForm.fullName,
          phone: regForm.phone,
          bloodGroup: regForm.bloodGroup,
          preferredTime: regForm.preferredTime,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to register for campaign');
      }

      setRegSuccess(true);
      fetchCampaigns();
    } catch (err: any) {
      setRegError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Blood Donation Campaigns
        </h1>
        <p className="text-sm sm:text-base text-slate-500 font-medium">
          Participate in organized community blood donation camps across Jaffna District and nationwide.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm font-bold text-slate-400">
          Loading upcoming campaigns...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className="bg-white rounded-3xl overflow-hidden shadow-xl border border-rose-100 flex flex-col hover:shadow-2xl transition group"
            >
              <div className="h-48 relative bg-slate-900 overflow-hidden">
                <img
                  src={camp.image || 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80'}
                  alt={camp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-[#B80024] text-xs font-black px-3 py-1 rounded-full shadow-xs">
                  {camp.district}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#B80024]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{camp.date}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{camp.startTime} - {camp.endTime}</span>
                  </div>

                  <h3 className="font-extrabold text-lg text-slate-900 leading-snug">
                    {camp.title}
                  </h3>

                  <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#B80024] shrink-0" />
                    <span>{camp.venue}</span>
                  </p>

                  <p className="text-xs text-slate-500 leading-relaxed pt-1 line-clamp-3">
                    {camp.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-rose-50 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-400 block font-semibold">Target</span>
                    <strong className="text-slate-900 font-extrabold">{camp.targetUnits} Units</strong>
                    <span className="text-emerald-600 font-bold ml-1.5">({camp.registeredCount} joined)</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCampaign(camp);
                      setRegSuccess(false);
                      setRegError('');
                    }}
                    className="px-4 py-2 bg-[#B80024] hover:bg-[#98001E] text-white text-xs font-bold rounded-xl transition shadow-md shadow-rose-900/20"
                  >
                    Join Campaign
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Registration Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 space-y-4">
            <h3 className="text-lg font-black text-slate-900">
              Register for Campaign
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              {selectedCampaign.title} • {selectedCampaign.date}
            </p>

            {regSuccess ? (
              <div className="py-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base text-slate-900">Registration Confirmed!</h4>
                <p className="text-xs text-slate-600">
                  Thank you for stepping up to donate blood at {selectedCampaign.venue}. Please arrive during your chosen time slot.
                </p>
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="px-6 py-2 bg-[#B80024] text-white text-xs font-bold rounded-xl"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                {regError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={regForm.fullName}
                    onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone (+94) *</label>
                  <input
                    type="tel"
                    required
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
                    <select
                      value={regForm.bloodGroup}
                      onChange={(e) => setRegForm({ ...regForm, bloodGroup: e.target.value as BloodGroup })}
                      className="w-full px-3 py-2 text-xs border rounded-xl"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Time</label>
                    <select
                      value={regForm.preferredTime}
                      onChange={(e) => setRegForm({ ...regForm, preferredTime: e.target.value })}
                      className="w-full px-3 py-2 text-xs border rounded-xl"
                    >
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="01:00 PM">01:00 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCampaign(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-[#B80024] text-white text-xs font-bold rounded-xl"
                  >
                    {submitting ? 'Registering...' : 'Confirm Registration'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
