using System.ComponentModel.DataAnnotations.Schema;

namespace Music_playlist_management.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public string Email { get; set; }      // new


        public bool IsSubscribed { get; set; }  // Track subscription status

        public bool IsApproved {  get; set; }

        //common for both variable through token and otp
        public bool IsEmailVerified { get; set; } = false;


        public string? EmailVerificationToken { get; set; }
        public DateTime? EmailVerificationExpiry { get; set; }


        public string? EmailOtp { get; set; }
        public DateTime? OtpExpiry { get; set; }

        [NotMapped]
        public IFormFile? ProfileImage { get; set; }
        public string? ProfileImagePath { get; set; }



        public int FailedLoginAttempts { get; set; } = 0;
        public DateTime? LockoutEndTime { get; set; }

        public string? SecurityQuestion { get; set; }
        public string? SecurityAnswerHash { get; set; }

    }
}
