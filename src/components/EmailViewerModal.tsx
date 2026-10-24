import React from 'react';
import { Mail, X, Copy, Check, Calendar, User, Tag } from 'lucide-react';
import { ProcessedJobApplication } from '../types/job';

interface EmailViewerModalProps {
  job: ProcessedJobApplication | null;
  onClose: () => void;
}

export const EmailViewerModal: React.FC<EmailViewerModalProps> = ({ job, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!job) return null;

  const handleCopy = () => {
    const content = `From: ${job.senderEmail}\nDate: ${job.receivedDate}\nSubject: ${job.originalSubject}\n\n${job.originalBody}`;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0e1424] border border-white/10 rounded-3xl max-w-2xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 text-slate-300 flex items-center justify-center">
              <Mail className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-slate-800 text-slate-300">
                  Email #{job.id}
                </span>
                <span className="text-xs text-slate-400">
                  Raw Ingested Message
                </span>
              </div>
              <h2 className="text-base font-bold text-white font-['Outfit'] mt-0.5 line-clamp-1">
                {job.originalSubject}
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

        {/* Metadata info */}
        <div className="my-4 p-3.5 rounded-2xl bg-slate-900 border border-white/5 space-y-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500">From:</span>
            <span className="font-semibold text-white">{job.senderEmail}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500">Date:</span>
            <span className="text-slate-300">{job.receivedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Tag className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500">Classification:</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-sans font-semibold bg-indigo-500/20 text-indigo-300 uppercase">
              {job.status}
            </span>
            {job.scam.isScam && (
              <span className="px-2 py-0.5 rounded text-[11px] font-sans font-semibold bg-red-600 text-white">
                SCAM DETECTED
              </span>
            )}
          </div>
        </div>

        {/* Raw Body */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto">
          {job.originalBody}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 flex items-center gap-1.5 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            {copied ? 'Copied' : 'Copy Email Text'}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
