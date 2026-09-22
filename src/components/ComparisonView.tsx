import React from 'react';
import { Columns, ArrowRight, CheckCircle2, TrendingUp, Sparkles, FileText, Check } from 'lucide-react';
import { OptimizationResult } from '../types';

interface ComparisonViewProps {
  originalCv: string;
  result: OptimizationResult;
  onSwitchToTailored: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  originalCv,
  result,
  onSwitchToTailored,
}) => {
  const scoreDelta = result.atsScoreAfter - result.atsScoreBefore;

  return (
    <div className="space-y-6">
      {/* Comparison Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 mb-2">
            <Columns className="w-3.5 h-3.5 text-indigo-600" />
            <span>Side-by-Side ATS Evolution Diff</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Document Transformation & Impact Comparison
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Compare candidate's original source submission against the keyword-aligned, Google X-Y-Z elevated output.
          </p>
        </div>

        {/* Score Delta Badge */}
        <div className="flex items-center gap-4 bg-[#090d16] text-white px-5 py-3.5 rounded-2xl border border-slate-800 shadow-md shrink-0">
          <div className="text-xs text-center">
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Initial</span>
            <span className="font-bold text-slate-400 font-mono text-base">{result.atsScoreBefore}%</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">
              +{scoreDelta}%
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 my-0.5" />
          </div>
          <div className="text-xs text-center">
            <span className="text-emerald-400 block text-[10px] uppercase font-bold tracking-wider">Optimized</span>
            <span className="font-bold text-emerald-400 font-mono text-base flex items-center gap-1">
              {result.atsScoreAfter}%
            </span>
          </div>
        </div>
      </div>

      {/* Two Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original Candidate CV */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Original Submission (Source Draft)
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Raw Text Flow
            </span>
          </div>
          <pre className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[750px] flex-1 select-text">
            {originalCv}
          </pre>
        </div>

        {/* Tailored CV Plain Text */}
        <div className="bg-white rounded-3xl border border-indigo-200 p-5 sm:p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-indigo-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
              <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                Tailored ATS Version (Google X-Y-Z Formulated)
              </span>
            </div>
            <button
              onClick={onSwitchToTailored}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              <span>View Formatted Sheet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <pre className="p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100 text-xs font-mono text-slate-900 whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[750px] flex-1 select-text">
            {result.tailoredCv.formattedText}
          </pre>
        </div>
      </div>
    </div>
  );
};
