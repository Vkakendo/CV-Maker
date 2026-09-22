import React, { useState } from 'react';
import { 
  User, 
  FileText, 
  Briefcase, 
  FolderGit2, 
  GraduationCap, 
  Wrench, 
  Award, 
  Globe,
  Users,
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Trash2, 
  Sparkles, 
  Check, 
  Layers, 
  ArrowUp, 
  ArrowDown, 
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { 
  TailoredCv, 
  ExperienceItem, 
  EducationItem, 
  SkillCategory, 
  CertificationItem, 
  ProjectItem, 
  LanguageItem,
  ReferenceItem,
  SectionConfig, 
  SectionType 
} from '../../types';

interface ResumeFormEditorProps {
  cv: TailoredCv;
  onChangeCv: (updatedCv: TailoredCv) => void;
  sections: SectionConfig[];
  onOpenSectionManager: () => void;
}

export const ResumeFormEditor: React.FC<ResumeFormEditorProps> = ({
  cv,
  onChangeCv,
  sections,
  onOpenSectionManager,
}) => {
  // Active expanded section accordion
  const [activeAccordion, setActiveAccordion] = useState<SectionType | null>('header');
  const [newCompetency, setNewCompetency] = useState('');

  const toggleAccordion = (secId: SectionType) => {
    setActiveAccordion(activeAccordion === secId ? null : secId);
  };

  // --- Header Handlers ---
  const updateHeader = (field: keyof typeof cv.header, value: string) => {
    onChangeCv({
      ...cv,
      header: { ...cv.header, [field]: value }
    });
  };

  // --- Summary Handlers ---
  const updateSummary = (val: string) => {
    onChangeCv({ ...cv, summary: val });
  };

  // --- Core Competencies Handlers ---
  const addCompetency = () => {
    if (!newCompetency.trim()) return;
    const comps = cv.coreCompetencies || [];
    if (!comps.includes(newCompetency.trim())) {
      onChangeCv({ ...cv, coreCompetencies: [...comps, newCompetency.trim()] });
    }
    setNewCompetency('');
  };

  const removeCompetency = (idx: number) => {
    const comps = [...(cv.coreCompetencies || [])];
    comps.splice(idx, 1);
    onChangeCv({ ...cv, coreCompetencies: comps });
  };

  // --- Work Experience Handlers ---
  const updateExperienceField = (index: number, field: keyof ExperienceItem, value: any) => {
    const exps = [...cv.experience];
    exps[index] = { ...exps[index], [field]: value };
    onChangeCv({ ...cv, experience: exps });
  };

  const addExperienceBullet = (expIndex: number) => {
    const exps = [...cv.experience];
    exps[expIndex].bullets.push('Achieved [Goal/Metric], measured by [Key Indicator], by executing [Action/Tool].');
    onChangeCv({ ...cv, experience: exps });
  };

  const updateExperienceBullet = (expIndex: number, bulletIndex: number, text: string) => {
    const exps = [...cv.experience];
    exps[expIndex].bullets[bulletIndex] = text;
    onChangeCv({ ...cv, experience: exps });
  };

  const deleteExperienceBullet = (expIndex: number, bulletIndex: number) => {
    const exps = [...cv.experience];
    exps[expIndex].bullets.splice(bulletIndex, 1);
    onChangeCv({ ...cv, experience: exps });
  };

  const addExperienceItem = () => {
    const newItem: ExperienceItem = {
      company: 'Company Name',
      role: 'Role Title',
      location: 'City, State / Remote',
      startDate: '2023',
      endDate: 'Present',
      bullets: [
        'Spearheaded [Core Initiative], measured by [Key Result], by implementing [Technology/Methodology].'
      ]
    };
    onChangeCv({ ...cv, experience: [newItem, ...cv.experience] });
    setActiveAccordion('experience');
  };

  const deleteExperienceItem = (index: number) => {
    const exps = [...cv.experience];
    exps.splice(index, 1);
    onChangeCv({ ...cv, experience: exps });
  };

  const moveExperience = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === cv.experience.length - 1)
    ) return;
    const exps = [...cv.experience];
    const target = direction === 'up' ? index - 1 : index + 1;
    const temp = exps[index];
    exps[index] = exps[target];
    exps[target] = temp;
    onChangeCv({ ...cv, experience: exps });
  };

  // --- Projects Handlers ---
  const projects = cv.projects || [];

  const addProjectItem = () => {
    const newProj: ProjectItem = {
      title: 'Project or Architecture Name',
      role: 'Lead Architect / Contributor',
      link: 'github.com/project',
      startDate: '2023',
      endDate: 'Present',
      bullets: [
        'Engineered [Platform Feature], achieving [Metric/Outcome], utilizing [Tech Stack].'
      ]
    };
    onChangeCv({ ...cv, projects: [newProj, ...projects] });
    setActiveAccordion('projects');
  };

  const updateProjectField = (index: number, field: keyof ProjectItem, value: any) => {
    const projs = [...projects];
    projs[index] = { ...projs[index], [field]: value };
    onChangeCv({ ...cv, projects: projs });
  };

  const updateProjectBullet = (projIndex: number, bulletIndex: number, text: string) => {
    const projs = [...projects];
    projs[projIndex].bullets[bulletIndex] = text;
    onChangeCv({ ...cv, projects: projs });
  };

  const addProjectBullet = (projIndex: number) => {
    const projs = [...projects];
    projs[projIndex].bullets.push('Achieved [Outcome], measured by [Quantifiable Metric], by building [System Component].');
    onChangeCv({ ...cv, projects: projs });
  };

  const deleteProjectBullet = (projIndex: number, bulletIndex: number) => {
    const projs = [...projects];
    projs[projIndex].bullets.splice(bulletIndex, 1);
    onChangeCv({ ...cv, projects: projs });
  };

  const deleteProjectItem = (index: number) => {
    const projs = [...projects];
    projs.splice(index, 1);
    onChangeCv({ ...cv, projects: projs });
  };

  // --- Education Handlers ---
  const updateEducationField = (index: number, field: keyof EducationItem, value: string) => {
    const edus = [...cv.education];
    edus[index] = { ...edus[index], [field]: value };
    onChangeCv({ ...cv, education: edus });
  };

  const addEducationItem = () => {
    const newEdu: EducationItem = {
      institution: 'University / Institution Name',
      degree: 'Bachelor of Science in Computer Science',
      location: 'City, State',
      graduationDate: '2020',
      honors: 'Magna Cum Laude',
    };
    onChangeCv({ ...cv, education: [...cv.education, newEdu] });
    setActiveAccordion('education');
  };

  const deleteEducationItem = (index: number) => {
    const edus = [...cv.education];
    edus.splice(index, 1);
    onChangeCv({ ...cv, education: edus });
  };

  // --- Skills Handlers ---
  const updateSkillCategory = (index: number, category: string, itemsStr: string) => {
    const sks = [...cv.skills];
    sks[index] = {
      category,
      items: itemsStr.split(',').map(s => s.trim()).filter(Boolean)
    };
    onChangeCv({ ...cv, skills: sks });
  };

  const addSkillCategory = () => {
    const newSk: SkillCategory = {
      category: 'New Category (e.g. Cloud & Tools)',
      items: ['Item 1', 'Item 2', 'Item 3']
    };
    onChangeCv({ ...cv, skills: [...cv.skills, newSk] });
    setActiveAccordion('skills');
  };

  const deleteSkillCategory = (index: number) => {
    const sks = [...cv.skills];
    sks.splice(index, 1);
    onChangeCv({ ...cv, skills: sks });
  };

  // --- Certifications Handlers ---
  const certs = cv.certifications || [];

  const updateCertificationField = (index: number, field: keyof CertificationItem, value: string) => {
    const crts = [...certs];
    crts[index] = { ...crts[index], [field]: value };
    onChangeCv({ ...cv, certifications: crts });
  };

  const addCertificationItem = () => {
    const newCert: CertificationItem = {
      name: 'AWS Certified Solutions Architect – Professional',
      issuer: 'Amazon Web Services',
      date: '2024'
    };
    onChangeCv({ ...cv, certifications: [...certs, newCert] });
    setActiveAccordion('certifications');
  };

  const deleteCertificationItem = (index: number) => {
    const crts = [...certs];
    crts.splice(index, 1);
    onChangeCv({ ...cv, certifications: crts });
  };

  // --- Languages Handlers ---
  const languages = cv.languages || [];
  const updateLanguageField = (index: number, field: keyof LanguageItem, value: string) => {
    const langs = [...languages];
    langs[index] = { ...langs[index], [field]: value };
    onChangeCv({ ...cv, languages: langs });
  };
  const addLanguageItem = () => {
    const newLang: LanguageItem = { language: 'German', proficiency: 'Professional Working' };
    onChangeCv({ ...cv, languages: [...languages, newLang] });
    setActiveAccordion('languages');
  };
  const deleteLanguageItem = (index: number) => {
    const langs = [...languages];
    langs.splice(index, 1);
    onChangeCv({ ...cv, languages: langs });
  };

  // --- References Handlers ---
  const references = cv.references || [];
  const updateReferenceField = (index: number, field: keyof ReferenceItem, value: string) => {
    const refs = [...references];
    refs[index] = { ...refs[index], [field]: value };
    onChangeCv({ ...cv, references: refs });
  };
  const addReferenceItem = () => {
    const newRef: ReferenceItem = { 
      name: 'Dr. Jane Smith', 
      title: 'VP of Engineering', 
      company: 'Tech Corp', 
      contact: 'jane.smith@techcorp.com • (555) 019-2834' 
    };
    onChangeCv({ ...cv, references: [...references, newRef] });
    setActiveAccordion('references');
  };
  const deleteReferenceItem = (index: number) => {
    const refs = [...references];
    refs.splice(index, 1);
    onChangeCv({ ...cv, references: refs });
  };

  // Section icon map
  const getSectionIcon = (id: SectionType) => {
    switch (id) {
      case 'header': return <User className="w-4 h-4 text-indigo-600" />;
      case 'summary': return <FileText className="w-4 h-4 text-indigo-600" />;
      case 'coreCompetencies': return <Sparkles className="w-4 h-4 text-indigo-600" />;
      case 'experience': return <Briefcase className="w-4 h-4 text-indigo-600" />;
      case 'projects': return <FolderGit2 className="w-4 h-4 text-indigo-600" />;
      case 'education': return <GraduationCap className="w-4 h-4 text-indigo-600" />;
      case 'skills': return <Wrench className="w-4 h-4 text-indigo-600" />;
      case 'certifications': return <Award className="w-4 h-4 text-indigo-600" />;
      case 'languages': return <Globe className="w-4 h-4 text-indigo-600" />;
      case 'references': return <Users className="w-4 h-4 text-indigo-600" />;
      default: return <Layers className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Modular Content Editor</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200">
              Resume.io Mode
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            Tune each block manually with Google X-Y-Z assistance. Updates sync to the live canvas instantly.
          </p>
        </div>

        <button
          onClick={onOpenSectionManager}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200/80 active:scale-95"
          title="Organize document sections"
        >
          <Layers className="w-3.5 h-3.5 text-slate-500" />
          <span>Sections ({sections.filter(s => s.enabled).length})</span>
        </button>
      </div>

      {/* Accordion Blocks Sorted by sections configuration */}
      <div className="space-y-3">
        {sections.filter(s => s.enabled).map((sec) => {
          const isExpanded = activeAccordion === sec.id;

          return (
            <div
              key={sec.id}
              className={`rounded-2xl border transition-all ${
                isExpanded 
                  ? 'border-indigo-300/80 bg-white shadow-xs ring-2 ring-indigo-500/10' 
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => toggleAccordion(sec.id)}
                className="w-full flex items-center justify-between p-3.5 text-left text-xs font-bold text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-indigo-50/80 border border-indigo-100">
                    {getSectionIcon(sec.id)}
                  </div>
                  <span className="text-sm font-bold text-slate-900">{sec.title}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="p-4 pt-1 border-t border-slate-100 text-xs space-y-4">
                  {/* --- 1. PERSONAL INFORMATION --- */}
                  {sec.id === 'header' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Candidate Name</label>
                        <input
                          type="text"
                          value={cv.header.name}
                          onChange={(e) => updateHeader('name', e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          placeholder="e.g. Alex R. Morgan"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Target Professional Headline / Title</label>
                        <input
                          type="text"
                          value={cv.header.title}
                          onChange={(e) => updateHeader('title', e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          placeholder="e.g. Staff Distributed Systems Engineer"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Email Address</label>
                        <input
                          type="email"
                          value={cv.header.email}
                          onChange={(e) => updateHeader('email', e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          placeholder="alex.morgan@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Phone Number</label>
                        <input
                          type="text"
                          value={cv.header.phone}
                          onChange={(e) => updateHeader('phone', e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          placeholder="(415) 555-0182"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Location</label>
                        <input
                          type="text"
                          value={cv.header.location}
                          onChange={(e) => updateHeader('location', e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          placeholder="San Francisco, CA / Remote"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">LinkedIn URL / Handle</label>
                        <input
                          type="text"
                          value={cv.header.linkedin || ''}
                          onChange={(e) => updateHeader('linkedin', e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          placeholder="linkedin.com/in/alexmorgan"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Portfolio / GitHub Website</label>
                        <input
                          type="text"
                          value={cv.header.portfolio || ''}
                          onChange={(e) => updateHeader('portfolio', e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          placeholder="github.com/alexmorgan-dev"
                        />
                      </div>
                    </div>
                  )}

                  {/* --- 2. EXECUTIVE SUMMARY --- */}
                  {sec.id === 'summary' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>High-impact summary tuned with JD target keywords</span>
                        <span>{cv.summary.length} characters</span>
                      </div>
                      <textarea
                        rows={4}
                        value={cv.summary}
                        onChange={(e) => updateSummary(e.target.value)}
                        className="w-full p-3 text-xs border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed"
                        placeholder="Write or refine the candidate summary..."
                      />
                    </div>
                  )}

                  {/* --- 3. CORE COMPETENCIES --- */}
                  {sec.id === 'coreCompetencies' && (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-slate-50 rounded-xl border border-slate-200">
                        {(cv.coreCompetencies || []).map((comp, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-800 shadow-2xs"
                          >
                            <span>{comp}</span>
                            <button
                              type="button"
                              onClick={() => removeCompetency(idx)}
                              className="text-slate-400 hover:text-rose-600 p-0.5 rounded"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newCompetency}
                          onChange={(e) => setNewCompetency(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addCompetency()}
                          placeholder="Add new competency tag (e.g. Distributed Consensus, gRPC)"
                          className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={addCompetency}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-xs active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --- 4. PROFESSIONAL EXPERIENCE --- */}
                  {sec.id === 'experience' && (
                    <div className="space-y-4">
                      {cv.experience.map((exp, expIdx) => (
                        <div key={expIdx} className="p-3.5 rounded-2xl border border-slate-200/90 bg-slate-50/70 space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                            <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-indigo-500" />
                              Position {expIdx + 1}: {exp.role || 'Role'} at {exp.company || 'Company'}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => moveExperience(expIdx, 'up')}
                                disabled={expIdx === 0}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded"
                                title="Move position up"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => moveExperience(expIdx, 'down')}
                                disabled={expIdx === cv.experience.length - 1}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded"
                                title="Move position down"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => deleteExperienceItem(expIdx)}
                                className="p-1 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50 ml-1"
                                title="Delete position"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Company Name</label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => updateExperienceField(expIdx, 'company', e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Job Title</label>
                              <input
                                type="text"
                                value={exp.role}
                                onChange={(e) => updateExperienceField(expIdx, 'role', e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Start Date</label>
                              <input
                                type="text"
                                value={exp.startDate}
                                onChange={(e) => updateExperienceField(expIdx, 'startDate', e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="e.g. 2021"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">End Date</label>
                              <input
                                type="text"
                                value={exp.endDate}
                                onChange={(e) => updateExperienceField(expIdx, 'endDate', e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="e.g. Present"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Location</label>
                              <input
                                type="text"
                                value={exp.location}
                                onChange={(e) => updateExperienceField(expIdx, 'location', e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="San Francisco, CA"
                              />
                            </div>
                          </div>

                          {/* Bullets with XYZ formulation */}
                          <div className="space-y-2 pt-2 border-t border-slate-200/60">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-700">
                                Experience Bullets (Google X-Y-Z Formulated)
                              </span>
                              <button
                                type="button"
                                onClick={() => addExperienceBullet(expIdx)}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                              >
                                <Plus className="w-3 h-3" />
                                Add XYZ Bullet
                              </button>
                            </div>

                            <div className="space-y-2">
                              {exp.bullets.map((bullet, bulletIdx) => (
                                <div key={bulletIdx} className="flex items-start gap-1.5">
                                  <textarea
                                    rows={2}
                                    value={bullet}
                                    onChange={(e) => updateExperienceBullet(expIdx, bulletIdx, e.target.value)}
                                    className="flex-1 p-2 text-xs border border-slate-200 rounded-lg bg-white font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => deleteExperienceBullet(expIdx, bulletIdx)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded shrink-0"
                                    title="Delete bullet"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addExperienceItem}
                        className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-300 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Work Position</span>
                      </button>
                    </div>
                  )}

                  {/* --- 5. PROJECTS & INITIATIVES --- */}
                  {sec.id === 'projects' && (
                    <div className="space-y-4">
                      {projects.map((proj, projIdx) => (
                        <div key={projIdx} className="p-3.5 rounded-2xl border border-slate-200/90 bg-slate-50/70 space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                            <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              Project {projIdx + 1}: {proj.title || 'Untitled Project'}
                            </span>
                            <button
                              onClick={() => deleteProjectItem(projIdx)}
                              className="p-1 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50"
                              title="Delete project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Project Title</label>
                              <input
                                type="text"
                                value={proj.title}
                                onChange={(e) => updateProjectField(projIdx, 'title', e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Role / Contribution</label>
                              <input
                                type="text"
                                value={proj.role || ''}
                                onChange={(e) => updateProjectField(projIdx, 'role', e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Repository / Project Link</label>
                              <input
                                type="text"
                                value={proj.link || ''}
                                onChange={(e) => updateProjectField(projIdx, 'link', e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Timeline</label>
                              <input
                                type="text"
                                value={proj.startDate ? `${proj.startDate} – ${proj.endDate || 'Present'}` : ''}
                                onChange={(e) => updateProjectField(projIdx, 'startDate', e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="2023 – Present"
                              />
                            </div>
                          </div>

                          <div className="space-y-2 pt-2 border-t border-slate-200/60">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-700">Project Highlights & Bullets</span>
                              <button
                                type="button"
                                onClick={() => addProjectBullet(projIdx)}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                              >
                                <Plus className="w-3 h-3" />
                                Add Bullet
                              </button>
                            </div>
                            {proj.bullets.map((bullet, bulletIdx) => (
                              <div key={bulletIdx} className="flex items-start gap-1.5">
                                <textarea
                                  rows={2}
                                  value={bullet}
                                  onChange={(e) => updateProjectBullet(projIdx, bulletIdx, e.target.value)}
                                  className="flex-1 p-2 text-xs border border-slate-200 rounded-lg bg-white font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                                />
                                <button
                                  type="button"
                                  onClick={() => deleteProjectBullet(projIdx, bulletIdx)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded shrink-0"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addProjectItem}
                        className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-300 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Project / Open-Source Initiative</span>
                      </button>
                    </div>
                  )}

                  {/* --- 6. EDUCATION --- */}
                  {sec.id === 'education' && (
                    <div className="space-y-3">
                      {cv.education.map((edu, eduIdx) => (
                        <div key={eduIdx} className="p-3.5 rounded-2xl border border-slate-200/90 bg-slate-50/70 space-y-2.5">
                          <div className="flex items-center justify-between pb-1 border-b border-slate-200/60">
                            <span className="font-extrabold text-xs text-slate-900">
                              Degree {eduIdx + 1}: {edu.degree || 'Degree'}
                            </span>
                            <button
                              onClick={() => deleteEducationItem(eduIdx)}
                              className="p-1 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50"
                              title="Delete education"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Institution / University</label>
                              <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => updateEducationField(eduIdx, 'institution', e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Degree Title</label>
                              <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => updateEducationField(eduIdx, 'degree', e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Graduation Year / Date</label>
                              <input
                                type="text"
                                value={edu.graduationDate}
                                onChange={(e) => updateEducationField(eduIdx, 'graduationDate', e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Location / Honors</label>
                              <input
                                type="text"
                                value={edu.honors ? `${edu.location} • ${edu.honors}` : edu.location}
                                onChange={(e) => updateEducationField(eduIdx, 'location', e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addEducationItem}
                        className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-300 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Degree / Academic Credential</span>
                      </button>
                    </div>
                  )}

                  {/* --- 7. SKILLS & TECHNOLOGIES --- */}
                  {sec.id === 'skills' && (
                    <div className="space-y-3">
                      {cv.skills.map((skillGroup, skIdx) => (
                        <div key={skIdx} className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
                          <div className="flex items-center justify-between">
                            <input
                              type="text"
                              value={skillGroup.category}
                              onChange={(e) => updateSkillCategory(skIdx, e.target.value, skillGroup.items.join(', '))}
                              className="px-2 py-1 font-bold text-xs border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <button
                              onClick={() => deleteSkillCategory(skIdx)}
                              className="p-1 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 mb-0.5">Items (comma-separated):</label>
                            <input
                              type="text"
                              value={skillGroup.items.join(', ')}
                              onChange={(e) => updateSkillCategory(skIdx, skillGroup.category, e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addSkillCategory}
                        className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-300 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Skill Category</span>
                      </button>
                    </div>
                  )}

                  {/* --- 8. CERTIFICATIONS --- */}
                  {sec.id === 'certifications' && (
                    <div className="space-y-3">
                      {certs.map((cert, certIdx) => (
                        <div key={certIdx} className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
                          <div className="flex items-center justify-between pb-1 border-b border-slate-200/60">
                            <span className="font-extrabold text-xs text-slate-900">
                              Certification {certIdx + 1}
                            </span>
                            <button
                              onClick={() => deleteCertificationItem(certIdx)}
                              className="p-1 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Certification Name</label>
                              <input
                                type="text"
                                value={cert.name}
                                onChange={(e) => updateCertificationField(certIdx, 'name', e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Year / Date</label>
                              <input
                                type="text"
                                value={cert.date || ''}
                                onChange={(e) => updateCertificationField(certIdx, 'date', e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="sm:col-span-3">
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Issuing Organization</label>
                              <input
                                type="text"
                                value={cert.issuer || ''}
                                onChange={(e) => updateCertificationField(certIdx, 'issuer', e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addCertificationItem}
                        className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-300 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Certification / License</span>
                      </button>
                    </div>
                  )}

                  {/* --- 9. LANGUAGES --- */}
                  {sec.id === 'languages' && (
                    <div className="space-y-3">
                      {languages.map((lang, langIdx) => (
                        <div key={langIdx} className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
                          <div className="flex items-center justify-between pb-1 border-b border-slate-200/60">
                            <span className="font-extrabold text-xs text-slate-900">
                              Language {langIdx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => deleteLanguageItem(langIdx)}
                              className="p-1 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Language</label>
                              <input
                                type="text"
                                value={lang.language}
                                onChange={(e) => updateLanguageField(langIdx, 'language', e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="e.g. English, German, Spanish"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Proficiency Level</label>
                              <input
                                type="text"
                                value={lang.proficiency || ''}
                                onChange={(e) => updateLanguageField(langIdx, 'proficiency', e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="e.g. Native, Fluent, Professional Working"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addLanguageItem}
                        className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-300 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Language</span>
                      </button>
                    </div>
                  )}

                  {/* --- 10. REFERENCES --- */}
                  {sec.id === 'references' && (
                    <div className="space-y-3">
                      {references.map((ref, refIdx) => (
                        <div key={refIdx} className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
                          <div className="flex items-center justify-between pb-1 border-b border-slate-200/60">
                            <span className="font-extrabold text-xs text-slate-900">
                              Reference {refIdx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => deleteReferenceItem(refIdx)}
                              className="p-1 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Full Name</label>
                              <input
                                type="text"
                                value={ref.name}
                                onChange={(e) => updateReferenceField(refIdx, 'name', e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="e.g. Dr. Jane Smith"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Title & Company</label>
                              <input
                                type="text"
                                value={`${ref.title ? ref.title + ' — ' : ''}${ref.company || ''}`}
                                onChange={(e) => {
                                  const parts = e.target.value.split('—');
                                  updateReferenceField(refIdx, 'title', parts[0]?.trim() || '');
                                  if (parts[1]) updateReferenceField(refIdx, 'company', parts[1]?.trim());
                                }}
                                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="e.g. VP of Engineering — Tech Corp"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Contact Details (Email / Phone)</label>
                              <input
                                type="text"
                                value={ref.contact || ''}
                                onChange={(e) => updateReferenceField(refIdx, 'contact', e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="e.g. jane.smith@techcorp.com • (555) 019-2834"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addReferenceItem}
                        className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-300 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Reference</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
