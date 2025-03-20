namespace ParentTeacherAPI.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using ParentTeacherAPI.Data;
    using ParentTeacherAPI.Models;

    [Route("api/[controller]")]
    [ApiController]
    public class AssignmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AssignmentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAssignments()
        {
            return Ok(_context.Assignments.ToList());
        }

        [HttpPost]
        public IActionResult AddAssignment([FromBody] Assignment assignment)
        {
            _context.Assignments.Add(assignment);
            _context.SaveChanges();
            return Ok(assignment);
        }
    }
}