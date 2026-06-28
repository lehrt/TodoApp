using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi;
using ToDoApp.Models;

namespace ToDoApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ToDoController : ControllerBase
    {
        [HttpGet]
        public ActionResult<IEnumerable<TodoDto>> GetTodos()
        {
            return Ok(ToDoDataStore.Current.ToDos);
        }

        [HttpGet("{id}")]
        public ActionResult<TodoDto> GetTodo(int id)
        {
            var selectedToDo = ToDoDataStore.Current.ToDos.FirstOrDefault(c => c.Id == id);

            if (selectedToDo == null)
            {
                return NotFound();
            }

            return Ok(selectedToDo);
        }
    }
}
