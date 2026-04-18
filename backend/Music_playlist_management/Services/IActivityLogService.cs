namespace Music_playlist_management.Services
{
    public interface IActivityLogService
    {
        Task LogAsync(int? userId, string username, string action, string description);
        Task<bool> DeleteLogAsync(int id); 


    }
}
