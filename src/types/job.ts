export interface RawEmail {
  id: number;
  date: string;
  from: string;
  subject: string;
  body: string;
}

export type JobStatus = 'applied' | 'interview' | 'rejected' | 'offer';

export interface ScamAnalysis {
  isScam: boolean;
  severity: 'critical' | 'high' | 'medium' | 'none';
  reasons: string[];
  confidence: number;
}

export interface FollowUpInfo {
  needsFollowUp: boolean;
  daysSinceApplied: number;
  suggestedSubject: string;
  suggestedBody: string;
}

export interface InterviewPrep {
  companyOverview: string;
  roleSummary: string;
  roundName: string;
  scheduledDate: string;
  topicsToPrepare: string[];
  expectedQuestions: { question: string; sampleApproach: string }[];
  questionsToAskInterviewer: string[];
}

export interface ProcessedJobApplication {
  id: number;
  company: string;
  role: string;
  senderEmail: string;
  receivedDate: string;
  status: JobStatus;
  originalSubject: string;
  originalBody: string;
  scam: ScamAnalysis;
  followUp: FollowUpInfo;
  interviewPrep?: InterviewPrep;
  lastUpdated: string;
}
