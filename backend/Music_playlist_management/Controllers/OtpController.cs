using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Music_playlist_management.Data;
using Music_playlist_management.Models;
using Music_playlist_management.Services;

namespace Music_playlist_management.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OtpController : ControllerBase
    {
        private readonly Iotpservices _otpservices;
        private readonly AppDbContext _context;
        public OtpController(Iotpservices otpservices, AppDbContext context)
        {
            _otpservices = otpservices;
            _context = context;

        }

        [HttpPost("resend-otp")]
        public async Task<IActionResult> ResendOtp([FromBody] ResendOtpRequest request)
        {
            var user = await _context.users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
                return BadRequest("User not found.");

            if (user.IsEmailVerified)
                return BadRequest("Email already verified.");

            var otp = new Random().Next(100000, 999999).ToString();
            user.EmailOtp = otp;
            user.OtpExpiry = DateTime.UtcNow.AddMinutes(10);

            await _context.SaveChangesAsync();

            await _otpservices.SendOtpEmail(user.Email, otp);

            return Ok("A new OTP has been sent to your email.");
        }

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            var user = await _context.users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
                return BadRequest("User not found.");

            if (user.IsEmailVerified)
                return Ok("Email already verified.");

            if (user.EmailOtp != request.Otp || user.OtpExpiry < DateTime.UtcNow)
                return BadRequest("Invalid or expired OTP.");

            user.IsEmailVerified = true;
            user.EmailOtp = null;
            user.OtpExpiry = null;
            await _context.SaveChangesAsync();

            return Ok("Email verified successfully! You can now log in.");
        }

    }

}