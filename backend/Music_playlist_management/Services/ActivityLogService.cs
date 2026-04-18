using Music_playlist_management.Data;
using Music_playlist_management.Models;

namespace Music_playlist_management.Services
{
    public class ActivityLogService : IActivityLogService
    {
        private readonly AppDbContext _context;
        public ActivityLogService(AppDbContext context)
        {
            _context = context;
        }
        public async Task LogAsync(int? userId, string username, string action, string description)
        {
            var log = new ActivityLog
            {
                UserId = userId,
                Username = username,
                Action = action,
                Description = description,
                Timestamp = DateTime.UtcNow
            };
            _context.ActivityLogs.Add(log);
            await _context.SaveChangesAsync();
        }
    
     public async Task<bool> DeleteLogAsync(int id)
        {
            var log = await _context.ActivityLogs.FindAsync(id);
            if (log == null)
            {
                return false;
            }

            _context.ActivityLogs.Remove(log);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}