using Microsoft.AspNetCore.Identity;

public class ApplicationUser : IdentityUser
{
    public string? Role { get; set; } // Parent, Teacher, Admin
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? SchoolCode { get; set; } // Nullable for Superuser
    public bool IsSuperuser { get; set; } = false; // New field for identifying Superuser
}