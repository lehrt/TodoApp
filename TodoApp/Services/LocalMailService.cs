namespace TodoApp.Services
{
    public class LocalMailService
    {
        private string _mailTo = "testuser@company.com";
        private string _mainFrom = "noreply@company.com";

        //mimic sending due date reminder email
        public void Send(string subject, string message)
        {
            Console.WriteLine($"Mail from {_mainFrom} to {_mailTo}");
            Console.WriteLine($"Subject: {subject}");
            Console.WriteLine($"Message: {message}");
        }
    }
}
