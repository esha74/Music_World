using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Music_playlist_management.Data;
using Music_playlist_management.Models;
using Music_playlist_management.Services;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Music_playlist_management.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IPayPalSubscriptionService _payPalSubscriptionService;
        private readonly AppDbContext _context;

        public PaymentController(IPayPalSubscriptionService payPalSubscriptionService, AppDbContext context)
        {
            _payPalSubscriptionService = payPalSubscriptionService;
            _context = context;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (int.TryParse(userIdClaim, out int userId))
                return userId;

            throw new System.Exception("User ID claim not found or invalid.");
        }

        public class ConfirmSubscriptionRequest
        {
            public string SubscriptionId { get; set; }
        }

        [Authorize]
        [HttpPost("confirm-subscription")]
        public async Task<IActionResult> ConfirmSubscription([FromBody] ConfirmSubscriptionRequest model)
        {
            var isActive = await _payPalSubscriptionService.VerifySubscriptionAsync(model.SubscriptionId);
            if (!isActive)
                return BadRequest("Subscription is not active.");

            var userId = GetCurrentUserId();
            var user = await _context.users.FindAsync(userId);
            if (user == null)
                return NotFound();

            user.IsSubscribed = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Subscription activated" });
        }
    }
}
