import React, { useState } from 'react';
import { ShieldCheck, Phone, Mail, X, CheckCircle2, ChevronRight, AlertTriangle, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SecurityAlertBanner: React.FC = () => {
  const { securityAlert, dismissSecurityAlert } = useAuth();
  const [detailsOpen, setDetailsOpen] = useState(false);

  if (!securityAlert) return null;

  return (
    <>
      {/* Toast Notification in bottom-right corner */}
      <div className="fixed bottom-6 right-6 z-50 max-w-md w-full p-4 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-rose-500/40 animate-in slide-in-from-bottom-5 duration-300">
        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B80024] to-rose-700 flex items-center justify-center shrink-0 shadow-md">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <span>Security Alert Dispatched</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </h4>
            </div>
            <p className="text-xs text-rose-200 mt-0.5">
              Phone & Email alerts dispatched to your registered contacts:
            </p>

            <div className="mt-2 space-y-1 bg-black/40 p-2.5 rounded-xl border border-white/10 text-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-mono">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">SMS: {securityAlert.phone}</span>
                <span className="ml-auto text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-800">
                  SENT
                </span>
              </div>
              <div className="flex items-center gap-2 text-rose-200 font-mono">
                <Mail className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="truncate">Email: {securityAlert.email}</span>
                <span className="ml-auto text-[10px] bg-rose-950 text-rose-300 px-1.5 py-0.2 rounded border border-rose-800">
                  DISPATCHED
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => setDetailsOpen(true)}
                className="px-3 py-1.5 text-xs font-bold text-white bg-[#B80024] hover:bg-[#98001E] rounded-lg transition flex items-center gap-1"
              >
                <span>View Dispatched Messages</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={dismissSecurityAlert}
                className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition"
              >
                Dismiss
              </button>
            </div>
          </div>

          <button
            onClick={dismissSecurityAlert}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Modal showing exact SMS & Email content */}
      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-rose-100 flex flex-col max-h-[90vh]">
            <div className="bg-[#B80024] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white text-[#B80024] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Account Security Dispatch</h3>
                  <p className="text-xs text-rose-200">Dispatched at {securityAlert.timeStr} (Asia/Colombo)</p>
                </div>
              </div>
              <button
                onClick={() => setDetailsOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              {/* SMS View */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    Mobile Phone SMS Alert ({securityAlert.phone})
                  </span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full">
                    Dialog / Mobitel / Hutch SIM
                  </span>
                </div>
                <div className="bg-slate-900 text-emerald-300 font-mono text-xs p-3.5 rounded-2xl border border-slate-800 shadow-inner leading-relaxed">
                  {securityAlert.smsText || `[LifeLink Sri Lanka] Security Alert: New login detected for your account at ${securityAlert.timeStr}. If not you, contact 1990.`}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Status: {securityAlert.smsStatus}
                </p>
              </div>

              {/* Email View */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-rose-600" />
                    Email Notification ({securityAlert.email})
                  </span>
                  <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 font-bold px-2 py-0.5 rounded-full">
                    LifeLink Official Mailer
                  </span>
                </div>
                <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200 text-xs text-slate-800 space-y-2">
                  <div className="border-b border-rose-200 pb-2">
                    <p className="font-bold text-[#B80024]">Subject: 🔒 Security Alert: New Login to your LifeLink Account</p>
                    <p className="text-[11px] text-slate-500">From: LifeLink Sri Lanka &lt;noreply@lifelink.lk&gt;</p>
                  </div>
                  <p>
                    Hello, a new sign-in was just recorded for your LifeLink account from Sri Lanka.
                  </p>
                  <div className="bg-white p-2.5 rounded-xl border border-rose-100 text-[11px] space-y-1">
                    <p><strong>Timestamp:</strong> {securityAlert.timeStr} (Asia/Colombo)</p>
                    <p><strong>Registered Email:</strong> {securityAlert.email}</p>
                    <p><strong>Registered Phone:</strong> {securityAlert.phone}</p>
                    <p><strong>Emergency Hotline:</strong> 1990 (Suwa Seriya Ambulance / NBTS)</p>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    If this was you, you can safely disregard this message. If you suspect unauthorized access, call hospital blood coordination support at +94 21 222 2222 immediately.
                  </p>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Status: {securityAlert.emailStatus}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setDetailsOpen(false)}
                className="px-5 py-2 text-xs font-bold text-white bg-[#B80024] hover:bg-[#98001E] rounded-xl transition"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
