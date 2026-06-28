using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TodoApp.Entities
{
    public class Todo
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        [MaxLength(50)]
        public string Name { get; set; }
        [MaxLength(200)]
        public string? AdditionalDetails { get; set; }

        public DateTime CreatedDate
        {
            get; set;
        }

        public DateTime? DueDate
        {
            get; set;
        }

        public bool RemindersEnabled { get; set; } = true;

        public Todo(string name)
        {
            Name = name;
        }
    }
}
