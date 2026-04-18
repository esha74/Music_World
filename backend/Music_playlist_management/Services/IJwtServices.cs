using Music_playlist_management.Models;

namespace Music_playlist_management.Services
{
    public interface IJwtServices
    {
        public string GetJwtToken(User user);
    }
}
