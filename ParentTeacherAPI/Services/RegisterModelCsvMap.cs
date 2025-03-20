using CsvHelper.Configuration;
using ParentTeacherAPI.Models;

public class RegisterModelCsvMap : ClassMap<RegisterModel>
{
    public RegisterModelCsvMap()
    {
        Map(m => m.Username).Name("Username");
        Map(m => m.FirstName).Name("FirstName");
        Map(m => m.LastName).Name("LastName");
        Map(m => m.Email).Name("Email");

        // Set default password if missing
        Map(m => m.Password)
            .Name("Password")
            .Optional()
            .Default("Student@123");

        // Ensure role is either "Teacher", "Parent", or "Student"
        Map(m => m.Role)
            .Name("Role")
            .Convert(args =>
            {
                var role = args.Row.GetField("Role")?.Trim();
                return (role == "Teacher" || role == "Parent" || role == "Student") ? role : "Student";
            });
    }
}
