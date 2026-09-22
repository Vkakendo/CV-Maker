import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  FileDown, 
  Copy, 
  Check, 
  Edit3, 
  Palette, 
  ShieldCheck, 
  Sparkles,
  Download,
  Loader2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Columns,
  Layout,
  Sliders,
  Share2,
  Save,
  RotateCcw
} from 'lucide-react';
import { 
  TailoredCv, 
  DesignTemplate, 
  DesignThemeConfig, 
  SectionConfig, 
  SectionType 
} from '../types';
import { 
  downloadWordDocument, 
  downloadMarkdown, 
  copyAtsPlainText, 
  downloadCvPdf, 
  saveCvDraft, 
  loadCvDraft, 
  clearCvDraft 
} from '../utils/exportUtils';
import { DesignCustomizerBar } from './builder/DesignCustomizerBar';
import { ResumeFormEditor } from './builder/ResumeFormEditor';
import { LiveDocumentCanvas } from './builder/LiveDocumentCanvas';
import { SectionManager, DEFAULT_SECTIONS } from './builder/SectionManager';
import { ShareExportModal } from './builder/ShareExportModal';
import { LayoutModeToggle, ActiveLayoutMode } from './builder/LayoutModeToggle';
import { CvImportDropzone } from './builder/CvImportDropzone';

interface TailoredCvViewProps {
  cv: TailoredCv;
  designPreference: DesignTemplate;
  setDesignPreference: (val: DesignTemplate) => void;
  onUpdateCv: (updatedCv: TailoredCv) => void;
  onPrint: () => void;
}

export const TailoredCvView: React.FC<TailoredCvViewProps> = ({
  cv,
  designPreference,
  setDesignPreference,
  onUpdateCv,
  onPrint,
}) => {
  // Theme Configuration - Defaulting to Calibri across all professional templates
  const [themeConfig, setThemeConfig] = useState<DesignThemeConfig>(() => {
    const savedDraft = loadCvDraft();
    if (savedDraft?.themeConfig?.fontFamily) {
      return savedDraft.themeConfig;
    }
    return {
      template: designPreference,
      fontFamily: 'Calibri',
      fontSize: 'Standard (10.5pt)',
      spacing: 'Standard',
      margins: 'Standard (0.45in)',
      accentColor: '#0f172a',
    };
  });

  // Keep theme template synchronized with designPreference prop
  useEffect(() => {
    if (themeConfig.template !== designPreference) {
      setThemeConfig(prev => ({ ...prev, template: designPreference }));
    }
  }, [designPreference]);

  // Section Ordering and Visibility
  const [sections, setSections] = useState<SectionConfig[]>(DEFAULT_SECTIONS);
  const [isSectionManagerOpen, setIsSectionManagerOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Split-Screen Layout Mode: 'split' (side-by-side) | 'preview-only' | 'editor-only' | 'plainText' | 'markdown'
  const [workspaceMode, setWorkspaceMode] = useState<'split' | 'preview-only' | 'editor-only' | 'plainText' | 'markdown'>('split');
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Export & Feedback States
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('');

  // Auto-save draft on changes
  useEffect(() => {
    saveCvDraft({
      cv,
      themeConfig,
      sectionConfigs: sections,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [cv, themeConfig, sections]);

  // Handle Theme Change
  const handleThemeChange = (newTheme: DesignThemeConfig) => {
    setThemeConfig(newTheme);
    if (newTheme.template !== designPreference) {
      setDesignPreference(newTheme.template);
    }
  };

  const handleCopyText = async () => {
    const success = await copyAtsPlainText(cv.formattedText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
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

  const handleDownloadDoc = () => {
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

  const handleClearDraft = () => {
    clearCvDraft();
    setSections(DEFAULT_SECTIONS);
    setLastSavedTime('');
  };

  const handleLayoutModeChange = (mode: ActiveLayoutMode) => {
    if (mode === 'two-column-executive') {
      handleThemeChange({
        ...themeConfig,
        template: 'Timeline Sidebar (Executive Modern)',
      });
    } else {
      // Switch to Single-Column Strict ATS mode
      const targetTemplate: DesignTemplate = themeConfig.template === 'Timeline Sidebar (Executive Modern)'
        ? 'Modern Executive'
        : themeConfig.template;
      handleThemeChange({
        ...themeConfig,
        template: targetTemplate,
      });
    }
  };

  const handleImportComplete = (parsedCv: TailoredCv, _rawText: string) => {
    onUpdateCv(parsedCv);
  };

  return (
    <div className="space-y-4">
      {/* 1. Primary Workspace Header & Action Toolbar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs no-print space-y-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Resume.io Interactive Split-Screen Workspace</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Modular Resume Designer & Customizer
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit sections, reorder blocks, adjust typography & spacing, and preview live on an ATS-certified canvas.
            </p>
          </div>

          {/* Workspace View Mode Switcher */}
          <div className="flex items-center flex-wrap gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setWorkspaceMode('split')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  workspaceMode === 'split'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Split Editor & Live Canvas (Resume.io style)"
              >
                <Columns className="w-3.5 h-3.5 text-indigo-600" />
                <span>Split View</span>
              </button>

              <button
                onClick={() => setWorkspaceMode('preview-only')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  workspaceMode === 'preview-only'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Full Screen Document Canvas"
              >
                <Layout className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sheet Only</span>
              </button>

              <button
                onClick={() => setWorkspaceMode('editor-only')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  workspaceMode === 'editor-only'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Editor Form Only"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                <span>Editor Only</span>
              </button>

              <button
                onClick={() => setWorkspaceMode('plainText')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all hidden sm:inline-block ${
                  workspaceMode === 'plainText'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Raw Plain Text ATS Stream"
              >
                ATS Text
              </button>
            </div>

            {/* Reorder Sections Button */}
            <button
              onClick={() => setIsSectionManagerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200/80 active:scale-95"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span>Reorder ({sections.filter(s => s.enabled).length})</span>
            </button>
          </div>
        </div>

        {/* Dual Layout Mode Selector (Strict ATS Single-Column vs. 2-Column Executive Modern) */}
        <LayoutModeToggle
          currentTemplate={themeConfig.template}
          onSelectLayoutMode={handleLayoutModeChange}
        />

        {/* 2. Advanced Design Customizer Bar (Typography, Spacing, Margins, Accent Colors) */}
        <DesignCustomizerBar
          themeConfig={themeConfig}
          onChangeTheme={handleThemeChange}
          onOpenSectionManager={() => setIsSectionManagerOpen(true)}
        />

        {/* 3. Action Toolbar (Download PDF, Print, Word, Plain Text, Share Suite) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Auto-saving live draft</span>
            {lastSavedTime && (
              <span className="text-[11px] font-mono text-slate-400">({lastSavedTime})</span>
            )}
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Share Suite Modal Button */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors shadow-2xs active:scale-95"
              title="Share Preview Link or Open Export Options"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Share & Export</span>
            </button>

            {/* Direct High-Resolution PDF Download */}
            <button
              id="download-pdf-direct-btn"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm shadow-indigo-600/20 active:scale-95"
              title="Download high-resolution ATS-optimized PDF"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  Download PDF
                </>
              )}
            </button>

            {/* Browser Vector Print */}
            <button
              id="print-cv-btn"
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#090d16] text-white hover:bg-slate-800 transition-colors shadow-xs active:scale-95"
              title="Print directly or save via browser system print dialog"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Vector PDF
            </button>

            {/* Word Document */}
            <button
              id="download-doc-btn"
              onClick={handleDownloadDoc}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs active:scale-95"
              title="Download Microsoft Word .doc file"
            >
              <FileDown className="w-3.5 h-3.5 text-blue-600" />
              Word (.doc)
            </button>

            {/* Copy ATS Text */}
            <button
              id="copy-ats-text-btn"
              onClick={handleCopyText}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all shadow-2xs active:scale-95 ${
                copied
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
              }`}
              title="Copy clean plain text for ATS application forms"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                  Copy ATS Text
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Smart CV Upload & Pre-fill Engine ("Import Existing CV") */}
      <CvImportDropzone
        currentCv={cv}
        onImportComplete={handleImportComplete}
        className="no-print"
      />

      {/* 4. Split-Screen Interactive Workspace Stage */}
      {workspaceMode === 'plainText' ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase">
              Raw Single-Column ATS Parser Stream
            </span>
            <button
              onClick={handleCopyText}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              {copied ? 'Copied to Clipboard!' : 'Copy Stream'}
            </button>
          </div>
          <pre className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[700px] overflow-y-auto">
            {cv.formattedText}
          </pre>
        </div>
      ) : workspaceMode === 'markdown' ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase">
              Markdown Structured Resume
            </span>
            <button
              onClick={handleDownloadMd}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              Download .md
            </button>
          </div>
          <pre className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[700px] overflow-y-auto">
            {cv.markdownText}
          </pre>
        </div>
      ) : workspaceMode === 'editor-only' ? (
        <div className="max-w-4xl mx-auto">
          <ResumeFormEditor
            cv={cv}
            onChangeCv={onUpdateCv}
            sections={sections}
            onOpenSectionManager={() => setIsSectionManagerOpen(true)}
          />
        </div>
      ) : workspaceMode === 'preview-only' ? (
        <div>
          <LiveDocumentCanvas
            cv={cv}
            themeConfig={themeConfig}
            sections={sections}
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
          />
        </div>
      ) : (
        /* Split-Screen Workspace (Side-by-Side: Left Editor, Right Live Canvas) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Panel: Form Editor */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-4">
            <ResumeFormEditor
              cv={cv}
              onChangeCv={onUpdateCv}
              sections={sections}
              onOpenSectionManager={() => setIsSectionManagerOpen(true)}
            />
          </div>

          {/* Right Panel: Live Document Canvas */}
          <div className="lg:col-span-7 xl:col-span-7 sticky top-4">
            <LiveDocumentCanvas
              cv={cv}
              themeConfig={themeConfig}
              sections={sections}
              zoomLevel={zoomLevel}
              setZoomLevel={setZoomLevel}
            />
          </div>
        </div>
      )}

      {/* Section Manager Modal */}
      {isSectionManagerOpen && (
        <SectionManager
          sections={sections}
          onUpdateSections={setSections}
          onClose={() => setIsSectionManagerOpen(false)}
        />
      )}

      {/* Share & Export Suite Modal */}
      {isShareModalOpen && (
        <ShareExportModal
          cv={cv}
          themeConfig={themeConfig}
          sections={sections}
          onClose={() => setIsShareModalOpen(false)}
          onPrint={onPrint}
          lastSavedTime={lastSavedTime}
          onClearDraft={handleClearDraft}
        />
      )}
    </div>
  );
};
