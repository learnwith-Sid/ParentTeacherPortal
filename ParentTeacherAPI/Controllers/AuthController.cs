using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ParentTeacherAPI.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ParentTeacherAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;

        public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }

        [HttpPost("register-admin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] RegisterModel model)
        {
            if (string.IsNullOrEmpty(model.Role))
                return BadRequest("Role is required.");

            // Restrict multiple Admin registrations
            if (model.Role == "Admin")
            {
                var existingAdmin = await _userManager.GetUsersInRoleAsync("Admin");
                if (existingAdmin.Count > 0)
                    return BadRequest("Admin already exists. Only one admin can be registered.");
            }

            var user = new ApplicationUser
            {
                UserName = model.Username,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            // Assign the selected role
            var roleResult = await _userManager.AddToRoleAsync(user, model.Role);
            if (!roleResult.Succeeded)
                return BadRequest("Failed to assign role.");

            return Ok("User registered successfully");
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {

            Console.WriteLine($"Login Attempt - Username: {model.Username}, Email: {model.Email}");

            var user = await _userManager.FindByNameAsync(model.Username) ??
                       await _userManager.FindByEmailAsync(model.Email);

            if (user == null)
            {
                Console.WriteLine("❌ User not found!");
                return Unauthorized(new { message = "Invalid username or email" });
            }

            Console.WriteLine($"User Found - Username: {user.UserName}, Email: {user.Email}");
            Console.WriteLine($"Stored Hashed Password: {user.PasswordHash}");

            bool passwordValid = await _userManager.CheckPasswordAsync(user, model.Password);
            Console.WriteLine($"Password Valid: {passwordValid}");

            if (!passwordValid)
            {
                Console.WriteLine("❌ Invalid password!");
                return Unauthorized(new { message = "Incorrect password" });
            }

            Console.WriteLine("✅ Login Successful!");

            var userRoles = await _userManager.GetRolesAsync(user);
            var authClaims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, user.UserName),
        new Claim(ClaimTypes.Email, user.Email)
    };

            foreach (var role in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            Console.WriteLine($"JWT Key: {_configuration["Jwt:Key"]}");

            var token = new JwtSecurityToken(
                expires: DateTime.Now.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            Console.WriteLine($"Generated Token: {new JwtSecurityTokenHandler().WriteToken(token)}");

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                username = user.UserName,
                roles = userRoles
            });
        }
    }
}