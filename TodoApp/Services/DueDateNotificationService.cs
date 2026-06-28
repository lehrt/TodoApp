using TodoApp.Models;
using ToDoApp;
using ToDoApp.Models;

namespace TodoApp.Services
{
    public class DueDateNotificationService : BackgroundService
    {
        private readonly ILogger<DueDateNotificationService> _logger;
        private readonly IServiceProvider _serviceProvider;
        private readonly TimeSpan _checkInterval = TimeSpan.FromSeconds(10); // Check every 10 seconds for testing

        public DueDateNotificationService(
            ILogger<DueDateNotificationService> logger,
            IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Due Date Notification Service started at {Time}", DateTime.Now);

            // Wait a bit before first check to let the application fully start
            await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    CheckAndSendDueDateReminders();
                    await Task.Delay(_checkInterval, stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error in Due Date Notification Service");
                    // Continue running even if there's an error
                    await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
                }
            }

            _logger.LogInformation("Due Date Notification Service stopped at {Time}", DateTime.Now);
        }

        private void CheckAndSendDueDateReminders()
        {
            using var scope = _serviceProvider.CreateScope();
            var mailService = scope.ServiceProvider.GetRequiredService<LocalMailService>();

            var now = DateTime.Now;

            // Find todos that are due (due date has passed or is right now)
            var dueTodos = ToDoDataStore.Current.ToDos
                .Where(t => t.DueDate.HasValue && t.DueDate.Value <= now)
                .ToList();

            // Find todos due within the next minute (upcoming reminders)
            var upcomingTodos = ToDoDataStore.Current.ToDos
                .Where(t => t.DueDate.HasValue && 
                            t.DueDate.Value > now && 
                            t.DueDate.Value <= now.AddMinutes(1))
                .ToList();

            // Send reminders for todos that are now due
            foreach (var todo in dueTodos)
            {
                mailService.Send(
                    "Todo Due Now!",
                    $"Reminder: '{todo.Name}' is due!\n\nDue: {todo.DueDate:yyyy-MM-dd HH:mm:ss}\n\nDetails: {todo.AdditionalDetails}"
                );
                _logger.LogInformation("Sent due reminder for todo {TodoId}: {TodoName} (Due: {DueDate})", 
                    todo.Id, todo.Name, todo.DueDate);

                // Clear the due date after sending to avoid repeat notifications
                todo.DueDate = null;
            }

            // Send upcoming reminders
            foreach (var todo in upcomingTodos)
            {
                mailService.Send(
                    "Todo Due Soon!",
                    $"Heads up: '{todo.Name}' is due in less than a minute!\n\nDue: {todo.DueDate:yyyy-MM-dd HH:mm:ss}\n\nDetails: {todo.AdditionalDetails}"
                );
                _logger.LogInformation("Sent upcoming reminder for todo {TodoId}: {TodoName} (Due: {DueDate})", 
                    todo.Id, todo.Name, todo.DueDate);
            }

            if (dueTodos.Count > 0 || upcomingTodos.Count > 0)
            {
                _logger.LogInformation("Due date check at {Time}: Found {DueNow} due now, {Upcoming} upcoming", 
                    now, dueTodos.Count, upcomingTodos.Count);
            }
            else
            {
                _logger.LogDebug("Due date check completed. No todos with approaching due dates.");
            }
        }
    }
}
