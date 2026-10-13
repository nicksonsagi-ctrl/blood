import React, { useState, useEffect } from 'react';
import {
  Heart,
  Droplet,
  Users,
  Award,
  Plus,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { BloodRequest } from '../types';

interface RequesterDashboardProps {
  setCurrentTab: (tab: string) => void;
}

export const RequesterDashboard: React.FC<RequesterDashboardProps> = ({ setCurrentTab }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const handleCancelRequest = async (id: string) => {
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled' }),
      });
      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: 'Cancelled' } : r))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dashboard Top Header matching reference image */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            {t.welcomeBack}, {user?.fullName || 'Ravi'}!
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('request-blood')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B80024] hover:bg-[#98001E] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md shadow-rose-900/20 transition hover:scale-103"
        >
          <Plus className="w-4 h-4" />
          <span>New Blood Request</span>
        </button>
      </div>

      {/* 4 Summary KPI Cards matching reference image */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Donations */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-rose-100 flex flex-col justify-between space-y-2">
          <span className="text-3xl sm:text-4xl font-black text-slate-900">
            10
          </span>
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>{t.totalDonations}</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#B80024] flex items-center justify-center">
              <Droplet className="w-4 h-4 fill-[#B80024]" />
            </div>
          </div>
        </div>

        {/* Lives Helped */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-rose-100 flex flex-col justify-between space-y-2">
          <span className="text-3xl sm:text-4xl font-black text-[#B80024]">
            4
          </span>
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>{t.livesHelped}</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#B80024] flex items-center justify-center">
              <Heart className="w-4 h-4 fill-[#B80024]" />
            </div>
          </div>
        </div>

        {/* Requests Responded */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-rose-100 flex flex-col justify-between space-y-2">
          <span className="text-3xl sm:text-4xl font-black text-slate-900">
            3
          </span>
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>{t.requestsResponded}</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#B80024] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Community Points */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-rose-100 flex flex-col justify-between space-y-2">
          <span className="text-3xl sm:text-4xl font-black text-slate-900">
            150
          </span>
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>{t.communityPoints}</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#B80024] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Requests List matching reference image */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-100 space-y-6">
        <div className="flex items-center justify-between border-b border-rose-100 pb-4">
          <h2 className="text-xl font-black text-slate-900">
            {t.recentRequests}
          </h2>
          <button
            onClick={() => setCurrentTab('find-donors')}
            className="text-xs font-extrabold text-[#B80024] hover:underline"
          >
            {t.viewAll}
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm font-bold text-slate-400">
            Loading your requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <Heart className="w-10 h-10 text-rose-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No requests submitted yet.</p>
            <button
              onClick={() => setCurrentTab('request-blood')}
              className="text-xs font-bold text-[#B80024] underline"
            >
              Submit an emergency request
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className="p-4 sm:p-5 rounded-2xl bg-rose-50/40 border border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-rose-50/80 transition"
              >
                {/* Left details matching screenshot: Need O+ blood | Jaffna Teaching Hospital */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-rose-200 text-[#B80024] flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                    {req.bloodGroup}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                        {t.needBloodPrefix} {req.bloodGroup} blood
                      </h4>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          req.urgency === 'urgent' || req.urgency === 'emergency'
                            ? 'bg-rose-100 text-[#B80024]'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {req.urgency}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium mt-0.5">
                      {req.hospitalName} • Patient: {req.patientName} ({req.unitsNeeded} Units)
                    </p>
                  </div>
                </div>

                {/* Right metadata & status pills matching screenshot */}
                <div className="flex items-center justify-between sm:justify-end gap-4 text-xs font-semibold">
                  <span className="text-slate-400">
                    {req.requiredDate || req.createdAt?.split('T')[0]}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                      req.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : req.status === 'Fulfilled'
                        ? 'bg-emerald-50 text-emerald-700'
                        : req.status === 'Pending Verification'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {req.status}
                  </span>

                  {req.status === 'Active' && (
                    <button
                      onClick={() => handleCancelRequest(req.id)}
                      className="text-xs text-slate-400 hover:text-rose-600 transition underline"
                      title="Cancel request"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
