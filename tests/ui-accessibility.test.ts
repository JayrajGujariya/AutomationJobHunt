import { describe, it, expect } from 'vitest';
import cachedResults from '../src/data/cachedClassification.json';
import sampleInbox from '../src/data/sampleInbox.json';

describe('Job Hunt Autopilot — Dataset & Security Validation', () => {
  it('validates 20 sample layoff emails exist with complete metadata', () => {
    expect(sampleInbox.length).toBe(20);
    sampleInbox.forEach((email) => {
      expect(email.id).toBeDefined();
      expect(email.from).toBeDefined();
      expect(email.subject).toBeDefined();
      expect(email.date).toBeDefined();
      expect(email.body).toBeDefined();
    });
  });

  it('validates pre-computed offline classification covers all required categories', () => {
    expect(cachedResults.length).toBe(20);
    
    const statuses = new Set(cachedResults.map(r => r.status));
    expect(statuses.has('applied')).toBe(true);
    expect(statuses.has('interview')).toBe(true);
    expect(statuses.has('rejected')).toBe(true);
    expect(statuses.has('offer')).toBe(true);

    const scams = cachedResults.filter(r => r.scam.isScam);
    expect(scams.length).toBeGreaterThanOrEqual(3);

    const followUps = cachedResults.filter(r => r.followUp.needsFollowUp);
    expect(followUps.length).toBeGreaterThanOrEqual(3);
  });

  it('ensures all scam records contain structured forensic reasons', () => {
    const scams = cachedResults.filter(r => r.scam.isScam);
    scams.forEach((scam) => {
      expect(scam.scam.reasons.length).toBeGreaterThan(0);
      expect(scam.scam.confidence).toBeGreaterThan(0.9);
    });
  });
});
