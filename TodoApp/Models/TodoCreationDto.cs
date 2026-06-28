using System.ComponentModel.DataAnnotations;

namespace TodoApp.Models
{
    public class TodoCreationDto
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;
        [MaxLength(200)]
        public string? AdditionalDetails { get; set; }

        /// <summary>
        /// Absolute due date. Takes precedence over relative due date.
        /// </summary>
        public DateTime? DueDate { get; set; }

        /// <summary>
        /// Numeric value for relative due date (e.g., 5 for "5 days").
        /// Must be used together with RelativeDueDateUnit.
        /// </summary>
        public int? RelativeDueDateValue { get; set; }

        /// <summary>
        /// Time unit for relative due date (Seconds, Minutes, Hours, Days).
        /// Must be used together with RelativeDueDateValue.
        /// </summary>
        public TimeUnit? RelativeDueDateUnit { get; set; }
    }
}
