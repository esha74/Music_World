using Music_playlist_management.Models;

namespace Music_playlist_management.Services
{
    public interface IMusicServices
    {
        Task<IEnumerable<Music>> GetMusicAsync();
        Task<Music>GetMusicById(int id);
        Task<MusicDTO> CreateMusicAsync(MusicDTO music);

        Task<bool>UpdateMusicAsync(int  id, MusicDTO music);    
        Task<bool>DeleteMusicAsync(int id);
    }
}
