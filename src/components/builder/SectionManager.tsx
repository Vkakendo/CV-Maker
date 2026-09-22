import React, { useState } from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  GripVertical, 
  X, 
  Check, 
  RotateCcw,
  Sparkles,
  Layers,
  Edit2
} from 'lucide-react';
import { SectionConfig, SectionType } from '../../types';

interface SectionManagerProps {
  sections: SectionConfig[];
  onUpdateSections: (newSections: SectionConfig[]) => void;
  onClose: () => void;
}

export const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: 'header', title: 'Personal Information', enabled: true },
  { id: 'summary', title: 'Executive Summary', enabled: true },
  { id: 'coreCompetencies', title: 'Core Competencies', enabled: true },
  { id: 'experience', title: 'Professional Experience', enabled: true },
  { id: 'projects', title: 'Key Projects & Initiatives', enabled: true },
  { id: 'education', title: 'Education', enabled: true },
  { id: 'skills', title: 'Skills & Technologies', enabled: true },
  { id: 'certifications', title: 'Certifications & Licenses', enabled: true },
  { id: 'languages', title: 'Languages', enabled: true },
  { id: 'references', title: 'References', enabled: true },
];

export const SectionManager: React.FC<SectionManagerProps> = ({
  sections,
  onUpdateSections,
  onClose,
}) => {
  const [editingId, setEditingId] = useState<SectionType | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === sections.length - 1)
    ) return;

    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;
    onUpdateSections(newSections);
  };

  const toggleVisibility = (id: SectionType) => {
    // Keep header always enabled for contact info integrity
    if (id === 'header') return;
    const newSections = sections.map(sec => 
      sec.id === id ? { ...sec, enabled: !sec.enabled } : sec
    );
    onUpdateSections(newSections);
  };

  const startRename = (sec: SectionConfig) => {
    setEditingId(sec.id);
    setEditTitle(sec.title);
  };

  const saveRename = () => {
    if (!editingId || !editTitle.trim()) {
      setEditingId(null);
      return;
    }
    const newSections = sections.map(sec => 
      sec.id === editingId ? { ...sec, title: editTitle.trim() } : sec
    );
    onUpdateSections(newSections);
    setEditingId(null);
  };

  const handleResetOrder = () => {
    onUpdateSections(DEFAULT_SECTIONS);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs no-print">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Resume Sections & Layout Order
              </h3>
              <p className="text-xs text-slate-500">
                Reorder, rename, or toggle visibility of document blocks.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section List */}
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {sections.map((sec, idx) => {
            const isEditing = editingId === sec.id;
            const isHeader = sec.id === 'header';

            return (
              <div
                key={sec.id}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all text-xs ${
                  sec.enabled 
                    ? 'bg-slate-50/80 border-slate-200 text-slate-900' 
                    : 'bg-slate-100/50 border-slate-200/60 text-slate-400 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0 mr-2">
                  <span className="font-mono text-[10px] text-slate-400 w-4">{idx + 1}.</span>
                  {isEditing ? (
                    <div className="flex items-center gap-1.5 flex-1">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && saveRename()}
                        autoFocus
                        className="flex-1 px-2.5 py-1 text-xs border border-indigo-300 rounded-lg bg-white font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button
                        onClick={saveRename}
                        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-bold text-slate-800 truncate">
                        {sec.title}
                      </span>
                      <button
                        onClick={() => startRename(sec)}
                        className="text-slate-400 hover:text-slate-600 p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-slate-200/60"
                        title="Rename section"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Move Up */}
                  <button
                    onClick={() => moveSection(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="Move section up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Down */}
                  <button
                    onClick={() => moveSection(idx, 'down')}
                    disabled={idx === sections.length - 1}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="Move section down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Toggle Visibility */}
                  {!isHeader && (
                    <button
                      onClick={() => toggleVisibility(sec.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        sec.enabled 
                          ? 'text-indigo-600 hover:bg-indigo-50' 
                          : 'text-slate-400 hover:bg-slate-200/60'
                      }`}
                      title={sec.enabled ? 'Hide section from CV' : 'Show section in CV'}
                    >
                      {sec.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            onClick={handleResetOrder}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Standard Order</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#090d16] text-white hover:bg-slate-800 transition-colors shadow-xs active:scale-95"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
