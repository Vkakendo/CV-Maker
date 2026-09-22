import React, { useRef, useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp,
  FileCheck,
  Zap,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { TailoredCv } from '../../types';
import { importAndParseCvDocument } from '../../utils/cvParserEngine';

// Explicit MIME type for Word .docx OpenXML documents
const WORD_DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const ACCEPTED_FILE_TYPES = `${WORD_DOCX_MIME},.docx,application/msword,.doc,application/pdf,.pdf,text/plain,.txt,text/markdown,.md,.rtf`;

interface CvImportDropzoneProps {
  currentCv: TailoredCv;
  onImportComplete: (parsedCv: TailoredCv, rawText: string) => void;
  className?: string;
}

export const CvImportDropzone: React.FC<CvImportDropzoneProps> = ({
  currentCv,
  onImportComplete,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragFileType, setDragFileType] = useState<'docx' | 'pdf' | 'other' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastImported, setLastImported] = useState<{
    fileName: string;
    fileSize: string;
    fileFormat: 'docx' | 'pdf' | 'text';
    rolesCount: number;
    skillsCount: number;
    languagesCount: number;
    referencesCount: number;
    educationCount: number;
    hasPersonalInfo: boolean;
    hasSummary: boolean;
    extractedSectionsCount: number;
    docxStats?: {
      paragraphsCount: number;
      headingsCount: number;
      bulletsCount: number;
      tablesCount: number;
    };
  } | null>(null);
  const [previousCv, setPreviousCv] = useState<TailoredCv | null>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    if (!file) return;

    // Validate size (max 25MB)
    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 25MB limit. Please upload a smaller document.');
      return;
    }

    // Robust validation for Word .docx MIME type and extension
    const isDocx = file.type === WORD_DOCX_MIME || /\.docx$/i.test(file.name);
    const isDoc = file.type === 'application/msword' || /\.doc$/i.test(file.name);
    const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
    const isText = file.type.startsWith('text/') || /\.(txt|md|rtf)$/i.test(file.name);

    if (!isDocx && !isDoc && !isPdf && !isText) {
      setErrorMessage('Unsupported file format. Please upload a Microsoft Word (.docx), PDF (.pdf), or text document.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    // Dynamic processing message
    if (isDocx) {
      setProcessingStatus('Unpacking Word .docx container via JSZip & parsing WordProcessingML XML...');
    } else if (isPdf) {
      setProcessingStatus('Extracting PDF text layer & typography stream...');
    } else {
      setProcessingStatus('Reading document text...');
    }

    // Save previous CV state for Undo capability
    setPreviousCv(currentCv);

    try {
      if (isDocx) {
        setProcessingStatus('Extracting Word headings, bullet points, tables & headers without data loss...');
      } else {
        setProcessingStatus('Extracting text via client-side document parser...');
      }

      await new Promise(r => setTimeout(r, 120)); // Brief UX cadence

      setProcessingStatus('Auto-mapping candidate sections (Personal Info, Summary, Experience, Education, Skills, Languages, References)...');
      const { cv, rawText, metadata } = await importAndParseCvDocument(file);

      // Pre-fill state in real time!
      onImportComplete(cv, rawText);

      setLastImported({
        fileName: metadata.fileName,
        fileSize: metadata.fileSize,
        fileFormat: isDocx ? 'docx' : isPdf ? 'pdf' : 'text',
        rolesCount: metadata.rolesCount,
        skillsCount: metadata.skillsCount,
        languagesCount: cv.languages?.length || 0,
        referencesCount: cv.references?.length || 0,
        educationCount: cv.education?.length || 0,
        hasPersonalInfo: Boolean(cv.header?.name && cv.header?.email),
        hasSummary: Boolean(cv.summary && cv.summary.length > 20),
        extractedSectionsCount: metadata.extractedSectionsCount,
        docxStats: metadata.docxStructure,
      });
    } catch (err: any) {
      console.error('CV Import failed:', err);
      setErrorMessage(err.message || 'Failed to parse resume document. Please check the file format.');
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
      setDragFileType(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setDragFileType(null);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);

    // Inspect drag items if available
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      const item = e.dataTransfer.items[0];
      if (item.type === WORD_DOCX_MIME || item.type.includes('word')) {
        setDragFileType('docx');
      } else if (item.type === 'application/pdf') {
        setDragFileType('pdf');
      } else {
        setDragFileType('other');
      }
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setDragFileType(null);
  };

  const handleUndo = () => {
    if (previousCv) {
      onImportComplete(previousCv, previousCv.formattedText || '');
      setLastImported(null);
      setPreviousCv(null);
    }
  };

  return (
    <div className={`bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl border border-indigo-500/30 p-4 shadow-sm relative overflow-hidden transition-all ${className}`}>
      {/* Subtle background glow */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header bar of the dropzone */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-tight">Smart CV Upload & Pre-fill Engine</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                Word .docx & PDF Auto-Map
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-normal mt-0.5">
              Drop your existing CV (<span className="text-indigo-200 font-mono font-medium">.docx</span>, <span className="text-indigo-200 font-mono font-medium">.pdf</span>, <span className="text-indigo-200 font-mono font-medium">.txt</span>) to automatically map all modular sections into the live editor
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          title={isCollapsed ? "Expand dropzone" : "Collapse dropzone"}
        >
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {!isCollapsed && (
        <>
          {/* Dropzone Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 sm:p-5 transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
              isDragging
                ? 'border-indigo-400 bg-indigo-500/25 scale-[0.99] shadow-inner ring-2 ring-indigo-400/30'
                : isProcessing
                  ? 'border-indigo-500/50 bg-slate-800/60 pointer-events-none'
                  : 'border-slate-700 hover:border-indigo-400/80 bg-slate-800/40 hover:bg-slate-800/80'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_FILE_TYPES}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleProcessFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            {isProcessing ? (
              <div className="flex flex-col items-center gap-2 py-2">
                <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                <span className="text-xs font-semibold text-indigo-200">{processingStatus}</span>
                <span className="text-[11px] text-slate-400">
                  Parsing Personal Info, Work History, Skills, Education, Languages & References...
                </span>
              </div>
            ) : isDragging ? (
              <div className="py-2 flex flex-col items-center gap-1.5">
                <div className="p-3 rounded-xl bg-indigo-500/30 text-indigo-200 border border-indigo-400/50 animate-bounce">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-white">
                  {dragFileType === 'docx' ? 'Microsoft Word (.docx) detected — Release to parse' : 'Release file to auto-populate modular sections'}
                </span>
                <span className="text-[10px] text-indigo-200">
                  Container XML parser with table & bullet preservation will execute instantly
                </span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                      Word (.docx)
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                      PDF (.pdf)
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-700/60 text-slate-300 text-[10px] font-medium">
                      Plain Text (.txt)
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-white">
                    Drop your current CV here, or <span className="text-indigo-400 underline underline-offset-2">browse file</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 max-w-xl">
                    Reads Word (.docx) containers via JSZip & XML DOM without data loss • Auto-populates <strong>Personal Info</strong>, <strong>Summary</strong>, <strong>Experience</strong>, <strong>Education</strong>, <strong>Skills</strong>, <strong>Languages</strong>, and <strong>References</strong>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Success Banner if previously imported */}
          {lastImported && !isProcessing && (
            <div className="mt-3 p-3.5 rounded-xl bg-slate-800/90 border border-emerald-500/40 text-xs space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Successfully mapped <strong>{lastImported.fileName}</strong> ({lastImported.fileSize})
                  </span>
                  {lastImported.fileFormat === 'docx' && (
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-200 text-[10px] font-mono">
                      JSZip Word XML Parser
                    </span>
                  )}
                </div>
                {previousCv && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUndo();
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-500 text-[11px] font-semibold transition-colors shrink-0 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Undo</span>
                  </button>
                )}
              </div>

              {/* Section Breakdown Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-700/60 text-[11px]">
                {lastImported.hasPersonalInfo && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                    ✓ Personal Info
                  </span>
                )}
                {lastImported.hasSummary && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                    ✓ Summary
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  ✓ {lastImported.rolesCount} Roles
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  ✓ {lastImported.educationCount} Education
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  ✓ {lastImported.skillsCount} Skills
                </span>
                {lastImported.languagesCount > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                    ✓ {lastImported.languagesCount} Languages
                  </span>
                )}
                {lastImported.referencesCount > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                    ✓ {lastImported.referencesCount} References
                  </span>
                )}
                {lastImported.docxStats && lastImported.docxStats.tablesCount > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-950/80 text-blue-300 border border-blue-500/30">
                    ✓ {lastImported.docxStats.tablesCount} Tables
                  </span>
                )}
                {lastImported.docxStats && lastImported.docxStats.bulletsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-950/80 text-blue-300 border border-blue-500/30">
                    ✓ {lastImported.docxStats.bulletsCount} Bullets
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mt-3 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 flex items-center gap-2 text-xs text-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};
