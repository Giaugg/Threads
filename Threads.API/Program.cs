using Microsoft.EntityFrameworkCore;
using Threads.API.Data;
using Threads.API.Data.Seed;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

var app = builder.Build();

app.MapGet("/", () => "🚀 Thien Kim Cute");

// using (var scope = app.Services.CreateScope())
// {
//     var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
//     await SeedData.Initialize(context);
// }

app.Run();