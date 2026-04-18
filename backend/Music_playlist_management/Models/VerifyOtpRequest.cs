namespace Music_playlist_management.Models
{
    public class VerifyOtpRequest
    {
        //during registration -- for verify email
        public string Email { get; set; } = string.Empty;
        public string Otp { get; set; } = string.Empty;
    }

}

