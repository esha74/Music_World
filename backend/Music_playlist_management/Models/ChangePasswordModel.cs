namespace Music_playlist_management.Models
{
    public class ChangePasswordModel
    {
        public int UserId { get; set; }
        public string SecurityAnswer { get; set; }
        public string NewPassword { get; set; }
    }
}
