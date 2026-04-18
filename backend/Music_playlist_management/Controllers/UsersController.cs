using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Music_playlist_management.Models;
using Music_playlist_management.Services;
using System.Security.Claims;
using System.Security.Cryptography;

namespace Music_playlist_management.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserServices _userService;


        public UsersController(IUserServices userService)
        {
            _userService = userService;
         
        }

       

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }


        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            bool result = await _userService.DeleteAsync(id);
            if (!result)
            {
                return NotFound(new { Message = $"User with ID {id} not found." });
            }
            return NoContent();
        }


        [Authorize(Roles = "Admin,User")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userService.GetUserById(id);
            if (user == null) return NotFound("User not found.");
            return Ok(user);
        }

        [HttpPut("{id}/edit")]
        [Authorize(Roles = "Admin,User")]

        public async Task<IActionResult> EditProfile(int id, [FromForm] EditProfile profile)
        {
            var result = await _userService.EditProfileAsync(id, profile);
            if (result==null) return NotFound("User not found.");
            return Ok(result);
        }

        [EnableRateLimiting("AddUserLimiter")]
        [Authorize(Roles = "Admin")]
        [HttpPost("add-user")]
        public async Task<IActionResult> AddUser([FromBody] AddUser model)
        {
            if (string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Username))
                return BadRequest("Email and Username must be provided.");

            if (await _userService.GetUserByEmailAsync(model.Email) != null)
                return BadRequest("Email already exists.");

            if (await _userService.GetUserByUsernameAsync(model.Username) != null)
                return BadRequest("Username already exists.");

            var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

            var user = new User
            {
                Username = model.Username,
                Email = model.Email,
                Role = "User",
                IsApproved = true,
                IsEmailVerified = false,
                EmailVerificationToken = token,
                EmailVerificationExpiry = DateTime.UtcNow.AddHours(24)
            };

            await _userService.CreateUserAsync(user);

            return Ok(new { message = "User added successfully. Please check your email to set your password." });
        }

        [HttpPost("set-password")]
        [AllowAnonymous]
        public async Task<IActionResult> SetPassword([FromBody] SetPassword model)
        {
            if (model.Password != model.ConfirmPassword)
                return BadRequest("Passwords do not match.");

            var user = await _userService.GetUserByEmailVerificationTokenAsync(model.Token);
            if (user == null || user.EmailVerificationExpiry < DateTime.UtcNow)
                return BadRequest("Invalid or expired token.");

            // Set  password, mark email verified and clear token
            await _userService.SetUserPasswordAsync(user.Id, model.Password);
            user.IsEmailVerified = true;
            user.EmailVerificationToken = null;
            user.EmailVerificationExpiry = null;
            await _userService.UpdateUserAsync(user);

            return Ok(new { message = "Password set successfully. You can now login." });
        }

        // Accept user: (e.g., allow access)
        [HttpPost("{id:int}/accept")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AcceptUser(int id)
        {
            var result = await _userService.AcceptUserAsync(id);
            if (!result)
                return NotFound(new { Message = $"User with ID {id} not found." });
            return Ok(new { Message = "User accepted." });
        }

        // Restrict user: (e.g., revoke access or suspend)
        [HttpPost("{id:int}/restrict")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RestrictUser(int id)
        {
            var result = await _userService.RestrictUserAsync(id);
            if (!result)
                return NotFound(new { Message = $"User with ID {id} not found." });
            return Ok(new { Message = "User restricted." });
        }
    }
}
  