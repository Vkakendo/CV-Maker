import React from 'react';
import { 
  Sparkles, 
  Printer, 
  RefreshCw, 
  Briefcase, 
  ShieldCheck, 
  Zap, 
  FileCheck,
  ChevronRight
} from 'lucide-react';
import { SAMPLE_PROFILES } from '../data/samples';
import { OptimizationResult } from '../types';

interface HeaderProps {
  onSelectSample: (sampleId: string) => void;
  onReset: () => void;
  result: OptimizationResult | null;
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectSample,
  onReset,
  result,
  onPrint,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#090d16] text-slate-100 border-b border-slate-800/80 shadow-md no-print backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          
          {/* Logo & Product Identity */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 shadow-md shadow-indigo-500/20 text-white font-bold text-base">
              <Sparkles className="w-4.5 h-4.5 text-amber-300" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#090d16]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                  <span>ATS Resume Optimizer</span>
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Pro
                  </span>
                </h1>
                
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Workday & Taleo Compliant
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal flex items-center gap-2">
                <span>Google X-Y-Z Impact Formula</span>
                <span className="text-slate-600">•</span>
                <span>Contextual Keyword Weaver</span>
                <span className="text-slate-600">•</span>
                <span>Zero False Data Guarantee</span>
              </p>
            </div>
          </div>

          {/* Quick Pre-loaded Profiles & Actions */}
          <div className="flex items-center flex-wrap gap-2.5">
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 font-medium px-2 py-0.5 flex items-center gap-1 text-[11px]">
                <Briefcase className="w-3 h-3 text-indigo-400" /> Demo Roles:
              </span>
              {SAMPLE_PROFILES.map((sample) => (
                <button
                  key={sample.id}
                  id={`sample-btn-${sample.id}`}
                  onClick={() => onSelectSample(sample.id)}
                  title={sample.subtitle}
                  className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all font-medium text-[11px] border border-transparent hover:border-slate-700 active:scale-95"
                >
                  {sample.title.split(' ')[0]}
                </button>
              ))}
            </div>

            {result && (
              <div className="flex items-center gap-2">
                <button
                  id="header-print-btn"
                  onClick={onPrint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm shadow-indigo-600/20 active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Export PDF</span>
                </button>

                <button
                  id="header-reset-btn"
                  onClick={onReset}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors border border-slate-800"
                  title="Start Over with New Inputs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
