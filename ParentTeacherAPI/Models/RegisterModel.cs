namespace ParentTeacherAPI.Models
{
    public class RegisterModel
    {
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }  // Role will be "Parent" or "Teacher"
        public string? SchoolCode { get; set; } // Nullable for Superuser
        public bool IsSuperuser { get; set; } = false; // Default: False (Only Superuser gets True)

    }
}