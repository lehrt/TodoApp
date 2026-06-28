using TodoApp.Entities;
using TodoApp.Models;

namespace TodoApp.Services
{
    public interface ITodoInfoRepository
    {
        Task<IEnumerable<Todo>> GetTodosAsync();

        Task<Todo?> GetTodoAsync();
    }
}
