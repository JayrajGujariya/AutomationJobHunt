import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  RefreshCw, 
  Key, 
  Briefcase, 
  Calendar, 
  AlertTriangle, 
  Clock, 
  CheckCircle2,
  Inbox,
  PlusCircle,
  BarChart3
} from 'lucide-react';
import { GeminiService } from '../services/geminiService';

interface HeaderProps {
  isProcessing: boolean;
  progress: { current: number; total: number };
  onStartIngest: () => void;
  stats: {
    total: number;
    applied: number;
    interview: number;
    offer: number;
    rejected: number;
    scams: number;
    followUps: number;
  };
  onOpenRawInbox: () => void;
  onOpenAddEmail: () => void;
  onOpenAnalytics: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isProcessing,
  progress,
  onStartIngest,
  stats,
  onOpenRawInbox,
  onOpenAddEmail,
  onOpenAnalytics
}) => {
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(GeminiService.getApiKey());
  const [savedKey, setSavedKey] = useState(Boolean(GeminiService.getApiKey()));

  const handleSaveKey = () => {
    GeminiService.setApiKey(apiKeyInput);
    setSavedKey(Boolean(apiKeyInput.trim()));
    setApiKeyModalOpen(false);
  };

  return (
    <header role="banner" className="border-b border-white/10 bg-[#090d16]/90 backdrop-blur-md sticky top-0 z-40">
      {/* Top Banner / Context */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Story Angle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-['Outfit'] tracking-tight text-white">
                  Job Hunt <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Autopilot</span>
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true"></span>
                  Autopilot Ready
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  Google Gemini 2.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Post-Layoff Application Ingestion • Scam Shield • 7-Day Follow-Up Agent
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <nav aria-label="Autopilot Controls" className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={onOpenAnalytics}
              aria-label="View Layoff Recovery Momentum and Ghosting Index"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="View Layoff Recovery Momentum & Ghosting Index"
            >
              <BarChart3 className="w-3.5 h-3.5 text-purple-400" aria-hidden="true" />
              <span>📊 Layoff Analytics</span>
            </button>

            <button
              onClick={onOpenAddEmail}
              aria-label="Paste custom email or test arbitrary judge sample"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Paste custom email or test judge's sample"
            >
              <PlusCircle className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
              <span>+ Add / Test Email</span>
            </button>

            <button
              onClick={onOpenRawInbox}
              aria-label="Inspect raw 20 email inbox dataset in card and JSON formats"
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-white/10 transition flex items-center gap-1.5 cursor-pointer"
              title="Inspect raw 20 email inbox JSON"
            >
              <Inbox className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <span>View Raw Inbox (20)</span>
            </button>

            <button
              onClick={() => setApiKeyModalOpen(true)}
              aria-label="Configure live Google Gemini API Key"
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-white/10 transition flex items-center gap-1.5 cursor-pointer"
              title="Configure live Gemini API Key"
            >
              <Key className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
              <span>{savedKey ? 'Gemini API: Connected' : 'Gemini API: Offline Safe'}</span>
            </button>

            <button
              onClick={onStartIngest}
              disabled={isProcessing}
              aria-label="Ingest 20 Layoff Emails with Gemini"
              className={`px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-lg transition flex items-center gap-2 cursor-pointer ${
                isProcessing 
                  ? 'bg-indigo-600/60 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-600/30'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} aria-hidden="true" />
              <span>{isProcessing ? `Ingesting (${progress.current}/${progress.total})...` : '⚡ Ingest 20 Layoff Emails'}</span>
            </button>
          </nav>
        </div>

        {/* Live Progress Bar if processing */}
        {isProcessing && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
              <span>Streaming Gemini Pipeline Analysis...</span>
              <span>{Math.round((progress.current / progress.total) * 100)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Live Status & Metrics KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 mt-3 pt-3 border-t border-white/5">
          <div className="bg-slate-900/60 border border-white/5 rounded-lg px-3 py-2 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Total Tracked</div>
              <div className="text-base font-bold text-white font-mono">{stats.total}</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-white/5 rounded-lg px-3 py-2 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Applied</div>
              <div className="text-base font-bold text-blue-300 font-mono">{stats.applied}</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-white/5 rounded-lg px-3 py-2 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Interviews</div>
              <div className="text-base font-bold text-purple-300 font-mono">{stats.interview}</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-white/5 rounded-lg px-3 py-2 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Offers</div>
              <div className="text-base font-bold text-emerald-300 font-mono">{stats.offer}</div>
            </div>
          </div>

          <div className="bg-red-950/30 border border-red-500/30 rounded-lg px-3 py-2 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-red-500/20 text-red-400 flex items-center justify-center">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[11px] text-red-300 uppercase tracking-wider font-semibold">Scams Flagged</div>
              <div className="text-base font-bold text-red-400 font-mono">{stats.scams}</div>
            </div>
          </div>

          <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg px-3 py-2 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[11px] text-amber-300 uppercase tracking-wider font-semibold">Follow-Ups (&gt;7d)</div>
              <div className="text-base font-bold text-amber-400 font-mono">{stats.followUps}</div>
            </div>
          </div>
        </div>
      </div>

      {/* API Key Modal */}
      {apiKeyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1424] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-['Outfit']">Google Gemini API Configuration</h3>
                <p className="text-xs text-slate-400">Optional: Enter your API key or use cached offline mode</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              For the Garbathon hackathon demo, Job Hunt Autopilot includes an <strong>instant offline backup mode</strong>. If you provide a Google AI Studio Gemini API key, it will call live Gemini 2.0 / 1.5 Flash.
            </p>

            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 font-mono"
            />

            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setApiKeyModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveKey}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition cursor-pointer"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
