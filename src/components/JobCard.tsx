import React from 'react';
import { 
  ShieldAlert, 
  Clock, 
  Calendar, 
  FileText, 
  Sparkles, 
  AlertTriangle,
  Mail,
  ChevronRight
} from 'lucide-react';
import { ProcessedJobApplication } from '../types/job';

interface JobCardProps {
  job: ProcessedJobApplication;
  onOpenScamModal: (job: ProcessedJobApplication) => void;
  onOpenFollowUpModal: (job: ProcessedJobApplication) => void;
  onOpenInterviewPrep: (job: ProcessedJobApplication) => void;
  onOpenRawEmail: (job: ProcessedJobApplication) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onOpenScamModal,
  onOpenFollowUpModal,
  onOpenInterviewPrep,
  onOpenRawEmail
}) => {
  const isScam = job.scam.isScam;
  const isInterview = job.status === 'interview';
  const needsFollowUp = job.followUp.needsFollowUp;

  // Generate a consistent vibrant color avatar monogram
  const initials = job.company
    .replace(/[^a-zA-Z]/g, '')
    .substring(0, 2)
    .toUpperCase() || 'JB';

  return (
    <div 
      className={`glass-card rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 ${
        isScam 
          ? 'border-red-500/50 bg-red-950/20 hover:border-red-500 shadow-lg shadow-red-950/30' 
          : needsFollowUp
          ? 'border-amber-500/40 bg-amber-950/10 hover:border-amber-500/70'
          : isInterview
          ? 'border-purple-500/40 bg-purple-950/10 hover:border-purple-500/70'
          : 'border-white/10 hover:border-white/20'
      }`}
    >
      <div>
        {/* Top Header: Company Avatar & Status Badges */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ring-1 ${
              isScam 
                ? 'bg-red-500/20 text-red-300 ring-red-500/30' 
                : isInterview
                ? 'bg-purple-500/20 text-purple-300 ring-purple-500/30'
                : 'bg-indigo-500/20 text-indigo-300 ring-indigo-500/30'
            }`}>
              {initials}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight line-clamp-1">
                {job.company}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono truncate max-w-[140px]">
                {job.senderEmail}
              </p>
            </div>
          </div>

          <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
            {job.receivedDate}
          </span>
        </div>

        {/* Role Title */}
        <div className="mb-3">
          <p className="text-xs font-semibold text-slate-200 line-clamp-1">
            {job.role}
          </p>
        </div>

        {/* 🚨 RED FLAG SCAM BANNER */}
        {isScam && (
          <div className="mb-3 p-2.5 rounded-xl bg-red-900/30 border border-red-500/40 text-red-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 mb-1">
              <ShieldAlert className="w-3.5 h-3.5 animate-bounce" />
              <span>SCAM OFFER FLAGGED (RED ALERT)</span>
            </div>
            <p className="text-[11px] text-red-200/90 line-clamp-2 leading-relaxed">
              {job.scam.reasons[0] || 'High risk indicators detected by Gemini.'}
            </p>
            <button
              onClick={() => onOpenScamModal(job)}
              className="mt-2 w-full py-1.5 px-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-[11px] flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <ShieldAlert className="w-3 h-3" />
              View Forensic Breakdown ({job.scam.reasons.length} Flags)
            </button>
          </div>
        )}

        {/* ⚠️ 7-DAY FOLLOW-UP REMINDER BANNER */}
        {needsFollowUp && !isScam && (
          <div className="mb-3 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>No reply for {job.followUp.daysSinceApplied} days (&gt;7d rule)</span>
            </div>
            <button
              onClick={() => onOpenFollowUpModal(job)}
              className="mt-1.5 w-full py-1 px-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-medium text-[11px] flex items-center justify-center gap-1 transition cursor-pointer"
            >
              <Mail className="w-3 h-3" />
              1-Click Follow-Up Email Ready
            </button>
          </div>
        )}

        {/* 🎯 INTERVIEW NOTICE BANNER */}
        {isInterview && (
          <div className="mb-3 p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-300 mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Interview Round Scheduled</span>
            </div>
            <button
              onClick={() => onOpenInterviewPrep(job)}
              className="mt-1.5 w-full py-1 px-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-[11px] flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              Open Gemini Interview Prep Cheat Sheet
            </button>
          </div>
        )}
      </div>

      {/* Card Footer: Quick Actions */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
        <button
          onClick={() => onOpenRawEmail(job)}
          className="hover:text-slate-200 flex items-center gap-1 transition cursor-pointer"
        >
          <FileText className="w-3 h-3 text-slate-500" />
          <span>Raw Email</span>
        </button>

        <span className="capitalize px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-300">
          {job.status}
        </span>
      </div>
    </div>
  );
};
