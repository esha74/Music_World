namespace Music_playlist_management.Services
{
    public interface IPasswordResetService
    {
        //during forgot password
        Task SendResetOtpAsync(string email);

        //during reset with new password
        Task<(bool Success, string? ErrorMessage)> VerifyOtpAndResetPasswordAsync(string email, string otp, string newPassword);
    }
}
