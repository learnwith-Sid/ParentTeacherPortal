using Microsoft.AspNetCore.Identity;

public class ApplicationUser : IdentityUser
{
    public string? Role { get; set; } // Parent, Teacher, Admin
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
}