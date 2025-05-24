using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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
            // If registering a Superuser, check if one already exists
            bool superuserExists = await _userManager.Users.AnyAsync(u => u.IsSuperuser);
            if (model.IsSuperuser && superuserExists)
                return (false, "Superuser already exists. Only one Superuser is allowed.");

            // Validate Role
            if (string.IsNullOrEmpty(model.Role) ||
               (!model.IsSuperuser && model.Role != "Admin" && model.Role != "Teacher" && model.Role != "Parent" && model.Role != "Student"))
            {
                return (false, "Invalid role. Allowed roles: Admin, Teacher, Parent, Student.");
            }

            // Check if user already exists (email should be unique within a school)
            var existingUser = await _userManager.Users.FirstOrDefaultAsync(u => u.Email == model.Email && u.SchoolCode == model.SchoolCode);
            if (existingUser != null)
                return (false, $"User with email {model.Email} already exists in this school.");

            // Create a new user
            var user = new ApplicationUser
            {
                UserName = model.Username,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                SchoolCode = model.IsSuperuser ? null : model.SchoolCode, // Superuser has no SchoolId
                IsSuperuser = model.IsSuperuser
            };

            // Set default password if not provided
            string defaultPassword = string.IsNullOrEmpty(model.Password) ? "Default@123" : model.Password;
            var result = await _userManager.CreateAsync(user, defaultPassword);

            if (!result.Succeeded)
                return (false, string.Join(", ", result.Errors.Select(e => e.Description)));

            // Assign Role (Superuser has a separate role)
            string role = model.IsSuperuser ? "Superuser" : model.Role;

            if (!await _roleManager.RoleExistsAsync(role))
            {
                await _roleManager.CreateAsync(new IdentityRole(role));
            }

            await _userManager.AddToRoleAsync(user, role);

            return (true, $"{role} registered successfully.");
        }


        // public async Task<(bool Success, string Message)> RegisterUserAsync(RegisterModel model)
        // {
        //     if (string.IsNullOrEmpty(model.Role) || (model.Role != "Teacher" && model.Role != "Parent" && model.Role != "Student"))
        //         return (false, "Invalid role. Allowed roles: Teacher, Parent, Student.");

        //     var existingUser = await _userManager.FindByEmailAsync(model.Email);
        //     if (existingUser != null)
        //         return (false, $"User with email {model.Email} already exists.");

        //     var user = new ApplicationUser
        //     {
        //         UserName = model.Username,
        //         Email = model.Email,
        //         FirstName = model.FirstName,
        //         LastName = model.LastName
        //     };

        //     string defaultPassword = string.IsNullOrEmpty(model.Password) ? "Default@123" : model.Password;
        //     var result = await _userManager.CreateAsync(user, defaultPassword);

        //     if (!result.Succeeded)
        //         return (false, string.Join(", ", result.Errors));

        //     // Assign role
        //     if (!await _roleManager.RoleExistsAsync(model.Role))
        //     {
        //         await _roleManager.CreateAsync(new IdentityRole(model.Role));
        //     }
        //     await _userManager.AddToRoleAsync(user, model.Role);

        //     return (true, "User registered successfully");
        // }

        public async Task<string> Login(ApplicationUser user, string password, string? schoolCode)
        {
            // Step 1: Lookup user (by email + schoolId, or superuser with just email)
            var result = await _userManager.Users
                .FirstOrDefaultAsync(u => u.Email == user.Email && (u.IsSuperuser || u.SchoolCode == schoolCode));

            if (result == null)
                return "Invalid credentials";

            // Step 2: Verify password
            var result1 = await _signInManager.CheckPasswordSignInAsync(user, password, false);
            if (!result1.Succeeded)
                return "Invalid credentials";

            // Step 3: Get roles
            var roles = await _userManager.GetRolesAsync(user);

            // Step 4: Generate token
            return GenerateJwtToken(user, roles);
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
         new Claim("IsSuperuser", user.IsSuperuser.ToString()),
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
