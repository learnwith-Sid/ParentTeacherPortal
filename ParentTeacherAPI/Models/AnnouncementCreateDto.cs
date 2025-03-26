
public class AnnouncementCreateDto
{
    public string Title { get; set; }
    public string Message { get; set; }
    public string TargetAudience { get; set; }
    public IFormFile? Attachment { get; set; } // Accepts file
}
