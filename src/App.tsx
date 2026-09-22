/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  Sparkles, 
  Columns, 
  SlidersHorizontal, 
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { AtsSummaryView } from './components/AtsSummaryView';
import { TailoredCvView } from './components/TailoredCvView';
import { ComparisonView } from './components/ComparisonView';
import { SAMPLE_PROFILES } from './data/samples';
import { DEFAULT_OPTIMIZATION_RESULT } from './data/defaultResult';
import { OptimizationResult, DesignTemplate, TailoredCv, CustomizationOptions } from './types';
import { loadCvDraft, clearCvDraft } from './utils/exportUtils';

export default function App() {
  const initialSample = SAMPLE_PROFILES[0];

  const [currentCv, setCurrentCv] = useState<string>(initialSample.currentCv);
  const [targetJd, setTargetJd] = useState<string>(initialSample.targetJd);
  const [designPreference, setDesignPreference] = useState<DesignTemplate>(initialSample.recommendedDesign);
  const [customNotes, setCustomNotes] = useState<string>('');

  const [customizationOptions, setCustomizationOptions] = useState<CustomizationOptions>({
    strictSingleColumn: true,
    xyzIntensity: 'Aggressive (High Impact Metrics)',
    prioritizeHardSkills: true,
    targetTone: 'Executive & Strategic',
    pageTarget: 'Dynamic Standard',
    expandAndDetailExperience: true,
  });

  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize result from saved draft or default pre-optimized profile
  const [result, setResult] = useState<OptimizationResult>(() => {
    const saved = loadCvDraft();
    if (saved && saved.cv) {
      return {
        ...DEFAULT_OPTIMIZATION_RESULT,
        tailoredCv: saved.cv,
      };
    }
    return DEFAULT_OPTIMIZATION_RESULT;
  });

  // Active view tab: Default to tailoredCv so the user immediately experiences the split-screen Resume.io workspace!
  const [activeTab, setActiveTab] = useState<'summary' | 'tailoredCv' | 'comparison' | 'inputs'>('tailoredCv');

  const handleSelectSample = (sampleId: string) => {
    const found = SAMPLE_PROFILES.find((s) => s.id === sampleId);
    if (found) {
      setCurrentCv(found.currentCv);
      setTargetJd(found.targetJd);
      setDesignPreference(found.recommendedDesign);
      setError(null);
      // If choosing another sample, update the inputs and let user run optimization or view
      setActiveTab('inputs');
    }
  };

  const handleReset = () => {
    clearCvDraft();
    setCurrentCv('');
    setTargetJd('');
    setCustomNotes('');
    setResult(DEFAULT_OPTIMIZATION_RESULT);
    setError(null);
    setActiveTab('inputs');
  };

  const handleOptimize = async () => {
    if (!currentCv.trim() || !targetJd.trim()) {
      setError('Please provide both the Candidate CV and Target Job Description.');
      return;
    }

    setIsOptimizing(true);
    setError(null);

    try {
      const response = await fetch('/api/optimize-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentCv,
          targetJd,
          designPreference,
          customNotes,
          customizationOptions,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data: OptimizationResult = await response.json();
      setResult(data);
      // Automatically navigate to the Tailored CV view
      setActiveTab('tailoredCv');
    } catch (err: any) {
      console.error('Optimization error:', err);
      setError(err.message || 'An unexpected error occurred during optimization. Please check your inputs and try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleUpdateCv = (updatedCv: TailoredCv) => {
    if (result) {
      setResult({
        ...result,
        tailoredCv: updatedCv,
      });
    }
  };

  const handlePrint = () => {
    if (activeTab !== 'tailoredCv') {
      setActiveTab('tailoredCv');
      setTimeout(() => {
        window.print();
      }, 300);
    } else {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col selection:bg-indigo-500/20 selection:text-indigo-900">
      {/* Top Header */}
      <Header
        onSelectSample={handleSelectSample}
        onReset={handleReset}
        result={result}
        onPrint={handlePrint}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3 no-print shadow-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-semibold text-rose-900">Optimization Notice: </strong>
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-600 hover:text-rose-800 font-bold ml-2 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Linear/Vercel-style Tab Bar */}
        <div className="mb-6 bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between no-print overflow-x-auto gap-2">
          <div className="flex items-center gap-1.5">
            <button
              id="tab-tailored-cv"
              onClick={() => setActiveTab('tailoredCv')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'tailoredCv'
                  ? 'bg-[#090d16] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Resume Designer & Canvas</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Split Mode
              </span>
            </button>

            <button
              id="tab-summary"
              onClick={() => setActiveTab('summary')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'summary'
                  ? 'bg-[#090d16] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ATS Diagnostics</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {result.atsScoreAfter}%
              </span>
            </button>

            <button
              id="tab-comparison"
              onClick={() => setActiveTab('comparison')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'comparison'
                  ? 'bg-[#090d16] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side Diff</span>
            </button>
          </div>

          <button
            onClick={() => setActiveTab('inputs')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap ${
              activeTab === 'inputs'
                ? 'bg-indigo-50 text-indigo-900 border-indigo-200 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
            <span>Upload / Modify JD</span>
          </button>
        </div>

        {/* View Switcher */}
        {activeTab === 'inputs' && (
          <InputPanel
            currentCv={currentCv}
            setCurrentCv={setCurrentCv}
            targetJd={targetJd}
            setTargetJd={setTargetJd}
            designPreference={designPreference}
            setDesignPreference={setDesignPreference}
            customizationOptions={customizationOptions}
            setCustomizationOptions={setCustomizationOptions}
            customNotes={customNotes}
            setCustomNotes={setCustomNotes}
            isOptimizing={isOptimizing}
            onOptimize={handleOptimize}
            onSelectSample={handleSelectSample}
            onOpenDirectEditor={() => setActiveTab('tailoredCv')}
          />
        )}

        {activeTab === 'summary' && (
          <AtsSummaryView
            summary={result.summary}
            atsScoreBefore={result.atsScoreBefore}
            atsScoreAfter={result.atsScoreAfter}
            onJumpToCv={() => setActiveTab('tailoredCv')}
          />
        )}

        {activeTab === 'tailoredCv' && (
          <TailoredCvView
            cv={result.tailoredCv}
            designPreference={designPreference}
            setDesignPreference={setDesignPreference}
            onUpdateCv={handleUpdateCv}
            onPrint={handlePrint}
          />
        )}

        {activeTab === 'comparison' && (
          <ComparisonView
            originalCv={currentCv}
            result={result}
            onSwitchToTailored={() => setActiveTab('tailoredCv')}
          />
        )}
      </main>

      {/* Modern Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-5 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-700">ATS Resume Optimizer & Designer</span>
            <span className="text-slate-400">•</span>
            <span>Fortune 500 Screening Standards</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Google X-Y-Z Impact Formulation • Workday & Taleo Single-Column Compliant • Anti-Hallucination Protocol
          </div>
        </div>
      </footer>
    </div>
  );
}
