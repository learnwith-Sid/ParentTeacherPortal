namespace ParentTeacherAPI.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using ParentTeacherAPI.Data;
    using ParentTeacherAPI.Models;

    [Route("api/[controller]")]
    [ApiController]
    public class ClassesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClassesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetClasses()
        {
            return Ok(_context.Classes.ToList());
        }

        [HttpPost]
        public IActionResult AddClass([FromBody] Class newClass)
        {
            _context.Classes.Add(newClass);
            _context.SaveChanges();
            return Ok(newClass);
        }
    }
}
