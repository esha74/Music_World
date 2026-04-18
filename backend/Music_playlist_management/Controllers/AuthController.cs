using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Music_playlist_management.Data;
using Music_playlist_management.Models;
using Music_playlist_management.Services;
using System.Linq.Expressions;

namespace Music_playlist_management.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthServices _authServices;


        public AuthController(IAuthServices authServices)
        {
            _authServices = authServices;

        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid login data.");
            }

            var (success, errorMessage, loginData) = await _authServices.LoginAsync(model);

            if (!success)
            {
                return BadRequest(new { message = errorMessage });
            }

            return Ok(new
            {
                token = loginData.Token,
                username = model.Username,
                profileImagePath = loginData.ProfileImagePath,
                role = loginData.Role,
                isApproved = loginData.IsApproved,
                id = loginData.Id
            });
        }
    


[HttpPost("register")]


        public async Task<IActionResult> Register([FromForm] RegisterModel model)
        {
            try
            {
                var imagePath = await _authServices.RegisterAsync(model);
                return Ok(new { Message = "User registered successfully", imagepath = imagePath });

            }
            catch (InvalidOperationException ex)
            {

                return BadRequest(ex.Message);
            }
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordModel model)
        {
            var (success, error) = await _authServices.ChangePasswordAsync(model);
            if (!success)
                return BadRequest(error);

            return Ok(new { Message = "Password changed successfully" });
        }

        [HttpGet("get-security-question/{userId}")]
        public async Task<IActionResult> GetSecurityQuestion(int userId)
        {
            var question = await _authServices.GetSecurityQuestionAsync(userId);
            if (string.IsNullOrEmpty(question))
                return NotFound("Security question not found.");

            return Ok(new { securityQuestion = question });
        }

    }



}

