using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Music_playlist_management.Data;
using Music_playlist_management.Helper;
using Music_playlist_management.Models;
using System.Net;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;

namespace Music_playlist_management.Services
{
    public class UserServices:IUserServices
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly string _frontendUrl = "http://localhost:4200"; // ideally get from config
        private readonly PasswordHasher<User> _passwordHasher = new();
        private readonly IActivityLogService _activityLogService;



        public UserServices(AppDbContext context, IWebHostEnvironment env, IActivityLogService activityLogService)
        {
            _context = context;
            _env = env;
            _activityLogService = activityLogService;

        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            var users = await _context.users
                .Select(u => new User { 
                    Username = u.Username, 
                    Role = u.Role,Id=u.Id,
                    IsApproved=u.IsApproved,
                    Email=u.Email,
                    ProfileImagePath = u.ProfileImagePath
                })
                .ToListAsync();
            return users;

        }
        public async Task<User?> GetUserById(int id)
        {
            return await _context.users
                 .AsNoTracking()
                 .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<User?> EditProfileAsync(int id, EditProfile profile)
        {
            var user = await _context.users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null) return null;
            if (!string.IsNullOrWhiteSpace(profile.Username))
            {
                user.Username = profile.Username.Trim();
            }
            if (profile.ProfileImage != null && profile.ProfileImage.Length > 0)
            {
                var uploadsDir = Path.Combine(_env.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsDir))
                {
                    Directory.CreateDirectory(uploadsDir);
                }
                string uniqueFileName = $"user_{user.Id}_{Guid.NewGuid()}_{Path.GetFileName(profile.ProfileImage.FileName)}";
                string filePath = Path.Combine(uploadsDir, uniqueFileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await profile.ProfileImage.CopyToAsync(fileStream);
                }
                user.ProfileImagePath = "/uploads/" + uniqueFileName;
            }
            await _context.SaveChangesAsync();
            await _activityLogService.LogAsync(user.Id, user.Username, "Edit Profile", "User updated their profile.");
            return user;
        }


        public async Task<bool> DeleteAsync(int userId)
        {
            var u = await _context.users.FirstOrDefaultAsync(u => u.Id == userId);
            if (u == null) return false;

            _context.users.Remove(u);
            await _context.SaveChangesAsync();
            await _activityLogService.LogAsync(u.Id, u.Username, "Delete User", "User account deleted.");
            return true;

        }
        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _context.users.FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task CreateUserAsync(User user)
        {
            user.EmailVerificationToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
            user.EmailVerificationExpiry = DateTime.UtcNow.AddHours(24);

            if (string.IsNullOrEmpty(user.Password))
            {
                user.Password = Guid.NewGuid().ToString(); // Ideally hash it!
            }

            _context.users.Add(user);
            await _context.SaveChangesAsync();

            var setPasswordUrl = $"{_frontendUrl}/set-password?token={Uri.EscapeDataString(user.EmailVerificationToken)}";

            await SendVerificationEmail(user.Email, setPasswordUrl);
            await _activityLogService.LogAsync(user.Id, user.Username, "User Created", "New user created and verification email sent.");

        }


        private async Task SendVerificationEmail(string email, string setPasswordUrl)
        {
            try
            {
                string htmlBody = $@"<!DOCTYPE html>
<html lang=""en"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Set Your Password - Music World</title>
</head>
<body style=""font-family: Arial, sans-serif; margin:0; padding:0; background:linear-gradient(135deg,#ff5f6d,#ffc371,#42a5f5,#7b42f6); background-color:#7b42f6;"">
    <div style=""max-width:600px; margin:40px auto; background:rgba(0,0,0,0.6); padding:30px; border-radius:14px; box-shadow:0 4px 16px rgba(0,0,0,0.18); text-align:center; backdrop-filter: blur(8px);"">
        <img src=""http://localhost:4200/assets/images/logo2.png"" alt=""Music World Logo"" style=""width:120px; margin-bottom:20px; border-radius:10px; box-shadow:0 2px 8px rgba(123,66,246,0.3);"" />
        <h1 style=""font-size:24px; margin-bottom:20px; color:#fff; text-shadow:0 0 10px #53c0fd;"">Set Your Password</h1>
        <p style=""font-size:16px; line-height:1.5; margin-bottom:10px; color:#ffdcfa; font-weight:bold;"">Hello,</p>
        <p style=""font-size:16px; line-height:1.5; margin-bottom:30px; color:#f5f5f5;"">
            Thank you for joining Music World! To get started, please click the button below to set your password.
        </p>
        <a href=""{setPasswordUrl}"" style=""background:linear-gradient(90deg,#ff8a00,#e52e71); color:#fff; text-decoration:none; padding:15px 40px; font-weight:bold; border-radius:30px; display:inline-block; font-size:18px; margin-bottom:20px; box-shadow:0 0 8px rgba(229,46,113,0.25);"">
            Set Password
        </a>
        <p style=""margin-top:30px; font-size:14px; color:#bbb;"">
            If you did not request this, please ignore this email.
        </p>
    </div>
</body>
</html>";



                using var client = new SmtpClient("smtp.gmail.com", 587)
                {
                    Credentials = new NetworkCredential("eshatrivedi6567@gmail.com", "wzhy iols kzyl spgn"),
                    EnableSsl = true
                };
                var mail = new MailMessage
                {
                    From = new MailAddress("eshatrivedi6567@gmail.com", "Music World"),
                    Subject = "Set Your Password - Music World",
                    IsBodyHtml = true,
                    Body = htmlBody
                };
                mail.To.Add(email);
                await client.SendMailAsync(mail);
            }
            catch (Exception ex)
            {
                // Log error somewhere
                Console.WriteLine($"Failed to send email: {ex.Message}");
                throw; // optionally rethrow or handle differently
            }
        }

        public async Task<User?> GetUserByEmailVerificationTokenAsync(string token)
        {
            return await _context.users.FirstOrDefaultAsync(u => u.EmailVerificationToken == token);
        }

        public async Task SetUserPasswordAsync(int userId, string password)
        {
            var user = await _context.users.FindAsync(userId);
            if (user == null)
                throw new ArgumentException("User not found");


            // Directly setting password without hashing 
            //var decrypted = AesEncryptionHelper.Decrypt(password);
            user.Password = _passwordHasher.HashPassword(user, password);

            // Clear verification token that was used
            user.EmailVerificationToken = null;
            user.EmailVerificationExpiry = null;

            await _context.SaveChangesAsync();
            await _activityLogService.LogAsync(user.Id, user.Username, "Set Password", "User set their password via verification link.");

        }

        public async Task UpdateUserAsync(User user)
        {
            _context.users.Update(user);
            await _context.SaveChangesAsync();
        }

     

        public async Task<bool> AcceptUserAsync(int userId)
        {
            var user = await _context.users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) return false;
            user.IsApproved = true;
            await _context.SaveChangesAsync();
            await _activityLogService.LogAsync(user.Id, user.Username, "User Approved", "User approved by admin.");
            return true;
        }

        public async Task<bool> RestrictUserAsync(int userId)
        {
            var user = await _context.users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) return false;
            user.IsApproved = false;
            await _context.SaveChangesAsync();
            await _activityLogService.LogAsync(user.Id, user.Username, "User Restricted", "User access restricted by admin.");
            return true;
        }

    }

}


    

