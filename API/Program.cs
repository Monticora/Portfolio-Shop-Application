using System.Text;
using API.Context;
using API.Middlware;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c => {
    
    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        BearerFormat = "JWT",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Description = "Put Bearer + your token in the box below",
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };

    c.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);

    c.AddSecurityRequirement(new OpenApiSecurityRequirement{
        {
            jwtSecurityScheme, Array.Empty<string>()
        }
    });

});

builder.Services.AddDbContext<DataBaseContext>(option => 
{
    //option.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
    option.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddCors();

builder.Services.AddIdentityCore<User>(options => {
    options.User.RequireUniqueEmail = true;
})
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<DataBaseContext>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options => {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWTSettings:TokenKey"]))
                    };
                });

builder.Services.AddAuthorization();
builder.Services.AddScoped<TokenService>();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => {
        c.ConfigObject.AdditionalItems.Add("persistAuthorization", "true");
    });
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors(option => {
    option.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000");
});

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();
app.MapFallbackToController("Index", "Fallback");

var scope = app.Services.CreateScope();

var context = scope.ServiceProvider.GetRequiredService<DataBaseContext>();
var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
try
{
    await context.Database.MigrateAsync();
    await DbSeed.SeedData(context, userManager);
}
catch(Exception ex)
{
    logger.LogError(ex, "A problem during migration");
}

app.Run();
