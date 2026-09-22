import JSZip from 'jszip';

export interface ExtractedDocxStructure {
  text: string;
  paragraphs: string[];
  headings: string[];
  bulletPoints: string[];
  tables: string[][][]; // table -> rows -> cells
  metadata: {
    paragraphsCount: number;
    headingsCount: number;
    bulletsCount: number;
    tablesCount: number;
    headerText?: string;
  };
}

/**
 * Robust client-side parser that opens .docx container files as ZIP archives,
 * parses WordProcessingML XML (word/document.xml, word/header*.xml),
 * and extracts structured headings, bullet points, tables, and paragraphs
 * without data loss.
 */
export async function extractDocxContainerWithZip(
  arrayBuffer: ArrayBuffer
): Promise<ExtractedDocxStructure> {
  const zip = await JSZip.loadAsync(arrayBuffer);

  // 1. Check for word/document.xml
  const docFile = zip.file('word/document.xml');
  if (!docFile) {
    throw new Error('Invalid .docx container: missing word/document.xml');
  }

  const docXml = await docFile.async('text');
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(docXml, 'application/xml');

  // Check for XML parsing error
  if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
    // Fallback to text/xml parser
    const fallbackDoc = parser.parseFromString(docXml, 'text/xml');
    if (fallbackDoc.getElementsByTagName('parsererror').length > 0) {
      throw new Error('Failed to parse Word document XML structure.');
    }
  }

  // 2. Extract any document headers (frequent location for candidate name & contact info in Word templates)
  const headerTexts: string[] = [];
  const headerFiles = Object.keys(zip.files).filter(name => /^word\/header\d+\.xml$/i.test(name));
  
  for (const headerName of headerFiles) {
    try {
      const headerXml = await zip.files[headerName].async('text');
      const headerDoc = parser.parseFromString(headerXml, 'application/xml');
      const hText = extractTextFromWordXmlDoc(headerDoc);
      if (hText.trim()) {
        headerTexts.push(hText.trim());
      }
    } catch {
      // Ignore non-critical header read issues
    }
  }

  // 3. Process the main document body
  const bodyNode = findChildByLocalName(xmlDoc.documentElement, 'body');
  if (!bodyNode) {
    throw new Error('Invalid Word document: no document body found');
  }

  const paragraphs: string[] = [];
  const headings: string[] = [];
  const bulletPoints: string[] = [];
  const tables: string[][][] = [];
  const documentLines: string[] = [];

  // Prepend headers if found
  if (headerTexts.length > 0) {
    const combinedHeader = headerTexts.join('\n');
    documentLines.push(combinedHeader);
    documentLines.push('');
  }

  // Iterate over direct body children (paragraphs <w:p> and tables <w:tbl>)
  for (let i = 0; i < bodyNode.childNodes.length; i++) {
    const node = bodyNode.childNodes[i];
    if (node.nodeType !== Node.ELEMENT_NODE) continue;

    const localName = (node as Element).localName?.toLowerCase() || '';

    if (localName === 'p') {
      const pResult = parseParagraphElement(node as Element);
      if (pResult.text) {
        paragraphs.push(pResult.text);
        documentLines.push(pResult.text);

        if (pResult.isHeading) {
          headings.push(pResult.text);
        }
        if (pResult.isBullet) {
          bulletPoints.push(pResult.text);
        }
      }
    } else if (localName === 'tbl') {
      const tableData = parseTableElement(node as Element);
      if (tableData.rows.length > 0) {
        tables.push(tableData.rows);

        // Append structured table text into document flow
        const formattedTable = formatTableText(tableData.rows);
        if (formattedTable.trim()) {
          documentLines.push(formattedTable);
          documentLines.push('');
        }
      }
    } else if (localName === 'sdt') {
      // Structured Document Tag (Content controls often used in modern CV templates)
      const sdtContent = findChildByLocalName(node as Element, 'sdtContent');
      if (sdtContent) {
        for (let j = 0; j < sdtContent.childNodes.length; j++) {
          const childNode = sdtContent.childNodes[j];
          if (childNode.nodeType !== Node.ELEMENT_NODE) continue;
          const childLocal = (childNode as Element).localName?.toLowerCase() || '';
          if (childLocal === 'p') {
            const pResult = parseParagraphElement(childNode as Element);
            if (pResult.text) {
              paragraphs.push(pResult.text);
              documentLines.push(pResult.text);
              if (pResult.isHeading) headings.push(pResult.text);
              if (pResult.isBullet) bulletPoints.push(pResult.text);
            }
          }
        }
      }
    }
  }

  const fullText = documentLines.join('\n').replace(/\n{3,}/g, '\n\n').trim();

  return {
    text: fullText,
    paragraphs,
    headings,
    bulletPoints,
    tables,
    metadata: {
      paragraphsCount: paragraphs.length,
      headingsCount: headings.length,
      bulletsCount: bulletPoints.length,
      tablesCount: tables.length,
      headerText: headerTexts.join(' | ') || undefined,
    }
  };
}

/**
 * Extracts plain text from an XML document (useful for headers/footers)
 */
function extractTextFromWordXmlDoc(doc: Document): string {
  const pElements = doc.getElementsByTagNameNS('*', 'p');
  const lines: string[] = [];

  for (let i = 0; i < pElements.length; i++) {
    const p = pElements[i];
    const parsed = parseParagraphElement(p);
    if (parsed.text) {
      lines.push(parsed.text);
    }
  }

  return lines.join('\n');
}

interface ParsedParagraph {
  text: string;
  isHeading: boolean;
  isBullet: boolean;
}

/**
 * Parses a <w:p> paragraph element, preserving bold headings, bullet lists,
 * tabs, line breaks, and hyperlinks.
 */
function parseParagraphElement(pElem: Element): ParsedParagraph {
  // Check paragraph properties
  const pPr = findChildByLocalName(pElem, 'pPr');
  let isHeading = false;
  let isBullet = false;

  if (pPr) {
    // 1. Heading check via <w:pStyle w:val="..." />
    const pStyle = findChildByLocalName(pPr, 'pStyle');
    if (pStyle) {
      const styleVal = pStyle.getAttribute('w:val') || pStyle.getAttribute('val') || '';
      if (/Heading\d?|Title|Subtitle|Header/i.test(styleVal)) {
        isHeading = true;
      }
    }

    // 2. Bullet / Numbered list check via <w:numPr>
    const numPr = findChildByLocalName(pPr, 'numPr');
    if (numPr) {
      isBullet = true;
    }
  }

  // Extract runs and text inside this paragraph
  const textParts: string[] = [];

  for (let i = 0; i < pElem.childNodes.length; i++) {
    const child = pElem.childNodes[i];
    if (child.nodeType !== Node.ELEMENT_NODE) continue;

    const childLocal = (child as Element).localName?.toLowerCase() || '';

    if (childLocal === 'r') {
      // Run element
      const runText = extractRunText(child as Element);
      if (runText) {
        textParts.push(runText);
      }
    } else if (childLocal === 'hyperlink') {
      // Hyperlink element
      const linkRuns = child.childNodes;
      for (let k = 0; k < linkRuns.length; k++) {
        if (linkRuns[k].nodeType === Node.ELEMENT_NODE) {
          const runText = extractRunText(linkRuns[k] as Element);
          if (runText) textParts.push(runText);
        }
      }
    }
  }

  let text = textParts.join('').trim();
  if (!text) {
    return { text: '', isHeading: false, isBullet: false };
  }

  // Check if text starts with bullet glyphs (•, -, *, etc.)
  const startsWithBulletChar = /^[•\-\*–▪·o\u2022\u25cf\u25aa]\s*/.test(text);

  if (isBullet && !startsWithBulletChar) {
    // Ensure clean bullet format for downstream CV section parser
    text = `• ${text}`;
  } else if (startsWithBulletChar) {
    isBullet = true;
  }

  // Check heuristic heading (short line, uppercase, or ends with colon)
  if (!isHeading && text.length < 50 && !isBullet) {
    const cleanHeader = text.replace(/[:\-—•#*]/g, '').trim().toUpperCase();
    const commonSectionNames = [
      'EXPERIENCE', 'WORK EXPERIENCE', 'PROFESSIONAL EXPERIENCE', 'EMPLOYMENT HISTORY',
      'EDUCATION', 'ACADEMIC BACKGROUND', 'QUALIFICATIONS',
      'SKILLS', 'TECHNICAL SKILLS', 'CORE COMPETENCIES', 'AREAS OF EXPERTISE',
      'SUMMARY', 'PROFESSIONAL SUMMARY', 'PROFILE', 'ABOUT ME', 'OBJECTIVE',
      'PROJECTS', 'KEY PROJECTS', 'CERTIFICATIONS', 'LANGUAGES', 'REFERENCES'
    ];
    if (commonSectionNames.includes(cleanHeader)) {
      isHeading = true;
    }
  }

  return { text, isHeading, isBullet };
}

/**
 * Extracts text from a <w:r> run element, handling <w:t>, <w:tab/>, and <w:br/>
 */
function extractRunText(rElem: Element): string {
  let result = '';

  for (let i = 0; i < rElem.childNodes.length; i++) {
    const node = rElem.childNodes[i];
    if (node.nodeType !== Node.ELEMENT_NODE) continue;

    const localName = (node as Element).localName?.toLowerCase() || '';

    if (localName === 't') {
      // Text node
      result += node.textContent || '';
    } else if (localName === 'tab') {
      result += '\t';
    } else if (localName === 'br' || localName === 'cr') {
      result += '\n';
    }
  }

  return result;
}

interface ParsedTable {
  rows: string[][];
}

/**
 * Parses a <w:tbl> table element into structured rows and cells.
 */
function parseTableElement(tblElem: Element): ParsedTable {
  const rows: string[][] = [];

  for (let i = 0; i < tblElem.childNodes.length; i++) {
    const rowNode = tblElem.childNodes[i];
    if (rowNode.nodeType !== Node.ELEMENT_NODE) continue;

    if ((rowNode as Element).localName?.toLowerCase() === 'tr') {
      const cells: string[] = [];

      for (let j = 0; j < rowNode.childNodes.length; j++) {
        const cellNode = rowNode.childNodes[j];
        if (cellNode.nodeType !== Node.ELEMENT_NODE) continue;

        if ((cellNode as Element).localName?.toLowerCase() === 'tc') {
          // Parse all paragraphs inside this cell
          const cellParagraphs: string[] = [];

          for (let k = 0; k < cellNode.childNodes.length; k++) {
            const pNode = cellNode.childNodes[k];
            if (pNode.nodeType !== Node.ELEMENT_NODE) continue;

            if ((pNode as Element).localName?.toLowerCase() === 'p') {
              const pRes = parseParagraphElement(pNode as Element);
              if (pRes.text) {
                cellParagraphs.push(pRes.text);
              }
            }
          }

          cells.push(cellParagraphs.join('\n'));
        }
      }

      if (cells.some(c => c.trim().length > 0)) {
        rows.push(cells);
      }
    }
  }

  return { rows };
}

/**
 * Formats table rows into human-readable, parser-friendly text.
 * Handles:
 * 1) 2-column resume layout (e.g. Left = Skills, Right = Experience)
 * 2) Multi-column metadata (e.g. Role | Company | Dates)
 */
function formatTableText(rows: string[][]): string {
  if (rows.length === 0) return '';

  // Check if this is a large 2-column resume layout container
  // (e.g. 1 or 2 rows where cells contain long multi-line paragraphs)
  const isMultiColumnLayout = rows.length <= 3 && rows.some(row => 
    row.length === 2 && row.some(cell => cell.split('\n').length >= 3)
  );

  if (isMultiColumnLayout) {
    const columnBlocks: string[] = [];
    // Extract column by column so sections (like Experience vs Skills) aren't mixed into disjoint lines
    const numCols = Math.max(...rows.map(r => r.length));
    for (let colIdx = 0; colIdx < numCols; colIdx++) {
      const colTexts: string[] = [];
      for (const row of rows) {
        if (row[colIdx]?.trim()) {
          colTexts.push(row[colIdx].trim());
        }
      }
      if (colTexts.length > 0) {
        columnBlocks.push(colTexts.join('\n\n'));
      }
    }
    return columnBlocks.join('\n\n');
  }

  // Standard tabular format: join non-empty cells with " | "
  const lines: string[] = [];
  for (const row of rows) {
    const cleanCells = row.map(c => c.trim()).filter(Boolean);
    if (cleanCells.length > 0) {
      lines.push(cleanCells.join(' | '));
    }
  }

  return lines.join('\n');
}

/**
 * Helper to find child element by localName (namespace agnostic)
 */
function findChildByLocalName(parent: Element, localNameTarget: string): Element | null {
  const target = localNameTarget.toLowerCase();
  for (let i = 0; i < parent.childNodes.length; i++) {
    const node = parent.childNodes[i];
    if (node.nodeType === Node.ELEMENT_NODE) {
      if ((node as Element).localName?.toLowerCase() === target) {
        return node as Element;
      }
    }
  }
  return null;
}
