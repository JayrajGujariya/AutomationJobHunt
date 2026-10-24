import { describe, it, expect } from 'vitest';
import { GeminiService } from '../src/services/geminiService';
import { RawEmail } from '../src/types/job';

describe('Job Hunt Autopilot — Email Classification Engine', () => {
  it('correctly classifies fresh application acknowledgement as "applied"', async () => {
    const email: RawEmail = {
      id: 101,
      from: 'careers@groww.in',
      date: '2026-10-22',
      subject: 'Application Received: Senior Full Stack Engineer at Groww',
      body: 'Thank you for applying. Our talent acquisition team has received your application.'
    };

    const result = await GeminiService.classifySingleEmail(email);
    expect(result.status).toBe('applied');
    expect(result.company.toLowerCase()).toContain('groww');
    expect(result.scam.isScam).toBe(false);
  });

  it('correctly classifies interview invitation as "interview"', async () => {
    const email: RawEmail = {
      id: 102,
      from: 'talent@finly.co',
      date: '2026-10-18',
      subject: 'Interview invite: Round 1 System Design on 27 Oct',
      body: 'We would love to invite you for Round 1: System Design & Architecture with our Principal Architect.'
    };

    const result = await GeminiService.classifySingleEmail(email);
    expect(result.status).toBe('interview');
    expect(result.interviewPrep).toBeDefined();
    expect(result.interviewPrep?.topicsToPrepare.length).toBeGreaterThan(0);
  });

  it('correctly classifies formal rejection as "rejected"', async () => {
    const email: RawEmail = {
      id: 103,
      from: 'no-reply@atlassian.com',
      date: '2026-10-18',
      subject: 'Update on your application with Atlassian',
      body: 'We have decided not to advance your application at this time. We wish you all the best.'
    };

    const result = await GeminiService.classifySingleEmail(email);
    expect(result.status).toBe('rejected');
    expect(result.scam.isScam).toBe(false);
  });

  it('correctly classifies legitimate employment offer as "offer"', async () => {
    const email: RawEmail = {
      id: 104,
      from: 'offers@browserstack.com',
      date: '2026-10-23',
      subject: 'Official Offer of Employment: Staff Software Engineer at BrowserStack',
      body: 'We are thrilled to extend a formal offer of employment following your technical interview loops.'
    };

    const result = await GeminiService.classifySingleEmail(email);
    expect(result.status).toBe('offer');
    expect(result.scam.isScam).toBe(false);
  });
});
