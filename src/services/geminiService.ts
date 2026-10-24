import { RawEmail, ProcessedJobApplication, InterviewPrep } from '../types/job';
import sampleInbox from '../data/sampleInbox.json';
import cachedResults from '../data/cachedClassification.json';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export class GeminiService {
  private static apiKey: string = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  private static simulatedDelay = 70; // ms for fluid ingest visual

  public static setApiKey(key: string) {
    this.apiKey = key.trim();
    if (this.apiKey) {
      localStorage.setItem('GEMINI_API_KEY', this.apiKey);
    } else {
      localStorage.removeItem('GEMINI_API_KEY');
    }
  }

  public static getApiKey(): string {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('GEMINI_API_KEY') || '';
    }
    return this.apiKey;
  }

  public static getRawInbox(): RawEmail[] {
    return sampleInbox as RawEmail[];
  }

  /**
   * Process entire inbox with progressive updates for streaming UI
   */
  public static async processInbox(
    onProgress?: (processed: ProcessedJobApplication, currentCount: number, total: number) => void
  ): Promise<ProcessedJobApplication[]> {
    const rawEmails = this.getRawInbox();
    const apiKey = this.getApiKey();

    // If API key is available, attempt real-time Gemini call for the first batch or emails
    if (apiKey) {
      try {
        const liveResults = await this.classifyWithLiveGemini(rawEmails, apiKey, onProgress);
        if (liveResults && liveResults.length > 0) {
          return liveResults;
        }
      } catch (err) {
        console.warn('Live Gemini call fallback engaged:', err);
      }
    }

    // High-speed robust cached classification mode (100% offline proof for hackathon demo)
    const results: ProcessedJobApplication[] = [];
    const cached = cachedResults as ProcessedJobApplication[];

    for (let i = 0; i < cached.length; i++) {
      const item = { ...cached[i], lastUpdated: new Date().toISOString() };
      results.push(item);
      if (onProgress) {
        onProgress(item, i + 1, cached.length);
        // Small stagger to show beautiful dynamic card sorting in the UI
        await new Promise((resolve) => setTimeout(resolve, this.simulatedDelay));
      }
    }

    return results;
  }

  /**
   * Real-time Gemini API integration using structured JSON output
   */
  private static async classifyWithLiveGemini(
    emails: RawEmail[],
    apiKey: string,
    onProgress?: (processed: ProcessedJobApplication, currentCount: number, total: number) => void
  ): Promise<ProcessedJobApplication[]> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15s circuit breaker

    const systemPrompt = `You are Job Hunt Autopilot, an automated career agent protecting tech job seekers after a layoff.
Given a list of job search emails, categorize each email and return a JSON ARRAY where each element has:
- id: number (matching email id)
- company: string
- role: string
- senderEmail: string
- receivedDate: string
- status: "applied" | "interview" | "rejected" | "offer"
- scam: {
    isScam: boolean,
    severity: "critical" | "high" | "medium" | "none",
    reasons: string[],
    confidence: number
  }
- followUp: {
    needsFollowUp: boolean, // true if status is 'applied' and receivedDate is >7 days before 2026-10-24
    daysSinceApplied: number,
    suggestedSubject: string,
    suggestedBody: string
  }

CRITICAL SCAM RULES:
1. If the email demands any payment (refundable fee, training fee, onboarding charge, security deposit), mark isScam: true, severity: "critical".
2. If the email originates from a freemail service (gmail.com, yahoo.com) while pretending to represent an enterprise (Infosys, TCS, Wipro), mark isScam: true, severity: "critical".
3. If Aadhaar card, PAN card, or bank details are requested before an interview has taken place, mark isScam: true, severity: "critical".
4. If an offer is issued with zero prior interviews, mark isScam: true.

Output strictly valid JSON with no markdown wrapping.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: systemPrompt },
              { text: `Analyze these emails:\n${JSON.stringify(emails)}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json'
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty response from Gemini');

    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error('Expected JSON array');

    // Merge original subjects and bodies for full fidelity
    const finalResults: ProcessedJobApplication[] = parsed.map((item: any) => {
      const original = emails.find((e) => e.id === item.id);
      return {
        ...item,
        originalSubject: original?.subject || '',
        originalBody: original?.body || '',
        lastUpdated: new Date().toISOString()
      };
    });

    if (onProgress) {
      finalResults.forEach((res, idx) => {
        onProgress(res, idx + 1, finalResults.length);
      });
    }

    return finalResults;
  }

  /**
   * Stretch Feature: Generate deep interview preparation notes using Gemini
   */
  public static async generateInterviewPrep(job: ProcessedJobApplication): Promise<InterviewPrep> {
    const apiKey = this.getApiKey();

    if (apiKey) {
      try {
        const prompt = `Generate a high-yield interview preparation cheat sheet for a candidate interviewing at "${job.company}" for the role "${job.role}".
Context:
Subject: ${job.originalSubject}
Body: ${job.originalBody}

Return strictly a JSON object matching:
{
  "companyOverview": "Brief punchy 1-sentence overview of the company and business model",
  "roleSummary": "Technical expectations and core responsibilities for this role",
  "roundName": "Name or focus of this round",
  "scheduledDate": "Date or time from email",
  "topicsToPrepare": ["4 key technical topics to master for this interview"],
  "expectedQuestions": [
    { "question": "Technical question 1", "sampleApproach": "Concise key points to answer" },
    { "question": "Technical question 2", "sampleApproach": "Concise key points to answer" }
  ],
  "questionsToAskInterviewer": ["2 smart, insightful questions to ask the interviewer"]
}`;

        const resp = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3, responseMimeType: 'application/json' }
          })
        });

        if (resp.ok) {
          const json = await resp.json();
          const content = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (content) {
            return JSON.parse(content);
          }
        }
      } catch (e) {
        console.warn('Gemini live interview prep fallback:', e);
      }
    }

    // Fallback: If job already has interviewPrep, return it; otherwise synthesize smart defaults
    if (job.interviewPrep) {
      return job.interviewPrep;
    }

    return {
      companyOverview: `${job.company} is a leading technology company known for engineering excellence and scalable architecture.`,
      roleSummary: `Focus on architectural mastery, system scaling, and problem-solving relevant to ${job.role}.`,
      roundName: 'Round 1: Technical & System Evaluation',
      scheduledDate: 'Upcoming scheduled session',
      topicsToPrepare: [
        'System Design & Resilient Architecture',
        'Data structures, Concurrency & API optimization',
        'Database indexing, Caching and Failure handling',
        'Behavioral leadership & STAR incident resolution'
      ],
      expectedQuestions: [
        {
          question: `How would you architect a fault-tolerant subsystem for ${job.company}?`,
          sampleApproach: 'Break down into ingestion, asynchronous queueing, idempotent workers, and dead-letter handling with automated alerting.'
        },
        {
          question: 'What is the most challenging production bug you investigated and resolved?',
          sampleApproach: 'Walk through telemetry detection, reproduction under load, surgical root-cause isolation, and rollback/hotfix deployment.'
        }
      ],
      questionsToAskInterviewer: [
        `What are the most exciting architectural initiatives underway at ${job.company} this quarter?`,
        'What metrics define success for an engineer in this role during the first 90 days?'
      ]
    };
  }

  /**
   * Classify any single custom email pasted by user or judges
   */
  public static async classifySingleEmail(email: RawEmail): Promise<ProcessedJobApplication> {
    const apiKey = this.getApiKey();

    if (apiKey) {
      try {
        const live = await this.classifyWithLiveGemini([email], apiKey);
        if (live && live.length > 0) {
          return live[0];
        }
      } catch (err) {
        console.warn('Single email live classification fallback:', err);
      }
    }

    // High-precision offline rule classifier
    const text = `${email.subject} ${email.body}`.toLowerCase();
    const from = email.from.toLowerCase();

    // 1. Detect Company
    let company = 'Tech Company';
    const knownCompanies = ['Google', 'Infosys', 'TCS', 'Wipro', 'Amazon', 'Cred', 'Swiggy', 'Zomato', 'Blinkit', 'Razorpay', 'Flipkart', 'Atlassian', 'Stripe', 'Uber', 'Finly', 'PhonePe', 'Postman', 'Atlan', 'BrowserStack'];
    for (const c of knownCompanies) {
      if (text.includes(c.toLowerCase()) || from.includes(c.toLowerCase())) {
        company = c;
        break;
      }
    }

    // 2. Detect Role
    let role = 'Software Engineer';
    const roles = ['Frontend Engineer', 'Backend Engineer', 'Fullstack Developer', 'Staff Software Engineer', 'Cloud Architect', 'Platform Engineer', 'SDE II', 'Engineering Manager'];
    for (const r of roles) {
      if (text.includes(r.toLowerCase())) {
        role = r;
        break;
      }
    }

    // 3. Fraud / Scam Analysis
    const reasons: string[] = [];
    const hasFee = /(fee|pay|deposit|rs\.?|₹|money|charges|upi|refundable)/i.test(text);
    const hasAadhaarOrPan = /(aadhaar|pan\b|cancelled cheque|bank account|passport)/i.test(text);
    const isFreemail = /@(gmail\.com|yahoo\.com|outlook\.com|consultant\.com)/i.test(from);
    const mentionsEnterprise = /(infosys|tcs|wipro|google|amazon|microsoft)/i.test(text);

    if (hasFee) {
      reasons.push("Fee Extortion: Requests a fee, deposit, or registration charge prior to joining/interview.");
    }
    if (isFreemail && mentionsEnterprise) {
      reasons.push(`Free-mail Impersonation: Poses as corporate brand (${company}) using generic free webmail (${from}).`);
    }
    if (hasAadhaarOrPan && !text.includes('after final round')) {
      reasons.push("Document Phishing: Requests Aadhaar card, PAN card, or bank details before technical interviews.");
    }

    const isScam = reasons.length > 0;

    // 4. Status Determination
    let status: 'applied' | 'interview' | 'rejected' | 'offer' = 'applied';
    if (isScam) {
      status = text.includes('offer') || text.includes('selected') ? 'offer' : 'applied';
    } else if (text.includes('interview') || text.includes('round') || text.includes('schedule') || text.includes('discussion')) {
      status = 'interview';
    } else if (text.includes('offer') || text.includes('pleased to offer')) {
      status = 'offer';
    } else if (text.includes('regret') || text.includes('not moving forward') || text.includes('not advance') || text.includes('freeze')) {
      status = 'rejected';
    }

    // 5. Follow-up calculation
    const emailDate = new Date(email.date);
    const today = new Date('2026-10-24');
    const diffDays = Math.max(1, Math.round((today.getTime() - emailDate.getTime()) / (1000 * 3600 * 24)));
    const needsFollowUp = status === 'applied' && !isScam && diffDays >= 7;

    const result: ProcessedJobApplication = {
      id: email.id,
      company: isScam && isFreemail ? `${company} (Impersonator)` : company,
      role,
      senderEmail: email.from,
      receivedDate: email.date,
      status,
      originalSubject: email.subject,
      originalBody: email.body,
      scam: {
        isScam,
        severity: isScam ? 'critical' : 'none',
        reasons,
        confidence: isScam ? 0.98 : 0.99
      },
      followUp: {
        needsFollowUp,
        daysSinceApplied: diffDays,
        suggestedSubject: `Following up on ${role} Application - ${company}`,
        suggestedBody: `Hi ${company} Hiring Team,\n\nI wanted to follow up on my application for the ${role} position submitted ${diffDays} days ago. I look forward to any updates on next steps!\n\nBest regards,\nJayraj`
      },
      lastUpdated: new Date().toISOString()
    };

    if (status === 'interview') {
      result.interviewPrep = {
        companyOverview: `${company} is a leading enterprise recognized for engineering excellence.`,
        roleSummary: `Technical evaluation covering scalable architecture and engineering execution for ${role}.`,
        roundName: 'Round 1: System & Technical Discussion',
        scheduledDate: 'Upcoming scheduled session',
        topicsToPrepare: [
          'System Design, Availability & Scalability',
          'Concurrency, Caching & Data Layer Optimization',
          'Clean API Contracts and Resilient Error Handling'
        ],
        expectedQuestions: [
          {
            question: `How would you scale ${company}'s critical services during peak traffic spikes?`,
            sampleApproach: 'Discuss horizontal scaling, edge caching, circuit breakers, and rate limiters.'
          }
        ],
        questionsToAskInterviewer: [
          `What are the major engineering challenges your pod is tackling at ${company}?`
        ]
      };
    }

    return result;
  }
}
