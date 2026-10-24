import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { KanbanBoard } from './components/KanbanBoard';
import { ScamBannerModal } from './components/ScamBannerModal';
import { FollowUpModal } from './components/FollowUpModal';
import { InterviewPrepDrawer } from './components/InterviewPrepDrawer';
import { EmailViewerModal } from './components/EmailViewerModal';
import { RawInboxModal } from './components/RawInboxModal';
import { AddEmailModal } from './components/AddEmailModal';
import { AnalyticsModal } from './components/AnalyticsModal';
import { GeminiService } from './services/geminiService';
import { ProcessedJobApplication } from './types/job';
import { Sparkles, Shield, Cpu } from 'lucide-react';

export default function App() {
  const [jobs, setJobs] = useState<ProcessedJobApplication[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<{ current: number; total: number }>({ current: 0, total: 20 });

  // Modals state
  const [activeScamJob, setActiveScamJob] = useState<ProcessedJobApplication | null>(null);
  const [activeFollowUpJob, setActiveFollowUpJob] = useState<ProcessedJobApplication | null>(null);
  const [activeInterviewJob, setActiveInterviewJob] = useState<ProcessedJobApplication | null>(null);
  const [activeRawEmailJob, setActiveRawEmailJob] = useState<ProcessedJobApplication | null>(null);
  const [isRawInboxOpen, setIsRawInboxOpen] = useState<boolean>(false);
  const [isAddEmailOpen, setIsAddEmailOpen] = useState<boolean>(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState<boolean>(false);

  // Ingest workflow
  const handleStartIngest = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setJobs([]);
    setProgress({ current: 0, total: 20 });

    try {
      const incomingList: ProcessedJobApplication[] = [];
      await GeminiService.processInbox((item, current, total) => {
        incomingList.push(item);
        setJobs([...incomingList]);
        setProgress({ current, total });
      });
    } catch (err) {
      console.error('Ingest error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Initial auto-load so judges immediately see data or can re-trigger
  useEffect(() => {
    handleStartIngest();
  }, []);

  // Compute live stats
  const stats = {
    total: jobs.length,
    applied: jobs.filter((j) => j.status === 'applied').length,
    interview: jobs.filter((j) => j.status === 'interview').length,
    offer: jobs.filter((j) => j.status === 'offer').length,
    rejected: jobs.filter((j) => j.status === 'rejected').length,
    scams: jobs.filter((j) => j.scam.isScam).length,
    followUps: jobs.filter((j) => j.followUp.needsFollowUp).length,
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <div>
        {/* Navigation & Header */}
        <Header
          isProcessing={isProcessing}
          progress={progress}
          onStartIngest={handleStartIngest}
          stats={stats}
          onOpenRawInbox={() => setIsRawInboxOpen(true)}
          onOpenAddEmail={() => setIsAddEmailOpen(true)}
          onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        />

        {/* Main Board */}
        <main>
          <KanbanBoard
            jobs={jobs}
            onOpenScamModal={(job) => setActiveScamJob(job)}
            onOpenFollowUpModal={(job) => setActiveFollowUpJob(job)}
            onOpenInterviewPrep={(job) => setActiveInterviewJob(job)}
            onOpenRawEmail={(job) => setActiveRawEmailJob(job)}
          />
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 px-4 bg-[#060910] text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-slate-300">Job Hunt Autopilot</span>
            <span>•</span>
            <span>Built for Garbathon 2026 (GDG Ahmedabad)</span>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <span className="flex items-center gap-1.5 text-indigo-400 font-medium">
              <Cpu className="w-3.5 h-3.5" />
              Powered by Google Gemini 2.0
            </span>
            <span className="flex items-center gap-1.5 text-purple-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Built with Google Antigravity
            </span>
            <span className="flex items-center gap-1.5 text-red-400 font-medium">
              <Shield className="w-3.5 h-3.5" />
              Dual-Mode Offline Safety Net
            </span>
          </div>
        </div>
      </footer>

      {/* Action Modals */}
      <ScamBannerModal
        job={activeScamJob}
        onClose={() => setActiveScamJob(null)}
      />

      <FollowUpModal
        job={activeFollowUpJob}
        onClose={() => setActiveFollowUpJob(null)}
      />

      <InterviewPrepDrawer
        job={activeInterviewJob}
        onClose={() => setActiveInterviewJob(null)}
      />

      <EmailViewerModal
        job={activeRawEmailJob}
        onClose={() => setActiveRawEmailJob(null)}
      />

      <RawInboxModal
        isOpen={isRawInboxOpen}
        onClose={() => setIsRawInboxOpen(false)}
      />

      <AddEmailModal
        isOpen={isAddEmailOpen}
        onClose={() => setIsAddEmailOpen(false)}
        onAddJob={(newJob) => setJobs((prev) => [newJob, ...prev])}
      />

      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        jobs={jobs}
      />
    </div>
  );
}
