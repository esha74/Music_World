using System.ComponentModel.DataAnnotations.Schema;

namespace Music_playlist_management.Models
{
    public class EditProfile
    {
    public string? Username {  get; set; }

     [NotMapped]
     public IFormFile? ProfileImage { get; set; }


    }
}
