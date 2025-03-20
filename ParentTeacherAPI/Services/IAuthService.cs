using System.Threading.Tasks;
namespace ParentTeacherAPI.Services
{
    public interface IAuthService
    {
        Task<string> Register(ApplicationUser user, string password);
        Task<string> Login(ApplicationUser user, string password);
    }
}