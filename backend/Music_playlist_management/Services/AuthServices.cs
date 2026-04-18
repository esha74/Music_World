using Azure.Core;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using Music_playlist_management.Data;
using Music_playlist_management.Helper;
using Music_playlist_management.Models;
using static System.Net.WebRequestMethods;


namespace Music_playlist_management.Services
{
    public class AuthServices : IAuthServices
    {
        private readonly AppDbContext _context;
        private readonly IJwtServices _jwtServices;
        private readonly Iotpservices _otpServices;
        private readonly PasswordHasher<User> _passwordHasher = new();
        private readonly IActivityLogService _activityLogServices;


        public AuthServices(AppDbContext context, IJwtServices jwtServices, Iotpservices otpServices, IActivityLogService activityLogService)
        {
            _context = context;
            _jwtServices = jwtServices;
            _otpServices = otpServices;
            _activityLogServices = activityLogService;

        }

        public async Task<(bool Success, string? ErrorMessage, LoginResponseModel? LoginData)> LoginAsync(LoginModel model)
        {
            var user = await _context.users.SingleOrDefaultAsync(u => u.Username == model.Username);

            if (user == null)
            {
                await _activityLogServices.LogAsync(null, model.Username, "Login Failed", "Invalid username.");
                return (false, "Invalid username or password.", null);

            }

            if (user.LockoutEndTime.HasValue && user.LockoutEndTime > DateTime.UtcNow)
            {
                var lockoutMins = (user.LockoutEndTime.Value - DateTime.UtcNow).TotalMinutes;
                await _activityLogServices.LogAsync(user.Id, user.Username, "Login Failed", $"Account locked. {Math.Ceiling(lockoutMins)} minutes remaining.");
                return (false, $"Account locked. Try again in {Math.Ceiling(lockoutMins)} minutes.", null);
            }

            string decryptedPassword;
            try
            {
                decryptedPassword = AesEncryptionHelper.Decrypt(model.Password);
            }
            catch
            {
                decryptedPassword = model.Password; // treat as plain text if decryption fails
            }

            var verificationResult = _passwordHasher.VerifyHashedPassword(user, user.Password, decryptedPassword);

            if (verificationResult == PasswordVerificationResult.Success)
            {
                user.FailedLoginAttempts++;
                if (user.FailedLoginAttempts >= 5)
                {
                    user.LockoutEndTime = DateTime.UtcNow.AddMinutes(5);
                    await _context.SaveChangesAsync();
                    await _activityLogServices.LogAsync(user.Id, user.Username, "Login Failed", "Too many failed login attempts. Account locked.");
                    return (false, "Account locked due to too many failed login attempts. Try again later.", null);
                }
                await _context.SaveChangesAsync();
                var attemptsLeft = 5 - user.FailedLoginAttempts;
                await _activityLogServices.LogAsync(user.Id, user.Username, "Login Failed", $"Invalid password. {attemptsLeft} attempts left.");
                return (false, $"Invalid password. You have {attemptsLeft} attempts left.", null);
            }

            // Successful login
            user.FailedLoginAttempts = 0;
            user.LockoutEndTime = null;
            await _context.SaveChangesAsync();

            var token = _jwtServices.GetJwtToken(user);
            var loginRes = new LoginResponseModel
            {
                Token = token,
                ProfileImagePath = user.ProfileImagePath,
                Role = user.Role,
                IsApproved = user.IsApproved,
                Id = user.Id
            };
            await _activityLogServices.LogAsync(user.Id, user.Username, "Login Success", "User successfully logged in.");
            return (true, null, loginRes);
        }

        public async Task<string> RegisterAsync(RegisterModel model)
        {
            if (await _context.users.AnyAsync(u => u.Username == model.Username))
                throw new InvalidOperationException("Username already exists");

            var otp = new Random().Next(100000, 999999).ToString(); // 6-digit OTP
            var otpExpiry = DateTime.UtcNow.AddMinutes(10); //otp expiry

            string? imagePath=null;

            if (model.ProfileImage != null && model.ProfileImage.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                Directory.CreateDirectory(uploadsFolder);

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(model.ProfileImage.FileName)}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.ProfileImage.CopyToAsync(stream);
                }

                // Save relative URL here
                imagePath = $"/uploads/{fileName}";
            }





            var user = new User
            {
                Username = model.Username,
                //user.Password = _passwordHasher.HashPassword(model,model.Password),
                Email = model.Email,          // store user Email
                Role = model.Role ?? "User",
                ProfileImagePath = imagePath,
                ProfileImage = model.ProfileImage,
                IsEmailVerified = false,
                EmailOtp = otp,
                OtpExpiry = otpExpiry,
                SecurityQuestion = model.SecurityQuestion,
                SecurityAnswerHash = model.SecurityAnswer
            };

            user.Password = _passwordHasher.HashPassword(user,model.Password);
            _context.users.Add(user);
            await _context.SaveChangesAsync();

            await _otpServices.SendOtpEmail(user.Email, otp);
            await _activityLogServices.LogAsync(user.Id, user.Username, "Registration", "User registered successfully.");

            return imagePath;
        }

        public async Task<(bool success, string? errorMessage)> ChangePasswordAsync(ChangePasswordModel model)
        {
            var user = await _context.users.FindAsync(model.UserId);
            if (user == null)
            {
                await _activityLogServices.LogAsync(null, "Unknown", "Change Password Failed", "User not found.");
                return (false, "User not found");

            }

            if (user.SecurityAnswerHash != model.SecurityAnswer)
            {
                await _activityLogServices.LogAsync(user.Id, user.Username, "Change Password Failed", "Incorrect security answer.");
                return (false, "Security answer is incorrect");
            }

            string decryptedNewPassword;
            //try
            //{
            //    decryptedNewPassword = AesEncryptionHelper.Decrypt(model.NewPassword);
            //}
            //catch
            //{
            //    decryptedNewPassword = model.NewPassword; // treat as plain if decryption fails
            //}
            decryptedNewPassword = _passwordHasher.HashPassword(user, model.NewPassword);

            Console.WriteLine("Encrypted received: " + model.NewPassword);
            Console.WriteLine("Decrypted password: " + decryptedNewPassword);

            user.Password = _passwordHasher.HashPassword(user, decryptedNewPassword);
            await _activityLogServices.LogAsync(user.Id, user.Username, "Password Changed", "User changed password successfully.");
            await _context.SaveChangesAsync();

            return (true, null);
        }

        public async Task<string?> GetSecurityQuestionAsync(int userId)
        {
            var user = await _context.users.FindAsync(userId);
            return user?.SecurityQuestion;
        }

    }
}
