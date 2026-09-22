import { TailoredCv, DesignThemeConfig, SectionConfig } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generates and downloads a clean, vector/raster high-res PDF file directly in the browser
 */
export async function downloadCvPdf(cv: TailoredCv, elementId = 'cv-printable-sheet', filename?: string) {
  const targetFilename = filename || `${cv.header.name.replace(/\s+/g, '_')}_ATS_Resume.pdf`;
  const element = document.getElementById(elementId);

  if (!element) {
    window.print();
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // 2x retina crisp quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'letter',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const imgHeight = (canvasHeight * pdfWidth) / canvasWidth;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Subsequent pages if multiple pages long
    while (heightLeft > 5) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(targetFilename);
  } catch (error) {
    console.error('Direct PDF export error, falling back to print dialog:', error);
    window.print();
  }
}

/**
 * Generates an ATS-compliant Word-compatible document (.doc)
 * Using clean HTML markup that Microsoft Word, LibreOffice, and Google Docs open natively.
 */
export function downloadWordDocument(
  cv: TailoredCv, 
  filename = 'ATS_Optimized_Resume.doc',
  themeConfig?: DesignThemeConfig,
  sectionConfigs?: SectionConfig[]
) {
  const accent = themeConfig?.accentColor || '#0f172a';
  
  // Clean Calibri typography as default standard across Word exports
  const getWordFontFamily = (ff?: string) => {
    switch (ff) {
      case 'Merriweather':
        return "'Merriweather', 'Georgia', serif";
      case 'JetBrains Mono':
        return "'JetBrains Mono', 'Consolas', 'Courier New', monospace";
      case 'Plus Jakarta Sans':
        return "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, Arial, sans-serif";
      case 'Inter':
        return "'Inter', -apple-system, BlinkMacSystemFont, Arial, sans-serif";
      case 'Roboto':
        return "'Roboto', Arial, sans-serif";
      case 'Calibri':
      default:
        return "'Calibri', 'Carlito', Arial, sans-serif";
    }
  };

  const fontFamily = getWordFontFamily(themeConfig?.fontFamily);

  const headerHtml = `
    <div style="text-align: center; margin-bottom: 18px; border-bottom: 2px solid ${accent}; padding-bottom: 12px;">
      <h1 style="font-size: 24pt; margin: 0 0 4px 0; font-family: ${fontFamily}; text-transform: uppercase; letter-spacing: 0.5px; color: #090d16;">${cv.header.name}</h1>
      <p style="font-size: 13pt; margin: 0 0 6px 0; font-weight: bold; color: ${accent}; font-family: ${fontFamily};">${cv.header.title}</p>
      <p style="font-size: 10pt; color: #4a5568; margin: 0; font-family: ${fontFamily};">
        ${cv.header.location} | ${cv.header.phone} | ${cv.header.email}
        ${cv.header.linkedin ? ` | ${cv.header.linkedin}` : ''}
        ${cv.header.portfolio ? ` | ${cv.header.portfolio}` : ''}
      </p>
    </div>
  `;

  const summaryHtml = `
    <div style="margin-bottom: 14px;">
      <h2 style="font-size: 12pt; text-transform: uppercase; border-bottom: 1px solid ${accent}; margin: 0 0 6px 0; padding-bottom: 2px; font-family: ${fontFamily}; color: ${accent};">Executive Summary</h2>
      <p style="font-size: 10.5pt; line-height: 1.4; margin: 0; text-align: justify; font-family: ${fontFamily};">${cv.summary}</p>
    </div>
  `;

  const competenciesHtml = cv.coreCompetencies && cv.coreCompetencies.length > 0 ? `
    <div style="margin-bottom: 14px;">
      <h2 style="font-size: 12pt; text-transform: uppercase; border-bottom: 1px solid ${accent}; margin: 0 0 6px 0; padding-bottom: 2px; font-family: ${fontFamily}; color: ${accent};">Core Competencies</h2>
      <p style="font-size: 10pt; line-height: 1.4; margin: 0; font-family: ${fontFamily};">
        <strong>Key Domains:</strong> ${cv.coreCompetencies.join(' • ')}
      </p>
    </div>
  ` : '';

  const experienceHtml = `
    <div style="margin-bottom: 14px;">
      <h2 style="font-size: 12pt; text-transform: uppercase; border-bottom: 1px solid ${accent}; margin: 0 0 8px 0; padding-bottom: 2px; font-family: ${fontFamily}; color: ${accent};">Professional Experience</h2>
      ${cv.experience.map(exp => `
        <div style="margin-bottom: 12px;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 4px; font-family: ${fontFamily};">
            <tr>
              <td style="font-size: 11pt; font-weight: bold; color: #1a202c; text-align: left;">${exp.company}</td>
              <td style="font-size: 10pt; text-align: right; color: #4a5568;">${exp.location}</td>
            </tr>
            <tr>
              <td style="font-size: 10.5pt; font-style: italic; color: #2d3748; text-align: left;">${exp.role}</td>
              <td style="font-size: 10pt; font-style: italic; text-align: right; color: #4a5568;">${exp.startDate} – ${exp.endDate}</td>
            </tr>
          </table>
          <ul style="margin: 0; padding-left: 20px; font-size: 10pt; line-height: 1.35; font-family: ${fontFamily};">
            ${exp.bullets.map(b => `<li style="margin-bottom: 4px;">${b}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </div>
  `;

  const projectsHtml = cv.projects && cv.projects.length > 0 ? `
    <div style="margin-bottom: 14px;">
      <h2 style="font-size: 12pt; text-transform: uppercase; border-bottom: 1px solid ${accent}; margin: 0 0 8px 0; padding-bottom: 2px; font-family: ${fontFamily}; color: ${accent};">Projects & Key Initiatives</h2>
      ${cv.projects.map(proj => `
        <div style="margin-bottom: 10px;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 3px; font-family: ${fontFamily};">
            <tr>
              <td style="font-size: 10.5pt; font-weight: bold; color: #1a202c; text-align: left;">
                ${proj.title}${proj.role ? ` (${proj.role})` : ''}
              </td>
              <td style="font-size: 10pt; text-align: right; color: #4a5568;">
                ${proj.startDate ? `${proj.startDate} – ${proj.endDate || 'Present'}` : ''}
              </td>
            </tr>
          </table>
          <ul style="margin: 0; padding-left: 20px; font-size: 10pt; line-height: 1.35; font-family: ${fontFamily};">
            ${proj.bullets.map(b => `<li style="margin-bottom: 3px;">${b}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </div>
  ` : '';

  const educationHtml = `
    <div style="margin-bottom: 14px;">
      <h2 style="font-size: 12pt; text-transform: uppercase; border-bottom: 1px solid ${accent}; margin: 0 0 8px 0; padding-bottom: 2px; font-family: ${fontFamily}; color: ${accent};">Education</h2>
      ${cv.education.map(edu => `
        <div style="margin-bottom: 6px;">
          <table style="width: 100%; border-collapse: collapse; font-family: ${fontFamily};">
            <tr>
              <td style="font-size: 10.5pt; font-weight: bold; color: #1a202c;">${edu.institution}</td>
              <td style="font-size: 10pt; text-align: right; color: #4a5568;">${edu.location}</td>
            </tr>
            <tr>
              <td style="font-size: 10pt; color: #2d3748;">${edu.degree}${edu.honors ? ` — <em>${edu.honors}</em>` : ''}</td>
              <td style="font-size: 10pt; text-align: right; color: #4a5568;">${edu.graduationDate}</td>
            </tr>
          </table>
        </div>
      `).join('')}
    </div>
  `;

  const skillsHtml = cv.skills && cv.skills.length > 0 ? `
    <div style="margin-bottom: 14px;">
      <h2 style="font-size: 12pt; text-transform: uppercase; border-bottom: 1px solid ${accent}; margin: 0 0 6px 0; padding-bottom: 2px; font-family: ${fontFamily}; color: ${accent};">Skills & Technologies</h2>
      <ul style="margin: 0; padding-left: 20px; font-size: 10pt; line-height: 1.4; font-family: ${fontFamily};">
        ${cv.skills.map(s => `<li style="margin-bottom: 3px;"><strong>${s.category}:</strong> ${s.items.join(', ')}</li>`).join('')}
      </ul>
    </div>
  ` : '';

  const certsHtml = cv.certifications && cv.certifications.length > 0 ? `
    <div style="margin-bottom: 14px;">
      <h2 style="font-size: 12pt; text-transform: uppercase; border-bottom: 1px solid ${accent}; margin: 0 0 6px 0; padding-bottom: 2px; font-family: ${fontFamily}; color: ${accent};">Certifications</h2>
      <ul style="margin: 0; padding-left: 20px; font-size: 10pt; line-height: 1.4; font-family: ${fontFamily};">
        ${cv.certifications.map(c => `<li><strong>${c.name}</strong>${c.issuer ? ` — ${c.issuer}` : ''}${c.date ? ` (${c.date})` : ''}</li>`).join('')}
      </ul>
    </div>
  ` : '';

  const languagesHtml = cv.languages && cv.languages.length > 0 ? `
    <div style="margin-bottom: 14px;">
      <h2 style="font-size: 12pt; text-transform: uppercase; border-bottom: 1px solid ${accent}; margin: 0 0 6px 0; padding-bottom: 2px; font-family: ${fontFamily}; color: ${accent};">Languages</h2>
      <ul style="margin: 0; padding-left: 20px; font-size: 10pt; line-height: 1.4; font-family: ${fontFamily};">
        ${cv.languages.map(l => `<li><strong>${l.language}:</strong> ${l.proficiency}</li>`).join('')}
      </ul>
    </div>
  ` : '';

  const referencesHtml = cv.references && cv.references.length > 0 ? `
    <div style="margin-bottom: 14px;">
      <h2 style="font-size: 12pt; text-transform: uppercase; border-bottom: 1px solid ${accent}; margin: 0 0 6px 0; padding-bottom: 2px; font-family: ${fontFamily}; color: ${accent};">References</h2>
      <div style="font-size: 10pt; line-height: 1.4; font-family: ${fontFamily};">
        ${cv.references.map(r => `<p style="margin: 0 0 6px 0;"><strong>${r.name}</strong> — ${r.title || ''}${r.company ? ` (${r.company})` : ''}${r.contact ? ` | ${r.contact}` : ''}</p>`).join('')}
      </div>
    </div>
  ` : '';

  const isTwoColumn = themeConfig?.template === 'Timeline Sidebar (Executive Modern)';

  let bodyHtml = '';
  if (isTwoColumn) {
    const sidebarHtml = `
      <div style="margin-bottom: 18px;">
        <h3 style="font-size: 11pt; text-transform: uppercase; border-bottom: 1.5px solid ${accent}; padding-bottom: 2px; margin: 0 0 8px 0; color: ${accent}; font-family: ${fontFamily};">Contact Details</h3>
        <p style="font-size: 9.5pt; margin: 0 0 4px 0; color: #334155; font-family: ${fontFamily};"><strong>Phone:</strong> ${cv.header.phone}</p>
        <p style="font-size: 9.5pt; margin: 0 0 4px 0; color: #334155; font-family: ${fontFamily};"><strong>Email:</strong> ${cv.header.email}</p>
        <p style="font-size: 9.5pt; margin: 0 0 4px 0; color: #334155; font-family: ${fontFamily};"><strong>Location:</strong> ${cv.header.location}</p>
        ${cv.header.linkedin ? `<p style="font-size: 9.5pt; margin: 0 0 4px 0; color: #334155; font-family: ${fontFamily};"><strong>LinkedIn:</strong> ${cv.header.linkedin}</p>` : ''}
        ${cv.header.portfolio ? `<p style="font-size: 9.5pt; margin: 0 0 4px 0; color: #334155; font-family: ${fontFamily};"><strong>Portfolio:</strong> ${cv.header.portfolio}</p>` : ''}
      </div>
      ${skillsHtml}
      ${languagesHtml}
      ${referencesHtml}
      ${certsHtml}
    `;

    const mainHtml = `
      <div style="margin-bottom: 16px; border-bottom: 2px solid ${accent}; padding-bottom: 8px;">
        <h1 style="font-size: 22pt; margin: 0 0 4px 0; font-family: ${fontFamily}; text-transform: uppercase; color: #090d16;">${cv.header.name}</h1>
        <p style="font-size: 12.5pt; margin: 0; font-weight: bold; color: ${accent}; font-family: ${fontFamily};">${cv.header.title}</p>
      </div>
      ${summaryHtml}
      ${competenciesHtml}
      ${experienceHtml}
      ${projectsHtml}
      ${educationHtml}
    `;

    bodyHtml = `
      <table style="width: 100%; border-collapse: collapse; margin: 0;">
        <tr>
          <td style="width: 32%; vertical-align: top; background-color: #f1f5f9; padding: 14px; border-right: 2px solid #cbd5e1;">
            ${sidebarHtml}
          </td>
          <td style="width: 68%; vertical-align: top; padding: 14px 18px;">
            ${mainHtml}
          </td>
        </tr>
      </table>
    `;
  } else {
    bodyHtml = `
      ${headerHtml}
      ${summaryHtml}
      ${competenciesHtml}
      ${experienceHtml}
      ${projectsHtml}
      ${educationHtml}
      ${skillsHtml}
      ${certsHtml}
      ${languagesHtml}
      ${referencesHtml}
    `;
  }

  const documentContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${cv.header.name} - Resume</title>
      <style>
        @page {
          size: 8.5in 11in;
          margin: 0.5in;
        }
        body {
          font-family: ${fontFamily};
          font-size: 10.5pt;
          line-height: 1.35;
          color: #1a202c;
        }
        h1, h2, h3, h4, p, td, th, li, span, a {
          font-family: ${fontFamily};
        }
      </style>
    </head>
    <body>
      ${bodyHtml}
    </body>
    </html>
  `;

  const blob = new Blob([documentContent], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads plain markdown version
 */
export function downloadMarkdown(cv: TailoredCv, filename = 'ATS_Optimized_Resume.md') {
  let md = `# ${cv.header.name.toUpperCase()}\n`;
  if (cv.header.title) md += `**${cv.header.title}**\n\n`;
  md += `${cv.header.location} | ${cv.header.phone} | ${cv.header.email}\n`;
  if (cv.header.linkedin) md += `LinkedIn: ${cv.header.linkedin} | `;
  if (cv.header.portfolio) md += `Portfolio: ${cv.header.portfolio}\n`;
  md += `\n---\n\n`;

  md += `## EXECUTIVE SUMMARY\n${cv.summary}\n\n`;

  if (cv.coreCompetencies?.length) {
    md += `## CORE COMPETENCIES\n${cv.coreCompetencies.join(' • ')}\n\n`;
  }

  md += `## PROFESSIONAL EXPERIENCE\n`;
  cv.experience.forEach(exp => {
    md += `### ${exp.role} | ${exp.company} — ${exp.location}\n`;
    md += `*${exp.startDate} – ${exp.endDate}*\n\n`;
    exp.bullets.forEach(b => {
      md += `- ${b}\n`;
    });
    md += `\n`;
  });

  if (cv.projects?.length) {
    md += `## PROJECTS & INITIATIVES\n`;
    cv.projects.forEach(p => {
      md += `### ${p.title}${p.role ? ` (${p.role})` : ''}\n`;
      if (p.startDate) md += `*${p.startDate} – ${p.endDate || 'Present'}*\n\n`;
      p.bullets.forEach(b => {
        md += `- ${b}\n`;
      });
      md += `\n`;
    });
  }

  md += `## EDUCATION\n`;
  cv.education.forEach(edu => {
    md += `### ${edu.institution} — ${edu.location}\n`;
    md += `${edu.degree}${edu.honors ? ` — ${edu.honors}` : ''} | Graduated: ${edu.graduationDate}\n\n`;
  });

  if (cv.skills?.length) {
    md += `## SKILLS & TECHNOLOGIES\n`;
    cv.skills.forEach(s => {
      md += `- **${s.category}:** ${s.items.join(', ')}\n`;
    });
    md += `\n`;
  }

  if (cv.certifications?.length) {
    md += `## CERTIFICATIONS\n`;
    cv.certifications.forEach(c => {
      md += `- **${c.name}**${c.issuer ? ` (${c.issuer})` : ''}${c.date ? ` — ${c.date}` : ''}\n`;
    });
    md += `\n`;
  }

  if (cv.languages?.length) {
    md += `## LANGUAGES\n`;
    cv.languages.forEach(l => {
      md += `- **${l.language}:** ${l.proficiency}\n`;
    });
    md += `\n`;
  }

  if (cv.references?.length) {
    md += `## REFERENCES\n`;
    cv.references.forEach(r => {
      md += `- **${r.name}** — ${r.title || ''}${r.company ? ` (${r.company})` : ''}${r.contact ? ` | ${r.contact}` : ''}\n`;
    });
    md += `\n`;
  }

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Copies clean ATS plain text to clipboard
 */
export async function copyAtsPlainText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}

/**
 * Local Storage Draft Persistence
 */
const STORAGE_KEY = 'ats_resume_builder_draft_v2';

export interface SavedDraft {
  cv: TailoredCv;
  themeConfig: DesignThemeConfig;
  sectionConfigs: SectionConfig[];
  updatedAt: string;
}

export function saveCvDraft(draft: SavedDraft): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    return true;
  } catch (err) {
    console.error('Could not save resume draft to localStorage:', err);
    return false;
  }
}

export function loadCvDraft(): SavedDraft | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Could not load resume draft from localStorage:', err);
    return null;
  }
}

export function clearCvDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Could not clear resume draft:', err);
  }
}
