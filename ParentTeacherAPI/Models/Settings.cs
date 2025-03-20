using System.ComponentModel.DataAnnotations;

public class Settings
{
    [Key]
    public int Id { get; set; }
    public string PlatformName { get; set; }
    public string LogoUrl { get; set; }
}
