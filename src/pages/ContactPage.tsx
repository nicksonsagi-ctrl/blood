import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Building, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { validateSriLankanPhone } from '../data/sriLankaData';

export const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.email || !formData.message) {
      setError('Please fill full name, email, and message.');
      return;
    }

    if (formData.phone && !validateSriLankanPhone(formData.phone)) {
      setError('Please provide a valid Sri Lankan phone number (+94 7X or 07X).');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to submit message');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Contact LifeLink Coordination
        </h1>
        <p className="text-sm sm:text-base text-slate-500 font-medium">
          Get in touch with our Sri Lankan blood donation coordinators and regional volunteer teams.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Side: Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-rose-100">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Message Received!</h2>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                Thank you for contacting LifeLink. Your inquiry has been routed to our admin coordination team. We will review and respond promptly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ fullName: '', email: '', phone: '', subject: '', message: '' });
                }}
                className="mt-4 px-6 py-2.5 bg-[#B80024] text-white text-xs font-bold rounded-xl"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Sivanathan P."
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-2xl focus:border-[#B80024] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.lk"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-2xl focus:border-[#B80024] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Phone (+94)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+94 77 123 4567"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-2xl focus:border-[#B80024] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Inquiring about donation camp"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-2xl focus:border-[#B80024] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist you with blood donation coordination in Sri Lanka?"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-2xl focus:border-[#B80024] focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#B80024] hover:bg-[#98001E] text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-rose-900/20 transition flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Side: Hospital Contacts */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-rose-100 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">
              Verified Blood Bank Hotlines
            </h3>
            <p className="text-xs text-slate-500">
              Direct contacts for government hospital transfusion services:
            </p>

            <div className="space-y-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100">
                <p className="text-xs font-bold text-slate-900">Teaching Hospital Jaffna Blood Bank</p>
                <p className="text-sm font-black text-[#B80024] mt-0.5">+94 21 222 2261</p>
                <p className="text-[11px] text-slate-500">Hospital Road, Jaffna</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100">
                <p className="text-xs font-bold text-slate-900">Base Hospital Tellippalai Blood Unit</p>
                <p className="text-sm font-black text-[#B80024] mt-0.5">+94 21 224 0222</p>
                <p className="text-[11px] text-slate-500">Tellippalai, Jaffna</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100">
                <p className="text-xs font-bold text-slate-900">National Blood Transfusion Service (NHSL)</p>
                <p className="text-sm font-black text-[#B80024] mt-0.5">+94 11 269 1111</p>
                <p className="text-[11px] text-slate-500">Narahenpita / Regent Street, Colombo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
