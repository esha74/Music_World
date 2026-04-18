export interface Loginresponse {
  id: number;
  username: string;
  token: string;
  role: string;
  isApproved: boolean;
  profileImage?: string | null;
  profileImagePath: string;
}
