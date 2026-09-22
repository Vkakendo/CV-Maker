import React, { useRef, useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Loader2, 
  FileCode2,
  Edit3,
  FileCheck,
  Eye,
  Copy,
  Check
} from 'lucide-react';
import { parseDocumentFile } from '../utils/fileParser';
import { UploadedFileMetadata } from '../types';

interface FileUploadZoneProps {
  id: string;
  label: string;
  sublabel: string;
  acceptTypes?: string;
  textValue: string;
  onTextChange: (text: string) => void;
  placeholder: string;
  accentColor?: 'indigo' | 'emerald';
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  id,
  label,
  sublabel,
  acceptTypes = '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.doc,application/msword,.pdf,application/pdf,.txt,text/plain,.md,.rtf',
  textValue,
  onTextChange,
  placeholder,
  accentColor = 'indigo'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [fileMeta, setFileMeta] = useState<UploadedFileMetadata | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setParseError('File size exceeds the 15MB limit. Please upload a smaller document.');
      return;
    }

    setIsParsing(true);
    setParseError(null);

    try {
      const result = await parseDocumentFile(file);
      onTextChange(result.text);
      setFileMeta({
        name: result.fileName,
        size: result.fileSize,
        type: file.name.split('.').pop()?.toUpperCase() || 'DOC',
        pageCount: result.pageCount,
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } catch (err: any) {
      console.error('File parsing error:', err);
      setParseError(err.message || 'Failed to extract text from document. Please ensure the file is not corrupted or password-protected.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClear = () => {
    onTextChange('');
    setFileMeta(null);
    setParseError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCopy = async () => {
    if (!textValue) return;
    try {
      await navigator.clipboard.writeText(textValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error(e);
    }
  };

  const wordCount = textValue.trim() ? textValue.trim().split(/\s+/).length : 0;
  const charCount = textValue.length;

  const isIndigo = accentColor === 'indigo';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col h-full overflow-hidden">
      
      {/* Top Header Card */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl ${isIndigo ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'} border ${isIndigo ? 'border-indigo-100' : 'border-emerald-100'}`}>
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{label}</span>
              {fileMeta && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  {fileMeta.type} Active
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-500 font-normal mt-0.5">
              {sublabel}
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          {textValue && (
            <>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Copy raw text"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Clear contents"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col space-y-4">
        {/* Sleek Drag & Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 group ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99] shadow-inner'
              : 'border-slate-200 hover:border-indigo-400/80 bg-slate-50/40 hover:bg-slate-50/90'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptTypes}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                processFile(e.target.files[0]);
              }
            }}
            className="hidden"
            id={`file-input-${id}`}
          />

          {isParsing ? (
            <div className="flex flex-col items-center justify-center py-2 text-slate-700">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
              </div>
              <span className="text-xs font-semibold text-slate-800">
                Parsing Document Semantics...
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                Extracting typography hierarchy & text flow client-side
              </span>
            </div>
          ) : fileMeta ? (
            <div className="flex items-center justify-between px-2 py-1 text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {fileMeta.type}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 truncate max-w-[180px] sm:max-w-[280px]">
                    {fileMeta.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {fileMeta.size} {fileMeta.pageCount ? `• ${fileMeta.pageCount} page(s)` : ''} • Uploaded at {fileMeta.uploadedAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-200/80 transition-colors">
                  Replace Document
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-1.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-indigo-50 flex items-center justify-center mb-1.5 transition-colors">
                <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </div>
              
              <div className="text-xs font-semibold text-slate-800">
                <span className="text-indigo-600 font-bold hover:underline">Choose a file</span> or drag & drop here
              </div>

              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  .PDF
                </span>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  .DOCX
                </span>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  .TXT
                </span>
                <span className="text-[10px] text-slate-400 ml-1">
                  up to 15MB
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {parseError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-[11px] leading-relaxed">
              <strong className="font-semibold">Parsing Notice:</strong> {parseError}
            </div>
          </div>
        )}

        {/* Direct Text Editor Box */}
        <div className="flex-1 flex flex-col min-h-[220px]">
          <div className="relative flex-1 flex flex-col">
            <textarea
              id={`textarea-${id}`}
              value={textValue}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder={placeholder}
              rows={8}
              className="w-full flex-1 p-3.5 text-xs font-mono text-slate-800 bg-slate-50/60 hover:bg-slate-50/80 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-y leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-600">
                {wordCount} words
              </span>
              <span>•</span>
              <span>{charCount.toLocaleString()} characters</span>
            </div>
            <span className="text-slate-400 flex items-center gap-1">
              <Edit3 className="w-3 h-3" />
              Directly editable
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
