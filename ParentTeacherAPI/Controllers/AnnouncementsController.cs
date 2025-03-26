using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ParentTeacherAPI.Data;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin")] // Only Admins can manage announcements
public class AnnouncementsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AnnouncementsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // ✅ Create Announcement
    [HttpPost]
    public async Task<IActionResult> CreateAnnouncement([FromForm] AnnouncementCreateDto announcementDto)
    {
        if (announcementDto == null)
        {
            return BadRequest("Invalid announcement data.");
        }

        string attachmentUrl = null;

        if (announcementDto.Attachment != null)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "attachments");
            Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = $"{Guid.NewGuid()}_{announcementDto.Attachment.FileName}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await announcementDto.Attachment.CopyToAsync(stream);
            }

            attachmentUrl = $"/attachments/{uniqueFileName}"; // Save relative path
        }

        var announcement = new Announcement
        {
            Title = announcementDto.Title,
            Message = announcementDto.Message,
            TargetAudience = announcementDto.TargetAudience,
            AttachmentUrl = attachmentUrl
        };

        _context.Announcements.Add(announcement);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAnnouncement), new { id = announcement.Id }, announcement);
    }


    // ✅ Get All Announcements
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Announcement>>> GetAnnouncements()
    {
        return await _context.Announcements.OrderByDescending(a => a.CreatedAt).ToListAsync();
    }

    // ✅ Get Single Announcement by ID
    [HttpGet("{id}")]
    public async Task<ActionResult<Announcement>> GetAnnouncement(int id)
    {
        var announcement = await _context.Announcements.FindAsync(id);
        if (announcement == null)
        {
            return NotFound();
        }
        return announcement;
    }

    // ✅ Update Announcement
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAnnouncement(int id, [FromForm] AnnouncementCreateDto updatedDto)
    {
        var existingAnnouncement = await _context.Announcements.FindAsync(id);
        if (existingAnnouncement == null)
        {
            return NotFound();
        }

        existingAnnouncement.Title = updatedDto.Title;
        existingAnnouncement.Message = updatedDto.Message;
        existingAnnouncement.TargetAudience = updatedDto.TargetAudience;

        if (updatedDto.Attachment != null)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "attachments");
            Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = $"{Guid.NewGuid()}_{updatedDto.Attachment.FileName}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await updatedDto.Attachment.CopyToAsync(stream);
            }

            existingAnnouncement.AttachmentUrl = $"/attachments/{uniqueFileName}";
        }

        _context.Announcements.Update(existingAnnouncement);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // ✅ Delete Announcement
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAnnouncement(int id)
    {
        var announcement = await _context.Announcements.FindAsync(id);
        if (announcement == null)
        {
            return NotFound();
        }

        _context.Announcements.Remove(announcement);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
