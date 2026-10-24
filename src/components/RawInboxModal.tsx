import React, { useState, useRef } from 'react';
import { Inbox, X, Copy, Check, FileJson, Upload, FileText } from 'lucide-react';
import sampleInbox from '../data/sampleInbox.json';
import { RawEmail } from '../types/job';
import { MboxParser } from '../services/mboxParser';

interface RawInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInboxLoaded?: (emails: RawEmail[]) => void;
}

export const RawInboxModal: React.FC<RawInboxModalProps> = ({ 
  isOpen, 
  onClose,
  onInboxLoaded 
}) => {
  const [emails, setEmails] = useState<RawEmail[]>(sampleInbox as RawEmail[]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'cards' | 'json'>('cards');
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(emails, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            setEmails(parsed);
            if (onInboxLoaded) onInboxLoaded(parsed);
            setUploadSuccess(`Loaded ${parsed.length} emails from ${file.name}`);
          }
        } else {
          // Parse .mbox format
          const parsed = MboxParser.parseMbox(content);
          setEmails(parsed);
          if (onInboxLoaded) onInboxLoaded(parsed);
          setUploadSuccess(`Parsed ${parsed.length} emails from MBOX file (${file.name})`);
        }
      } catch (err) {
        console.error('File parse error:', err);
        setUploadSuccess('Failed to parse file. Please upload valid JSON or .mbox');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="inbox-modal-title"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div className="bg-[#0e1424] border border-white/10 rounded-3xl max-w-4xl w-full max-h-[85vh] p-6 shadow-2xl flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Inbox className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="inbox-modal-title" className="text-base font-bold text-white font-['Outfit']">
                  Raw Ingest Inbox ({emails.length} Emails)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Problem Spec: JSON / .mbox
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sample inbox of a recently laid-off engineer loaded from JSON or .mbox file
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json,.mbox,text/plain"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload custom JSON or .mbox file"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Import JSON or .mbox file"
            >
              <Upload className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Import .mbox / JSON</span>
            </button>

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
                <FileJson className="w-3.5 h-3.5" aria-hidden="true" />
                Raw JSON
              </button>
            </div>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {uploadSuccess && (
          <div className="my-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
            {uploadSuccess}
          </div>
        )}

        {/* Content Body */}
        <div className="my-4 flex-1 overflow-y-auto pr-2">
          {activeTab === 'json' ? (
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 font-mono text-xs text-indigo-300 leading-relaxed overflow-x-auto">
              <pre>{jsonString}</pre>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {emails.map((email) => (
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
            {emails.length} emails loaded into ingestion buffer (Supports JSON & .mbox)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              aria-label="Copy entire JSON dataset to clipboard"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 flex items-center gap-1.5 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />}
              <span>{copied ? 'JSON Copied!' : 'Copy Dataset JSON'}</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close raw inbox viewer"
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
