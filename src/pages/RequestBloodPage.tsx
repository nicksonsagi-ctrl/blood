import React, { useState } from 'react';
import {
  Heart,
  Droplet,
  Send,
  AlertCircle,
  CheckCircle2,
  Phone,
  ShieldAlert,
  MapPin,
  LocateFixed,
  Clock,
  Building,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { BloodGroup, UrgencyLevel } from '../types';
import { VERIFIED_HOSPITALS, validateSriLankanPhone } from '../data/sriLankaData';

interface RequestBloodPageProps {
  setCurrentTab: (tab: string) => void;
}

export const RequestBloodPage: React.FC<RequestBloodPageProps> = ({ setCurrentTab }) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    hospitalName: 'Teaching Hospital Jaffna',
    requesterPhone: user?.phone || '',
    requesterName: user?.fullName || '',
    bloodGroup: 'O+' as BloodGroup,
    unitsNeeded: '2',
    requiredDate: new Date().toISOString().split('T')[0],
    urgency: 'urgent' as UrgencyLevel,
    address: 'Hospital Road, Jaffna, Sri Lanka',
    district: 'Jaffna',
    additionalNotes: '',
  });

  const [loading, setLoading] = useState(false);
  const [successResult, setSuccessResult] = useState<any | null>(null);
  const [error, setError] = useState('');
  const [locating, setLocating] = useState(false);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setFormData((prev) => ({
          ...prev,
          address: `Jaffna Town / Vicinity (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`,
        }));
      },
      () => {
        setLocating(false);
        setFormData((prev) => ({
          ...prev,
          address: 'Jaffna Town, Northern Province, Sri Lanka',
        }));
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.patientName.trim()) {
      setError('Please provide patient name or identifier.');
      return;
    }

    if (!formData.requesterPhone.trim() || !validateSriLankanPhone(formData.requesterPhone)) {
      setError('Please provide a valid Sri Lankan contact phone number (+94 7X or 07X).');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterId: user?.id || 'anonymous-requester',
          requesterName: formData.requesterName || formData.patientName + ' Family',
          requesterPhone: formData.requesterPhone,
          patientName: formData.patientName,
          patientAge: Number(formData.patientAge) || 30,
          bloodGroup: formData.bloodGroup,
          unitsNeeded: Number(formData.unitsNeeded) || 1,
          hospitalName: formData.hospitalName,
          province: 'Northern',
          district: formData.district,
          hospitalLocation: formData.address,
          requiredDate: formData.requiredDate,
          urgency: formData.urgency,
          additionalNotes: formData.additionalNotes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit blood request');
      }

      const data = await res.json();
      setSuccessResult(data.bloodRequest);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while submitting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t.requestPageTitle}
        </h1>
        <p className="text-sm sm:text-base text-slate-500 font-medium">
          {t.requestPageSubtitle}
        </p>
      </div>

      {successResult ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-rose-100 max-w-2xl mx-auto text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Emergency Request Dispatched!
            </h2>
            <p className="text-sm text-slate-600">
              Request ID:{' '}
              <strong className="text-[#B80024] font-mono text-base">
                {successResult.id}
              </strong>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 text-left text-xs sm:text-sm text-slate-700 space-y-2">
            <div className="flex justify-between py-1 border-b border-rose-100">
              <span className="font-semibold text-slate-500">Patient:</span>
              <span className="font-bold">{successResult.patientName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-rose-100">
              <span className="font-semibold text-slate-500">Requirement:</span>
              <span className="font-bold text-[#B80024]">
                {successResult.unitsNeeded} Units of {successResult.bloodGroup}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-rose-100">
              <span className="font-semibold text-slate-500">Hospital:</span>
              <span className="font-bold">{successResult.hospitalName}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="font-semibold text-slate-500">Status:</span>
              <span className="font-bold text-emerald-600 uppercase tracking-wide">
                Active & Dispatched to Donors
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentTab('requester-dashboard')}
              className="w-full sm:w-auto px-6 py-3 bg-[#B80024] text-white text-sm font-bold rounded-2xl shadow-md hover:bg-[#98001E] transition"
            >
              Track on Requester Dashboard
            </button>
            <button
              onClick={() => {
                setSuccessResult(null);
                setFormData((prev) => ({ ...prev, patientName: '', additionalNotes: '' }));
              }}
              className="w-full sm:w-auto px-6 py-3 bg-rose-50 text-[#B80024] text-sm font-bold rounded-2xl border border-rose-200 hover:bg-rose-100 transition"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form matching reference image */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-rose-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* 1. Patient Details */}
              <div className="space-y-3">
                <h3 className="text-base font-extrabold text-slate-900 border-b border-rose-100 pb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#B80024]"></span>
                  {t.patientDetailsSection}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t.patientName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      placeholder="Enter patient name"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-2xl focus:border-[#B80024] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t.patientAge} *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={formData.patientAge}
                      onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                      placeholder="Enter age"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-2xl focus:border-[#B80024] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t.hospitalName} *
                    </label>
                    <input
                      type="text"
                      required
                      list="hospitals-list"
                      value={formData.hospitalName}
                      onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                      placeholder="Enter hospital name"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-2xl focus:border-[#B80024] focus:outline-none"
                    />
                    <datalist id="hospitals-list">
                      {VERIFIED_HOSPITALS.map((h) => (
                        <option key={h.id} value={h.name} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t.contactNumber} (+94) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.requesterPhone}
                      onChange={(e) => setFormData({ ...formData, requesterPhone: e.target.value })}
                      placeholder="Enter contact number"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-2xl focus:border-[#B80024] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Blood Requirement */}
              <div className="space-y-3 pt-2">
                <h3 className="text-base font-extrabold text-slate-900 border-b border-rose-100 pb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#B80024]"></span>
                  {t.bloodRequirementSection}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Blood Group *
                    </label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })}
                      className="w-full px-3.5 py-2.5 text-sm font-bold text-[#B80024] border border-slate-200 rounded-2xl focus:border-[#B80024] focus:outline-none"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t.unitsNeeded} *
                    </label>
                    <select
                      value={formData.unitsNeeded}
                      onChange={(e) => setFormData({ ...formData, unitsNeeded: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm font-semibold border border-slate-200 rounded-2xl focus:border-[#B80024] focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6].map((u) => (
                        <option key={u} value={u}>
                          {u} {u === 1 ? 'Unit' : 'Units'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t.requiredDate} *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.requiredDate}
                      onChange={(e) => setFormData({ ...formData, requiredDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-2xl focus:border-[#B80024] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t.urgencyLevel}
                    </label>
                    <select
                      value={formData.urgency}
                      onChange={(e) => setFormData({ ...formData, urgency: e.target.value as UrgencyLevel })}
                      className="w-full px-3.5 py-2.5 text-sm font-bold border border-slate-200 rounded-2xl focus:border-[#B80024] focus:outline-none"
                    >
                      <option value="urgent">Urgent (Within 24 Hours)</option>
                      <option value="emergency">Critical Emergency (Immediate Surgery)</option>
                      <option value="normal">Normal / Scheduled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      District
                    </label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm font-semibold border border-slate-200 rounded-2xl focus:border-[#B80024] focus:outline-none"
                    >
                      <option value="Jaffna">Jaffna</option>
                      <option value="Kilinochchi">Kilinochchi</option>
                      <option value="Mannar">Mannar</option>
                      <option value="Vavuniya">Vavuniya</option>
                      <option value="Colombo">Colombo</option>
                      <option value="Kandy">Kandy</option>
                      <option value="Galle">Galle</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. Location */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-rose-100 pb-2">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#B80024]"></span>
                    {t.locationSection}
                  </h3>
                  <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    disabled={locating}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#B80024] hover:text-[#98001E] bg-rose-50 px-2.5 py-1 rounded-xl transition"
                  >
                    <LocateFixed className="w-3.5 h-3.5" />
                    <span>{locating ? 'Locating...' : t.btnGetCurrentLocation}</span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.locationAddress} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter full address"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-2xl focus:border-[#B80024] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Clinical Notes / Ward Information (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                    placeholder="e.g. Surgery scheduled in Surgical Ward 3. Blood bank requisition slip available."
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-2xl focus:border-[#B80024] focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Submit Button matching reference image */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 text-sm font-extrabold text-white bg-[#B80024] hover:bg-[#98001E] rounded-2xl shadow-xl shadow-rose-900/25 transition disabled:opacity-50 hover:scale-[1.01]"
                >
                  {loading ? 'Submitting & Dispatching...' : t.btnSubmitRequest}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Sidebar matching reference image */}
          <div className="lg:col-span-4 space-y-6">
            {/* Important Information Card */}
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-rose-100 space-y-4">
              <div className="flex items-center gap-2 text-[#B80024]">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <h3 className="font-extrabold text-base text-slate-900">
                  {t.importantInfoTitle}
                </h3>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#B80024] font-bold text-sm leading-none">•</span>
                  <span>{t.importantPoint1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#B80024] font-bold text-sm leading-none">•</span>
                  <span>{t.importantPoint2}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#B80024] font-bold text-sm leading-none">•</span>
                  <span>{t.importantPoint3}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#B80024] font-bold text-sm leading-none">•</span>
                  <span>{t.importantPoint4}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#B80024] font-bold text-sm leading-none">•</span>
                  <span>{t.importantPoint5}</span>
                </li>
              </ul>
            </div>

            {/* Emergency Contact Card matching reference image */}
            <div className="bg-rose-50/80 p-6 rounded-3xl border border-rose-200/80 shadow-md space-y-4">
              <div className="flex items-center gap-2 text-[#B80024]">
                <Phone className="w-5 h-5" />
                <h3 className="font-extrabold text-base text-slate-900">
                  {t.emergencyContactsTitle}
                </h3>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-white rounded-2xl border border-rose-100 shadow-xs">
                  <p className="text-xs text-slate-500 font-bold">Base Hospital Tellippalai</p>
                  <p className="text-sm font-black text-[#B80024] mt-0.5">+94 21 224 0222</p>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-rose-100 shadow-xs">
                  <p className="text-xs text-slate-500 font-bold">Teaching Hospital Jaffna</p>
                  <p className="text-sm font-black text-[#B80024] mt-0.5">+94 21 222 2222</p>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-rose-100 shadow-xs">
                  <p className="text-xs text-slate-500 font-bold">Emergency Ambulance Suwa Seriya</p>
                  <p className="text-sm font-black text-emerald-700 mt-0.5">1990 (Toll Free)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
