using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Music_playlist_management.Data;
using Music_playlist_management.Helper;
using Music_playlist_management.Models;

namespace Music_playlist_management.Services
{
    public class PasswordResetService : IPasswordResetService
    {
        private readonly AppDbContext _context;
        private readonly Iotpservices _otpService;
        private readonly PasswordHasher<User> _passwordHasher = new();
        private readonly IActivityLogService _activityLogService;

        public PasswordResetService(AppDbContext context, Iotpservices otpService, IActivityLogService activityLogService)
        {
            _context = context;
            _otpService = otpService;
            _activityLogService = activityLogService;
        }

        public async Task SendResetOtpAsync(string email)
        {
            var user = await _context.users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                await _activityLogService.LogAsync(null, email, "Send OTP Failed", "User with given email not found.");
                throw new InvalidOperationException("User not found");

            }

            var otp = new Random().Next(100000, 999999).ToString();
            user.EmailOtp = otp;
            user.OtpExpiry = DateTime.UtcNow.AddMinutes(10);

            await _context.SaveChangesAsync();

            await _otpService.SendOtpEmail(email, otp);
            await _activityLogService.LogAsync(user.Id, user.Username, "Send OTP", $"Password reset OTP sent to {email}.");

        }

        public async Task<(bool Success, string? ErrorMessage)> VerifyOtpAndResetPasswordAsync(string email, string otp, string newPassword)
        {
            var user = await _context.users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                await _activityLogService.LogAsync(null, email, "Reset Password Failed", "User not found.");
                return (false, "User not found");

            }

            if (user.EmailOtp != otp || user.OtpExpiry < DateTime.UtcNow)
            {
                await _activityLogService.LogAsync(user.Id, user.Username, "Reset Password Failed", "Invalid or expired OTP.");
                return (false, "Invalid or expired OTP");
            }
            // TODO: You must hash the password securely e.g. with BCrypt, ASP.NET Identity PasswordHasher, etc.
            // var currentPwd = AesEncryptionHelper.Decrypt(newPassword);
            //var result = _passwordHasher.VerifyHashedPassword(user, user.Password, currentPwd);
            var result = _passwordHasher.VerifyHashedPassword(user, user.Password, newPassword);

            if (result == PasswordVerificationResult.Success)
            {
              await _activityLogService.LogAsync(user.Id, user.Username, "Reset Password Failed", "New password same as old password.");
              return (false, "New password cannot be the same as the old password");

            }

            user.Password = _passwordHasher.HashPassword(user, newPassword);
            user.EmailOtp = null;
            user.OtpExpiry = null;
            user.IsEmailVerified = true;

            await _context.SaveChangesAsync();
            await _activityLogService.LogAsync(user.Id, user.Username, "Password Reset", "Password successfully reset using OTP.");
            return (true, null);
        }

    }

}
