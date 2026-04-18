using System.ComponentModel.DataAnnotations;

namespace Music_playlist_management.Models
{
    public class Music
    {
        [Key]
       public int Id { get; set; }

       public string Title { get; set; }

        public string Artist { get; set; }

        public string Image {  get; set; }
        public int Year { get; set; } 

        public string Genre {  get; set; }

        public string Audio {  get; set; }

        public bool IsFavorite { get; set; }
    }
}
