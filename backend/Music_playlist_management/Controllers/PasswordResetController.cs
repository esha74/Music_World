using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Music_playlist_management.Models;
using Music_playlist_management.Services;

namespace Music_playlist_management.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PasswordResetController : ControllerBase
    {
        private readonly IPasswordResetService _passwordResetService;

        public PasswordResetController(IPasswordResetService passwordResetService)
        {
            _passwordResetService = passwordResetService;
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            try
            {
                await _passwordResetService.SendResetOtpAsync(request.Email);
                return Ok("OTP sent to your email.");
            }
            catch (InvalidOperationException)
            {
                // For security, do not reveal if user exists
                return Ok("OTP sent to your email.");
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var (success, errorMessage) = await _passwordResetService.VerifyOtpAndResetPasswordAsync(request.Email, request.Otp, request.NewPassword);

            if (!success)
            {
                return BadRequest(new { success = false, error = errorMessage ?? "Invalid OTP or OTP expired." });
            }
            return Ok(new { success = true, message = "Password reset successfully." });
        }


    }
}

