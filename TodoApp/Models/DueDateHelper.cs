namespace TodoApp.Models
{
    public enum TimeUnit
    {
        Seconds,
        Minutes,
        Hours,
        Days
    }

    public static class DueDateHelper
    {
        /// <summary>
        /// Calculates the due date from either an absolute DateTime or a relative time period.
        /// </summary>
        /// <param name="absoluteDueDate">Absolute due date</param>
        /// <param name="relativeValue">Numeric value for relative time (e.g., 5)</param>
        /// <param name="relativeUnit">Time unit for relative time (e.g., TimeUnit.Days)</param>
        /// <param name="baseDateTime">The base time to calculate from (typically creation time)</param>
        /// <returns>Calculated DateTime or null if no due date specified</returns>
        public static DateTime? CalculateDueDate(
            DateTime? absoluteDueDate,
            int? relativeValue,
            TimeUnit? relativeUnit,
            DateTime baseDateTime)
        {
            // If absolute date is provided, use it
            if (absoluteDueDate.HasValue)
            {
                return absoluteDueDate.Value;
            }

            // If relative values are provided, calculate the due date
            if (relativeValue.HasValue && relativeUnit.HasValue)
            {
                return AddTime(baseDateTime, relativeValue.Value, relativeUnit.Value);
            }

            // No due date specified
            return null;
        }

        /// <summary>
        /// Adds the specified amount of time to a base DateTime.
        /// </summary>
        private static DateTime AddTime(DateTime baseDateTime, int value, TimeUnit unit)
        {
            return unit switch
            {
                TimeUnit.Seconds => baseDateTime.AddSeconds(value),
                TimeUnit.Minutes => baseDateTime.AddMinutes(value),
                TimeUnit.Hours => baseDateTime.AddHours(value),
                TimeUnit.Days => baseDateTime.AddDays(value),
                _ => throw new ArgumentOutOfRangeException(nameof(unit), $"Unsupported time unit: {unit}")
            };
        }
    }
}
