namespace Music_playlist_management.Models
{
    public class ResetPasswordRequest
    {
        //after verification done
        //during forgot password in click set new password
        public string Email { get; set; }
        public string Otp { get; set; }
        public string NewPassword { get; set; }
    }
}
