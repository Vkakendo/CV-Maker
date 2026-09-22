import React, { useState } from 'react';
import { 
  CheckCircle2, 
  TrendingUp, 
  Tag, 
  ArrowRight, 
  AlertTriangle, 
  ShieldCheck, 
  FileCheck, 
  Award,
  Zap,
  Filter,
  Layers,
  Sparkles,
  Search,
  Check
} from 'lucide-react';
import { AtsSummary } from '../types';

interface AtsSummaryViewProps {
  summary: AtsSummary;
  atsScoreBefore: number;
  atsScoreAfter: number;
  onJumpToCv: () => void;
}

export const AtsSummaryView: React.FC<AtsSummaryViewProps> = ({
  summary,
  atsScoreBefore,
  atsScoreAfter,
  onJumpToCv,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeXyzTab, setActiveXyzTab] = useState<number>(0);

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(summary.matchedKeywords.map((k) => k.category)))];

  const filteredKeywords = summary.matchedKeywords.filter((k) => {
    const matchesCategory = selectedCategory === 'All' || k.category === selectedCategory;
    const matchesSearch = k.keyword.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const scoreDelta = atsScoreAfter - atsScoreBefore;

  return (
    <div className="space-y-6">
      {/* Header & Score Elevation Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>ATS Specialist Audit & Diagnostic</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              1. ATS Optimization & Keyword Diagnostic
            </h2>
            <p className="text-xs text-slate-500 max-w-xl mt-1 leading-relaxed">
              Algorithmic breakdown of keyword alignment, Google X-Y-Z metric elevations, and single-column ATS parser compliance.
            </p>
          </div>

          {/* ATS Score Delta Card */}
          <div className="flex items-center gap-4 bg-[#090d16] text-white p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-md">
            {/* Before Score */}
            <div className="text-center px-1">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Initial Match
              </span>
              <span className="text-2xl font-black text-slate-400 font-mono">
                {atsScoreBefore}%
              </span>
            </div>

            {/* Arrow & Delta */}
            <div className="flex flex-col items-center">
              <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1 border border-emerald-500/30">
                <TrendingUp className="w-3 h-3" />
                +{scoreDelta}%
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 my-1" />
            </div>

            {/* After Score */}
            <div className="text-center px-1">
              <span className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                Optimized Score
              </span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {atsScoreAfter}%
              </span>
            </div>

            {/* Jump Button */}
            <button
              onClick={onJumpToCv}
              className="ml-2 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shrink-0 shadow-sm shadow-indigo-600/30 flex items-center gap-1.5 active:scale-95"
            >
              <span>View Resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Executive Overview */}
        <div className="mt-5 bg-gradient-to-r from-indigo-50/70 via-indigo-50/40 to-slate-50 border border-indigo-100 rounded-2xl p-4 sm:p-5 text-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 mb-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Executive Recruiter Assessment & Strategy:</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
            {summary.executiveOverview}
          </p>
        </div>

        {/* Key Changes Checklist */}
        <div className="mt-6 space-y-2.5">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-indigo-600" />
            Strategic Adjustments Applied:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {summary.keyChanges.map((change, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 text-xs text-slate-700"
              >
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span className="leading-relaxed font-medium">{change}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Matched Keywords Matrix */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">
                ATS Keyword Alignment Matrix
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Extracted hard skills, tools, and methodologies woven contextually into achievements.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex items-center flex-wrap gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter keywords..."
                className="pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#090d16] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Keyword Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
          {filteredKeywords.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/40 flex flex-col justify-between hover:border-slate-300 hover:bg-white transition-all shadow-2xs"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold text-xs text-slate-900 font-mono">
                  {item.keyword}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    item.relevance === 'Critical'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : item.relevance === 'High'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                >
                  {item.relevance}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2.5 pt-2 border-t border-slate-200/60">
                <span className="truncate">{item.category}</span>
                <span
                  className={`font-semibold ${
                    item.status === 'Newly Integrated'
                      ? 'text-emerald-600'
                      : 'text-slate-600'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Google X-Y-Z Impact Transformations */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" />
              <h3 className="text-base font-bold text-slate-900">
                Google X-Y-Z Impact Transformations
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              "Accomplished [X] as measured by [Y] by doing [Z]" with strong action verbs.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {summary.xyzTransforms.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveXyzTab(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  activeXyzTab === idx
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Sample #{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {summary.xyzTransforms[activeXyzTab] && (
          <div className="space-y-4 pt-1">
            {/* Split before vs after */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original Bullet */}
              <div className="p-4 rounded-2xl border border-rose-200/90 bg-rose-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">
                    Original Bullet (Unquantified)
                  </span>
                  <span className="text-[10px] text-rose-600 font-medium">Passive Voice</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-mono">
                  "{summary.xyzTransforms[activeXyzTab].original}"
                </p>
              </div>

              {/* Optimized XYZ Bullet */}
              <div className="p-4 rounded-2xl border border-emerald-300 bg-emerald-50/40 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    Optimized XYZ Bullet (Google Formula)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-200/80 text-emerald-900">
                    High ATS Weight
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-900 leading-relaxed font-mono">
                  "{summary.xyzTransforms[activeXyzTab].optimized}"
                </p>
              </div>
            </div>

            {/* Formula Decomposition breakdown */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5">
              <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-3">
                Formula Anatomy Breakdown:
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">
                    Action Verb
                  </span>
                  <span className="font-bold text-slate-900 font-mono">
                    {summary.xyzTransforms[activeXyzTab].actionVerb}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="block text-[10px] font-bold text-indigo-500 uppercase">
                    [X] Achieved Goal
                  </span>
                  <span className="font-medium text-slate-800">
                    {summary.xyzTransforms[activeXyzTab].achievedX}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="block text-[10px] font-bold text-emerald-600 uppercase">
                    [Y] Measured Impact
                  </span>
                  <span className="font-medium text-slate-800">
                    {summary.xyzTransforms[activeXyzTab].measuredByY}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="block text-[10px] font-bold text-purple-600 uppercase">
                    [Z] Method / Tool Used
                  </span>
                  <span className="font-medium text-slate-800">
                    {summary.xyzTransforms[activeXyzTab].byDoingZ}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ATS Parser Architecture & Compliance Check */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">
            ATS Parser Architecture & Compliance Check
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {summary.atsComplianceChecks.map((audit, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-slate-900">
                    {audit.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      audit.status === 'Pass'
                        ? 'bg-emerald-100 text-emerald-800'
                        : audit.status === 'Optimized'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {audit.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {audit.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Missing Keywords / Honest Gaps */}
      {summary.missingGaps && summary.missingGaps.length > 0 && (
        <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-6 sm:p-7 shadow-lg space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white">
              Integrity Protocol: Unmatched JD Requirements (Interview Prep)
            </h4>
          </div>
          <p className="text-xs text-slate-400">
            These skills appeared in the JD but were absent from your original document. Per strict anti-fabrication standards, these were not added. Review for interview talking points:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {summary.missingGaps.map((gap, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs"
              >
                <div className="font-semibold text-amber-300 font-mono mb-1">
                  • {gap.keyword}
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {gap.suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
