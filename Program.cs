using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MtpApp.App_Start;
using MtpApp.Infrastructure;
using MtpApp.Models;
using System.IO;
using System;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

var builder = WebApplication.CreateBuilder(args);

// EF Core + SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ASP.NET Core Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// Support legacy ASP.NET Identity v2 (.NET Framework) password hashes.
builder.Services.AddScoped<IPasswordHasher<ApplicationUser>, MtpApp.Infrastructure.LegacyPasswordHasher>();

// MVC + API controllers with views
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// AutoMapper � register profiles from the application assembly
builder.Services.AddAutoMapper(cfg => cfg.AddProfile<MappingProfile>());

// Legacy view helper compatibility services
builder.Services.AddSingleton<ILegacyAssetRenderer, LegacyAssetRenderer>();
builder.Services.AddScoped<LegacyReportService>();

// Persist data-protection keys so encrypted cookies remain valid across restarts.
builder.Services.AddDataProtection()
    .SetApplicationName("MtpApp")
    .PersistKeysToFileSystem(new DirectoryInfo(Path.Combine(builder.Environment.ContentRootPath, "App_Data", "DataProtection-Keys")));

// Session
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(20);
    options.Cookie.Name = ".MtpApp.Session.v2";
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
});

// SignalR
builder.Services.AddSignalR();

// Global exception handler
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// Antiforgery configuration
builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";
    options.Cookie.Name = "__Antiforgery";
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
});

// Authorization policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(MtpApp.Infrastructure.PolicyNames.RequireAdmin, policy =>
        policy.RequireRole(MtpApp.Infrastructure.RoleNames.Admin));
    options.AddPolicy(MtpApp.Infrastructure.PolicyNames.RequireManager, policy =>
        policy.RequireRole(MtpApp.Infrastructure.RoleNames.Manager, MtpApp.Infrastructure.RoleNames.Admin));
    options.AddPolicy(MtpApp.Infrastructure.PolicyNames.RequireCaseWorker, policy =>
        policy.RequireRole(MtpApp.Infrastructure.RoleNames.CaseWorker, MtpApp.Infrastructure.RoleNames.Manager, MtpApp.Infrastructure.RoleNames.Admin));
    options.AddPolicy(MtpApp.Infrastructure.PolicyNames.RequireAuthenticated, policy =>
        policy.RequireAuthenticatedUser());
});

// Forwarded headers for reverse proxy
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

// Configure cookie-based auth redirect for API calls to return 401 instead of login page
builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/Account/Login";
    options.Cookie.Name = ".MtpApp.Auth.v2";
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
    options.SlidingExpiration = true;

    options.Events.OnRedirectToLogin = context =>
    {
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        }

        context.Response.Redirect(context.RedirectUri);
        return Task.CompletedTask;
    };
});

var app = builder.Build();

// Dev-only: reset passwords so you can log in after migration.
// Remove this block once you have confirmed login works.
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var um = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
    foreach (var email in new[] { "khornveasna@mloptapang.org", "it.mt@mloptapang.org" })
    {
        var u = await um.FindByEmailAsync(email);
        if (u != null)
        {
            var token = await um.GeneratePasswordResetTokenAsync(u);
            await um.ResetPasswordAsync(u, token, "Admin@12345");
        }
    }
}

// ── Super-admin seed (runs once; idempotent) ─────────────────────────────────
{
    using var scope = app.Services.CreateScope();
    var sp   = scope.ServiceProvider;
    var rm   = sp.GetRequiredService<RoleManager<IdentityRole>>();
    var um   = sp.GetRequiredService<UserManager<ApplicationUser>>();

    // Ensure every role the app uses exists in the database
    var allRoles = new[]
    {
        "Admin", "Manager", "CaseWorker", "User",
        "Futures System", "HR System", "Stock System",
        "Medical System", "Ticket System"
    };
    foreach (var role in allRoles)
    {
        if (!await rm.RoleExistsAsync(role))
            await rm.CreateAsync(new IdentityRole(role));
    }

    // Create the super-admin user if it does not already exist
    const string superEmail = "superadmin@mloptapang.org";
    var superUser = await um.FindByEmailAsync(superEmail);
    if (superUser == null)
    {
        superUser = new ApplicationUser
        {
            UserName      = superEmail,
            Email         = superEmail,
            EmailConfirmed = true,
            FirstName     = "Super",
            LastName      = "Admin",
            Branch        = "All",
            IsDeleted     = false
        };
        var result = await um.CreateAsync(superUser, "Admin@123");
        if (!result.Succeeded)
        {
            var errs = string.Join("; ", System.Linq.Enumerable.Select(result.Errors, e => e.Description));
            throw new Exception($"Failed to create super-admin: {errs}");
        }
    }

    // Assign all roles to the super-admin
    foreach (var role in allRoles)
    {
        if (!await um.IsInRoleAsync(superUser, role))
            await um.AddToRoleAsync(superUser, role);
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseHsts();
    app.UseExceptionHandler(_ => { });
}

app.UseForwardedHeaders();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.Use(async (context, next) =>
{
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    context.Response.Headers["X-Frame-Options"] = "SAMEORIGIN";
    context.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    await next();
});

app.UseAuthentication();
app.UseAuthorization();

// Auto-generate antiforgery tokens for authenticated users
app.Use(async (context, next) =>
{
    if (context.User.Identity?.IsAuthenticated == true)
    {
        var antiforgery = context.RequestServices.GetRequiredService<IAntiforgery>();
        var tokens = antiforgery.GetAndStoreTokens(context);
        // Token is stored in cookie; API calls send it via X-CSRF-TOKEN header
    }
    await next();
});

app.UseSession();

app.MapControllers();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapHub<MtpApp.Hubs.PlacementMonitorHub>("/placementMonitorHub");

app.Run();
