using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ParentTeacherAPI.Data;
using ParentTeacherAPI.Models;

namespace ParentTeacherAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "SuperAdmin")]
    public class SuperAdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public SuperAdminController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        // Get schools and their admin users
        [HttpGet("schools-with-admins")]
        public async Task<IActionResult> GetSchoolsWithAdmins()
        {
            var schools = await _context.Schools.ToListAsync();
            var users = await _userManager.Users.ToListAsync();

            var result = new List<object>();

            foreach (var school in schools)
            {
                // Only consider users with the 'SchoolAdmin' role
                var schoolAdmins = users.Where(u => u.SchoolCode == school.Code && _userManager.GetRolesAsync(u).Result.Contains("Admin")).ToList();
                var userInfo = new List<object>();

                foreach (var user in schoolAdmins)
                {
                    var roles = await _userManager.GetRolesAsync(user);
                    userInfo.Add(new
                    {
                        user.Id,
                        user.UserName,
                        user.FirstName,
                        user.LastName,
                        user.Email,
                        Role = roles.FirstOrDefault() ?? "Unknown"
                    });
                }

                result.Add(new
                {
                    school.Id,
                    school.Name,
                    school.Code,
                    school.Email,
                    school.PhoneNumber,
                    Users = userInfo
                });
            }

            return Ok(result);
        }

        // Add a new School Admin sending id and school code both
        [HttpPost("add-school-admin")]
        public async Task<IActionResult> AddSchoolAdmin([FromBody] AddSchoolAdminRequest model)
        {
            var school = await _context.Schools.FindAsync(model.SchoolId);
            if (school == null)
                return NotFound("School not found");

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user != null)
                return BadRequest("User already exists");

            var newUser = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                SchoolCode = model.SchoolCode
            };

            var result = await _userManager.CreateAsync(newUser, model.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            var roleExist = await _roleManager.RoleExistsAsync("Admin");
            if (!roleExist)
            {
                await _roleManager.CreateAsync(new IdentityRole("Admin"));
            }

            await _userManager.AddToRoleAsync(newUser, "Admin");

            return Ok(new { userId = newUser.Id, message = "School Admin added successfully." });
        }

        // Remove a School Admin
        [HttpDelete("remove-school-admin/{userId}")]
        public async Task<IActionResult> RemoveSchoolAdmin(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound("User not found");

            var roles = await _userManager.GetRolesAsync(user);
            if (!roles.Contains("Admin"))
                return BadRequest("User is not a School Admin");

            var result = await _userManager.RemoveFromRoleAsync(user, "Admin");
            if (!result.Succeeded)
                return BadRequest("Failed to remove user from role");

            return Ok(new { message = "School Admin removed successfully." });
        }

        // Get School Admins by School Code
        [HttpGet("school-admins/{schoolCode}")]
        public async Task<IActionResult> GetSchoolAdmins(string schoolCode)
        {
            var school = await _context.Schools.FirstOrDefaultAsync(s => s.Code == schoolCode);
            if (school == null)
                return NotFound("School not found");

            var users = await _userManager.Users.Where(u => u.SchoolCode == school.Code).ToListAsync();
            var schoolAdmins = users.Where(u => _userManager.GetRolesAsync(u).Result.Contains("SchoolAdmin")).ToList();

            var result = schoolAdmins.Select(user => new
            {
                user.Id,
                user.UserName,
                user.FirstName,
                user.LastName,
                user.Email
            });

            return Ok(result);
        }

    }

    // Request model for adding a School Admin
    public class AddSchoolAdminRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int SchoolId { get; set; }
        public string SchoolCode { get; set; }
    }
}
