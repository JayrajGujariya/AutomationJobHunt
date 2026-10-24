import { RawEmail } from '../types/job';

/**
 * Robust RFC 2822 / .mbox file parser for Job Hunt Autopilot
 * Conforms to hackathon problem statement: "Load the inbox from a JSON or .mbox file"
 */
export class MboxParser {
  /**
   * Parse raw .mbox text into structured RawEmail objects
   */
  public static parseMbox(mboxContent: string): RawEmail[] {
    if (!mboxContent || !mboxContent.trim()) {
      return [];
    }

    // Split messages by standard MBOX separator: lines starting with "From "
    const rawMessages = mboxContent.split(/\n(?=From\s+[^\r\n]+)/);
    const emails: RawEmail[] = [];

    rawMessages.forEach((rawMsg, index) => {
      const trimmed = rawMsg.trim();
      if (!trimmed) return;

      const lines = trimmed.split('\n');
      let from = '';
      let subject = '';
      let date = '';
      let bodyStartIndex = lines.length;

      // Extract header fields
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim() === '') {
          bodyStartIndex = i + 1;
          break;
        }

        const lower = line.toLowerCase();
        if (lower.startsWith('from:')) {
          from = line.substring(5).trim().replace(/^.*<([^>]+)>.*$/, '$1');
        } else if (lower.startsWith('subject:')) {
          subject = line.substring(8).trim();
        } else if (lower.startsWith('date:')) {
          const rawDate = line.substring(5).trim();
          try {
            const parsed = new Date(rawDate);
            if (!isNaN(parsed.getTime())) {
              date = parsed.toISOString().split('T')[0];
            } else {
              date = '2026-10-24';
            }
          } catch {
            date = '2026-10-24';
          }
        }
      }

      const body = lines.slice(bodyStartIndex).join('\n').trim();

      emails.push({
        id: index + 1,
        from: from || 'recruitment@company.com',
        subject: subject || 'Application Update',
        date: date || '2026-10-24',
        body: body || 'No email body content available.'
      });
    });

    return emails;
  }
}
