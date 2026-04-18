using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Threading.RateLimiting;

using Microsoft.OpenApi.Models;
using Music_playlist_management.Data;
using Music_playlist_management.Models;
using Music_playlist_management.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev",
        builder => builder
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod());
});
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("AppDb")));
// Add services to the container.
builder.Services.AddTransient<IMusicServices, MusicServices>();
builder.Services.AddTransient<IUserServices, UserServices>();  

builder.Services.AddScoped<IAuthServices, AuthServices>();
builder.Services.AddScoped<IJwtServices, JwtServices>();
builder.Services.AddScoped<IActivityLogService, ActivityLogService>();

builder.Services.AddHttpClient<IPayPalSubscriptionService, PayPalSubscriptionService>();

builder.Services.AddTransient<Iotpservices,otpservices>();
builder.Services.AddTransient<IPasswordResetService,PasswordResetService>();


builder.Services.AddScoped<IPayPalSubscriptionService, PayPalSubscriptionService>();

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = 429;

    options.AddFixedWindowLimiter("AddUserLimiter", limiterOptions =>
    {
        limiterOptions.PermitLimit = 1; // 1 request per user
        limiterOptions.Window = TimeSpan.FromMinutes(2); // per 1 minute
        limiterOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        limiterOptions.QueueLimit = 0;
    });
});


builder.Services.AddAuthentication(
 JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
c.SwaggerDoc("v1", new OpenApiInfo { Title = "Music World API", Version = "v1" });
c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
{
    In = ParameterLocation.Header,
    Description = "Enter JWT with Bearer",
    Name = "Authorization",
    Type = SecuritySchemeType.Http,
    Scheme = "Bearer"
});
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseStaticFiles();
app.UseCors("AllowAngularDev");


app.UseHttpsRedirection();

app.UseAuthentication();
app.UseRateLimiter();

app.UseAuthorization();

app.MapControllers();

app.Run();
