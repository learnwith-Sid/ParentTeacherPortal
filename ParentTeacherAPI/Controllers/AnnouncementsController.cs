using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using ParentTeacherAPI.Data;
using ParentTeacherAPI.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
// Only Admins and teacher can manage announcements
public class AnnouncementsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IHubContext<ChatHub> _hubContext; // ✅ Inject SignalR Hub Context

    public AnnouncementsController(ApplicationDbContext context, IHubContext<ChatHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext; // ✅ Assign hub context
    }

    // ✅ Create Announcement
    [Authorize(Roles = "Admin,Teacher")]
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

        if (announcement.TargetAudience == "All")
        {
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", announcement.Title, "All");
        }
        else
        {
            await _hubContext.Clients.Group(announcement.TargetAudience).SendAsync("ReceiveNotification", announcement.Title, announcement.TargetAudience);
            Console.WriteLine("added");
        }


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
    [HttpGet("by-role")]
    public async Task<ActionResult<IEnumerable<Announcement>>> GetAnnouncementsByRole([FromQuery] string role)
    {
        return await _context.Announcements
            .Where(a => a.TargetAudience == role || a.TargetAudience == "All")
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }



    // ✅ Update Announcement
    [Authorize(Roles = "Admin,Teacher")]
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
    [Authorize(Roles = "Admin,Teacher")]
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
