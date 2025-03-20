namespace ParentTeacherAPI.Models
{
    public class Parent
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<Student> Students { get; set; }
    }
}