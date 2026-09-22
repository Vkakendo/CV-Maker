export interface MatchedKeyword {
  keyword: string;
  category: string;
  status: 'Preserved' | 'Newly Integrated' | 'Elevated' | string;
  relevance: 'High' | 'Critical' | 'Medium' | string;
}

export interface MissingGap {
  keyword: string;
  suggestion: string;
}

export interface XyzTransform {
  original: string;
  optimized: string;
  actionVerb: string;
  achievedX: string;
  measuredByY: string;
  byDoingZ: string;
}

export interface AtsComplianceCheck {
  category: string;
  status: 'Pass' | 'Optimized' | 'Warning' | string;
  details: string;
}

export interface AtsSummary {
  executiveOverview: string;
  keyChanges: string[];
  matchedKeywords: MatchedKeyword[];
  missingGaps?: MissingGap[];
  xyzTransforms: XyzTransform[];
  atsComplianceChecks: AtsComplianceCheck[];
}

export interface CvHeader {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  portfolio?: string;
}

export interface ExperienceItem {
  id?: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface EducationItem {
  id?: string;
  institution: string;
  degree: string;
  location: string;
  graduationDate: string;
  honors?: string;
}

export interface SkillCategory {
  id?: string;
  category: string;
  items: string[];
}

export interface CertificationItem {
  id?: string;
  name: string;
  issuer?: string;
  date?: string;
}

export interface LanguageItem {
  id?: string;
  language: string;
  proficiency?: string;
}

export interface ReferenceItem {
  id?: string;
  name: string;
  title?: string;
  company?: string;
  contact?: string;
}

export interface ProjectItem {
  id?: string;
  title: string;
  role?: string;
  link?: string;
  startDate?: string;
  endDate?: string;
  bullets: string[];
}

export type SectionType = 
  | 'header'
  | 'summary'
  | 'coreCompetencies'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'references';

export interface SectionConfig {
  id: SectionType;
  title: string;
  enabled: boolean;
}

export interface TailoredCv {
  header: CvHeader;
  summary: string;
  coreCompetencies: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  certifications?: CertificationItem[];
  projects?: ProjectItem[];
  languages?: LanguageItem[];
  references?: ReferenceItem[];
  sectionOrder?: SectionType[];
  formattedText: string;
  markdownText: string;
}

export interface OptimizationResult {
  atsScoreBefore: number;
  atsScoreAfter: number;
  summary: AtsSummary;
  tailoredCv: TailoredCv;
}

export type DesignTemplate = 
  | 'Preserve Original Structure'
  | 'Modern Executive'
  | 'Minimalist Technical'
  | 'Clean Corporate'
  | 'Timeline Sidebar (Executive Modern)';

export type FontFamilyOption = 
  | 'Calibri'
  | 'Plus Jakarta Sans' 
  | 'Inter' 
  | 'Merriweather' 
  | 'JetBrains Mono' 
  | 'Roboto';

export type FontSizeOption = 'Compact (10pt)' | 'Standard (10.5pt)' | 'Large (11pt)';
export type SpacingOption = 'Compact' | 'Standard' | 'Relaxed';
export type MarginOption = 'Narrow (0.35in)' | 'Standard (0.45in)' | 'Wide (0.6in)';

export interface DesignThemeConfig {
  template: DesignTemplate;
  fontFamily: FontFamilyOption;
  fontSize: FontSizeOption;
  spacing: SpacingOption;
  margins: MarginOption;
  accentColor: string;
}

export interface CustomizationOptions {
  strictSingleColumn: boolean;
  xyzIntensity: 'Standard' | 'Aggressive (High Impact Metrics)' | 'Conservative (Role Preservation)';
  prioritizeHardSkills: boolean;
  targetTone: 'Executive & Strategic' | 'Technical & Architectural' | 'Operational & Commercial';
  pageTarget: 'Strict 1 Page' | 'Comprehensive 2 Pages' | 'Dynamic Standard';
  expandAndDetailExperience?: boolean;
  customInstructions?: string;
}

export interface UploadedFileMetadata {
  name: string;
  size: string;
  type: string;
  pageCount?: number;
  uploadedAt: string;
}

export interface SampleProfile {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  currentCv: string;
  targetJd: string;
  recommendedDesign: DesignTemplate;
}
