import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Calendar, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  RefreshCw,
  Building,
  Target
} from 'lucide-react';
import { ProcessedJobApplication, InterviewPrep } from '../types/job';
import { GeminiService } from '../services/geminiService';

interface InterviewPrepDrawerProps {
  job: ProcessedJobApplication | null;
  onClose: () => void;
}

export const InterviewPrepDrawer: React.FC<InterviewPrepDrawerProps> = ({ job, onClose }) => {
  const [prep, setPrep] = useState<InterviewPrep | null>(job?.interviewPrep || null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  if (!job) return null;

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const updated = await GeminiService.generateInterviewPrep(job);
      setPrep(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end animate-in fade-in duration-200">
      <div className="bg-[#0e1424] border-l border-white/10 w-full max-w-2xl h-full p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Top Header */}
        <div>
          <div className="flex items-start justify-between pb-4 border-b border-white/10 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-900/40">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    STRETCH FEATURE: GEMINI PREP
                  </span>
                  <span className="text-xs text-slate-400">
                    AI Interview Co-Pilot
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white font-['Outfit'] mt-1">
                  Interview Cheat Sheet: {job.company}
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Round & Role Banner */}
          <div className="my-5 p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-slate-400 uppercase font-mono text-[10px] flex items-center gap-1">
                <Target className="w-3 h-3 text-purple-400" />
                Target Role
              </div>
              <div className="font-bold text-white text-sm mt-0.5">{job.role}</div>
            </div>
            <div>
              <div className="text-slate-400 uppercase font-mono text-[10px] flex items-center gap-1">
                <Calendar className="w-3 h-3 text-purple-400" />
                Scheduled Discussion
              </div>
              <div className="font-semibold text-purple-200 mt-0.5">
                {prep?.scheduledDate || 'Upcoming Round'}
              </div>
            </div>
          </div>

          {/* Company Brief */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-['Outfit']">
              <Building className="w-3.5 h-3.5 text-indigo-400" />
              Company Architecture & Mission
            </h3>
            <p className="text-xs text-slate-300 bg-slate-900/80 p-3.5 rounded-xl border border-white/5 leading-relaxed">
              {prep?.companyOverview || `${job.company} is a leading technology organization.`}
            </p>
          </div>

          {/* High-Yield Topics */}
          {prep?.topicsToPrepare && prep.topicsToPrepare.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-['Outfit']">
                <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                Must-Review Architectural Topics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {prep.topicsToPrepare.map((topic, i) => (
                  <div 
                    key={i} 
                    className="p-2.5 rounded-xl bg-slate-900/90 border border-purple-500/20 text-xs text-slate-200 flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span className="font-medium">{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expected Questions & Sample Approaches */}
          {prep?.expectedQuestions && prep.expectedQuestions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-['Outfit']">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                High-Probability Questions & Recommended Approaches
              </h3>
              <div className="space-y-3">
                {prep.expectedQuestions.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 text-xs space-y-1.5"
                  >
                    <div className="font-bold text-white flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{item.question}</span>
                    </div>
                    <div className="pl-6 text-slate-300 leading-relaxed text-[11px] bg-slate-950/60 p-2 rounded-lg border border-white/5">
                      <strong className="text-indigo-400">Winning Strategy: </strong>
                      {item.sampleApproach}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Smart Questions to Ask the Interviewer */}
          {prep?.questionsToAskInterviewer && prep.questionsToAskInterviewer.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-['Outfit']">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                High-Impact Questions to Ask Your Interviewer
              </h3>
              <div className="space-y-2">
                {prep.questionsToAskInterviewer.map((q, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200/90 leading-relaxed italic"
                  >
                    "{q}"
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 flex items-center gap-2 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            {isRegenerating ? 'Analyzing with Gemini...' : 'Regenerate Notes'}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition cursor-pointer"
          >
            Done Reviewing
          </button>
        </div>

      </div>
    </div>
  );
};
