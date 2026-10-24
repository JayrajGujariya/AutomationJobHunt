import { describe, it, expect } from 'vitest';
import { GeminiService } from '../src/services/geminiService';
import { RawEmail } from '../src/types/job';

describe('Job Hunt Autopilot — Scam Shield & Fraud Detection', () => {
  it('flags training fee extortion as CRITICAL scam', async () => {
    const email: RawEmail = {
      id: 201,
      from: 'careers@techsupport-jobs.in',
      date: '2026-10-14',
      subject: 'Offer Letter - Pay Rs 4,999 Mandatory Training & Induction Fee',
      body: 'You are selected. You must pay a 100% refundable Training Fee of Rs 4,999 via UPI to confirm joining.'
    };

    const result = await GeminiService.classifySingleEmail(email);
    expect(result.scam.isScam).toBe(true);
    expect(result.scam.severity).toBe('critical');
    expect(result.scam.reasons.some(r => r.toLowerCase().includes('fee'))).toBe(true);
  });

  it('flags free-mail address posing as enterprise brand', async () => {
    const email: RawEmail = {
      id: 202,
      from: 'hr.infosys.jobs@gmail.com',
      date: '2026-10-15',
      subject: 'Infosys Appointment Letter for Senior Developer',
      body: 'Congratulations! Infosys has appointed you as Senior Developer at 28 LPA package.'
    };

    const result = await GeminiService.classifySingleEmail(email);
    expect(result.scam.isScam).toBe(true);
    expect(result.scam.reasons.some(r => r.toLowerCase().includes('free-mail') || r.toLowerCase().includes('impersonat'))).toBe(true);
  });

  it('flags Aadhaar & PAN card phishing prior to interviews', async () => {
    const email: RawEmail = {
      id: 203,
      from: 'recruitment@tcs-onboarding-portal.net',
      date: '2026-10-16',
      subject: 'URGENT: Submit Aadhaar and PAN Card Scan Before Scheduling Interview',
      body: 'Before we can schedule your interview, send high resolution scans of your Aadhaar Card and PAN card immediately.'
    };

    const result = await GeminiService.classifySingleEmail(email);
    expect(result.scam.isScam).toBe(true);
    expect(result.scam.reasons.some(r => r.toLowerCase().includes('aadhaar') || r.toLowerCase().includes('document'))).toBe(true);
  });

  it('does NOT flag legitimate corporate communications as scams', async () => {
    const email: RawEmail = {
      id: 204,
      from: 'careers@swiggy.in',
      date: '2026-10-12',
      subject: 'Application Acknowledgement: Senior Backend Engineer',
      body: 'Thank you for applying to Swiggy. Our talent team will review your profile and update you.'
    };

    const result = await GeminiService.classifySingleEmail(email);
    expect(result.scam.isScam).toBe(false);
    expect(result.scam.reasons.length).toBe(0);
  });
});
