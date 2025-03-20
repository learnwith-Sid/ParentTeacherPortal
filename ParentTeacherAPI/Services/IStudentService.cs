namespace ParentTeacherAPI.Services
{
    public interface IStudentService
    {
        void MarkAttendance(int studentId, bool isPresent);
    }
}