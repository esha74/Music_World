export interface ActivityLog {
  id: number;
  userId?: number;
  username: string;
  action: string;
  description: string;
  timestamp: string;
}