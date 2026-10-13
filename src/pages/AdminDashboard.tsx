import React, { useState, useEffect } from 'react';
import {
  Users,
  Heart,
  Droplet,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  ShieldCheck,
  Search,
  Download,
  Mail,
  Calendar,
  FileText,
  Activity,
  Plus,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { DonorProfile, BloodRequest, ContactMessage, BloodCampaign, AuditLog } from '../types';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'donors' | 'requests' | 'messages' | 'campaigns' | 'reports' | 'audit'
  >('overview');

  const [stats, setStats] = useState<any>({
    registeredDonors: 5209,
    verifiedDonors: 9,
    availableDonors: 8,
    activeRequests: 4,
    pendingRequests: 0,
    fulfilledRequests: 2,
    unreadMessages: 1,
    totalDonations: 1248,
    livesSaved: 512,
  });

  const [donors, setDonors] = useState<DonorProfile[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [campaigns, setCampaigns] = useState<BloodCampaign[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Filters & Search
  const [donorSearch, setDonorSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // New campaign modal state
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    organizer: 'National Blood Transfusion Service (NBTS) Jaffna',
    venue: '',
    district: 'Jaffna',
    city: 'Jaffna Town',
    date: '2024-11-15',
    startTime: '09:00 AM',
    endTime: '03:00 PM',
    description: '',
    targetUnits: 100,
    contactNumber: '+94 21 222 2261',
  });
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, donorsRes, requestsRes, msgRes, campRes, auditRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/donors'),
        fetch('/api/requests'),
        fetch('/api/admin/contact-messages'),
        fetch('/api/campaigns'),
        fetch('/api/admin/audit-logs'),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (donorsRes.ok) setDonors(await donorsRes.json());
      if (requestsRes.ok) setRequests(await requestsRes.json());
      if (msgRes.ok) setMessages(await msgRes.json());
      if (campRes.ok) setCampaigns(await campRes.json());
      if (auditRes.ok) setAuditLogs(await auditRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerifyDonor = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/donors/${id}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: !currentStatus }),
      });
      if (res.ok) {
        setDonors((prev) =>
          prev.map((d) => (d.id === id ? { ...d, isVerified: !currentStatus } : d))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSuspendDonor = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/donors/${id}/suspend`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isSuspended: !currentStatus }),
      });
      if (res.ok) {
        setDonors((prev) =>
          prev.map((d) => (d.id === id ? { ...d, isSuspended: !currentStatus } : d))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateRequestStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus as any } : r))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveMessage = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/contact-messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved', isRead: true }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: 'resolved', isRead: true } : m))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate creation
    const created: BloodCampaign = {
      id: `CMP-${Date.now().toString().slice(-4)}`,
      ...newCampaign,
      province: 'Northern',
      registeredCount: 0,
      isPublished: true,
      image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80',
    };
    setCampaigns([created, ...campaigns]);
    setShowCampaignModal(false);
  };

  const filteredDonors = donors.filter(
    (d) =>
      d.fullName.toLowerCase().includes(donorSearch.toLowerCase()) ||
      d.city.toLowerCase().includes(donorSearch.toLowerCase()) ||
      d.bloodGroup.toLowerCase().includes(donorSearch.toLowerCase())
  );

  // Analytics mock datasets
  const monthlyTrends = [
    { month: 'May', donors: 120, requests: 85 },
    { month: 'Jun', donors: 145, requests: 92 },
    { month: 'Jul', donors: 180, requests: 110 },
    { month: 'Aug', donors: 210, requests: 125 },
    { month: 'Sep', donors: 240, requests: 140 },
    { month: 'Oct', donors: 295, requests: 165 },
  ];

  const bloodGroupStats = [
    { name: 'O+', value: 42, color: '#B80024' },
    { name: 'A+', value: 24, color: '#E11D48' },
    { name: 'B+', value: 20, color: '#F43F5E' },
    { name: 'AB+', value: 8, color: '#FB7185' },
    { name: 'O-', value: 3, color: '#FDA4AF' },
    { name: 'Others', value: 3, color: '#FECDD3' },
  ];

  const districtDistribution = [
    { district: 'Jaffna', requests: 48 },
    { district: 'Colombo', requests: 36 },
    { district: 'Kandy', requests: 22 },
    { district: 'Kilinochchi', requests: 14 },
    { district: 'Galle', requests: 12 },
    { district: 'Vavuniya', requests: 9 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Admin Command Center
            </h1>
            <span className="bg-[#B80024] text-white text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
              Super Admin
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Dr. Ketheeswaran M. • National Blood Transfusion Coordination, Sri Lanka
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAdminData}
            className="p-2.5 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-slate-700 transition"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4 text-[#B80024]" />
          </button>
          <a
            href="/api/admin/reports/csv?type=donors"
            download
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-rose-200 text-slate-800 text-xs font-extrabold rounded-xl hover:bg-rose-50 transition shadow-xs"
          >
            <Download className="w-4 h-4 text-[#B80024]" />
            <span>Export Donors CSV</span>
          </a>
          <a
            href="/api/admin/reports/csv?type=requests"
            download
            className="flex items-center gap-2 px-4 py-2.5 bg-[#B80024] hover:bg-[#98001E] text-white text-xs font-extrabold rounded-xl transition shadow-md shadow-rose-900/20"
          >
            <Download className="w-4 h-4" />
            <span>Export Requests CSV</span>
          </a>
        </div>
      </div>

      {/* Admin Subtabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-rose-100">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: Activity },
          { id: 'donors', label: 'Donor Management', icon: Users },
          { id: 'requests', label: 'Blood Requests', icon: Droplet },
          { id: 'messages', label: `Messages (${stats.unreadMessages})`, icon: Mail },
          { id: 'campaigns', label: 'Blood Campaigns', icon: Calendar },
          { id: 'audit', label: 'Audit Trail', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-extrabold rounded-xl whitespace-nowrap transition ${
                isActive
                  ? 'bg-[#B80024] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-rose-50 hover:text-[#B80024]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* Top 6 KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-md border border-rose-100">
              <span className="text-2xl font-black text-slate-900">{stats.registeredDonors}</span>
              <p className="text-[11px] font-bold text-slate-500 mt-1">Total Donors</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-md border border-rose-100">
              <span className="text-2xl font-black text-emerald-600">{stats.verifiedDonors}</span>
              <p className="text-[11px] font-bold text-slate-500 mt-1">Verified Donors</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-md border border-rose-100">
              <span className="text-2xl font-black text-[#B80024]">{stats.availableDonors}</span>
              <p className="text-[11px] font-bold text-slate-500 mt-1">Available Now</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-md border border-rose-100">
              <span className="text-2xl font-black text-rose-600">{stats.activeRequests}</span>
              <p className="text-[11px] font-bold text-slate-500 mt-1">Active Requests</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-md border border-rose-100">
              <span className="text-2xl font-black text-emerald-600">{stats.fulfilledRequests}</span>
              <p className="text-[11px] font-bold text-slate-500 mt-1">Fulfilled</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-md border border-rose-100">
              <span className="text-2xl font-black text-amber-600">{stats.unreadMessages}</span>
              <p className="text-[11px] font-bold text-slate-500 mt-1">Unread Inquiries</p>
            </div>
          </div>

          {/* Recharts Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Monthly Trend Chart */}
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl shadow-xl border border-rose-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Monthly Donor Registrations & Requests Trend
                  </h3>
                  <p className="text-xs text-slate-500">Live operational data in Sri Lanka</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  +34% Growth
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#FFF0F3" />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                    <YAxis stroke="#94A3B8" fontSize={12} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="donors"
                      name="Donors"
                      stroke="#B80024"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="requests"
                      name="Requests"
                      stroke="#0284C7"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Blood Group Distribution */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-xl border border-rose-100 space-y-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Blood Group Distribution
                </h3>
                <p className="text-xs text-slate-500">Share of registered donors</p>
              </div>

              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bloodGroupStats}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                    >
                      {bloodGroupStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
                {bloodGroupStats.slice(0, 3).map((bg) => (
                  <div key={bg.name} className="p-1.5 rounded-lg bg-rose-50">
                    <span className="text-[#B80024]">{bg.name}</span>
                    <span className="block text-slate-600 font-extrabold">{bg.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* District Distribution Bar Chart */}
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-rose-100 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">
              Emergency Requests by District Focus (Northern & Western Provinces)
            </h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={districtDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#FFF0F3" />
                  <XAxis dataKey="district" stroke="#94A3B8" fontSize={12} />
                  <YAxis stroke="#94A3B8" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="requests" name="Requests" fill="#B80024" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 2. DONORS MANAGEMENT TAB */}
      {activeTab === 'donors' && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-rose-100 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Donor Management</h2>
              <p className="text-xs text-slate-500">
                Verify identities, check medical eligibility confirmations, and manage suspensions.
              </p>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={donorSearch}
                onChange={(e) => setDonorSearch(e.target.value)}
                placeholder="Search donors by name, city, group..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#B80024] focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-rose-100 text-slate-400 font-extrabold uppercase text-[11px]">
                  <th className="py-3 px-3">Donor</th>
                  <th className="py-3 px-3">Blood Group</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Donations</th>
                  <th className="py-3 px-3">Availability</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {filteredDonors.map((d) => (
                  <tr key={d.id} className="hover:bg-rose-50/40">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={d.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                          alt={d.fullName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-extrabold text-slate-900">{d.fullName}</p>
                          <p className="text-[10px] text-slate-500">{d.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-black text-[#B80024] text-sm">
                      {d.bloodGroup}
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-700">
                      {d.city}, {d.district}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-800">
                      {d.totalDonations}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        d.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {d.isAvailable ? 'Available' : 'Busy'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        d.isSuspended
                          ? 'bg-rose-100 text-rose-800'
                          : d.isVerified
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {d.isSuspended ? 'Suspended' : d.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right space-x-2">
                      <button
                        onClick={() => handleVerifyDonor(d.id, !!d.isVerified)}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 transition"
                      >
                        {d.isVerified ? 'Unverify' : 'Verify'}
                      </button>
                      <button
                        onClick={() => handleSuspendDonor(d.id, !!d.isSuspended)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition ${
                          d.isSuspended
                            ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                            : 'border-rose-200 text-rose-700 hover:bg-rose-50'
                        }`}
                      >
                        {d.isSuspended ? 'Reactivate' : 'Suspend'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. BLOOD REQUESTS TAB */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-rose-100 space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">Emergency Blood Requests</h2>
            <p className="text-xs text-slate-500">
              Verify medical legitimacy, monitor responses, and coordinate fulfillment.
            </p>
          </div>

          <div className="space-y-3">
            {requests.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-2xl bg-rose-50/30 border border-rose-100 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">{r.id}</span>
                    <span className="font-black text-[#B80024] text-sm">
                      {r.unitsNeeded} Units of {r.bloodGroup}
                    </span>
                    <span className="text-[10px] uppercase font-black bg-rose-100 text-[#B80024] px-2 py-0.5 rounded-md">
                      {r.urgency}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mt-1">
                    {r.patientName} (Age {r.patientAge}) • {r.hospitalName}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Requester: {r.requesterName} ({r.requesterPhone}) • {r.hospitalLocation}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase ${
                    r.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : r.status === 'Fulfilled'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {r.status}
                  </span>

                  <select
                    value={r.status}
                    onChange={(e) => handleUpdateRequestStatus(r.id, e.target.value)}
                    className="text-xs font-bold border border-slate-300 rounded-xl px-2 py-1 bg-white focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Fulfilled">Fulfilled</option>
                    <option value="Pending Verification">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. CONTACT MESSAGES TAB */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-rose-100 space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">Inbound Contact Messages</h2>
            <p className="text-xs text-slate-500">
              General inquiries, hospital collaboration requests, and donor questions.
            </p>
          </div>

          <div className="space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-5 rounded-2xl border transition ${
                  m.status === 'new' ? 'bg-rose-50/60 border-rose-200' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#B80024]">
                      {m.id} • {m.createdAt?.split('T')[0]}
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-900 mt-0.5">{m.subject}</h3>
                    <p className="text-xs text-slate-600 font-semibold mt-0.5">
                      From: {m.fullName} ({m.email} {m.phone ? `• ${m.phone}` : ''})
                    </p>
                    <p className="text-xs text-slate-700 mt-2 p-3 bg-white/80 rounded-xl border border-rose-100/50">
                      "{m.message}"
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      m.status === 'new' ? 'bg-rose-100 text-[#B80024]' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {m.status}
                    </span>

                    {m.status !== 'resolved' && (
                      <button
                        onClick={() => handleResolveMessage(m.id)}
                        className="px-3 py-1 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CAMPAIGNS TAB */}
      {activeTab === 'campaigns' && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-rose-100 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900">Blood Donation Campaigns</h2>
              <p className="text-xs text-slate-500">
                Organize community donation drives with hospital blood banks.
              </p>
            </div>
            <button
              onClick={() => setShowCampaignModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#B80024] hover:bg-[#98001E] text-white text-xs font-bold rounded-xl transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create Campaign</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.map((c) => (
              <div key={c.id} className="p-5 rounded-2xl border border-rose-100 bg-rose-50/20 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span className="text-[#B80024] font-black">{c.district}</span>
                  <span>{c.date} • {c.startTime}</span>
                </div>
                <h4 className="font-extrabold text-base text-slate-900">{c.title}</h4>
                <p className="text-xs text-slate-600">{c.venue}</p>
                <div className="pt-2 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Target: {c.targetUnits} Units</span>
                  <span className="text-emerald-600 font-bold">{c.registeredCount} Registered</span>
                </div>
              </div>
            ))}
          </div>

          {/* Modal to create campaign */}
          {showCampaignModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-rose-100 shadow-2xl">
                <h3 className="text-lg font-black text-slate-900">Create New Blood Drive</h3>
                <form onSubmit={handleCreateCampaign} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Campaign Title *</label>
                    <input
                      type="text"
                      required
                      value={newCampaign.title}
                      onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                      placeholder="e.g. Chavakachcheri Community Blood Drive"
                      className="w-full px-3 py-2 text-xs border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Venue *</label>
                    <input
                      type="text"
                      required
                      value={newCampaign.venue}
                      onChange={(e) => setNewCampaign({ ...newCampaign, venue: e.target.value })}
                      placeholder="e.g. Hindu College Memorial Hall, Chavakachcheri"
                      className="w-full px-3 py-2 text-xs border rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                      <input
                        type="date"
                        value={newCampaign.date}
                        onChange={(e) => setNewCampaign({ ...newCampaign, date: e.target.value })}
                        className="w-full px-3 py-2 text-xs border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Target Units</label>
                      <input
                        type="number"
                        value={newCampaign.targetUnits}
                        onChange={(e) => setNewCampaign({ ...newCampaign, targetUnits: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs border rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={newCampaign.description}
                      onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                      placeholder="Details, refreshments, medical staff..."
                      className="w-full px-3 py-2 text-xs border rounded-xl"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCampaignModal(false)}
                      className="px-4 py-2 text-xs font-bold text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#B80024] text-white text-xs font-bold rounded-xl"
                    >
                      Publish Campaign
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. AUDIT TRAIL TAB */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-rose-100 space-y-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">Security & Administrative Audit Trail</h2>
            <p className="text-xs text-slate-500">
              Immutable activity records for compliance with Sri Lankan data protection standards.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-rose-100 text-slate-400 font-extrabold uppercase text-[11px]">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Actor</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Resource</th>
                  <th className="py-2.5 px-3">Details</th>
                  <th className="py-2.5 px-3">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50 font-medium text-slate-700">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-rose-50/40">
                    <td className="py-3 px-3 text-slate-400">{log.timestamp?.split('T')[1]?.slice(0, 8)}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{log.actorEmail}</td>
                    <td className="py-3 px-3 font-mono font-black text-[#B80024]">{log.action}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{log.targetResource}</td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate">{log.details}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
