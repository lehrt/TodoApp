namespace ToDoApp.Models
{
    public class TodoDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string AdditionalDetails { get; set; }

        public DateTime CreatedDate
        {
            get; set;
        }

        public DateTime? DueDate
        {
            get; set;
        }

        public bool RemindersEnabled { get; set; }
    }
}
