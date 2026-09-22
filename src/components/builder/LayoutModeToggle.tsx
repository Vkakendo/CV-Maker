import React from 'react';
import { ShieldCheck, Columns, Layout, Check, Sparkles } from 'lucide-react';
import { DesignTemplate } from '../../types';

export type ActiveLayoutMode = 'strict-ats' | 'two-column-executive';

interface LayoutModeToggleProps {
  currentTemplate: DesignTemplate;
  onSelectLayoutMode: (mode: ActiveLayoutMode) => void;
  className?: string;
}

export const LayoutModeToggle: React.FC<LayoutModeToggleProps> = ({
  currentTemplate,
  onSelectLayoutMode,
  className = '',
}) => {
  const isTwoColumn = currentTemplate === 'Timeline Sidebar (Executive Modern)';
  const activeMode: ActiveLayoutMode = isTwoColumn ? 'two-column-executive' : 'strict-ats';

  return (
    <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md ${className}`}>
      {/* Mode 1: Strict ATS Single-Column */}
      <button
        type="button"
        id="layout-mode-strict-ats"
        onClick={() => onSelectLayoutMode('strict-ats')}
        className={`flex-1 flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer ${
          activeMode === 'strict-ats'
            ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-white/20'
            : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`p-1.5 rounded-lg shrink-0 ${activeMode === 'strict-ats' ? 'bg-indigo-500/50 text-white' : 'bg-slate-800 text-slate-400'}`}>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold tracking-tight">Strict ATS Mode</span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-sm uppercase tracking-wider ${
                activeMode === 'strict-ats' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                Single Column
              </span>
            </div>
            <p className={`text-[11px] truncate mt-0.5 ${activeMode === 'strict-ats' ? 'text-indigo-100' : 'text-slate-400'}`}>
              Optimized for Workday, Taleo & Greenhouse parsers
            </p>
          </div>
        </div>
        {activeMode === 'strict-ats' && (
          <div className="shrink-0 w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
            <Check className="w-3 h-3 text-white stroke-[2.5]" />
          </div>
        )}
      </button>

      {/* Mode 2: 2-Column Executive (Timeline Sidebar) */}
      <button
        type="button"
        id="layout-mode-two-column-executive"
        onClick={() => onSelectLayoutMode('two-column-executive')}
        className={`flex-1 flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer ${
          activeMode === 'two-column-executive'
            ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-white/20'
            : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`p-1.5 rounded-lg shrink-0 ${activeMode === 'two-column-executive' ? 'bg-emerald-500/50 text-white' : 'bg-slate-800 text-slate-400'}`}>
            <Layout className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold tracking-tight">2-Column Executive</span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-sm uppercase tracking-wider ${
                activeMode === 'two-column-executive' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                Timeline & Sidebar
              </span>
            </div>
            <p className={`text-[11px] truncate mt-0.5 ${activeMode === 'two-column-executive' ? 'text-emerald-100' : 'text-slate-400'}`}>
              32% Sidebar + 68% Main Timeline for human recruiters
            </p>
          </div>
        </div>
        {activeMode === 'two-column-executive' && (
          <div className="shrink-0 w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
            <Check className="w-3 h-3 text-white stroke-[2.5]" />
          </div>
        )}
      </button>
    </div>
  );
};
