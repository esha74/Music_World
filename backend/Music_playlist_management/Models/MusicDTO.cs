namespace Music_playlist_management.Models
{
    public class MusicDTO
    {

        public string Title { get; set; }

        public string Artist { get; set; }

        public int Year { get; set; }
        public string Image { get; set; }

        public string Genre { get; set; }
        public string Audio { get; set; }
        public bool IsFavorite { get; set; }

    }
}
