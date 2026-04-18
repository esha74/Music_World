using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Music_playlist_management.Data;
using Music_playlist_management.Services;

namespace Music_playlist_management.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActivityLogController : ControllerBase
    {
        private readonly IActivityLogService _activityLogService;
        private readonly AppDbContext _context;

        public ActivityLogController(IActivityLogService activityLogService, AppDbContext context)
        {
            _activityLogService = activityLogService;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetLogs()
        {
            var logs = await _context.ActivityLogs.OrderByDescending(l => l.Timestamp).ToListAsync();
            return Ok(logs);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLog(int id)
        {
            var log = await _context.ActivityLogs.FindAsync(id);
            if (log == null)
            {
                return NotFound(new { message = "Log not found." });
            }

            _context.ActivityLogs.Remove(log);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
