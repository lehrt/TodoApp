using System.ComponentModel.DataAnnotations;

namespace ToDoApp.Models
{
    public class TodoDtoUpdateDto
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;
        [MaxLength(200)]
        public string AdditionalDetails { get; set; }

        public DateTime? DueDate
        {
            get; set;
        }
    }
}
