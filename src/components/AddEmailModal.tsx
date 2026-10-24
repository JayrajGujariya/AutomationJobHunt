import React, { useState } from 'react';
import { PlusCircle, X, Sparkles, Send } from 'lucide-react';
import { RawEmail, ProcessedJobApplication } from '../types/job';
import { GeminiService } from '../services/geminiService';

interface AddEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJob: (newJob: ProcessedJobApplication) => void;
}

export const AddEmailModal: React.FC<AddEmailModalProps> = ({
  isOpen,
  onClose,
  onAddJob,
}) => {
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [date, setDate] = useState('2026-10-24');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  // Preset quick-test samples that judges love to try
  const handleLoadPreset = (type: 'scam' | 'interview' | 'ghosted') => {
    if (type === 'scam') {
      setSender('hr.google.careers@gmail.com');
      setDate('2026-10-24');
      setSubject('Congratulations: Selected for Google Cloud Architect - Pay Rs 3,500 Registration');
      setBody('Dear Candidate,\n\nYou have been selected for Google Cloud Architect at 45 LPA. Please deposit a refundable document verification charge of Rs 3,500 via UPI and submit your Aadhaar card copy to confirm your employee ID.');
    } else if (type === 'interview') {
      setSender('talent@cred.club');
      setDate('2026-10-24');
      setSubject('Interview Invite: CRED Backend Architecture Round with VP of Eng');
      setBody('Hi Jayraj,\n\nWe loved your open-source repositories. We would like to invite you for a 60-minute technical deep dive with our VP of Engineering on October 29 at 3:00 PM IST.');
    } else {
      setSender('careers@blinkit.com');
      setDate('2026-10-11');
      setSubject('Application Acknowledgement: SDE II at Blinkit');
      setBody('Hi Jayraj,\n\nThanks for applying to Blinkit. We have received your resume and our team is evaluating your application.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;

    setIsAnalyzing(true);
    const newId = Date.now();

    const raw: RawEmail = {
      id: newId,
      from: sender.trim() || 'recruiter@company.com',
      date: date || '2026-10-24',
      subject: subject.trim(),
      body: body.trim(),
    };

    try {
      // Analyze with Gemini or intelligent heuristic classifier
      const processed = await GeminiService.classifySingleEmail(raw);
      onAddJob(processed);
      onClose();
      // Reset form
      setSender('');
      setSubject('');
      setBody('');
    } catch (err) {
      console.error('Failed to classify custom email:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0e1424] border border-white/10 rounded-3xl max-w-xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Outfit']">
                Add & Test Custom Email
              </h2>
              <p className="text-xs text-slate-400">
                Test any email live — Gemini will classify status, flag fraud, or draft follow-ups
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Test Presets */}
        <div className="my-3 flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium">Quick Presets:</span>
          <button
            type="button"
            onClick={() => handleLoadPreset('scam')}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30 transition cursor-pointer"
          >
            ⚡ Test Scam Email
          </button>
          <button
            type="button"
            onClick={() => handleLoadPreset('interview')}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30 transition cursor-pointer"
          >
            ⚡ Test Interview Email
          </button>
          <button
            type="button"
            onClick={() => handleLoadPreset('ghosted')}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 transition cursor-pointer"
          >
            ⚡ Test Ghosted Email
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                Sender Email
              </label>
              <input
                type="text"
                placeholder="hr.infosys@gmail.com"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                Date Received
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
              Email Subject
            </label>
            <input
              type="text"
              placeholder="e.g. Selection Letter - Pay Rs 4,999 or Interview invite"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
              Email Body Content
            </label>
            <textarea
              rows={4}
              placeholder="Paste email text here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAnalyzing}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              {isAnalyzing ? 'Analyzing with AI...' : 'Run Autopilot & Add to Board'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
