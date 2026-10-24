import React, { useState } from 'react';
import { 
  ShieldAlert, 
  X, 
  AlertOctagon, 
  Copy, 
  Check, 
  ExternalLink,
  Lock,
  FileCheck2,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { ProcessedJobApplication } from '../types/job';

interface ScamBannerModalProps {
  job: ProcessedJobApplication | null;
  onClose: () => void;
}

export const ScamBannerModal: React.FC<ScamBannerModalProps> = ({ job, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [firCopied, setFirCopied] = useState(false);
  const [showFir, setShowFir] = useState(false);

  if (!job) return null;

  // Extract detected indicators
  const text = `${job.originalSubject} ${job.originalBody}`.toLowerCase();
  const hasFee = text.includes('fee') || text.includes('pay') || text.includes('deposit') || text.includes('₹') || text.includes('rs');
  const hasDoc = text.includes('aadhaar') || text.includes('pan') || text.includes('cheque');
  const isFreemail = job.senderEmail.includes('@gmail.com') || job.senderEmail.includes('@yahoo.com') || job.senderEmail.includes('@consultant.com');
  const hasPressure = text.includes('urgent') || text.includes('hours') || text.includes('immediately') || text.includes('blacklisting');

  // Extract potential UPI handle or Telegram link
  const upiMatch = job.originalBody.match(/[a-zA-Z0-9.\-_]+@[a-zA-Z]+/g);
  const telegramMatch = job.originalBody.match(/https?:\/\/t\.me\/[a-zA-Z0-9_\-]+/g);

  const handleCopyReport = () => {
    const report = `🚨 SCAM FORENSIC REPORT - JOB HUNT AUTOPILOT
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

  const firText = `To: National Cyber Crime Reporting Portal (cybercrime.gov.in) / Cyber Cell
Subject: Complaint against Fake Job Employment Syndicate & Extortion Phishing

Respected Officer,
I am lodging an official complaint regarding an active employment scam syndicate attempting to defraud job seekers post-layoff.

INCIDENT DETAILS:
1. Suspected Entity / Impersonator: "${job.company}"
2. Scammer Email ID: ${job.senderEmail}
3. Date of Incident: ${job.receivedDate}
4. Fraudulent Demands: ${job.scam.reasons.join('; ')}
${upiMatch ? `5. Suspected Scammer UPI ID / Payment Link: ${upiMatch[0]}` : ''}
${telegramMatch ? `5. Suspected Phishing Channel: ${telegramMatch[0]}` : ''}

EVIDENCE & EMAIL HEADER EXCERPT:
Subject: ${job.originalSubject}
Body:
"""
${job.originalBody}
"""

RELEVANT LEGAL VIOLATIONS:
- Section 66D, Information Technology Act (Cheating by personation by using computer resource)
- Section 419 & 420, Indian Penal Code (Cheating and dishonestly inducing delivery of property)

I request immediate blacklisting of the sender domain and associated payment accounts to safeguard fellow citizens.`;

  const handleCopyFir = () => {
    navigator.clipboard.writeText(firText);
    setFirCopied(true);
    setTimeout(() => setFirCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0e1424] border-2 border-red-500/60 rounded-3xl max-w-2xl w-full max-h-[90vh] p-6 overflow-y-auto shadow-2xl shadow-red-950/60 animate-in fade-in zoom-in-95 duration-200">
        
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

        {/* 🌟 UNIQUE FEATURE: Visual Forensic Threat Radar Matrix */}
        <div className="mb-5 p-4 rounded-2xl bg-slate-900/90 border border-red-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-bold text-red-300 uppercase tracking-wider flex items-center gap-1.5 font-['Outfit']">
              <Activity className="w-4 h-4 text-red-400" />
              Scam DNA Forensic Threat Radar
            </div>
            <span className="text-[10px] text-slate-400 font-mono">4 Vectors Evaluated</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5">
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Domain Authenticity</span>
                <span className={`font-bold ${isFreemail ? 'text-red-400' : 'text-emerald-400'}`}>
                  {isFreemail ? 'CRITICAL (Free-mail)' : 'VERIFIED'}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${isFreemail ? 'bg-red-500 w-[95%]' : 'bg-emerald-400 w-[20%]'}`} />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5">
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Financial Extortion</span>
                <span className={`font-bold ${hasFee ? 'text-red-400' : 'text-slate-400'}`}>
                  {hasFee ? 'CRITICAL (Fee Trap)' : 'NONE'}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${hasFee ? 'bg-red-500 w-[100%]' : 'bg-slate-700 w-[10%]'}`} />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5">
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Identity / PII Phishing</span>
                <span className={`font-bold ${hasDoc ? 'text-red-400' : 'text-slate-400'}`}>
                  {hasDoc ? 'CRITICAL (Aadhaar/PAN)' : 'NONE'}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${hasDoc ? 'bg-red-500 w-[90%]' : 'bg-slate-700 w-[10%]'}`} />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5">
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Coercive Urgency</span>
                <span className={`font-bold ${hasPressure ? 'text-amber-400' : 'text-slate-400'}`}>
                  {hasPressure ? 'HIGH (Threats)' : 'NORMAL'}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${hasPressure ? 'bg-amber-500 w-[85%]' : 'bg-slate-700 w-[15%]'}`} />
              </div>
            </div>
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

        {/* 🌟 UNIQUE FEATURE: 1-Click Cyber Crime Complaint / FIR Drawer */}
        <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-red-950/40 to-slate-900 border border-red-500/40 text-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold text-white flex items-center gap-1.5 font-['Outfit']">
              <FileCheck2 className="w-4 h-4 text-red-400" />
              1-Click Cybercrime Police Complaint (cybercrime.gov.in)
            </div>
            <button
              onClick={() => setShowFir(!showFir)}
              className="text-[11px] font-semibold text-red-400 hover:text-red-300 underline cursor-pointer"
            >
              {showFir ? 'Hide Complaint' : 'Preview Formal Complaint'}
            </button>
          </div>

          <p className="text-[11px] text-slate-400 mb-3">
            Pre-formats a formal legal complaint under Section 66D IT Act & Section 420 IPC, ready to file online.
          </p>

          {showFir && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-white/10 font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto mb-3">
              {firText}
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyFir}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              {firCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {firCopied ? 'Legal Complaint Copied!' : 'Copy Formal Police Complaint'}
            </button>

            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 flex items-center gap-1 transition"
            >
              <span>Open Portal</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
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
          <button
            onClick={handleCopyReport}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            {copied ? 'Report Copied' : 'Copy Forensic Summary'}
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition cursor-pointer"
          >
            Close Alert
          </button>
        </div>

      </div>
    </div>
  );
};
