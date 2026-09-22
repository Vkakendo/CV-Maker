import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Linkedin, 
  Globe, 
  ShieldCheck, 
  ZoomIn, 
  ZoomOut, 
  Briefcase,
  GraduationCap,
  Sparkles,
  Award,
  Users,
  Languages,
  User,
  FolderGit2
} from 'lucide-react';
import { TailoredCv, DesignThemeConfig, SectionConfig, SectionType } from '../../types';

interface LiveDocumentCanvasProps {
  cv: TailoredCv;
  themeConfig: DesignThemeConfig;
  sections: SectionConfig[];
  zoomLevel: number;
  setZoomLevel: (val: number) => void;
  onEditSection?: (sectionId: SectionType) => void;
}

export const LiveDocumentCanvas: React.FC<LiveDocumentCanvasProps> = ({
  cv,
  themeConfig,
  sections,
  zoomLevel,
  setZoomLevel,
  onEditSection,
}) => {
  const { template, fontFamily, fontSize, spacing, margins, accentColor } = themeConfig;

  // Resolve font family class / style
  const getFontFamilyStyle = () => {
    switch (fontFamily) {
      case 'Calibri':
        return { fontFamily: "'Calibri', 'Carlito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" };
      case 'Inter':
        return { fontFamily: "'Inter', sans-serif" };
      case 'Merriweather':
        return { fontFamily: "'Merriweather', Georgia, serif" };
      case 'JetBrains Mono':
        return { fontFamily: "'JetBrains Mono', monospace" };
      case 'Roboto':
        return { fontFamily: "'Roboto', sans-serif" };
      case 'Plus Jakarta Sans':
        return { fontFamily: "'Plus Jakarta Sans', sans-serif" };
      default:
        return { fontFamily: "'Calibri', 'Carlito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" };
    }
  };

  // Base font size
  const getFontSizeStyle = () => {
    switch (fontSize) {
      case 'Compact (10pt)': return 'text-[11.5px] leading-relaxed';
      case 'Large (11pt)': return 'text-[13px] leading-relaxed';
      case 'Standard (10.5pt)':
      default:
        return 'text-xs leading-relaxed';
    }
  };

  // Vertical spacing
  const getSpacingClass = () => {
    switch (spacing) {
      case 'Compact': return 'space-y-3';
      case 'Relaxed': return 'space-y-5';
      case 'Standard':
      default:
        return 'space-y-4';
    }
  };

  // Page margins padding
  const getMarginStyle = () => {
    switch (margins) {
      case 'Narrow (0.35in)': return 'p-6 sm:p-9';
      case 'Wide (0.6in)': return 'p-8 sm:p-14';
      case 'Standard (0.45in)':
      default:
        return 'p-7 sm:p-11';
    }
  };

  // Template specific styles
  const isCorporate = template === 'Clean Corporate';
  const isTechnical = template === 'Minimalist Technical';
  const isExecutive = template === 'Modern Executive';
  const isTimelineSidebar = template === 'Timeline Sidebar (Executive Modern)';

  const isSectionEnabled = (id: SectionType) => {
    const s = sections.find(sec => sec.id === id);
    return s ? s.enabled : true;
  };

  const languagesList = cv.languages && cv.languages.length > 0 ? cv.languages : [
    { language: 'English', proficiency: 'Native / Bilingual' },
    { language: 'German', proficiency: 'Professional Working (B2)' }
  ];

  const referencesList = cv.references && cv.references.length > 0 ? cv.references : [
    { name: 'Dr. Marcus Vance', title: 'VP of Engineering', company: 'CloudScale Technologies', contact: 'm.vance@cloudscale.io' },
    { name: 'Elena Rostova', title: 'Principal Infrastructure Architect', company: 'Apex Data Systems', contact: 'elena.rostova@apexdata.com' }
  ];

  return (
    <div className="space-y-3">
      {/* Canvas Top Bar with Zoom & ATS Compliance Badge */}
      <div className="flex items-center justify-between px-2 py-1 text-xs text-slate-500 no-print">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-semibold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Real-Time Live Canvas</span>
          </div>
          <span className="hidden sm:inline text-slate-400">•</span>
          <span className="hidden sm:inline font-mono text-[11px] text-slate-500">
            {template}
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 rounded-xl px-2 py-1 shadow-2xs">
          <button
            onClick={() => setZoomLevel(Math.max(75, zoomLevel - 10))}
            className="p-1 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] font-bold text-slate-700 w-11 text-center select-none">
            {zoomLevel}%
          </span>
          <button
            onClick={() => setZoomLevel(Math.min(130, zoomLevel + 10))}
            className="p-1 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(100)}
            className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 ml-1 px-1.5 py-0.5 rounded hover:bg-indigo-50"
            title="Reset Zoom to 100%"
          >
            Fit
          </button>
        </div>
      </div>

      {/* Live Document Stage */}
      <div className="flex justify-center p-2 sm:p-6 bg-slate-200/50 rounded-3xl border border-slate-300/80 overflow-x-auto shadow-inner min-h-[720px]">
        {/* ========================================================= */}
        {/* BRANCH 1: TIMELINE SIDEBAR (EXECUTIVE MODERN) TEMPLATE   */}
        {/* ========================================================= */}
        {isTimelineSidebar ? (
          <div
            id="cv-printable-sheet"
            style={{
              ...getFontFamilyStyle(),
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
            }}
            className={`cv-document-sheet timeline-sidebar-sheet bg-white w-full max-w-[850px] min-h-[1100px] shadow-2xl border border-slate-300 rounded-sm text-slate-900 transition-transform flex flex-row overflow-hidden ${getFontSizeStyle()}`}
          >
            {/* LEFT SIDEBAR (approx. 32% width) */}
            <div 
              className="timeline-sidebar-col w-[32%] min-w-[32%] max-w-[32%] bg-slate-100/85 border-r border-slate-300 p-5 sm:p-6 text-slate-800 space-y-6 flex flex-col justify-between"
              style={{ backgroundColor: '#f1f5f9' }}
            >
              <div className="space-y-6">
                {/* 1. CONTACT INFO */}
                {isSectionEnabled('header') && (
                  <div 
                    className="group relative cursor-pointer"
                    onClick={() => onEditSection && onEditSection('header')}
                  >
                    <h3 
                      style={{ color: accentColor, borderColor: accentColor }}
                      className="text-xs font-black uppercase tracking-wider border-b-2 pb-1 mb-2.5 flex items-center gap-1.5"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Contact</span>
                    </h3>
                    <div className="space-y-2 text-[11px] leading-snug">
                      {cv.header.phone && (
                        <div className="flex items-start gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                          <span className="font-medium text-slate-800">{cv.header.phone}</span>
                        </div>
                      )}
                      {cv.header.email && (
                        <div className="flex items-start gap-2">
                          <Mail className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                          <span className="font-medium text-slate-800 break-all">{cv.header.email}</span>
                        </div>
                      )}
                      {cv.header.location && (
                        <div className="flex items-start gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                          <span className="font-medium text-slate-800">{cv.header.location}</span>
                        </div>
                      )}
                      {cv.header.linkedin && (
                        <div className="flex items-start gap-2">
                          <Linkedin className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                          <span className="font-medium text-slate-800 break-all">{cv.header.linkedin.replace(/^https?:\/\//, '')}</span>
                        </div>
                      )}
                      {cv.header.portfolio && (
                        <div className="flex items-start gap-2">
                          <Globe className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                          <span className="font-medium text-slate-800 break-all">{cv.header.portfolio.replace(/^https?:\/\//, '')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. CORE SKILLS & TECH STACK */}
                {(isSectionEnabled('coreCompetencies') || isSectionEnabled('skills')) && (
                  <div 
                    className="group relative cursor-pointer"
                    onClick={() => onEditSection && onEditSection('coreCompetencies')}
                  >
                    <h3 
                      style={{ color: accentColor, borderColor: accentColor }}
                      className="text-xs font-black uppercase tracking-wider border-b-2 pb-1 mb-2.5 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Core Skills</span>
                    </h3>
                    
                    {/* Competency badges / tags */}
                    {cv.coreCompetencies && cv.coreCompetencies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {cv.coreCompetencies.map((comp, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-white border border-slate-300/80 text-slate-800 shadow-2xs"
                          >
                            {comp}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Categorized skills */}
                    {cv.skills && cv.skills.length > 0 && (
                      <div className="space-y-2 text-[11px]">
                        {cv.skills.map((skillGroup, idx) => (
                          <div key={idx} className="space-y-0.5">
                            <span className="font-bold text-slate-900 block">{skillGroup.category}</span>
                            <span className="text-slate-700 leading-relaxed block">{skillGroup.items.join(', ')}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. LANGUAGES */}
                {isSectionEnabled('languages') && (
                  <div 
                    className="group relative cursor-pointer"
                    onClick={() => onEditSection && onEditSection('languages')}
                  >
                    <h3 
                      style={{ color: accentColor, borderColor: accentColor }}
                      className="text-xs font-black uppercase tracking-wider border-b-2 pb-1 mb-2.5 flex items-center gap-1.5"
                    >
                      <Languages className="w-3.5 h-3.5" />
                      <span>Languages</span>
                    </h3>
                    <div className="space-y-2 text-[11px]">
                      {languagesList.map((lang, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{lang.language}</span>
                          {lang.proficiency && (
                            <span className="text-[10px] font-semibold text-slate-600 bg-white border border-slate-300/70 px-1.5 py-0.5 rounded">
                              {lang.proficiency}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. REFERENCES */}
                {isSectionEnabled('references') && (
                  <div 
                    className="group relative cursor-pointer"
                    onClick={() => onEditSection && onEditSection('references')}
                  >
                    <h3 
                      style={{ color: accentColor, borderColor: accentColor }}
                      className="text-xs font-black uppercase tracking-wider border-b-2 pb-1 mb-2.5 flex items-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>References</span>
                    </h3>
                    <div className="space-y-2.5 text-[11px]">
                      {referencesList.map((ref, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <div className="font-bold text-slate-950">{ref.name}</div>
                          {(ref.title || ref.company) && (
                            <div className="text-[10px] text-slate-600 font-medium">
                              {ref.title}{ref.company ? ` • ${ref.company}` : ''}
                            </div>
                          )}
                          {ref.contact && (
                            <div className="text-[10px] text-slate-500">{ref.contact}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. CERTIFICATIONS */}
                {isSectionEnabled('certifications') && cv.certifications && cv.certifications.length > 0 && (
                  <div 
                    className="group relative cursor-pointer"
                    onClick={() => onEditSection && onEditSection('certifications')}
                  >
                    <h3 
                      style={{ color: accentColor, borderColor: accentColor }}
                      className="text-xs font-black uppercase tracking-wider border-b-2 pb-1 mb-2.5 flex items-center gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Certifications</span>
                    </h3>
                    <div className="space-y-1.5 text-[11px]">
                      {cv.certifications.map((c, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <span className="font-bold text-slate-900 block">{c.name}</span>
                          <span className="text-slate-500 text-[10px] block">
                            {c.issuer}{c.date ? ` (${c.date})` : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar bottom branding */}
              <div className="pt-4 border-t border-slate-300/80 text-[10px] font-mono text-slate-400 no-print flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Executive Sidebar Layout</span>
              </div>
            </div>

            {/* MAIN CONTENT AREA (approx. 68% width) */}
            <div className="timeline-main-col w-[68%] min-w-[68%] max-w-[68%] p-6 sm:p-8 space-y-6 bg-white text-slate-900 flex flex-col justify-between">
              <div className="space-y-6">
                {/* High-contrast name and job title header at top of main pane */}
                {isSectionEnabled('header') && (
                  <div 
                    className="group relative cursor-pointer pb-3 border-b-2 border-slate-200"
                    onClick={() => onEditSection && onEditSection('header')}
                  >
                    <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950">
                      {cv.header.name}
                    </h1>
                    {cv.header.title && (
                      <div 
                        style={{ color: accentColor }}
                        className="text-xs sm:text-sm font-bold uppercase tracking-wider mt-1"
                      >
                        {cv.header.title}
                      </div>
                    )}
                  </div>
                )}

                {/* CONTINUOUS VERTICAL TIMELINE CONTAINER */}
                <div className="relative pl-8 space-y-7">
                  {/* Continuous vertical timeline axis line running down the left edge of the main content column */}
                  <div 
                    className="absolute left-[11px] top-2 bottom-2 w-[2px] rounded-full"
                    style={{ backgroundColor: `${accentColor}33` }}
                  />

                  {/* 1. PROFILE / SUMMARY */}
                  {isSectionEnabled('summary') && cv.summary && (
                    <div 
                      className="relative group cursor-pointer"
                      onClick={() => onEditSection && onEditSection('summary')}
                    >
                      {/* Timeline Node Marker */}
                      <div 
                        className="absolute -left-[30px] top-0 w-5 h-5 rounded-full flex items-center justify-center bg-white border-2 shadow-2xs z-10"
                        style={{ borderColor: accentColor }}
                      >
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                      </div>

                      <h2 
                        style={{ color: accentColor, borderColor: accentColor }}
                        className="text-xs sm:text-sm font-black uppercase tracking-wider border-b-2 pb-0.5 mb-2"
                      >
                        Profile
                      </h2>
                      <p className="text-slate-800 leading-relaxed text-justify">
                        {cv.summary}
                      </p>
                    </div>
                  )}

                  {/* 2. WORK EXPERIENCE */}
                  {isSectionEnabled('experience') && cv.experience && cv.experience.length > 0 && (
                    <div 
                      className="relative group cursor-pointer"
                      onClick={() => onEditSection && onEditSection('experience')}
                    >
                      {/* Timeline Node Marker */}
                      <div 
                        className="absolute -left-[30px] top-0 w-5 h-5 rounded-full flex items-center justify-center bg-white border-2 shadow-2xs z-10"
                        style={{ borderColor: accentColor }}
                      >
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                      </div>

                      <h2 
                        style={{ color: accentColor, borderColor: accentColor }}
                        className="text-xs sm:text-sm font-black uppercase tracking-wider border-b-2 pb-0.5 mb-3"
                      >
                        Work Experience
                      </h2>

                      <div className="space-y-4">
                        {cv.experience.map((exp, expIdx) => (
                          <div key={expIdx} className="relative space-y-1">
                            {/* Sub-node marker on timeline for each role */}
                            <div 
                              className="absolute -left-[26px] top-1.5 w-3 h-3 rounded-full bg-white border-2 z-10"
                              style={{ borderColor: accentColor }}
                            />

                            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                              <div>
                                <span className="font-bold text-slate-950 text-xs sm:text-sm">{exp.role}</span>
                                <div className="text-slate-700 font-semibold text-xs">
                                  {exp.company}{exp.location ? ` — ${exp.location}` : ''}
                                </div>
                              </div>
                              <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap bg-slate-100 px-2 py-0.5 rounded">
                                {exp.startDate} – {exp.endDate}
                              </span>
                            </div>

                            <ul className="list-disc pl-4 space-y-1 text-slate-800 pt-1 text-[11.5px]">
                              {exp.bullets.map((b, bIdx) => (
                                <li key={bIdx} className="leading-relaxed">
                                  {b}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. EDUCATION */}
                  {isSectionEnabled('education') && cv.education && cv.education.length > 0 && (
                    <div 
                      className="relative group cursor-pointer"
                      onClick={() => onEditSection && onEditSection('education')}
                    >
                      {/* Timeline Node Marker */}
                      <div 
                        className="absolute -left-[30px] top-0 w-5 h-5 rounded-full flex items-center justify-center bg-white border-2 shadow-2xs z-10"
                        style={{ borderColor: accentColor }}
                      >
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                      </div>

                      <h2 
                        style={{ color: accentColor, borderColor: accentColor }}
                        className="text-xs sm:text-sm font-black uppercase tracking-wider border-b-2 pb-0.5 mb-3"
                      >
                        Education
                      </h2>

                      <div className="space-y-3">
                        {cv.education.map((edu, idx) => (
                          <div key={idx} className="relative space-y-0.5">
                            {/* Sub-node marker */}
                            <div 
                              className="absolute -left-[26px] top-1.5 w-3 h-3 rounded-full bg-white border-2 z-10"
                              style={{ borderColor: accentColor }}
                            />

                            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                              <div>
                                <span className="font-bold text-slate-950">{edu.institution}</span>
                                <div className="text-slate-800 text-xs">
                                  {edu.degree}
                                  {edu.honors && <span className="italic font-medium text-slate-600"> — {edu.honors}</span>}
                                </div>
                              </div>
                              <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">
                                {edu.graduationDate}{edu.location ? ` | ${edu.location}` : ''}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4. PROJECTS & INITIATIVES */}
                  {isSectionEnabled('projects') && cv.projects && cv.projects.length > 0 && (
                    <div 
                      className="relative group cursor-pointer"
                      onClick={() => onEditSection && onEditSection('projects')}
                    >
                      {/* Timeline Node Marker */}
                      <div 
                        className="absolute -left-[30px] top-0 w-5 h-5 rounded-full flex items-center justify-center bg-white border-2 shadow-2xs z-10"
                        style={{ borderColor: accentColor }}
                      >
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                      </div>

                      <h2 
                        style={{ color: accentColor, borderColor: accentColor }}
                        className="text-xs sm:text-sm font-black uppercase tracking-wider border-b-2 pb-0.5 mb-3"
                      >
                        Key Projects & Initiatives
                      </h2>

                      <div className="space-y-3">
                        {cv.projects.map((proj, idx) => (
                          <div key={idx} className="relative space-y-1">
                            {/* Sub-node */}
                            <div 
                              className="absolute -left-[26px] top-1.5 w-3 h-3 rounded-full bg-white border-2 z-10"
                              style={{ borderColor: accentColor }}
                            />

                            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                              <div>
                                <span className="font-bold text-slate-950">{proj.title}</span>
                                {proj.role && <span className="text-slate-600 text-xs italic"> — {proj.role}</span>}
                              </div>
                              <span className="text-[11px] text-slate-500">
                                {proj.startDate && `${proj.startDate} – ${proj.endDate || 'Present'}`}
                              </span>
                            </div>

                            <ul className="list-disc pl-4 space-y-1 text-slate-800 text-[11.5px]">
                              {proj.bullets.map((b, bIdx) => (
                                <li key={bIdx}>{b}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Print / ATS Verification */}
              <div className="pt-3 border-t border-slate-200 text-center text-[10px] text-slate-400 no-print flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Executive Modern Layout • Continuous Timeline Track • 32/68 Column Proportions</span>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* BRANCH 2: STANDARD SINGLE-COLUMN TEMPLATES               */
          /* ========================================================= */
          <div
            id="cv-printable-sheet"
            style={{
              ...getFontFamilyStyle(),
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
            }}
            className={`cv-document-sheet bg-white w-full max-w-[850px] min-h-[1100px] ${getMarginStyle()} shadow-2xl border border-slate-300 rounded-sm text-slate-900 transition-transform ${getSpacingClass()} ${getFontSizeStyle()}`}
          >
            {/* Dynamic Section Ordering */}
            {sections.filter(s => s.enabled).map((sec) => {
              // --- HEADER ---
              if (sec.id === 'header') {
                return (
                  <div 
                    key={sec.id} 
                    className={`group relative pb-2 ${isCorporate ? 'text-center' : ''}`}
                    onClick={() => onEditSection && onEditSection('header')}
                  >
                    <h1 
                      style={{ color: '#090d16' }}
                      className={`font-black tracking-tight ${
                        isCorporate 
                          ? 'text-2xl font-serif uppercase tracking-wider' 
                          : isExecutive 
                            ? 'text-2xl uppercase border-b-2 pb-2' 
                            : 'text-2xl'
                      }`}
                    >
                      {cv.header.name}
                    </h1>

                    {cv.header.title && (
                      <div 
                        style={{ color: accentColor }}
                        className={`font-bold mt-1 ${isTechnical ? 'font-mono text-xs' : 'text-sm'}`}
                      >
                        {cv.header.title}
                      </div>
                    )}

                    <div className={`mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-600 ${isCorporate ? 'justify-center' : ''}`}>
                      {cv.header.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 no-print" />
                          {cv.header.location}
                        </span>
                      )}
                      {cv.header.phone && (
                        <span className="inline-flex items-center gap-1">
                          <span className="text-slate-300 no-print">•</span>
                          <Phone className="w-3 h-3 text-slate-400 no-print" />
                          {cv.header.phone}
                        </span>
                      )}
                      {cv.header.email && (
                        <span className="inline-flex items-center gap-1">
                          <span className="text-slate-300 no-print">•</span>
                          <Mail className="w-3 h-3 text-slate-400 no-print" />
                          {cv.header.email}
                        </span>
                      )}
                      {cv.header.linkedin && (
                        <span className="inline-flex items-center gap-1">
                          <span className="text-slate-300 no-print">•</span>
                          <Linkedin className="w-3 h-3 text-slate-400 no-print" />
                          {cv.header.linkedin}
                        </span>
                      )}
                      {cv.header.portfolio && (
                        <span className="inline-flex items-center gap-1">
                          <span className="text-slate-300 no-print">•</span>
                          <Globe className="w-3 h-3 text-slate-400 no-print" />
                          {cv.header.portfolio}
                        </span>
                      )}
                    </div>
                  </div>
                );
              }

              // --- EXECUTIVE SUMMARY ---
              if (sec.id === 'summary') {
                return (
                  <div 
                    key={sec.id} 
                    className="group relative cursor-pointer"
                    onClick={() => onEditSection && onEditSection('summary')}
                  >
                    <h2 
                      style={{ 
                        color: accentColor, 
                        borderColor: accentColor 
                      }}
                      className={`text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-2 ${isCorporate ? 'text-center' : ''} ${isTechnical ? 'font-mono' : ''}`}
                    >
                      {sec.title}
                    </h2>
                    <p className="text-slate-800 text-justify leading-relaxed">
                      {cv.summary}
                    </p>
                  </div>
                );
              }

              // --- CORE COMPETENCIES ---
              if (sec.id === 'coreCompetencies' && cv.coreCompetencies?.length) {
                return (
                  <div 
                    key={sec.id} 
                    className="group relative cursor-pointer"
                    onClick={() => onEditSection && onEditSection('coreCompetencies')}
                  >
                    <h2 
                      style={{ 
                        color: accentColor, 
                        borderColor: accentColor 
                      }}
                      className={`text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-2 ${isCorporate ? 'text-center' : ''} ${isTechnical ? 'font-mono' : ''}`}
                    >
                      {sec.title}
                    </h2>
                    <div className="flex flex-wrap gap-1.5 leading-normal">
                      {cv.coreCompetencies.map((comp, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center font-medium bg-slate-100 text-slate-900 px-2 py-0.5 rounded text-[11px] border border-slate-200"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              }

              // --- PROFESSIONAL EXPERIENCE ---
              if (sec.id === 'experience' && cv.experience?.length) {
                return (
                  <div 
                    key={sec.id} 
                    className="group relative cursor-pointer"
                    onClick={() => onEditSection && onEditSection('experience')}
                  >
                    <h2 
                      style={{ 
                        color: accentColor, 
                        borderColor: accentColor 
                      }}
                      className={`text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-2.5 ${isCorporate ? 'text-center' : ''} ${isTechnical ? 'font-mono' : ''}`}
                    >
                      {sec.title}
                    </h2>
                    <div className="space-y-3.5">
                      {cv.experience.map((exp, expIdx) => (
                        <div key={expIdx} className="space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                            <div className="flex items-baseline gap-2">
                              <span className="font-bold text-slate-950">{exp.company}</span>
                              <span className="text-slate-400 text-xs hidden sm:inline">—</span>
                              <span className="font-semibold text-slate-800 italic">{exp.role}</span>
                            </div>
                            <div className="text-xs text-slate-500 font-medium whitespace-nowrap">
                              <span>{exp.startDate} – {exp.endDate}</span>
                              {exp.location && <span> | {exp.location}</span>}
                            </div>
                          </div>

                          {/* Bullets */}
                          <ul className="list-disc pl-5 space-y-1 text-slate-800 pt-0.5">
                            {exp.bullets.map((bullet, bulletIdx) => (
                              <li key={bulletIdx} className="leading-relaxed pl-0.5">
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // --- PROJECTS & INITIATIVES ---
              if (sec.id === 'projects' && cv.projects?.length) {
                return (
                  <div 
                    key={sec.id} 
                    className="group relative cursor-pointer"
                    onClick={() => onEditSection && onEditSection('projects')}
                  >
                    <h2 
                      style={{ 
                        color: accentColor, 
                        borderColor: accentColor 
                      }}
                      className={`text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-2.5 ${isCorporate ? 'text-center' : ''} ${isTechnical ? 'font-mono' : ''}`}
                    >
                      {sec.title}
                    </h2>
                    <div className="space-y-3">
                      {cv.projects.map((proj, projIdx) => (
                        <div key={projIdx} className="space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                            <div className="flex items-baseline gap-2">
                              <span className="font-bold text-slate-950">{proj.title}</span>
                              {proj.role && (
                                <>
                                  <span className="text-slate-400 text-xs hidden sm:inline">—</span>
                                  <span className="font-medium text-slate-700 italic">{proj.role}</span>
                                </>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 font-medium whitespace-nowrap">
                              {proj.startDate && <span>{proj.startDate} – {proj.endDate || 'Present'}</span>}
                              {proj.link && <span className="ml-1 text-indigo-600">({proj.link})</span>}
                            </div>
                          </div>

                          <ul className="list-disc pl-5 space-y-1 text-slate-800 pt-0.5">
                            {proj.bullets.map((b, bIdx) => (
                              <li key={bIdx} className="leading-relaxed pl-0.5">
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // --- EDUCATION ---
              if (sec.id === 'education' && cv.education?.length) {
                return (
                  <div 
                    key={sec.id} 
                    className="group relative cursor-pointer"
                    onClick={() => onEditSection && onEditSection('education')}
                  >
                    <h2 
                      style={{ 
                        color: accentColor, 
                        borderColor: accentColor 
                      }}
                      className={`text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-2 ${isCorporate ? 'text-center' : ''} ${isTechnical ? 'font-mono' : ''}`}
                    >
                      {sec.title}
                    </h2>
                    <div className="space-y-2">
                      {cv.education.map((edu, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                          <div>
                            <span className="font-bold text-slate-900">{edu.institution}</span>
                            <div className="text-slate-700">
                              {edu.degree}
                              {edu.honors && <span className="italic font-medium text-slate-600"> — {edu.honors}</span>}
                            </div>
                          </div>
                          <div className="text-slate-500 whitespace-nowrap text-xs">
                            {edu.graduationDate} | {edu.location}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // --- SKILLS & TECHNOLOGIES ---
              if (sec.id === 'skills' && cv.skills?.length) {
                return (
                  <div 
                    key={sec.id} 
                    className="group relative cursor-pointer"
                    onClick={() => onEditSection && onEditSection('skills')}
                  >
                    <h2 
                      style={{ 
                        color: accentColor, 
                        borderColor: accentColor 
                      }}
                      className={`text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-2 ${isCorporate ? 'text-center' : ''} ${isTechnical ? 'font-mono' : ''}`}
                    >
                      {sec.title}
                    </h2>
                    <div className="space-y-1.5">
                      {cv.skills.map((skillGroup, idx) => (
                        <div key={idx} className="leading-relaxed">
                          <span className="font-bold text-slate-900">{skillGroup.category}: </span>
                          <span className="text-slate-800">{skillGroup.items.join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // --- CERTIFICATIONS ---
              if (sec.id === 'certifications' && cv.certifications?.length) {
                return (
                  <div 
                    key={sec.id} 
                    className="group relative cursor-pointer"
                    onClick={() => onEditSection && onEditSection('certifications')}
                  >
                    <h2 
                      style={{ 
                        color: accentColor, 
                        borderColor: accentColor 
                      }}
                      className={`text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-2 ${isCorporate ? 'text-center' : ''} ${isTechnical ? 'font-mono' : ''}`}
                    >
                      {sec.title}
                    </h2>
                    <div className="space-y-1">
                      {cv.certifications.map((cert, idx) => (
                        <div key={idx} className="flex items-center justify-between text-slate-800">
                          <span className="font-medium">
                            • {cert.name}{cert.issuer ? ` — ${cert.issuer}` : ''}
                          </span>
                          {cert.date && <span className="text-slate-500 text-xs">{cert.date}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // --- LANGUAGES ---
              if (sec.id === 'languages') {
                return (
                  <div 
                    key={sec.id} 
                    className="group relative cursor-pointer"
                    onClick={() => onEditSection && onEditSection('languages')}
                  >
                    <h2 
                      style={{ 
                        color: accentColor, 
                        borderColor: accentColor 
                      }}
                      className={`text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-2 ${isCorporate ? 'text-center' : ''} ${isTechnical ? 'font-mono' : ''}`}
                    >
                      {sec.title}
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {languagesList.map((lang, idx) => (
                        <div key={idx} className="text-slate-800">
                          <span className="font-bold">{lang.language}</span>
                          {lang.proficiency && <span className="text-slate-500 text-xs ml-1">({lang.proficiency})</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // --- REFERENCES ---
              if (sec.id === 'references') {
                return (
                  <div 
                    key={sec.id} 
                    className="group relative cursor-pointer"
                    onClick={() => onEditSection && onEditSection('references')}
                  >
                    <h2 
                      style={{ 
                        color: accentColor, 
                        borderColor: accentColor 
                      }}
                      className={`text-xs font-bold uppercase tracking-wider border-b pb-0.5 mb-2 ${isCorporate ? 'text-center' : ''} ${isTechnical ? 'font-mono' : ''}`}
                    >
                      {sec.title}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {referencesList.map((ref, idx) => (
                        <div key={idx} className="text-slate-800 space-y-0.5">
                          <div className="font-bold">{ref.name}</div>
                          {(ref.title || ref.company) && (
                            <div className="text-xs text-slate-600">{ref.title}{ref.company ? ` — ${ref.company}` : ''}</div>
                          )}
                          {ref.contact && <div className="text-xs text-slate-500">{ref.contact}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              return null;
            })}

            {/* Bottom ATS Parser Verification Signature */}
            <div className="pt-4 mt-6 border-t border-slate-200 text-center text-[10px] text-slate-400 no-print flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified ATS Single-Column Layout • Zero Complex Tables or Graphic Columns</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
