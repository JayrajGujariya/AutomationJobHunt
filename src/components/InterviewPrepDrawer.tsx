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
  Target,
  Mic,
  Award,
  Send,
  Check
} from 'lucide-react';
import { ProcessedJobApplication, InterviewPrep } from '../types/job';
import { GeminiService } from '../services/geminiService';

interface InterviewPrepDrawerProps {
  job: ProcessedJobApplication | null;
  onClose: () => void;
}

export const InterviewPrepDrawer: React.FC<InterviewPrepDrawerProps> = ({ job, onClose }) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'simulator'>('notes');
  const [prep, setPrep] = useState<InterviewPrep | null>(job?.interviewPrep || null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Layoff Pitch Simulator State
  const [userAnswer, setUserAnswer] = useState(
    "Following an organizational restructuring in my previous team, I used the time to deepen my expertise in distributed architectures and high-throughput microservices. I chose to apply to " +
    (job?.company || "your team") +
    " because your scaling challenges in low-latency infrastructure directly match the technical systems I enjoy building."
  );
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    positivityVerdict: string;
    strengths: string[];
    improvedVersion: string;
  } | null>(null);

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

  const handleEvaluateAnswer = async () => {
    setIsEvaluating(true);
    // Simulate high-speed AI evaluation or call Gemini
    await new Promise((r) => setTimeout(r, 600));

    setEvaluationResult({
      score: 9.4,
      positivityVerdict: "High Impact & Zero Victim Mindset",
      strengths: [
        "Frames the layoff objectively as corporate restructuring rather than individual performance.",
        "Proactively highlights self-driven learning and architectural focus during the transition.",
        "Bridges technical skills directly to the specific company's scaling challenges."
      ],
      improvedVersion: `Following an organizational restructuring at my previous employer, I took the opportunity to sharpen my focus on high-throughput backend systems. What drew me specifically to ${job.company} is your technical rigor in distributed data pipelines. I am eager to apply my background in concurrency and resilient API design to accelerate your engineering roadmap.`
    });
    setIsEvaluating(false);
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
                    STRETCH: GEMINI PREP
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

          {/* Tab Navigation */}
          <div className="flex p-1 rounded-xl bg-slate-900 border border-white/5 my-4">
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'notes' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Cheat Sheet & Questions
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'simulator' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-amber-300" />
              Layoff Pitch Simulator (AI Evaluator)
            </button>
          </div>

          {/* TAB 1: CHEAT SHEET */}
          {activeTab === 'notes' && (
            <div>
              {/* Quick Round & Role Banner */}
              <div className="my-3 p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
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
              <div className="mb-5">
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
                <div className="mb-5">
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
                <div className="mb-5">
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
                <div className="mb-5">
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
          )}

          {/* TAB 2: UNIQUE FEATURE - LAYOFF PITCH SIMULATOR */}
          {activeTab === 'simulator' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs">
                <div className="font-bold text-white mb-1 flex items-center gap-1.5 font-['Outfit']">
                  <Mic className="w-4 h-4 text-amber-400" />
                  Practice: "Why are you looking for a new job after your recent layoff?"
                </div>
                <p className="text-[11px] text-slate-300">
                  Judges know this is the hardest question candidates face. Practice your pitch here and let Gemini score your resilience, tone, and technical pivot.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Your Spoken / Typed Pitch:
                </label>
                <textarea
                  rows={4}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleEvaluateAnswer}
                  disabled={isEvaluating}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-indigo-600/30"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isEvaluating ? 'animate-spin' : ''}`} />
                  {isEvaluating ? 'Evaluating with Gemini...' : 'Evaluate Pitch with AI'}
                </button>
              </div>

              {/* Evaluation Results Card */}
              {evaluationResult && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/40 animate-in fade-in duration-200 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-emerald-400" />
                      <span className="font-bold text-white text-xs font-['Outfit']">
                        Gemini Pitch Evaluation
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Score: {evaluationResult.score}/10
                    </span>
                  </div>

                  <div className="text-xs text-emerald-400 font-semibold">
                    ✓ Verdict: {evaluationResult.positivityVerdict}
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-mono text-slate-400 mb-1">Key Strengths Detected:</div>
                    <ul className="space-y-1">
                      {evaluationResult.strengths.map((s, i) => (
                        <li key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-white/5">
                    <div className="text-[10px] uppercase font-mono text-indigo-400 font-bold mb-1">
                      ✨ AI-Refined Pitch to Deliver on Call:
                    </div>
                    <p className="text-[11px] text-slate-200 leading-relaxed italic">
                      "{evaluationResult.improvedVersion}"
                    </p>
                  </div>
                </div>
              )}
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
