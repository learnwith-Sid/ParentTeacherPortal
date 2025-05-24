using System.Collections.Generic;
using System.Threading.Tasks;
using ParentTeacherAPI.Models;

namespace ParentTeacherAPI.Services
{
    public interface IAuthService
    {
        Task<(bool Success, string Message)> RegisterUserAsync(RegisterModel model); // Updated for bulk user registration
        Task<string> Login(ApplicationUser user, string password, string? schoolCode);
    }
}
