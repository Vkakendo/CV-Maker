import React from 'react';
import { 
  Palette, 
  Type, 
  MoveVertical, 
  Maximize2, 
  Sparkles,
  Sliders,
  Check
} from 'lucide-react';
import { DesignThemeConfig, DesignTemplate, FontFamilyOption, FontSizeOption, SpacingOption, MarginOption } from '../../types';

interface DesignCustomizerBarProps {
  themeConfig: DesignThemeConfig;
  onChangeTheme: (config: DesignThemeConfig) => void;
  onOpenSectionManager?: () => void;
}

const ACCENT_PALETTE = [
  { name: 'Obsidian', hex: '#0f172a', label: 'Classic Slate' },
  { name: 'Electric Indigo', hex: '#4f46e5', label: 'Indigo' },
  { name: 'Emerald', hex: '#059669', label: 'Emerald' },
  { name: 'Navy', hex: '#1e3a8a', label: 'Royal Navy' },
  { name: 'Crimson', hex: '#dc2626', label: 'Crimson' },
  { name: 'Warm Amber', hex: '#d97706', label: 'Amber' },
];

const FONTS: { id: FontFamilyOption; label: string; preview: string }[] = [
  { id: 'Calibri', label: 'Calibri (Default Executive)', preview: 'font-calibri' },
  { id: 'Plus Jakarta Sans', label: 'Jakarta Sans', preview: 'font-sans' },
  { id: 'Inter', label: 'Inter', preview: 'font-sans' },
  { id: 'Merriweather', label: 'Merriweather (Serif)', preview: 'font-serif' },
  { id: 'JetBrains Mono', label: 'JetBrains Mono', preview: 'font-mono' },
  { id: 'Roboto', label: 'Roboto', preview: 'font-sans' },
];

export const DesignCustomizerBar: React.FC<DesignCustomizerBarProps> = ({
  themeConfig,
  onChangeTheme,
  onOpenSectionManager,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700 no-print">
      {/* Left controls: Template & Typography */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Template Style */}
        <div className="flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-indigo-600" />
          <span className="font-semibold text-slate-500 hidden sm:inline">Template:</span>
          <select
            value={themeConfig.template}
            onChange={(e) => onChangeTheme({ ...themeConfig, template: e.target.value as DesignTemplate })}
            className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
          >
            <optgroup label="2-Column Executive Mode">
              <option value="Timeline Sidebar (Executive Modern)">Timeline Sidebar (Executive Modern)</option>
            </optgroup>
            <optgroup label="Strict ATS Single-Column Mode">
              <option value="Modern Executive">Modern Executive (Leadership)</option>
              <option value="Minimalist Technical">Minimalist Technical (Engineering)</option>
              <option value="Clean Corporate">Clean Corporate / Ivy (Finance & Law)</option>
              <option value="Preserve Original Structure">Preserve Source DNA</option>
            </optgroup>
          </select>
        </div>

        {/* Font Family Selector */}
        <div className="flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-500 hidden sm:inline">Font:</span>
          <select
            value={themeConfig.fontFamily}
            onChange={(e) => onChangeTheme({ ...themeConfig, fontFamily: e.target.value as FontFamilyOption })}
            className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
          >
            {FONTS.map(f => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
        </div>

        {/* Font Size Selector */}
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-500 hidden md:inline">Size:</span>
          <select
            value={themeConfig.fontSize}
            onChange={(e) => onChangeTheme({ ...themeConfig, fontSize: e.target.value as FontSizeOption })}
            className="border border-slate-200 rounded-lg px-2 py-1.5 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
          >
            <option value="Compact (10pt)">Compact (10pt)</option>
            <option value="Standard (10.5pt)">Standard (10.5pt)</option>
            <option value="Large (11pt)">Large (11pt)</option>
          </select>
        </div>

        {/* Spacing & Margins */}
        <div className="hidden lg:flex items-center gap-1.5">
          <MoveVertical className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-500">Spacing:</span>
          <select
            value={themeConfig.spacing}
            onChange={(e) => onChangeTheme({ ...themeConfig, spacing: e.target.value as SpacingOption })}
            className="border border-slate-200 rounded-lg px-2 py-1.5 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
          >
            <option value="Compact">Compact</option>
            <option value="Standard">Standard</option>
            <option value="Relaxed">Relaxed</option>
          </select>
        </div>
      </div>

      {/* Right controls: Color Swatches & Section Manager Button */}
      <div className="flex items-center gap-3">
        {/* Accent Color Swatches */}
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-500 text-[11px] hidden sm:inline">Accent:</span>
          <div className="flex items-center gap-1">
            {ACCENT_PALETTE.map((c) => (
              <button
                key={c.hex}
                onClick={() => onChangeTheme({ ...themeConfig, accentColor: c.hex })}
                style={{ backgroundColor: c.hex }}
                className={`w-5 h-5 rounded-full transition-transform flex items-center justify-center ${
                  themeConfig.accentColor === c.hex 
                    ? 'ring-2 ring-indigo-500 ring-offset-2 scale-110' 
                    : 'hover:scale-105 opacity-90 hover:opacity-100'
                }`}
                title={c.name}
              >
                {themeConfig.accentColor === c.hex && (
                  <Check className="w-3 h-3 text-white drop-shadow-xs" />
                )}
              </button>
            ))}
            {/* Custom Color Input */}
            <input
              type="color"
              value={themeConfig.accentColor}
              onChange={(e) => onChangeTheme({ ...themeConfig, accentColor: e.target.value })}
              className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent"
              title="Custom Accent Color"
            />
          </div>
        </div>

        {/* Section Manager Button */}
        {onOpenSectionManager && (
          <button
            onClick={onOpenSectionManager}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200/80 active:scale-95"
            title="Reorder, hide, or rename sections"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Reorder Sections</span>
          </button>
        )}
      </div>
    </div>
  );
};
