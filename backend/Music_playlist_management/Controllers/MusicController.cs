using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Music_playlist_management.Models;
using Music_playlist_management.Services;

namespace Music_playlist_management.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
  
    public class MusicController : ControllerBase
    {
        private readonly IMusicServices _musicServices;

        public MusicController(IMusicServices musicServices)
        {
            _musicServices = musicServices;
        }
        [Authorize (Roles ="User,Admin")]
        [HttpGet]
        public async Task<IActionResult> GetMusic()
        {
            var music = await _musicServices.GetMusicAsync();
            return Ok(music);
        }

        [Authorize(Roles = "User,Admin")]
        [HttpGet("{id:int}")]

        public async Task<IActionResult> GetMusicById(int id)
        {
            var music = await _musicServices.GetMusicById(id);
            if (music == null) return NotFound();
            return Ok(music);
        }
        [Authorize(Roles = "User,Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateMusic([FromBody] MusicDTO music)
        {
            var created = await _musicServices.CreateMusicAsync(music);
            return Ok(created);
        }
        [Authorize(Roles = "User,Admin")]
        [HttpPut("{id:int}")]

        public async Task<IActionResult> UpdateMusic(int id, [FromBody] MusicDTO music)
        {
            var data=await _musicServices.UpdateMusicAsync(id,music);
            if(data==null)return NotFound();
            return NoContent();
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]

        public async Task<IActionResult> DeleteMusic(int id)
        {
            var data=await _musicServices.DeleteMusicAsync(id);
            if(data==null) return NotFound();
            return NoContent();
        }
    }
}
