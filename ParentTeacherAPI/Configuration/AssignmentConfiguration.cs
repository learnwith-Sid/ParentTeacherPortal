using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ParentTeacherAPI.Models;

namespace ParentTeacherAPI.Configurations
{
    public class AssignmentConfiguration : IEntityTypeConfiguration<Assignment>
    {
        public void Configure(EntityTypeBuilder<Assignment> builder)
        {
            builder.HasOne(a => a.Student)
                .WithMany(s => s.Assignments)
                .HasForeignKey(a => a.StudentId);
        }
    }
}