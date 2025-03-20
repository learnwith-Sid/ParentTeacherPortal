using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ParentTeacherAPI.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ParentTeacherAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;

        public AuthService(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _configuration = configuration;
            Console.WriteLine($"✅ Configuration Injected: {_configuration != null}");
            Console.WriteLine($"✅ Loaded JWT Secret: {_configuration["Jwt:Secret"] ?? "NULL"}");
        }

        public async Task<(bool Success, string Message)> RegisterUserAsync(RegisterModel model)
        {
            if (string.IsNullOrEmpty(model.Role) || (model.Role != "Teacher" && model.Role != "Parent" && model.Role != "Student"))
                return (false, "Invalid role. Allowed roles: Teacher, Parent, Student.");

            var existingUser = await _userManager.FindByEmailAsync(model.Email);
            if (existingUser != null)
                return (false, $"User with email {model.Email} already exists.");

            var user = new ApplicationUser
            {
                UserName = model.Username,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName
            };

            string defaultPassword = string.IsNullOrEmpty(model.Password) ? "Default@123" : model.Password;
            var result = await _userManager.CreateAsync(user, defaultPassword);

            if (!result.Succeeded)
                return (false, string.Join(", ", result.Errors));

            // Assign role
            if (!await _roleManager.RoleExistsAsync(model.Role))
            {
                await _roleManager.CreateAsync(new IdentityRole(model.Role));
            }
            await _userManager.AddToRoleAsync(user, model.Role);

            return (true, "User registered successfully");
        }

        public async Task<string> Login(ApplicationUser user, string password)
        {
            var result = await _signInManager.PasswordSignInAsync(user.UserName, password, false, false);
            if (!result.Succeeded) return "Invalid credentials";

            var appUser = await _userManager.FindByNameAsync(user.UserName);
            var roles = await _userManager.GetRolesAsync(appUser);

            return GenerateJwtToken(appUser, roles);
        }

        private string GenerateJwtToken(ApplicationUser user, IList<string> roles)
        {
            var secret = _configuration["Jwt:Key"]; // ✅ Matches appsettings.json

            Console.WriteLine($"✅ Loaded JWT Secret Key: {secret ?? "NULL"}");

            if (string.IsNullOrEmpty(secret))
            {
                throw new InvalidOperationException("❌ JWT Secret key is missing in configuration.");
            }


            var key = Encoding.ASCII.GetBytes(secret);
            var tokenHandler = new JwtSecurityTokenHandler();
            var claims = new List<Claim>
    {
        new Claim("id", user.Id),
        new Claim(ClaimTypes.Name, user.UserName),
        new Claim(ClaimTypes.Email, user.Email)
    };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

    }
}
