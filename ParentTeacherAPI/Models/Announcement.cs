public class Announcement
{
    public int Id { get; set; }
    public string Title { get; set; }

    public string Message { get; set; }
    public string TargetAudience { get; set; }
    public string? AttachmentUrl { get; set; } // Optional
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

}