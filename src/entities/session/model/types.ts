import type { Session } from 'next-auth';

export type { Session };

export interface SessionUser {
  id: string;
  email: string;
  name?: string;
}
