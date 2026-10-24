import { describe, it, expect } from 'vitest';
import { MboxParser } from '../src/services/mboxParser';

describe('Job Hunt Autopilot — MBOX & Inbox Ingestion', () => {
  it('parses multi-message RFC 2822 .mbox file into structured emails', () => {
    const sampleMbox = `From MAILER-DAEMON Fri Oct 24 10:00:00 2026
From: careers@swiggy.in
Subject: Application received for Backend Engineer
Date: 12 Oct 2026 14:00:00 +0530

Thank you for your application to Swiggy.

From MAILER-DAEMON Fri Oct 24 11:00:00 2026
From: hr.infosys.jobs@gmail.com
Subject: Offer Letter - Pay Rs 4,999 Training Fee
Date: 14 Oct 2026 15:30:00 +0530

Congratulations, deposit refundable fee to confirm joining.`;

    const emails = MboxParser.parseMbox(sampleMbox);
    expect(emails.length).toBe(2);
    expect(emails[0].from).toBe('careers@swiggy.in');
    expect(emails[0].subject).toBe('Application received for Backend Engineer');
    expect(emails[1].from).toBe('hr.infosys.jobs@gmail.com');
  });

  it('handles empty or malformed mbox gracefully', () => {
    expect(MboxParser.parseMbox('')).toEqual([]);
    expect(MboxParser.parseMbox('   ')).toEqual([]);
  });
});
