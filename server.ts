import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Google GenAI lazily / safely
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// CV Optimization Endpoint
app.post("/api/optimize-cv", async (req, res) => {
  try {
    const { 
      currentCv, 
      targetJd, 
      designPreference = "Preserve Original Structure", 
      customNotes = "",
      customizationOptions = {}
    } = req.body;

    if (!currentCv || !currentCv.trim()) {
      return res.status(400).json({ error: "Candidate CV content is required." });
    }
    if (!targetJd || !targetJd.trim()) {
      return res.status(400).json({ error: "Target Job Description is required." });
    }

    const ai = getGenAI();

    const systemPrompt = `You are an elite, expert-level CV/Resume Designer and ATS (Applicant Tracking System) Optimization Specialist with 15+ years of experience helping candidates pass strict corporate screening algorithms at Fortune 500 companies (such as Google, Amazon, Microsoft, Goldman Sachs, and McKinsey).

Your mission is to analyze the candidate's [CURRENT_CV] and the [TARGET_JD], then rewrite and optimize the CV to achieve maximum ATS keyword alignment, pass strict ATS parsers (Workday, Taleo, Greenhouse, Lever), and elevate every bullet using Google's X-Y-Z formula: "Achieved [X], measured by [Y], by doing [Z]".

Strict Operating Rules:
1. HONESTY & INTEGRITY (Absolute Mandate): Never hallucinate fake jobs, nonexistent degrees, or unearned credentials. Only reframe, re-weight, articulate, and elevate the candidate's actual documented experience and capabilities to speak the language of the target role. If estimating missing metrics for the XYZ formula, use reasonable, conservative brackets or realistic industry ranges (e.g. "[~20-30% improvement]") and clearly note them.
2. ATS KEYWORD ALIGNMENT: Extract critical hard skills, tools/technologies, methodologies, and soft skills from the JD. Naturally integrate them into the summary, experience bullets, and skills section without keyword stuffing.
3. GOOGLE XYZ IMPACT BULLETS: Rewrite experience bullets starting with high-impact power action verbs (Spearheaded, Orchestrated, Engineered, Championed, Accelerated, Overhauled) following "Achieved [X], measured by [Y], by doing [Z]".
4. PRESERVE DESIGN & STRUCTURE: Follow the requested design preference: "${designPreference}". Ensure a logical hierarchy (Header, Executive Summary, Core Competencies, Professional Experience, Education, Technical Skills, Certifications).
5. STRUCTURED OUTPUT: Return a comprehensive, perfectly valid JSON object complying with the specified schema.`;

    const userPrompt = `
Here is the Candidate's Current CV:
--- CURRENT_CV START ---
${currentCv}
--- CURRENT_CV END ---

Here is the Target Job Description:
--- TARGET_JD START ---
${targetJd}
--- TARGET_JD END ---

Design Preference: ${designPreference}
${customizationOptions.targetTone ? `Target Tone: ${customizationOptions.targetTone}` : ''}
${customizationOptions.xyzIntensity ? `XYZ Metric Intensity: ${customizationOptions.xyzIntensity}` : ''}
${customizationOptions.prioritizeHardSkills ? `Priority: Heavily prioritize JD Hard Skills and Specialized Tech Stack` : ''}
${customizationOptions.strictSingleColumn ? `Layout: Enforce strict single-column ATS parser compatibility` : ''}
${customizationOptions.pageTarget ? `Page Target Constraint: ${customizationOptions.pageTarget}` : ''}
${customNotes ? `Additional Candidate Notes: ${customNotes}` : ""}

Please execute the complete ATS optimization, keyword alignment, Google XYZ formula transformations, and structured CV generation. Provide detailed analytics in the summary.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            atsScoreBefore: {
              type: Type.INTEGER,
              description: "Estimated ATS match percentage before optimization (e.g., 45-65)",
            },
            atsScoreAfter: {
              type: Type.INTEGER,
              description: "Optimized ATS match percentage after keyword alignment and formatting (e.g., 90-98)",
            },
            summary: {
              type: Type.OBJECT,
              properties: {
                executiveOverview: {
                  type: Type.STRING,
                  description: "Professional assessment of the candidate-to-role match and how the strategic overhaul bypasses ATS algorithms.",
                },
                keyChanges: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "List of 4-6 primary strategic changes made to content, keywords, and metrics.",
                },
                matchedKeywords: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      keyword: { type: Type.STRING },
                      category: {
                        type: Type.STRING,
                        description: "Hard Skill | Tool/Tech | Soft Skill | Methodology | Certification",
                      },
                      status: {
                        type: Type.STRING,
                        description: "Preserved | Newly Integrated | Elevated",
                      },
                      relevance: { type: Type.STRING, description: "High | Critical | Medium" },
                    },
                    required: ["keyword", "category", "status", "relevance"],
                  },
                },
                missingGaps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      keyword: { type: Type.STRING },
                      suggestion: { type: Type.STRING },
                    },
                    required: ["keyword", "suggestion"],
                  },
                  description: "Keywords from JD that could not be honestly integrated without inventing experience, with interview prep advice.",
                },
                xyzTransforms: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      original: { type: Type.STRING },
                      optimized: { type: Type.STRING },
                      actionVerb: { type: Type.STRING },
                      achievedX: { type: Type.STRING },
                      measuredByY: { type: Type.STRING },
                      byDoingZ: { type: Type.STRING },
                    },
                    required: ["original", "optimized", "actionVerb", "achievedX", "measuredByY", "byDoingZ"],
                  },
                  description: "3-5 representative bullet point transformations demonstrating the Google XYZ formula.",
                },
                atsComplianceChecks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      category: { type: Type.STRING },
                      status: { type: Type.STRING, description: "Pass | Optimized | Warning" },
                      details: { type: Type.STRING },
                    },
                    required: ["category", "status", "details"],
                  },
                  description: "Audit items such as Header Parsing, Contact Info Safety, Standard Section Headers, Chronology, Clean Typography.",
                },
              },
              required: ["executiveOverview", "keyChanges", "matchedKeywords", "xyzTransforms", "atsComplianceChecks"],
            },
            tailoredCv: {
              type: Type.OBJECT,
              properties: {
                header: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    title: { type: Type.STRING },
                    email: { type: Type.STRING },
                    phone: { type: Type.STRING },
                    location: { type: Type.STRING },
                    linkedin: { type: Type.STRING },
                    portfolio: { type: Type.STRING },
                  },
                  required: ["name", "title", "email", "phone", "location"],
                },
                summary: {
                  type: Type.STRING,
                  description: "3-4 sentence high-impact executive summary tuned with JD target keywords.",
                },
                coreCompetencies: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Key domain skills & methodologies matched to the JD (8-16 items).",
                },
                experience: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      company: { type: Type.STRING },
                      role: { type: Type.STRING },
                      location: { type: Type.STRING },
                      startDate: { type: Type.STRING },
                      endDate: { type: Type.STRING },
                      bullets: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                    },
                    required: ["company", "role", "location", "startDate", "endDate", "bullets"],
                  },
                },
                education: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      institution: { type: Type.STRING },
                      degree: { type: Type.STRING },
                      location: { type: Type.STRING },
                      graduationDate: { type: Type.STRING },
                      honors: { type: Type.STRING },
                    },
                    required: ["institution", "degree", "location", "graduationDate"],
                  },
                },
                skills: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      category: { type: Type.STRING },
                      items: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                    },
                    required: ["category", "items"],
                  },
                },
                certifications: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      issuer: { type: Type.STRING },
                      date: { type: Type.STRING },
                    },
                    required: ["name"],
                  },
                },
                languages: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      language: { type: Type.STRING },
                      proficiency: { type: Type.STRING },
                    },
                    required: ["language"],
                  },
                },
                references: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      title: { type: Type.STRING },
                      company: { type: Type.STRING },
                      contact: { type: Type.STRING },
                    },
                    required: ["name"],
                  },
                },
                projects: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      role: { type: Type.STRING },
                      link: { type: Type.STRING },
                      startDate: { type: Type.STRING },
                      endDate: { type: Type.STRING },
                      bullets: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                    },
                    required: ["title", "bullets"],
                  },
                  description: "Notable technical, business, or open-source projects.",
                },
                formattedText: {
                  type: Type.STRING,
                  description: "The complete, pristine ATS-ready plain text version for copy-pasting into text job boards.",
                },
                markdownText: {
                  type: Type.STRING,
                  description: "Clean markdown formatted version of the tailored CV.",
                },
              },
              required: ["header", "summary", "coreCompetencies", "experience", "education", "skills", "formattedText", "markdownText"],
            },
          },
          required: ["atsScoreBefore", "atsScoreAfter", "summary", "tailoredCv"],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response content generated by Gemini.");
    }

    const parsedData = JSON.parse(responseText);
    res.json(parsedData);
  } catch (error: any) {
    console.error("Optimization error:", error);
    res.status(500).json({
      error: error?.message || "Failed to process CV optimization.",
    });
  }
});

// CV Parsing Endpoint (Pre-fills modular form editor directly from candidate CV text)
app.post("/api/parse-cv", async (req, res) => {
  try {
    const { cvText } = req.body;
    if (!cvText || !cvText.trim()) {
      return res.status(400).json({ error: "Candidate CV text is required." });
    }

    const ai = getGenAI();

    const systemPrompt = `You are an expert CV/Resume parser and data mapping specialist.
Your task is to parse the candidate's existing resume text and structure it into a clean, comprehensive JSON object.
Extract all actual details into:
- Header: name, title, email, phone, location, linkedin, portfolio
- Summary: professional summary or objective
- Core Competencies: key skills and keywords (8-16 items)
- Experience: all employment positions, company names, titles, location, start and end dates, and bullet points
- Education: universities, degrees, graduation dates, honors
- Skills: categorized lists of skills and technologies
- Certifications: certifications with issuer and date if present
- Languages: spoken/written languages with proficiency levels if present
- References: references or note if available
- formattedText: clean linear ATS plain text representation
- markdownText: clean markdown formatted representation

Strict rule: Do not invent fake jobs or degrees. Faithfully extract and cleanly normalize the candidate's existing information.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Parse and structure this CV:\n\n${cvText}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            header: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                title: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                location: { type: Type.STRING },
                linkedin: { type: Type.STRING },
                portfolio: { type: Type.STRING },
              },
              required: ["name", "title", "email", "phone", "location"],
            },
            summary: { type: Type.STRING },
            coreCompetencies: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  company: { type: Type.STRING },
                  role: { type: Type.STRING },
                  location: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  bullets: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["company", "role", "location", "startDate", "endDate", "bullets"],
              },
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  institution: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  location: { type: Type.STRING },
                  graduationDate: { type: Type.STRING },
                  honors: { type: Type.STRING },
                },
                required: ["institution", "degree", "location", "graduationDate"],
              },
            },
            skills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  items: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["category", "items"],
              },
            },
            certifications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  issuer: { type: Type.STRING },
                  date: { type: Type.STRING },
                },
                required: ["name"],
              },
            },
            languages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  language: { type: Type.STRING },
                  proficiency: { type: Type.STRING },
                },
                required: ["language"],
              },
            },
            references: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  title: { type: Type.STRING },
                  company: { type: Type.STRING },
                  contact: { type: Type.STRING },
                },
                required: ["name"],
              },
            },
            formattedText: { type: Type.STRING },
            markdownText: { type: Type.STRING },
          },
          required: ["header", "summary", "coreCompetencies", "experience", "education", "skills"],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response generated by CV parser.");
    }
    const parsedCv = JSON.parse(responseText);
    res.json(parsedCv);
  } catch (error: any) {
    console.error("CV parse error:", error);
    res.status(500).json({
      error: error?.message || "Failed to parse candidate CV.",
    });
  }
});

// Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ATS CV Optimizer Server running at http://localhost:${PORT}`);
  });
}

startServer();
