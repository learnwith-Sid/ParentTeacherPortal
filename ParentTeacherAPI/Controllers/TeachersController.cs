using Microsoft.AspNetCore.Mvc;
using ParentTeacherAPI.Data;
using ParentTeacherAPI.Models;
namespace ParentTeacherAPI.Controllers
{


    [Route("api/[controller]")]
    [ApiController]
    public class TeachersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TeachersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetTeachers()
        {
            return Ok(_context.Teachers.ToList());
        }

        [HttpPost]
        public IActionResult AddTeacher([FromBody] Teacher teacher)
        {
            _context.Teachers.Add(teacher);
            _context.SaveChanges();
            return Ok(teacher);
        }
    }
}