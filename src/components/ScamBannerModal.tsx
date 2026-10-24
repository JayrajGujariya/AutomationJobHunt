import React from 'react';
import { 
  ShieldAlert, 
  X, 
  AlertOctagon, 
  Copy, 
  Check, 
  ExternalLink,
  Lock,
  UserX
} from 'lucide-react';
import { ProcessedJobApplication } from '../types/job';

interface ScamBannerModalProps {
  job: ProcessedJobApplication | null;
  onClose: () => void;
}

export const ScamBannerModal: React.FC<ScamBannerModalProps> = ({ job, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!job) return null;

  const handleCopyReport = () => {
    const report = `🚨 SCAM INVESTIGATION REPORT - JOB HUNT AUTOPILOT
Company: ${job.company}
Sender: ${job.senderEmail}
Subject: ${job.originalSubject}
Date: ${job.receivedDate}

FORENSIC RED FLAGS DETECTED:
${job.scam.reasons.map((r, i) => `${i + 1}. ${r}`).join('\n')}

ADVISORY: Never pay registration fees or transmit Aadhaar/PAN cards prior to an in-person or official corporate technical interview.`;

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0e1424] border-2 border-red-500/60 rounded-3xl max-w-2xl w-full p-6 shadow-2xl shadow-red-950/60 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-red-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center shadow-lg shadow-red-900/40">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-600 text-white tracking-wide">
                  CRITICAL FRAUD ALERT
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Confidence: {Math.round(job.scam.confidence * 100)}%
                </span>
              </div>
              <h2 className="text-lg font-bold text-white font-['Outfit'] mt-1">
                Predatory Offer Blocked: {job.company}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sender Inspection Card */}
        <div className="my-4 p-3.5 rounded-2xl bg-red-950/30 border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div>
            <div className="text-slate-400 font-mono text-[11px]">SENDER ADDRESS</div>
            <div className="font-bold text-red-300 font-mono text-sm">{job.senderEmail}</div>
          </div>
          <div className="sm:text-right">
            <div className="text-slate-400 font-mono text-[11px]">TARGET ROLE</div>
            <div className="font-semibold text-slate-200">{job.role}</div>
          </div>
        </div>

        {/* The Exact Forensic Reasons Flagged in Red */}
        <div className="mb-5">
          <h3 className="text-xs font-bold text-red-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4 text-red-400" />
            Why Gemini Flagged This in Red
          </h3>

          <div className="space-y-2">
            {job.scam.reasons.map((reason, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-xl bg-slate-900/80 border border-red-500/30 text-xs text-slate-200 flex items-start gap-2.5"
              >
                <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="leading-relaxed">
                  {reason}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preventive Actions for Job Seekers */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/5 mb-6 text-xs text-slate-300">
          <div className="font-bold text-white mb-2 flex items-center gap-1.5 font-['Outfit']">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            Automated Protection Guardrails
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li><strong>Zero Payment Policy:</strong> Legitimate enterprises (Infosys, TCS, Wipro) NEVER charge onboarding fees, courier charges, or training deposits.</li>
            <li><strong>Identity Security:</strong> Never email scans of Aadhaar, PAN card, or bank cheques before an offer has been verified on the official company career portal.</li>
            <li><strong>Official Channel:</strong> Direct offers without any video or technical round are 100% fraudulent.</li>
          </ul>
        </div>

        {/* Modal Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition"
          >
            <span>National Cyber Crime Reporting Portal (India)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyReport}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              {copied ? 'Report Copied!' : 'Copy Forensic Report'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition cursor-pointer"
            >
              Dismiss Alert
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
