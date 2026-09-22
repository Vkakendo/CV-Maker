import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Clock,
  Briefcase,
  Cpu,
  CheckCircle2,
  Sliders,
  Zap,
  Loader2
} from 'lucide-react';
import { DesignTemplate, CustomizationOptions } from '../types';
import { SAMPLE_PROFILES } from '../data/samples';
import { FileUploadZone } from './FileUploadZone';
import { TemplateSelectorGallery } from './TemplateSelectorGallery';
import { CustomizationPanel } from './CustomizationPanel';

interface InputPanelProps {
  currentCv: string;
  setCurrentCv: (val: string) => void;
  targetJd: string;
  setTargetJd: (val: string) => void;
  designPreference: DesignTemplate;
  setDesignPreference: (val: DesignTemplate) => void;
  customizationOptions: CustomizationOptions;
  setCustomizationOptions: (options: CustomizationOptions) => void;
  customNotes: string;
  setCustomNotes: (val: string) => void;
  isOptimizing: boolean;
  onOptimize: () => void;
  onSelectSample: (sampleId: string) => void;
  onOpenDirectEditor?: () => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  currentCv,
  setCurrentCv,
  targetJd,
  setTargetJd,
  designPreference,
  setDesignPreference,
  customizationOptions,
  setCustomizationOptions,
  customNotes,
  setCustomNotes,
  isOptimizing,
  onOptimize,
  onSelectSample,
  onOpenDirectEditor,
}) => {
  const canSubmit = currentCv.trim().length > 30 && targetJd.trim().length > 30;

  return (
    <div className="space-y-6">
      {/* Intro Hero Section (Linear / Vercel style dark obsidian banner) */}
      <div className="relative overflow-hidden rounded-3xl bg-[#090d16] text-white border border-slate-800 shadow-xl p-6 sm:p-8">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-60 h-60 rounded-full bg-violet-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/25 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Enterprise ATS Alignment & Google X-Y-Z Elevation</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Targeted Resume Optimization & Architectural Styling
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
            Upload your source resume and target job description. The engine parses requirements, extracts primary & secondary hard skills, weaves contextual keywords without bot-triggering stuffing, and elevates bullet points using Google's quantified impact formula.
          </p>

          {/* Quick Demo Selector */}
          <div className="pt-4 border-t border-slate-800/80">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                Pre-loaded Candidate Profiles:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                {SAMPLE_PROFILES.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => onSelectSample(sample.id)}
                    className="text-left px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all text-xs group active:scale-[0.98]"
                  >
                    <div className="font-semibold text-slate-200 group-hover:text-indigo-300 flex items-center justify-between">
                      <span>{sample.title}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {sample.badge}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Document Input Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Current CV Zone */}
        <FileUploadZone
          id="candidate-cv"
          label="1. Candidate CV / Resume"
          sublabel="Accepts .pdf, .docx, .txt with instant privacy-first client-side parsing"
          textValue={currentCv}
          onTextChange={setCurrentCv}
          placeholder="Paste or upload your candidate CV/Resume here...

Sections typically include:
- Contact information & professional titles
- Executive summary or career profile
- Work history with quantified achievements
- Technical tools, libraries & competencies
- Education, certifications & degrees"
          accentColor="indigo"
        />

        {/* Target Job Description Zone */}
        <FileUploadZone
          id="target-jd"
          label="2. Target Job Description (JD)"
          sublabel="Accepts .pdf, .docx, or copy-paste directly from job boards"
          textValue={targetJd}
          onTextChange={setTargetJd}
          placeholder="Paste or upload the target Job Description (JD) here...

Key segments to include:
- Role Title & organizational context
- Core responsibilities & scope of ownership
- Must-have hard skills, stacks & tooling
- Preferred qualifications & domain methodologies"
          accentColor="emerald"
        />
      </div>

      {/* Interactive Visual Template Selector Gallery */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <TemplateSelectorGallery
          selected={designPreference}
          onSelect={setDesignPreference}
        />
      </div>

      {/* Enhanced Customization & ATS Controls Panel */}
      <CustomizationPanel
        options={customizationOptions}
        onChange={setCustomizationOptions}
        customNotes={customNotes}
        setCustomNotes={setCustomNotes}
      />

      {/* Action Trigger / Optimization Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-[11px] leading-relaxed">
            <strong className="text-slate-900 block font-semibold">Recruiting Specialist Integrity Protocol:</strong>
            Quantifies achievements and weaves keywords without fabricating employers, fake titles, or false degrees.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
          {onOpenDirectEditor && (
            <button
              type="button"
              onClick={onOpenDirectEditor}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 hover:border-slate-300 transition-all shadow-2xs shrink-0 active:scale-[0.98]"
              title="Open Resume.io-style interactive editor & canvas"
            >
              <span>Open Resume Designer</span>
            </button>
          )}

          <button
            id="optimize-btn"
            type="button"
            disabled={!canSubmit || isOptimizing}
            onClick={onOptimize}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md shrink-0 active:scale-[0.98] ${
              !canSubmit || isOptimizing
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-500 hover:to-violet-600 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40'
            }`}
          >
            {isOptimizing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Optimizing ATS Algorithms...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Optimize & Align Resume</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Micro-Interactions & Feedback State when optimizing */}
      {isOptimizing && (
        <div className="bg-[#090d16] text-white rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5 text-xs font-bold text-indigo-400">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <span>AI ATS Optimization Engine Executing:</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Model: Gemini 2.5 Flash • Contextual Synthesizer
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 animate-ping" />
              <div>
                <span className="font-bold text-slate-200 block text-[11px]">1. Skill Parsing</span>
                <span className="text-[10px] text-slate-400">Extracting primary & secondary JD keywords</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 animate-pulse" />
              <div>
                <span className="font-bold text-slate-200 block text-[11px]">2. Contextual Weaving</span>
                <span className="text-[10px] text-slate-400">Synthesizing keywords naturally</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5" />
              <div>
                <span className="font-bold text-slate-200 block text-[11px]">3. Google X-Y-Z</span>
                <span className="text-[10px] text-slate-400">Transforming bullets with metrics & verbs</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-violet-400 mt-1.5" />
              <div>
                <span className="font-bold text-slate-200 block text-[11px]">4. ATS Format Check</span>
                <span className="text-[10px] text-slate-400">Audit single-column compliance</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
