export type SubmissionType = 'link' | 'text' | 'both';
export type InstanceStatus = 'pending' | 'in_progress' | 'submitted' | 'scored' | 'closed';
export type SessionStatus = 'in_progress' | 'submitted';

export interface Reviewer {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  accessCode: string;
  reviewerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateWithCounts extends Candidate {
  counts: { total: number; pending: number; in_progress: number; submitted: number; scored: number };
}

export interface Assignment {
  id: string;
  title: string;
  brief: string;
  submissionType: SubmissionType;
  durationMinutes: number;
  hideUntilStart: boolean;
  mainTitle?: string | null;
  mainBrief?: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentInstance {
  id: string;
  assignmentId: string;
  candidateId: string;
  reviewerId: string;
  deadline: string | null;
  status: InstanceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface InstanceWithRelations extends AssignmentInstance {
  assignment: Assignment | null;
  candidate?: { id: string; name: string; email: string } | null;
}

export interface ScreenshotRef {
  key: string;
  capturedAt: string;
}

export interface Session {
  id: string;
  instanceId: string;
  candidateId: string;
  reviewerId: string;
  startedAt: string;
  expiresAt: string;
  endedAt: string | null;
  durationSeconds: number | null;
  status: SessionStatus;
  submissionContent: string | null;
  submissionLink: string | null;
  terminationClean: boolean | null;
  autoClosed: boolean;
  screenshots: ScreenshotRef[];
  createdAt: string;
  updatedAt: string;
}

export interface BlockedAttempt {
  id: string;
  sessionId: string;
  candidateId: string;
  reviewerId: string;
  domain: string;
  attemptedAt: string;
  screenshotKey?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SessionDetail extends Session {
  assignment: Assignment | null;
  instance: AssignmentInstance | null;
  candidate?: { id: string; name: string; email: string } | null;
  blockedAttempts: BlockedAttempt[];
}

export interface Score {
  id: string;
  sessionId: string;
  reviewerId: string;
  numericScore: number;
  feedback: string;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateHistoryItem {
  instance: AssignmentInstance;
  assignment: Assignment | null;
  session: Session | null;
  score: Score | null;
}
