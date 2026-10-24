import React, { useState } from 'react';
import { 
  Clock, 
  X, 
  Copy, 
  Check, 
  Send, 
  Sparkles, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { ProcessedJobApplication } from '../types/job';

interface FollowUpModalProps {
  job: ProcessedJobApplication | null;
  onClose: () => void;
}

export const FollowUpModal: React.FC<FollowUpModalProps> = ({ job, onClose }) => {
  const [tone, setTone] = useState<'polite' | 'direct' | 'concise'>('polite');
  const [copied, setCopied] = useState(false);

  if (!job) return null;

  const days = job.followUp.daysSinceApplied;

  // Tone variations
  const getSubject = () => {
    switch (tone) {
      case 'direct':
        return `Update Request: ${job.role} Application - Jayraj`;
      case 'concise':
        return `Checking in: ${job.role} (${job.company})`;
      default:
        return job.followUp.suggestedSubject || `Following up on ${job.role} application at ${job.company}`;
    }
  };

  const getBody = () => {
    switch (tone) {
      case 'direct':
        return `Hi ${job.company} Talent Team,\n\nI submitted my application for the ${job.role} position ${days} days ago. Given my relevant track record in building high-scale backend services and fast delivery, I am confident I can make an immediate impact on your engineering objectives.\n\nCould you please let me know if there are any next steps in the evaluation process?\n\nThank you,\nJayraj`;
      case 'concise':
        return `Hi ${job.company} Team,\n\nJust checking in on the status of my application for ${job.role} submitted on ${job.receivedDate}. Looking forward to any updates when time permits.\n\nBest,\nJayraj`;
      default:
        return job.followUp.suggestedBody || `Dear ${job.company} Hiring Team,\n\nI hope you are having a wonderful week. I applied for the ${job.role} position ${days} days ago. I remain very enthusiastic about ${job.company}'s mission and wanted to respectfully check in on the review timeline.\n\nWarm regards,\nJayraj`;
    }
  };

  const subject = getSubject();
  const body = getBody();

  const handleCopy = () => {
    const fullEmail = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(fullEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mailtoLink = `mailto:${job.senderEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0e1424] border border-amber-500/40 rounded-3xl max-w-xl w-full p-6 shadow-2xl shadow-amber-950/40 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {days} DAYS SILENT (&gt;7d RULE)
                </span>
                <span className="text-xs text-slate-400">
                  Autopilot Follow-Up Assistant
                </span>
              </div>
              <h2 className="text-lg font-bold text-white font-['Outfit'] mt-1">
                Follow Up: {job.company}
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

        {/* Tone Selector */}
        <div className="my-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Select Email Tone:
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-slate-900 border border-white/5">
            <button
              onClick={() => setTone('polite')}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
                tone === 'polite'
                  ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Polite & Warm
            </button>
            <button
              onClick={() => setTone('direct')}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
                tone === 'direct'
                  ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Direct & Impactful
            </button>
            <button
              onClick={() => setTone('concise')}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
                tone === 'concise'
                  ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Short & Quick
            </button>
          </div>
        </div>

        {/* Draft Preview Box */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3 font-sans">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Recipient</div>
            <div className="text-xs font-mono text-slate-200 mt-0.5">{job.senderEmail}</div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Subject Line</div>
            <div className="text-xs font-semibold text-white mt-0.5">{subject}</div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider mb-1">Message Body</div>
            <div className="p-3 rounded-xl bg-slate-950 border border-white/5 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto font-sans">
              {body}
            </div>
          </div>
        </div>

        {/* Modal CTAs */}
        <div className="flex items-center justify-between gap-3 pt-4 mt-4 border-t border-white/10">
          <span className="text-[11px] text-slate-400">
            Rule: Follow-up after 7 business days increases response rate by 31%
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 flex items-center gap-1.5 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              {copied ? 'Copied to Clipboard!' : 'Copy Email'}
            </button>

            <a
              href={mailtoLink}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition cursor-pointer font-bold"
            >
              <Send className="w-3.5 h-3.5" />
              Open in Email App
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
