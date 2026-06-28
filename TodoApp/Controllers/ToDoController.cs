using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApp.DbContexts;
using TodoApp.Entities;
using TodoApp.Models;
using ToDoApp.Models;
using Microsoft.AspNetCore.JsonPatch;

namespace ToDoApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ToDosController : ControllerBase
    {
        private readonly TodoContext _context;

        public ToDosController(TodoContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoDto>>> GetTodos()
        {
            var todos = await _context.Todos.ToListAsync();

            var todoDtos = todos.Select(t => new TodoDto
            {
                Id = t.Id,
                Name = t.Name,
                AdditionalDetails = t.AdditionalDetails,
                CreatedDate = t.CreatedDate,
                DueDate = t.DueDate
            });

            return Ok(todoDtos);
        }

        [HttpGet("{id}", Name="GetTodos")]
        public async Task<ActionResult<TodoDto>> GetTodo(int id)
        {
            var selectedTodo = await _context.Todos.FirstOrDefaultAsync(t => t.Id == id);

            if (selectedTodo == null)
            {
                return NotFound();
            }

            var todoDto = new TodoDto
            {
                Id = selectedTodo.Id,
                Name = selectedTodo.Name,
                AdditionalDetails = selectedTodo.AdditionalDetails,
                CreatedDate = selectedTodo.CreatedDate,
                DueDate = selectedTodo.DueDate
            };

            return Ok(todoDto);
        }

        [HttpPost]
        public async Task<ActionResult<TodoDto>> CreateTodo(TodoCreationDto todoCreationDto)
        {
            var createdDate = DateTime.Now;

            // Calculate due date from either absolute or relative format
            var calculatedDueDate = DueDateHelper.CalculateDueDate(
                todoCreationDto.DueDate,
                todoCreationDto.RelativeDueDateValue,
                todoCreationDto.RelativeDueDateUnit,
                createdDate
            );

            var newTodo = new Todo(todoCreationDto.Name)
            {
                AdditionalDetails = todoCreationDto.AdditionalDetails,
                CreatedDate = createdDate,
                DueDate = calculatedDueDate
            };

            _context.Todos.Add(newTodo);
            await _context.SaveChangesAsync();

            var todoDto = new TodoDto
            {
                Id = newTodo.Id,
                Name = newTodo.Name,
                AdditionalDetails = newTodo.AdditionalDetails,
                CreatedDate = newTodo.CreatedDate,
                DueDate = newTodo.DueDate
            };

            return CreatedAtAction("GetTodos", new { id = todoDto.Id }, todoDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateTodo(int id, TodoDtoUpdateDto todoUpdateDto)
        {
            var selectedTodo = await _context.Todos.FirstOrDefaultAsync(t => t.Id == id);

            if (selectedTodo == null)
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

            selectedTodo.Name = todoUpdateDto.Name;
            selectedTodo.AdditionalDetails = todoUpdateDto.AdditionalDetails;
            selectedTodo.DueDate = calculatedDueDate;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult> PatchDto(int id, JsonPatchDocument<TodoDtoUpdateDto> patchDocument)
        {
            var selectedTodo = await _context.Todos.FirstOrDefaultAsync(t => t.Id == id);
            if (selectedTodo == null)
            {
                return NotFound();
            }

            var todoToPatch = new TodoDtoUpdateDto()
            {
                Name = selectedTodo.Name,
                AdditionalDetails = selectedTodo.AdditionalDetails,
                DueDate = selectedTodo.DueDate
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

            selectedTodo.Name = todoToPatch.Name;
            selectedTodo.AdditionalDetails = todoToPatch.AdditionalDetails;
            selectedTodo.DueDate = todoToPatch.DueDate;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTodo(int id)
        {
            var selectedTodo = await _context.Todos.FirstOrDefaultAsync(t => t.Id == id);
            if (selectedTodo == null)
            {
                return NotFound();
            }

            _context.Todos.Remove(selectedTodo);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
