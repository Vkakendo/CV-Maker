import React, { useState } from 'react';
import { 
  Sliders, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  FileText, 
  BookOpen,
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';
import { CustomizationOptions } from '../types';

interface CustomizationPanelProps {
  options: CustomizationOptions;
  onChange: (options: CustomizationOptions) => void;
  customNotes: string;
  setCustomNotes: (notes: string) => void;
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  options,
  onChange,
  customNotes,
  setCustomNotes,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateOption = <K extends keyof CustomizationOptions>(key: K, value: CustomizationOptions[K]) => {
    onChange({
      ...options,
      [key]: value,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs transition-all">
      {/* Accordion Trigger Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between bg-gradient-to-r from-slate-50/70 via-slate-50/40 to-white hover:bg-slate-100/60 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                ATS Tuning & Optimization Parameters
              </h4>
              <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 px-2 py-0.5 rounded-full">
                Custom Engine Settings
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Fine-tune Google XYZ quantification intensity, executive tone calibration, and single-column layout constraints
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span className="hidden sm:inline text-[11px] text-slate-400">
            {isExpanded ? 'Hide Settings' : 'Configure Rules'}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {/* Accordion Body */}
      {isExpanded && (
        <div className="p-5 border-t border-slate-100 space-y-5 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. Google XYZ Formula Intensity */}
            <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  <span>Google X-Y-Z Intensity</span>
                </label>
                <span className="text-[10px] font-semibold text-slate-400">Metric Lift</span>
              </div>

              <select
                value={options.xyzIntensity}
                onChange={(e) => updateOption('xyzIntensity', e.target.value as any)}
                className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                <option value="Aggressive (High Impact Metrics)">Aggressive (Fortune 500 Metrics & Scale)</option>
                <option value="Standard">Standard (Balanced Quantitative & Qualitative)</option>
                <option value="Conservative (Role Preservation)">Conservative (Preserve Explicit Source Metrics)</option>
              </select>
              <p className="text-[10px] text-slate-500 leading-tight">
                Controls whether missing metrics are intelligently estimated using conservative industry benchmarks.
              </p>
            </div>

            {/* 2. Professional Tone & Persona */}
            <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Executive Tone & Persona</span>
                </label>
                <span className="text-[10px] font-semibold text-slate-400">Voice</span>
              </div>

              <select
                value={options.targetTone}
                onChange={(e) => updateOption('targetTone', e.target.value as any)}
                className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                <option value="Executive & Strategic">Executive & Strategic (ROI, Governance, Scale)</option>
                <option value="Technical & Architectural">Technical & Architectural (Stack, Latency, Systems)</option>
                <option value="Operational & Commercial">Operational & Commercial (Throughput, P&L, Execution)</option>
              </select>
              <p className="text-[10px] text-slate-500 leading-tight">
                Calibrates strong action verbs and vocabulary towards architectural depth or executive strategic scope.
              </p>
            </div>

            {/* 3. Page Target */}
            <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-700" />
                  <span>Page Target Budget</span>
                </label>
                <span className="text-[10px] font-semibold text-slate-400">Pacing</span>
              </div>

              <select
                value={options.pageTarget}
                onChange={(e) => updateOption('pageTarget', e.target.value as any)}
                className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                <option value="Dynamic Standard">Dynamic Standard (Adapts to Career Depth)</option>
                <option value="Strict 1 Page">Strict 1 Page (US Standard - High Density)</option>
                <option value="Comprehensive 2 Pages">Comprehensive 2 Pages (Senior / Staff / VP)</option>
              </select>
              <p className="text-[10px] text-slate-500 leading-tight">
                Prunes low-relevance legacy duties to ensure strict 1-page or balanced 2-page hiring standards.
              </p>
            </div>
          </div>

          {/* Quick Boolean Switches */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <label className="flex items-start gap-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 cursor-pointer hover:bg-slate-100/80 transition-colors">
              <input
                type="checkbox"
                checked={options.strictSingleColumn}
                onChange={(e) => updateOption('strictSingleColumn', e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Strict Single-Column ATS Layout Flow
                </span>
                <span className="text-[11px] text-slate-500 block leading-relaxed mt-0.5">
                  Prevents sidebars, nested cards, and multi-column tables for 100% Workday, Taleo & Greenhouse parser compatibility.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 cursor-pointer hover:bg-slate-100/80 transition-colors">
              <input
                type="checkbox"
                checked={options.prioritizeHardSkills}
                onChange={(e) => updateOption('prioritizeHardSkills', e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Prioritize Target Job Description Hard Skills
                </span>
                <span className="text-[11px] text-slate-500 block leading-relaxed mt-0.5">
                  Automatically extracts and places the most critical JD tools and frameworks at the top of your technical skill matrix.
                </span>
              </div>
            </label>
          </div>

          {/* Contextual Nuances / Directives */}
          <div className="pt-2">
            <label className="text-xs font-bold text-slate-900 block mb-1">
              Custom Candidate Directives & Contextual Nuances (Optional)
            </label>
            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="e.g. 'Highlight my distributed caching work over legacy SQL maintenance' or 'I am open to hybrid roles'"
              className="w-full text-xs p-3 bg-slate-50/60 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Any special focus or exclusions you'd like the ATS specialist engine to prioritize.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
