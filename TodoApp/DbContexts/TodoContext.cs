using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using System.Xml.Linq;
using TodoApp.Entities;
using TodoApp.Models;
    
namespace TodoApp.DbContexts
{
    public class TodoContext : DbContext
    {
        public DbSet<Todo> Todos { get; set; }

        public TodoContext(DbContextOptions<TodoContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Todo>()
                .HasData(
                new Todo("Create Dotnet API")
                {
                    Id = 1,
                    AdditionalDetails = "Implement full dotnet core api funcitonality with all CRUD operations",
                    CreatedDate = new DateTime(2026, 6, 28),
                    DueDate = new DateTime(2026, 7, 5)
                },
                new Todo("Create DB to store Todos")
                {
                    Id = 2,
                    AdditionalDetails = "Use entity framework core to implement database storage for todos",
                    CreatedDate = new DateTime(2026, 6, 28),
                    DueDate = new DateTime(2026, 7, 5)
                },
                new Todo("Create React frontend")
                {
                    Id = 3,
                    AdditionalDetails = "Implement react app to consume the dotnet api and display todos",
                    CreatedDate = new DateTime(2026, 6, 28),
                    DueDate = new DateTime(2026, 7, 5)
                });
            base.OnModelCreating(modelBuilder);
        }
    }
}
