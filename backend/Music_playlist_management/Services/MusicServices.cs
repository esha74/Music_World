using Microsoft.EntityFrameworkCore;
using Music_playlist_management.Data;
using Music_playlist_management.Models;

namespace Music_playlist_management.Services
{
    public class MusicServices:IMusicServices
    {
        private readonly AppDbContext _context;
        private readonly IActivityLogService _activityLogServices;


        public MusicServices(AppDbContext context, IActivityLogService activityLogServices)
        {
            _context =context ;
            _activityLogServices = activityLogServices;

        }

        public async Task<IEnumerable<Music>> GetMusicAsync()
        {
          return await _context.musics.ToListAsync();
        }
      public async  Task<Music> GetMusicById(int id)
        {
            return await _context.musics.FirstOrDefaultAsync(m=>m.Id==id);
        }
      public async Task<MusicDTO> CreateMusicAsync(MusicDTO music)
        {
            var mus = new Music()
            {
                Title = music.Title,
                Artist = music.Artist,
                Image=music.Image,
                Genre = music.Genre,
                Year = music.Year,
                Audio = music.Audio,
                IsFavorite = music.IsFavorite,
            };
            _context.musics.Add(mus);
          await _context.SaveChangesAsync();
        
            return music;
        }

       public async Task<bool> UpdateMusicAsync(int id, MusicDTO music)
        {
            var data= await _context.musics.FirstOrDefaultAsync(m=>m.Id==id);
            if(data==null) return false;

            data.Title = music.Title;   
            data.Artist = music.Artist;
            data.Genre = music.Genre;   
            data.Image = music.Image;
            data.Year = music.Year;
            data.Audio = music.Audio;
            data.IsFavorite = music.IsFavorite;
            await _context.SaveChangesAsync();
            return true;
        }
       public async Task<bool> DeleteMusicAsync(int id)
        {
             var data=await _context.musics.FirstOrDefaultAsync(music=>music.Id==id);
            if(data==null) return false;

            _context.musics.Remove(data);
           await  _context.SaveChangesAsync();
            return true;
        }
    }



}
