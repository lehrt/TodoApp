using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi;
using TodoApp.Models;
using ToDoApp.Models;
using Microsoft.AspNetCore.JsonPatch;

namespace ToDoApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ToDosController : ControllerBase
    {
        [HttpGet]
        public ActionResult<IEnumerable<TodoDto>> GetTodos()
        {
            return Ok(ToDoDataStore.Current.ToDos);
        }

        [HttpGet("{id}", Name="GetTodos")]
        public ActionResult<TodoDto> GetTodo(int id)
        {
            var selectedToDo = ToDoDataStore.Current.ToDos.FirstOrDefault(c => c.Id == id);

            if (selectedToDo == null)
            {
                return NotFound();
            }

            return Ok(selectedToDo);
        }

        [HttpPost]
        public ActionResult<TodoDto> CreateTodo(TodoCreationDto todoCreationDto)
        {
            var createdDate = DateTime.Now;

            // Calculate due date from either absolute or relative format
            var calculatedDueDate = DueDateHelper.CalculateDueDate(
                todoCreationDto.DueDate,
                todoCreationDto.RelativeDueDateValue,
                todoCreationDto.RelativeDueDateUnit,
                createdDate
            );

            var maxId = ToDoDataStore.Current.ToDos.Max(c => c.Id);
            var finalTodo = new TodoDto()
            {
                Id = ++maxId,
                Name = todoCreationDto.Name,
                AdditionalDetails = todoCreationDto.AdditionalDetails,
                CreatedDate = createdDate,
                DueDate = calculatedDueDate
            };
            ToDoDataStore.Current.ToDos.Add(finalTodo);
            return CreatedAtAction("GetTodos", new { id = finalTodo.Id }, finalTodo);
        }

        [HttpPut("{id}")]
        public ActionResult<TodoDto> UpdateTodo(int id, TodoDtoUpdateDto todoUpdateDto)
        {
            var selectedToDo = ToDoDataStore.Current.ToDos.FirstOrDefault(c => c.Id == id);

            if (selectedToDo == null)
            {
                return NotFound();
            }

            // Calculate due date from either absolute or relative format
            // Use current time as base for updates
            var calculatedDueDate = DueDateHelper.CalculateDueDate(
                todoUpdateDto.DueDate,
                todoUpdateDto.RelativeDueDateValue,
                todoUpdateDto.RelativeDueDateUnit,
                DateTime.Now
            );

            selectedToDo.Name = todoUpdateDto.Name;
            selectedToDo.AdditionalDetails = todoUpdateDto.AdditionalDetails;
            selectedToDo.DueDate = calculatedDueDate;

            return NoContent();
        }

        [HttpPatch("{id}")]
        public ActionResult<TodoDto> PatchDto(int id, JsonPatchDocument<TodoDtoUpdateDto> patchDocument)
        {
            var selectedToDo = ToDoDataStore.Current.ToDos.FirstOrDefault(c => c.Id == id);
            if (selectedToDo == null)
            {
                return NotFound();
            }

            var todoToPatch = new TodoDtoUpdateDto()
            {
                Name = selectedToDo.Name,
                AdditionalDetails = selectedToDo.AdditionalDetails,
                DueDate = selectedToDo.DueDate
            };

            patchDocument.ApplyTo(todoToPatch, ModelState);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if(!TryValidateModel(todoToPatch))
            {
                return BadRequest(ModelState);
            }

            selectedToDo.Name = todoToPatch.Name;
            selectedToDo.AdditionalDetails = todoToPatch.AdditionalDetails;
            selectedToDo.DueDate = todoToPatch.DueDate;
            return NoContent();
        }

        [HttpDelete("{id}")]
        public ActionResult DeleteTodo(int id)
        {
            var selectedToDo = ToDoDataStore.Current.ToDos.FirstOrDefault(c => c.Id == id);
                if (selectedToDo == null)
                {
                    return NotFound();
                }

                ToDoDataStore.Current.ToDos.Remove(selectedToDo);
            return NoContent();
        }
    }
}
