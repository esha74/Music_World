using System.ComponentModel.DataAnnotations.Schema;

namespace Music_playlist_management.Models
{
    public class LoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }

  

    }

    //get data form database 
    public class LoginResponseModel
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }

        public string Role { get; set; }
        public bool IsApproved { get; set; }


        public string? ProfileImagePath { get; set; }

        public string Token { get; set; }
    }
}
