import { describe, it, expect } from 'vitest';
import { GeminiService } from '../src/services/geminiService';
import { RawEmail } from '../src/types/job';

describe('Job Hunt Autopilot — 7-Day Follow-Up Automation', () => {
  it('triggers follow-up alert when application has no reply after 7 days', async () => {
    // 14 days ago from 2026-10-24
    const email: RawEmail = {
      id: 301,
      from: 'careers@zentech.in',
      date: '2026-10-10',
      subject: 'Application received: Backend Engineer',
      body: 'Thanks for applying. We will get back to you shortly.'
    };

    const result = await GeminiService.classifySingleEmail(email);
    expect(result.status).toBe('applied');
    expect(result.followUp.needsFollowUp).toBe(true);
    expect(result.followUp.daysSinceApplied).toBeGreaterThanOrEqual(7);
    expect(result.followUp.suggestedSubject.length).toBeGreaterThan(0);
    expect(result.followUp.suggestedBody.length).toBeGreaterThan(0);
  });

  it('does NOT trigger follow-up alert for fresh applications (<7 days)', async () => {
    // 2 days ago from 2026-10-24
    const email: RawEmail = {
      id: 302,
      from: 'careers@groww.in',
      date: '2026-10-22',
      subject: 'Application received: Senior Engineer',
      body: 'Thanks for applying. We are reviewing.'
    };

    const result = await GeminiService.classifySingleEmail(email);
    expect(result.status).toBe('applied');
    expect(result.followUp.needsFollowUp).toBe(false);
  });

  it('does NOT trigger follow-up alert if email is an interview or rejection', async () => {
    const rejectedEmail: RawEmail = {
      id: 303,
      from: 'talent@uber.com',
      date: '2026-10-10',
      subject: 'Status of your application',
      body: 'We will not be moving forward with your candidacy.'
    };

    const result = await GeminiService.classifySingleEmail(rejectedEmail);
    expect(result.status).toBe('rejected');
    expect(result.followUp.needsFollowUp).toBe(false);
  });
});
