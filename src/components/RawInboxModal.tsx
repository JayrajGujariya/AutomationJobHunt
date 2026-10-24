import React, { useState } from 'react';
import { Inbox, X, Copy, Check, FileJson, Mail } from 'lucide-react';
import sampleInbox from '../data/sampleInbox.json';

interface RawInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RawInboxModal: React.FC<RawInboxModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'cards' | 'json'>('cards');

  if (!isOpen) return null;

  const jsonString = JSON.stringify(sampleInbox, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0e1424] border border-white/10 rounded-3xl max-w-4xl w-full max-h-[85vh] p-6 shadow-2xl flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white font-['Outfit']">
                  Raw Ingest Inbox (20 Layoff Emails)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Input Dataset
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sample inbox of a recently laid-off engineer loaded from JSON starter
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex p-0.5 rounded-lg bg-slate-900 border border-white/10 text-xs">
              <button
                onClick={() => setActiveTab('cards')}
                className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
                  activeTab === 'cards' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Card List
              </button>
              <button
                onClick={() => setActiveTab('json')}
                className={`px-3 py-1 rounded-md font-medium transition cursor-pointer flex items-center gap-1 ${
                  activeTab === 'json' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileJson className="w-3.5 h-3.5" />
                Raw JSON
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="my-4 flex-1 overflow-y-auto pr-2">
          {activeTab === 'json' ? (
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 font-mono text-xs text-indigo-300 leading-relaxed overflow-x-auto">
              <pre>{jsonString}</pre>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sampleInbox.map((email) => (
                <div 
                  key={email.id} 
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                    <span className="text-indigo-400 font-bold">Email #{email.id}</span>
                    <span>{email.date}</span>
                  </div>
                  <div className="font-bold text-white line-clamp-1">{email.subject}</div>
                  <div className="text-[11px] text-slate-400 font-mono truncate">From: {email.from}</div>
                  <div className="text-slate-300 text-[11px] line-clamp-2 leading-relaxed bg-slate-950/60 p-2 rounded-lg border border-white/5">
                    {email.body}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {sampleInbox.length} emails prepared for ingestion pipeline
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 flex items-center gap-1.5 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              {copied ? 'JSON Copied!' : 'Copy Dataset JSON'}
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
