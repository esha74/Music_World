using System.ComponentModel.DataAnnotations.Schema;

namespace Music_playlist_management.Models
{
    public class RegisterModel
    {
        public string Username {  get; set; }
        public string Password { get; set; }

        public string Email { get; set; }      // new

        public string Role {  get; set; }

        [NotMapped]
        public IFormFile? ProfileImage { get; set; }

        public string? ProfileImagePath { get; set; }

        public string SecurityQuestion { get; set; }
        public string SecurityAnswer { get; set; }

    }
}
