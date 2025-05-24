using CsvHelper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ParentTeacherAPI.Models;
using ParentTeacherAPI.Services;
using System.Globalization;

namespace ParentTeacherAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly UserManager<ApplicationUser> _userManager;

        public AuthController(IAuthService authService, UserManager<ApplicationUser> userManager)
        {
            _authService = authService;
            _userManager = userManager;
        }

        [HttpPost("register-admin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] RegisterModel model)
        {
            if (model.Role != "Admin")
                return BadRequest("Only Admin registration is allowed here.");

            var (success, message) = await _authService.RegisterUserAsync(model);

            if (!success)
                return BadRequest(message);

            return Ok("Admin registered successfully.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            // Step 1: Find the user
            var user = await _userManager.Users
                .FirstOrDefaultAsync(u =>
                    (u.Email == model.Email || u.UserName == model.Username) &&
                    (u.IsSuperuser || u.SchoolCode == model.SchoolCode));

            if (user == null)
                return Unauthorized(new { message = "Incorrect username, password, or school." });

            // Step 2: Attempt login through AuthService
            var token = await _authService.Login(user, model.Password, model.SchoolCode);

            if (token == "Invalid credentials")
                return Unauthorized(new { message = "Incorrect username or password." });

            var roles = await _userManager.GetRolesAsync(user);

            // Step 3: Return the token and roles
            return Ok(new
            {
                token = token,
                username = user.UserName,
                roles = roles,
                isSuperuser = user.IsSuperuser,
                schoolCode = user.SchoolCode
            });
        }

        [HttpPost("upload-csv")]
        public async Task<IActionResult> UploadCsv(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Please upload a valid CSV file.");

            var registerModels = new List<RegisterModel>();

            using (var stream = new StreamReader(file.OpenReadStream()))
            using (var csv = new CsvReader(stream, CultureInfo.InvariantCulture))
            {
                csv.Context.RegisterClassMap<RegisterModelCsvMap>();
                registerModels = csv.GetRecords<RegisterModel>().ToList();
            }

            var errors = new List<string>();

            foreach (var model in registerModels)
            {
                if (string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Username))
                {
                    errors.Add("Email or Username is missing.");
                    continue;
                }

                if (model.Role != "Teacher" && model.Role != "Parent" && model.Role != "Student")
                {
                    errors.Add($"Invalid role for {model.Email}. Allowed roles: Teacher, Parent, Student.");
                    continue;
                }

                var (success, message) = await _authService.RegisterUserAsync(model);

                if (!success)
                    errors.Add($"Error for {model.Email}: {message}");
            }

            if (errors.Count > 0)
                return BadRequest(new { message = "Some users were not registered.", errors });

            return Ok(new { message = "Users uploaded and registered successfully!" });
        }
    }
}
