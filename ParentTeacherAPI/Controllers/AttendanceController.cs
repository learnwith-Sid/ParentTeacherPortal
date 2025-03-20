using Microsoft.AspNetCore.Mvc;
using ParentTeacherAPI.Data;
using ParentTeacherAPI.Models;
namespace ParentTeacherAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AttendanceController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAttendance()
        {
            return Ok(_context.Attendance.ToList());
        }

        [HttpPost]
        public IActionResult MarkAttendance([FromBody] Attendance attendance)
        {
            _context.Attendance.Add(attendance);
            _context.SaveChanges();
            return Ok(attendance);
        }
    }
}