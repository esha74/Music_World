using Microsoft.EntityFrameworkCore;
using Music_playlist_management.Models;
using System.Data.Common;

namespace Music_playlist_management.Data
{
    public class AppDbContext:DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Music>musics { get; set; }
        public DbSet<User> users { get; set; }
        public DbSet<ActivityLog> ActivityLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Music>().HasData(new Music
            {
                Id = 1,
                Title = "saiyara",
                Year = 2025,
                Artist = "mohit suri",
                Genre = "Romantic",
                Image = "https://th.bing.com/th/id/R.33fc9f43941ef8cdbbe3c8de986d61c0?rik=%2fi9MPJ%2bYyXMoew&riu=http%3a%2f%2fwww.yashrajfilms.com%2fimages%2fdefault-source%2fnews1%2fsaiyaara-listing-thumbnail.jpg%3fsfvrsn%3d8e4fdecc_1&ehk=Yqb9nJvEgoTc96uvMzqxgTbLc%2faL2SSFPXGYS%2bpV8h4%3d&risl=&pid=ImgRaw&r=0",
                Audio = "https://youtu.be/BSJa1UytM8w?si=VOiSbmOfqU9BzgLF",
                IsFavorite = true
            });
        }
    }
}
