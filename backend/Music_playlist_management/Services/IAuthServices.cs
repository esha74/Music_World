using Music_playlist_management.Models;

namespace Music_playlist_management.Services
{
    public interface IAuthServices
    {
        Task<(bool Success, string? ErrorMessage, LoginResponseModel? LoginData)> LoginAsync(LoginModel model);     
        Task<string> RegisterAsync(RegisterModel model);
        Task<(bool success, string? errorMessage)> ChangePasswordAsync(ChangePasswordModel model);
        Task<string?> GetSecurityQuestionAsync(int userId);


    }
}
