using Microsoft.EntityFrameworkCore;
using TodoApp.Entities;
    
namespace TodoApp.DbContexts
{
    public class TodoContext : DbContext
    {
        public DbSet<Todo> Todos { get; set; }

        public TodoContext(DbContextOptions<TodoContext> options) : base(options)
        {
        }
    }
}
