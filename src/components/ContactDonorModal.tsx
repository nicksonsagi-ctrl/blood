import React, { useState } from 'react';
import { X, ShieldCheck, Heart, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { DonorProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import { validateSriLankanPhone, formatSriLankanPhone } from '../data/sriLankaData';

interface ContactDonorModalProps {
  donor: DonorProfile | any | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ContactDonorModal: React.FC<ContactDonorModalProps> = ({ donor, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    requesterName: user?.fullName || '',
    requesterPhone: user?.phone || '',
    patientName: '',
    hospitalName: 'Teaching Hospital Jaffna',
    units: 1,
    urgency: 'urgent',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!donor) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.requesterName.trim() || !formData.patientName.trim()) {
      setError('Please provide requester and patient names.');
      return;
    }

    if (!validateSriLankanPhone(formData.requesterPhone)) {
      setError('Please provide a valid Sri Lankan phone number (+94 7X or 07X).');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/donors/contact-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorId: donor.id,
          requesterId: user?.id,
          requesterName: formData.requesterName,
          requesterPhone: formData.requesterPhone,
          patientName: formData.patientName,
          hospitalName: formData.hospitalName,
          bloodGroup: donor.bloodGroup,
          units: formData.units,
          urgency: formData.urgency,
          message: formData.message,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit contact request');
      }

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-rose-100 relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#B80024] to-[#8E001C] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-tight">
                Request Contact: {donor.fullName}
              </h3>
              <p className="text-xs text-rose-200 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                Privacy-Protected Communication
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-xl font-black text-slate-800">Contact Request Sent!</h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                Your emergency request has been safely dispatched to <strong>{donor.fullName}</strong>. You will receive an immediate in-app and SMS alert once the donor confirms willingness to donate.
              </p>
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#B80024] text-white font-bold rounded-xl text-sm shadow-md hover:bg-[#98001E] transition"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Privacy badge */}
              <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-3 text-xs text-slate-600 leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#B80024] shrink-0 mt-0.5" />
                <div>
                  To prevent unsolicited harassment and respect privacy, donor phone numbers and addresses are never shown directly. Your request will be transmitted safely to {donor.fullName}'s verified donor dashboard.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Requester Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.requesterName}
                    onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                    placeholder="e.g. Ravi S."
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-[#B80024] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Number (+94) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.requesterPhone}
                    onChange={(e) => setFormData({ ...formData, requesterPhone: e.target.value })}
                    placeholder="+94 77 123 4567"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-[#B80024] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    placeholder="Patient or Reference ID"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-[#B80024] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hospital Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.hospitalName}
                    onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                    placeholder="e.g. Teaching Hospital Jaffna"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-[#B80024] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Units Needed
                  </label>
                  <select
                    value={formData.units}
                    onChange={(e) => setFormData({ ...formData, units: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-[#B80024] focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5].map((u) => (
                      <option key={u} value={u}>
                        {u} {u === 1 ? 'Unit' : 'Units'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Urgency Level
                  </label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-[#B80024] focus:outline-none font-medium"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="emergency">Critical Emergency</option>
                    <option value="normal">Normal / Scheduled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Additional Note to Donor
                </label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="e.g. Surgery scheduled for tomorrow morning. Donor transportation can be arranged if needed."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-[#B80024] focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-[#B80024] hover:bg-[#98001E] rounded-xl shadow-md transition disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
