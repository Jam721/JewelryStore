using JewelryStore.Application.Auth;
using JewelryStore.Application.Interfaces;
using JewelryStore.Application.Options;
using JewelryStore.Application.Services;
using JewelryStore.Dtos.Profiles;
using JewelryStore.Extensions;
using JewelryStore.Infrastructure;
using JewelryStore.Infrastructure.Interfaces;
using JewelryStore.Infrastructure.Profiles;
using JewelryStore.Infrastructure.Repository;
using JewelryStore.Validation;

var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;
var configuration = builder.Configuration;

services.Configure<JwtOptions>(configuration.GetSection(nameof(JwtOptions)));

services.AddOpenApi();
services.AddSwaggerGen();
services.AddControllers();

services.AddMinioExtension(configuration);

services.AddAutoMapper(typeof(UserProfile).Assembly);
services.AddAutoMapper(typeof(JewelryProfile).Assembly);
services.AddAutoMapper(typeof(JewelryDtoProfiles).Assembly);
services.AddAutoMapper(typeof(CartProfile).Assembly);

services.AddDbContextExtensions(configuration);
services.AddApiAuthentication(configuration.GetSection(nameof(JwtOptions)).Get<JwtOptions>()!);

services.AddScoped<IUserRepository, UserRepository>();
services.AddScoped<IJewelryRepository, JewelryRepository>();

services.AddScoped<IJwtProvider, JwtProvider>();
services.AddScoped<IPasswordHasher, PasswordHasher>();

services.AddScoped<IUserService, UserService>();
services.AddScoped<IFileStorageService, FileStorageService>();
services.AddScoped<IJewelryService, JewelryService>();
services.AddScoped<ICartRepository, CartRepository>();

services.AddCors(options => {
    options.AddPolicy("ReactPolicy", policy => {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.EnsureCreated();
}

app.UseMiddleware<FileValidationMiddleware>();

app.UseCors("ReactPolicy");

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.Run();
