using Microsoft.EntityFrameworkCore;
using TodoApp.DbContexts;
using TodoApp.Models;
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
                    await CheckAndSendDueDateRemindersAsync();
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

        private async Task CheckAndSendDueDateRemindersAsync()
        {
            using var scope = _serviceProvider.CreateScope();
            var mailService = scope.ServiceProvider.GetRequiredService<LocalMailService>();
            var context = scope.ServiceProvider.GetRequiredService<TodoContext>();

            var now = DateTime.Now;

            // Find todos that are due (due date has passed or is right now) and have reminders enabled
            var dueTodos = await context.Todos
                .Where(t => t.RemindersEnabled && t.DueDate.HasValue && t.DueDate.Value <= now)
                .ToListAsync();

            // Find todos due within the next minute (upcoming reminders) and have reminders enabled
            var upcomingTodos = await context.Todos
                .Where(t => t.RemindersEnabled && 
                            t.DueDate.HasValue && 
                            t.DueDate.Value > now && 
                            t.DueDate.Value <= now.AddMinutes(1))
                .ToListAsync();

            // Send reminders for todos that are now due
            foreach (var todo in dueTodos)
            {
                mailService.Send(
                    "Todo Due Now!",
                    $"Reminder: '{todo.Name}' is due!\n\nDue: {todo.DueDate:yyyy-MM-dd HH:mm:ss}\n\nDetails: {todo.AdditionalDetails}"
                );
                _logger.LogInformation("Sent due reminder for todo {TodoId}: {TodoName} (Due: {DueDate})", 
                    todo.Id, todo.Name, todo.DueDate);
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
