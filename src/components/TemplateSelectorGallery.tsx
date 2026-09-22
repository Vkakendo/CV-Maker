import React from 'react';
import { 
  Check, 
  Sparkles, 
  Briefcase, 
  Terminal, 
  Building2, 
  Cpu, 
  ShieldCheck,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { DesignTemplate } from '../types';

interface TemplateOption {
  id: DesignTemplate;
  name: string;
  badge: string;
  badgeColor: string;
  roleTarget: string;
  parseRate: string;
  description: string;
  keyFeatures: string[];
}

const TEMPLATES: TemplateOption[] = [
  {
    id: 'Timeline Sidebar (Executive Modern)',
    name: 'Timeline Sidebar',
    badge: 'Executive Modern',
    badgeColor: 'bg-blue-500/10 text-blue-700 border-blue-200/80',
    roleTarget: 'C-Suite, VP, Director, Staff Architect, Lead',
    parseRate: '99.7% ATS Score',
    description: 'Two-column layout featuring a tinted 32% sidebar for Contact, Skills, Languages, & References, plus a continuous vertical timeline with node markers.',
    keyFeatures: ['32% Tinted Left Sidebar', 'Continuous Vertical Timeline Track', 'Section Header Node Badges', 'Pixel-Perfect Print Proportions'],
  },
  {
    id: 'Modern Executive',
    name: 'Modern Executive',
    badge: 'Leadership & Product',
    badgeColor: 'bg-indigo-500/10 text-indigo-700 border-indigo-200/80',
    roleTarget: 'VP, Director, Staff PM, Engineering Lead',
    parseRate: '99.4% ATS Score',
    description: 'Structured layout featuring an executive title header, core competency matrix, and quarterly metric focus.',
    keyFeatures: ['Executive Headline Block', 'Leadership Competencies Grid', 'Quarterly Metric Emphasis', 'Taleo Single-Column Compliant'],
  },
  {
    id: 'Minimalist Technical',
    name: 'Minimalist Technical',
    badge: 'Software & Data Science',
    badgeColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-200/80',
    roleTarget: 'Distributed Systems, DevOps, Full-Stack, AI Engineers',
    parseRate: '100% Parser Match',
    description: 'High-density, single-column parser-friendly layout built specifically for technical recruiters and screening bots.',
    keyFeatures: ['Monospace Tech Stack Categorization', 'Maximum Information Density', 'Zero Multi-Column Warnings', 'Git/Cloud Project Accents'],
  },
  {
    id: 'Clean Corporate',
    name: 'Clean Corporate / Ivy',
    badge: 'Finance & Consulting',
    badgeColor: 'bg-amber-500/10 text-amber-800 border-amber-200/80',
    roleTarget: 'Investment Banking, Management Consulting, Big 4, Legal',
    parseRate: '99.8% Parser Match',
    description: 'Conservative margins, classical hierarchy, and strict chronological sequencing aligned with Wall Street standards.',
    keyFeatures: ['Classic Wall Street Spacing', 'Prominent Honors & Education', 'Strict Chronological Ladder', 'Zero Design Fluff'],
  },
  {
    id: 'Preserve Original Structure',
    name: 'Preserve Source DNA',
    badge: 'Adaptive Intelligence',
    badgeColor: 'bg-purple-500/10 text-purple-700 border-purple-200/80',
    roleTarget: 'Custom layouts, existing portfolios, specialized resumes',
    parseRate: '98.9% Parser Match',
    description: 'Dynamically adapts to the aesthetic and structural DNA of your uploaded CV while elevating bullets with Google X-Y-Z.',
    keyFeatures: ['Preserves Your Section Order', 'Respects Existing Title Flow', 'Targeted Keyword Injection', 'Calculated Metric Lift'],
  },
];

interface TemplateSelectorGalleryProps {
  selected: DesignTemplate;
  onSelect: (template: DesignTemplate) => void;
}

export const TemplateSelectorGallery: React.FC<TemplateSelectorGalleryProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        <div>
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>ATS Design Format Gallery</span>
          </label>
          <p className="text-[11px] text-slate-500">
            Select an ATS-optimized architectural template tailored to your target industry.
          </p>
        </div>

        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full w-fit">
          All formats strictly single-column parser safe
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {TEMPLATES.map((tmpl) => {
          const isSelected = selected === tmpl.id;
          return (
            <div
              key={tmpl.id}
              onClick={() => onSelect(tmpl.id)}
              className={`relative cursor-pointer rounded-2xl p-4 transition-all duration-200 border-2 flex flex-col justify-between group ${
                isSelected
                  ? 'bg-gradient-to-b from-indigo-50/70 to-white border-indigo-600 shadow-md ring-4 ring-indigo-500/10 scale-[1.01]'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs hover:scale-[1.005]'
              }`}
            >
              {/* Active check pill */}
              {isSelected && (
                <div className="absolute -top-2.5 right-3 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3]" />
                  Active
                </div>
              )}

              <div>
                {/* Miniature Graphical Wireframe Preview */}
                <div className="mb-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 font-mono text-[9px] text-slate-400 space-y-1.5 pointer-events-none select-none group-hover:border-slate-300 transition-colors h-24 flex flex-col justify-center">
                  {tmpl.id === 'Timeline Sidebar (Executive Modern)' && (
                    <div className="flex h-full w-full gap-1.5">
                      {/* 32% Left Sidebar wireframe */}
                      <div className="w-[34%] bg-slate-200/90 rounded-xs p-1 space-y-1 flex flex-col justify-between">
                        <div className="space-y-0.5">
                          <div className="h-1.5 w-full bg-blue-600 rounded-xs" />
                          <div className="h-1 w-4/5 bg-slate-400 rounded-xs" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="h-1 w-full bg-slate-400 rounded-xs" />
                          <div className="h-1 w-3/4 bg-slate-400 rounded-xs" />
                        </div>
                        <div className="h-1 w-full bg-blue-300 rounded-xs" />
                      </div>
                      {/* 68% Main pane with vertical timeline track wireframe */}
                      <div className="w-[66%] pl-1 border-l-2 border-blue-400 relative space-y-1.5">
                        <div className="space-y-0.5">
                          <div className="h-1.5 w-3/4 bg-slate-800 rounded-xs" />
                          <div className="h-1 w-1/2 bg-blue-600 rounded-xs" />
                        </div>
                        <div className="relative pl-1.5 space-y-0.5">
                          <div className="absolute -left-[7px] top-0.5 w-2 h-2 rounded-full bg-blue-600" />
                          <div className="h-1 w-full bg-slate-300 rounded-xs" />
                          <div className="h-1 w-4/5 bg-slate-200 rounded-xs" />
                        </div>
                        <div className="relative pl-1.5 space-y-0.5">
                          <div className="absolute -left-[7px] top-0.5 w-2 h-2 rounded-full bg-blue-400" />
                          <div className="h-1 w-5/6 bg-slate-300 rounded-xs" />
                        </div>
                      </div>
                    </div>
                  )}

                  {tmpl.id === 'Modern Executive' && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="h-2 w-1/2 bg-indigo-600 rounded-xs" />
                        <div className="h-1.5 w-1/4 bg-slate-300 rounded-xs" />
                      </div>
                      <div className="h-1 w-3/4 bg-slate-300 rounded-xs" />
                      <div className="grid grid-cols-3 gap-1 pt-0.5">
                        <div className="h-2.5 bg-indigo-100 rounded-xs text-[7px] text-indigo-700 flex items-center px-1">Scale</div>
                        <div className="h-2.5 bg-indigo-100 rounded-xs text-[7px] text-indigo-700 flex items-center px-1">P&L</div>
                        <div className="h-2.5 bg-indigo-100 rounded-xs text-[7px] text-indigo-700 flex items-center px-1">Strategy</div>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-xs mt-1" />
                      <div className="h-1.5 w-5/6 bg-slate-200 rounded-xs" />
                    </div>
                  )}

                  {tmpl.id === 'Minimalist Technical' && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center pb-0.5 border-b border-slate-200">
                        <div className="h-2 w-2/5 bg-emerald-600 rounded-xs" />
                        <div className="h-1 w-1/3 bg-slate-300 rounded-xs" />
                      </div>
                      <div className="flex gap-1">
                        <div className="h-2.5 px-1 bg-emerald-50 text-emerald-800 text-[7px] rounded-xs font-mono flex items-center">Go/K8s</div>
                        <div className="h-2.5 px-1 bg-emerald-50 text-emerald-800 text-[7px] rounded-xs font-mono flex items-center">Rust</div>
                        <div className="h-2.5 px-1 bg-emerald-50 text-emerald-800 text-[7px] rounded-xs font-mono flex items-center">AWS</div>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-xs" />
                      <div className="h-1.5 w-11/12 bg-slate-200 rounded-xs" />
                      <div className="h-1.5 w-4/5 bg-slate-200 rounded-xs" />
                    </div>
                  )}

                  {tmpl.id === 'Clean Corporate' && (
                    <div className="space-y-1.5 text-center">
                      <div className="mx-auto h-2 w-2/3 bg-slate-800 rounded-xs" />
                      <div className="mx-auto h-1 w-1/2 bg-slate-300 rounded-xs mb-1" />
                      <div className="border-t border-slate-300 pt-1 text-left space-y-1">
                        <div className="flex justify-between">
                          <div className="h-1.5 w-2/5 bg-slate-700 rounded-xs" />
                          <div className="h-1.5 w-1/4 bg-slate-400 rounded-xs" />
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 rounded-xs" />
                        <div className="h-1.5 w-4/5 bg-slate-200 rounded-xs" />
                      </div>
                    </div>
                  )}

                  {tmpl.id === 'Preserve Original Structure' && (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <div className="h-2 w-1/2 bg-purple-700 rounded-xs" />
                      </div>
                      <div className="h-1.5 w-3/4 bg-slate-300 rounded-xs" />
                      <div className="h-1.5 w-full bg-slate-200 rounded-xs" />
                      <div className="h-1.5 w-5/6 bg-slate-200 rounded-xs" />
                      <div className="h-2 w-2/3 bg-purple-100 rounded-xs" />
                    </div>
                  )}
                </div>

                {/* Header Info */}
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {tmpl.name}
                  </h4>
                  <span className="text-[10px] font-mono font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                    {tmpl.parseRate}
                  </span>
                </div>

                <div className="mb-2">
                  <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md border ${tmpl.badgeColor}`}>
                    {tmpl.badge}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                  {tmpl.description}
                </p>
              </div>

              {/* Feature bullets */}
              <div className="pt-2.5 border-t border-slate-100 space-y-1 text-[10px] text-slate-500">
                {tmpl.keyFeatures.slice(0, 2).map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-slate-400" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
