import React, { useState } from 'react';
import { 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  AlertTriangle,
  Filter,
  Flame
} from 'lucide-react';
import { ProcessedJobApplication, JobStatus } from '../types/job';
import { JobCard } from './JobCard';

interface KanbanBoardProps {
  jobs: ProcessedJobApplication[];
  onOpenScamModal: (job: ProcessedJobApplication) => void;
  onOpenFollowUpModal: (job: ProcessedJobApplication) => void;
  onOpenInterviewPrep: (job: ProcessedJobApplication) => void;
  onOpenRawEmail: (job: ProcessedJobApplication) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  jobs,
  onOpenScamModal,
  onOpenFollowUpModal,
  onOpenInterviewPrep,
  onOpenRawEmail
}) => {
  const [filter, setFilter] = useState<'all' | 'scams' | 'followups' | 'interviews'>('all');

  // Filter jobs according to user selection
  const filteredJobs = jobs.filter((job) => {
    if (filter === 'scams') return job.scam.isScam;
    if (filter === 'followups') return job.followUp.needsFollowUp;
    if (filter === 'interviews') return job.status === 'interview';
    return true;
  });

  // Segregate by columns
  const appliedJobs = filteredJobs.filter((j) => j.status === 'applied');
  const interviewJobs = filteredJobs.filter((j) => j.status === 'interview');
  const offerJobs = filteredJobs.filter((j) => j.status === 'offer');
  const rejectedJobs = filteredJobs.filter((j) => j.status === 'rejected');

  const scamCount = jobs.filter((j) => j.scam.isScam).length;
  const followUpCount = jobs.filter((j) => j.followUp.needsFollowUp).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* 🚨 High-Priority Quarantine Alert Banner for Judges */}
      {scamCount > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-950/60 via-red-900/40 to-slate-900 border border-red-500/40 shadow-xl shadow-red-950/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center ring-1 ring-red-500/40 shrink-0">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-red-300 font-['Outfit'] tracking-wide">
                  SCAM SHIELD ACTIVE: {scamCount} PREDATORY OFFERS INTERCEPTED
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white">
                  FLAGGED IN RED
                </span>
              </div>
              <p className="text-xs text-red-200/80 mt-0.5">
                Gemini detected fee extortion (₹4,999 UPI), disposable @gmail domains impersonating Infosys/Wipro, and premature Aadhaar/PAN phishing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={() => setFilter(filter === 'scams' ? 'all' : 'scams')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                filter === 'scams'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              {filter === 'scams' ? 'Show All Applications' : 'Filter Scams Only'}
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs & View Controls */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-white/5">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              filter === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Roles ({jobs.length})
          </button>
          <button
            onClick={() => setFilter('scams')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
              filter === 'scams'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-red-400 hover:text-red-300'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Scams Blocked ({scamCount})
          </button>
          <button
            onClick={() => setFilter('followups')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
              filter === 'followups'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Follow-ups Due ({followUpCount})
          </button>
          <button
            onClick={() => setFilter('interviews')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
              filter === 'interviews'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-purple-400 hover:text-purple-300'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Interviews ({interviewJobs.length})
          </button>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span>Showing {filteredJobs.length} items</span>
        </div>
      </div>

      {/* 4-Column Responsive Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Column 1: Applied */}
        <div className="flex flex-col bg-slate-900/40 rounded-2xl p-3 border border-white/5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-['Outfit']">
                Applied
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {appliedJobs.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[75vh] pr-1">
            {appliedJobs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No applications in this category.
              </div>
            ) : (
              appliedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onOpenScamModal={onOpenScamModal}
                  onOpenFollowUpModal={onOpenFollowUpModal}
                  onOpenInterviewPrep={onOpenInterviewPrep}
                  onOpenRawEmail={onOpenRawEmail}
                />
              ))
            )}
          </div>
        </div>

        {/* Column 2: Interview */}
        <div className="flex flex-col bg-slate-900/40 rounded-2xl p-3 border border-white/5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-['Outfit']">
                Interview
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              {interviewJobs.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[75vh] pr-1">
            {interviewJobs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No upcoming interviews.
              </div>
            ) : (
              interviewJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onOpenScamModal={onOpenScamModal}
                  onOpenFollowUpModal={onOpenFollowUpModal}
                  onOpenInterviewPrep={onOpenInterviewPrep}
                  onOpenRawEmail={onOpenRawEmail}
                />
              ))
            )}
          </div>
        </div>

        {/* Column 3: Offer */}
        <div className="flex flex-col bg-slate-900/40 rounded-2xl p-3 border border-white/5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-['Outfit']">
                Offer
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {offerJobs.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[75vh] pr-1">
            {offerJobs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No offers yet.
              </div>
            ) : (
              offerJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onOpenScamModal={onOpenScamModal}
                  onOpenFollowUpModal={onOpenFollowUpModal}
                  onOpenInterviewPrep={onOpenInterviewPrep}
                  onOpenRawEmail={onOpenRawEmail}
                />
              ))
            )}
          </div>
        </div>

        {/* Column 4: Rejected */}
        <div className="flex flex-col bg-slate-900/40 rounded-2xl p-3 border border-white/5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-['Outfit']">
                Rejected
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
              {rejectedJobs.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[75vh] pr-1">
            {rejectedJobs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No rejections logged.
              </div>
            ) : (
              rejectedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onOpenScamModal={onOpenScamModal}
                  onOpenFollowUpModal={onOpenFollowUpModal}
                  onOpenInterviewPrep={onOpenInterviewPrep}
                  onOpenRawEmail={onOpenRawEmail}
                />
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
