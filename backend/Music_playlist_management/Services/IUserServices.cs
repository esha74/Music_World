using Microsoft.AspNetCore.Mvc;
using Music_playlist_management.Models;

namespace Music_playlist_management.Services
{
    public interface IUserServices
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<bool> DeleteAsync(int userId);
        Task<User?> EditProfileAsync(int id,EditProfile profile);
        Task<User?> GetUserById(int id);
        Task<bool> AcceptUserAsync(int userId);
        Task<bool> RestrictUserAsync(int userId);
        Task CreateUserAsync(User user);
        Task UpdateUserAsync(User user);

        Task<User?> GetUserByEmailAsync(string email);
        Task<User?> GetUserByUsernameAsync(string username);
        Task<User?> GetUserByEmailVerificationTokenAsync(string token);
        Task SetUserPasswordAsync(int userId, string password);
    }
}
