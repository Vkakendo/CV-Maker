import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { extractDocxContainerWithZip } from './docxContainerParser';

// Configure pdfjs worker to unpkg/cdnjs or inline
if (typeof window !== 'undefined' && 'Worker' in window) {
  // Use worker version matching pdfjs-dist
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export interface ParseResult {
  text: string;
  fileName: string;
  fileSize: string;
  pageCount?: number;
}

/**
 * Format bytes to readable string (e.g. 1.2 MB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Robust client-side file text parser handling:
 * - PDF documents (.pdf) using pdfjs-dist
 * - Microsoft Word (.docx) using mammoth
 * - Rich text & Plain text (.txt, .md, .rtf)
 */
export async function parseDocumentFile(file: File): Promise<ParseResult> {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const fileSize = formatFileSize(file.size);

  if (extension === 'pdf') {
    return parsePdfFile(file, fileSize);
  } else if (extension === 'docx') {
    return parseDocxFile(file, fileSize);
  } else {
    return parsePlainTextFile(file, fileSize);
  }
}

async function parsePdfFile(file: File, fileSize: string): Promise<ParseResult> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
  });

  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const textPieces: string[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Group text items by line approximately using their transform Y positions or strings
    let lastY: number | null = null;
    let pageText = '';

    for (const item of textContent.items) {
      if ('str' in item) {
        const textItem = item as { str: string; transform: number[] };
        const currentY = textItem.transform[5];
        if (lastY !== null && Math.abs(currentY - lastY) > 5) {
          pageText += '\n';
        } else if (pageText.length > 0 && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
          pageText += ' ';
        }
        pageText += textItem.str;
        lastY = currentY;
      }
    }

    if (pageText.trim()) {
      textPieces.push(pageText.trim());
    }
  }

  const combinedText = textPieces.join('\n\n');
  if (!combinedText.trim()) {
    throw new Error('PDF appears to be scanned or contains only images without readable text.');
  }

  return {
    text: combinedText,
    fileName: file.name,
    fileSize,
    pageCount: numPages,
  };
}

async function parseDocxFile(file: File, fileSize: string): Promise<ParseResult> {
  const arrayBuffer = await file.arrayBuffer();
  let text = '';

  // 1. First attempt robust direct JSZip WordProcessingML XML container parsing
  // to extract structured headings, bullet points, tables, and header/footer metadata
  try {
    const docxResult = await extractDocxContainerWithZip(arrayBuffer);
    text = docxResult.text.trim();
  } catch (err) {
    console.warn('Direct JSZip docx parsing fallback to mammoth:', err);
  }

  // 2. Fallback to mammoth if needed
  if (!text) {
    try {
      const result = await mammoth.extractRawText({ arrayBuffer });
      text = result.value.trim();
    } catch (mammothErr) {
      console.warn('Mammoth extraction failed:', mammothErr);
    }
  }

  if (!text) {
    throw new Error('Could not extract text from .docx file. It may be empty or corrupted.');
  }

  return {
    text,
    fileName: file.name,
    fileSize,
  };
}

async function parsePlainTextFile(file: File, fileSize: string): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || '';
      resolve({
        text: text.trim(),
        fileName: file.name,
        fileSize,
      });
    };
    reader.onerror = () => reject(new Error('Failed to read text file.'));
    reader.readAsText(file);
  });
}
