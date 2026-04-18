namespace Music_playlist_management.Models
{
    public class SetPassword
    {
        //during add user by admin we setting password through mail url
        public string Token { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
