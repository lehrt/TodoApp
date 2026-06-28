using System.Net.NetworkInformation;
using ToDoApp.Models;

namespace ToDoApp
{

    public class ToDoDataStore
    {
        public List<TodoDto> ToDos { get; set; }
        public static ToDoDataStore Current { get; } = new ToDoDataStore();

        public ToDoDataStore()
        {
            ToDos = new List<TodoDto>()
            {
                new TodoDto()
                {
                    Id = 1,
                    Name = "Test",
                    AdditionalDetails = "Test Description",
                    CreatedDate = DateTime.Now,
                    DueDate = DateTime.Now.AddDays(7)
                },
                new TodoDto()
                {
                    Id = 2,
                    Name = "Test2",
                    AdditionalDetails = "Test Description 2",
                    CreatedDate = DateTime.Now,
                    DueDate = DateTime.Now.AddDays(7)
                },
                new TodoDto()
                {
                    Id = 3,
                    Name = "Test3",
                    AdditionalDetails = "Test Description 3",
                    CreatedDate = DateTime.Now,
                    DueDate = DateTime.Now.AddDays(7)
                }
            };
        }
    }
}
