import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  FileDown, 
  Copy, 
  Check, 
  Share2, 
  Save, 
  Sparkles, 
  RotateCcw,
  Loader2,
  FileCode,
  FileText
} from 'lucide-react';
import { TailoredCv, DesignThemeConfig, SectionConfig } from '../../types';
import { 
  downloadCvPdf, 
  downloadWordDocument, 
  downloadMarkdown, 
  copyAtsPlainText 
} from '../../utils/exportUtils';

interface ShareExportModalProps {
  cv: TailoredCv;
  themeConfig: DesignThemeConfig;
  sections: SectionConfig[];
  onClose: () => void;
  onPrint: () => void;
  lastSavedTime?: string;
  onClearDraft: () => void;
}

export const ShareExportModal: React.FC<ShareExportModalProps> = ({
  cv,
  themeConfig,
  sections,
  onClose,
  onPrint,
  lastSavedTime,
  onClearDraft,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyPlainText = async () => {
    const success = await copyAtsPlainText(cv.formattedText);
    if (success) {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    }
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await downloadCvPdf(cv, 'cv-printable-sheet');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadWord = () => {
    downloadWordDocument(
      cv, 
      `${cv.header.name.replace(/\s+/g, '_')}_ATS_Resume.doc`,
      themeConfig,
      sections
    );
  };

  const handleDownloadMd = () => {
    downloadMarkdown(cv, `${cv.header.name.replace(/\s+/g, '_')}_ATS_Resume.md`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs no-print">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-7 space-y-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Export & Share Suite
              </h3>
              <p className="text-xs text-slate-500">
                Download parser-ready files, copy clean text, or share your resume.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Share Link Row */}
        <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-indigo-950 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-indigo-600" />
              Share Direct Workspace Link
            </span>
            {copiedLink && (
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-3 h-3" /> Copied Link!
              </span>
            )}
          </div>
          <p className="text-[11px] text-indigo-800/80">
            Share this editor workspace URL with reviewers, mentors, or recruiters.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              readOnly
              value={window.location.href}
              className="flex-1 px-3 py-1.5 text-xs border border-indigo-200 rounded-xl bg-white text-slate-700 font-mono select-all focus:outline-none"
            />
            <button
              onClick={handleCopyShareLink}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-xs shrink-0 active:scale-95"
            >
              {copiedLink ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* Primary Export Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* PDF Direct */}
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-slate-50 text-left transition-all group shadow-2xs"
          >
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-transform">
              {isGeneratingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            </div>
            <div>
              <div className="font-bold text-slate-900">Direct PDF Export</div>
              <div className="text-[10px] text-slate-500">2x Retina High-Resolution</div>
            </div>
          </button>

          {/* System Print Vector PDF */}
          <button
            onClick={() => {
              onClose();
              setTimeout(onPrint, 200);
            }}
            className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-slate-50 text-left transition-all group shadow-2xs"
          >
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700 group-hover:scale-105 transition-transform">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900">Vector Print / PDF</div>
              <div className="text-[10px] text-slate-500">Browser System Dialog</div>
            </div>
          </button>

          {/* Word Document */}
          <button
            onClick={handleDownloadWord}
            className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 hover:border-blue-400 bg-white hover:bg-slate-50 text-left transition-all group shadow-2xs"
          >
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
              <FileDown className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900">Word Document (.doc)</div>
              <div className="text-[10px] text-slate-500">Editable Microsoft Word</div>
            </div>
          </button>

          {/* ATS Plain Text Stream */}
          <button
            onClick={handleCopyPlainText}
            className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-400 bg-white hover:bg-slate-50 text-left transition-all group shadow-2xs"
          >
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform">
              {copiedText ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </div>
            <div>
              <div className="font-bold text-slate-900">Copy ATS Plain Text</div>
              <div className="text-[10px] text-slate-500">For job board input forms</div>
            </div>
          </button>

          {/* Markdown */}
          <button
            onClick={handleDownloadMd}
            className="sm:col-span-2 flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 text-left transition-all group shadow-2xs"
          >
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <FileCode className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-900">Markdown Format (.md)</div>
              <div className="text-[10px] text-slate-500">Plain developer markdown representation</div>
            </div>
          </button>
        </div>

        {/* Local Storage Draft Persistence Status */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Save className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {lastSavedTime ? `Draft auto-saved: ${lastSavedTime}` : 'Draft saved in browser'}
            </span>
          </div>

          <button
            onClick={onClearDraft}
            className="text-[11px] text-rose-600 hover:text-rose-800 hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Draft</span>
          </button>
        </div>
      </div>
    </div>
  );
};
