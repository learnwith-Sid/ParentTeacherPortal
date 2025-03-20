using System;

namespace ParentTeacherAPI.Models
{
    public class Assignment
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
        public int StudentId { get; set; }
        public Student Student { get; set; }
    }
}