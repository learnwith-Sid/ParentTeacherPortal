using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Threading.Tasks;
using ParentTeacherAPI.Data;

[Route("api/[controller]")]
[ApiController]
public class SettingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _env;

    public SettingsController(ApplicationDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    // ✅ GET API - Retrieve Settings
    [HttpGet("settings")]
    public async Task<IActionResult> GetSettings()
    {
        var settings = await _context.Settings.FirstOrDefaultAsync();
        if (settings == null)
        {
            return NotFound(new { message = "Settings not found" });
        }
        return Ok(settings);
    }

    // ✅ POST API - Update Settings
    [HttpPost("settings")]
    public async Task<IActionResult> UpdateSettings([FromBody] Settings model)
    {
        var settings = await _context.Settings.FirstOrDefaultAsync();

        if (settings == null)
        {
            settings = new Settings { PlatformName = model.PlatformName, LogoUrl = model.LogoUrl };
            _context.Settings.Add(settings);
        }
        else
        {
            settings.PlatformName = model.PlatformName;
            settings.LogoUrl = model.LogoUrl;
        }

        await _context.SaveChangesAsync();
        return Ok(settings);
    }

    // ✅ POST API - Upload Logo
    [HttpPost("upload-logo")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadLogo([FromForm] IFormFile logo)
    {
        if (logo == null || logo.Length == 0)
        {
            return BadRequest(new { message = "No file uploaded." });
        }

        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var filePath = Path.Combine(uploadsFolder, logo.FileName);
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await logo.CopyToAsync(stream);
        }

        var fileUrl = $"/uploads/{logo.FileName}";
        return Ok(new { logoUrl = fileUrl });
    }

}
