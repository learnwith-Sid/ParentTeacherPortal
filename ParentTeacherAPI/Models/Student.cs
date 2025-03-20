using ParentTeacherAPI.Models;

public class Student
{

    public int Id { get; set; }
    public string Name { get; set; }
    public int ParentId { get; set; }
    public Parent Parent { get; set; }
    public int ClassId { get; set; }
    public Class Class { get; set; }
    public ICollection<Attendance> Attendances { get; set; }
    public ICollection<Assignment> Assignments { get; set; }
}