export interface User {
    id?:number;
    username:string;
    password:string;
    role:string
    isApproved:boolean;
    email: string;
    profileImage?: string | null;
   profileImagePath:string;
   isSubscribed:boolean
    isEmailVerified?: boolean;
  emailOtp?: string | null;
  otpExpiry?: string | Date | null;
}
