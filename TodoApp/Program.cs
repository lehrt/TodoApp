using TodoApp.Services;
using TodoApp.DbContexts;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddNewtonsoftJson();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddTransient<LocalMailService>();
builder.Services.AddHostedService<DueDateNotificationService>();
builder.Services.AddDbContext<TodoContext>(dbContextOptions => 
    dbContextOptions.UseSqlite("Data Source=TodoInfo.db")
);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
