// Compatibility shims to reduce compile errors during migration to ASP.NET Core.
// These are lightweight placeholders to allow the project to compile for iterative fixes.
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Dynamic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using System.Security.Claims;

// NOTE: These shims are temporary and only exist to allow iterative compilation while migrating
// the application from ASP.NET MVC / OWIN to ASP.NET Core. They do not provide runtime behavior.

// Global Request shim for legacy Razor views that still use `Request.IsAuthenticated`.
public static class Request
{
    public static bool IsAuthenticated => false;
    public static Uri Url => new Uri("http://localhost/");
    public static string RawUrl => "/";
    public static NameValueCollection Form { get; } = new NameValueCollection();
    public static NameValueCollection ServerVariables { get; } = new NameValueCollection();
}

namespace System.Web
{
    public class HttpContextBaseShim : HttpContextBase
    {
        public HttpRequest Request { get; set; } = new HttpRequest();
        public HttpResponse Response { get; set; } = new HttpResponse();
    }

    // Minimal HttpApplication placeholder
    public class HttpApplication { }
}

// Minimal HttpContext/Request/Response shims for legacy code that uses HttpContext.Current
namespace System.Web
{
    public class HttpContext
    {
        public static HttpContext Current { get; set; }

        public HttpRequest Request { get; set; }
        public HttpResponse Response { get; set; }
        public HttpServerUtility Server { get; set; } = new HttpServerUtility();
    }

    public abstract class HttpContextBase { }

    public class HttpRequest
    {
        public string UserAgent { get; set; }
        public NameValueCollection ServerVariables { get; } = new NameValueCollection();
        public NameValueCollection Form { get; } = new NameValueCollection();
        public HttpFileCollection Files { get; } = new HttpFileCollection();
        public Uri RequestUri { get; set; }
        public bool IsAuthenticated { get; set; }
    }

    public class HttpResponse
    {
        public int StatusCode { get; set; }
    }

    public class HttpServerUtility
    {
        public string MapPath(string path) => path;
    }

    public class HttpFileCollection : List<HttpPostedFile>
    {
        public HttpPostedFile this[string name] => this.FirstOrDefault(f => string.Equals(f?.FileName, name, StringComparison.OrdinalIgnoreCase)) ?? new HttpPostedFile();
    }

    public class HttpPostedFile
    {
        public string FileName { get; set; }
        public void SaveAs(string path) { }
    }
}

// Owin startup attribute shim
namespace Microsoft.Owin
{
    [System.AttributeUsage(System.AttributeTargets.Assembly, AllowMultiple = true)]
    public class OwinStartupAttribute : System.Attribute
    {
        public OwinStartupAttribute(System.Type startupType) { }
        public OwinStartupAttribute(string typeName) { }
    }

public static class HttpContextWrapper
{
    public static System.Web.HttpContext Current => System.Web.HttpContext.Current;
}
}

// System.Web.Routing shims
namespace System.Web.Routing
{
    public class RouteCollection
    {
        public void IgnoreRoute(string url) { }
        public void MapRoute(string name, string url, object defaults) { }
        public void MapMvcAttributeRoutes() { }
    }

    public static class RouteTable
    {
        public static RouteCollection Routes { get; } = new RouteCollection();
    }

    public class UrlParameter
    {
        public static object Optional => null;
    }
}

// Web API RouteAttribute shim
namespace System.Web.Http
{
    public class RouteAttribute : System.Attribute
    {
        public RouteAttribute(string template) { }
    }
}

// Reporting shims
namespace Microsoft.Reporting.WebForms
{
    // Minimal ReportViewer placeholder to satisfy view references
    public enum ProcessingMode { Local, Remote }

    public class ReportParameter
    {
        public ReportParameter(string name, string value) { }
    }

    public class ReportDataSource
    {
        public ReportDataSource(string name, object value) { }
    }

    public class LocalReport
    {
        public string ReportPath { get; set; }
        public IList<ReportDataSource> DataSources { get; } = new List<ReportDataSource>();
        public void SetParameters(IEnumerable<ReportParameter> parameters) { }
        public void Refresh() { }
    }

    public class ServerReport
    {
        public string ReportPath { get; set; }
        public void SetParameters(IEnumerable<ReportParameter> parameters) { }
    }

    public class ReportViewer
    {
        public ProcessingMode ProcessingMode { get; set; }
        public bool SizeToReportContent { get; set; }
        public string Width { get; set; }
        public string Height { get; set; }
        public LocalReport LocalReport { get; } = new LocalReport();
        public ServerReport ServerReport { get; } = new ServerReport();
    }
}

namespace ReportViewerForMvc
{
    public static class ReportViewerHtmlHelperExtensions
    {
        public static IHtmlContent ReportViewer(this IHtmlHelper htmlHelper, Microsoft.Reporting.WebForms.ReportViewer reportViewer)
            => HtmlString.Empty;
    }
}

// SignalR shims for old Microsoft.AspNet.SignalR
namespace Microsoft.AspNet.SignalR
{
    public abstract class Hub { }

    public interface IHubContext { }

    public sealed class HubConnectionManager
    {
        public IHubContext GetHubContext<T>() => null;
    }

    public static class GlobalHost
    {
        public static HubConnectionManager ConnectionManager { get; } = new HubConnectionManager();
    }
}

namespace Microsoft.AspNet.SignalR.Hubs
{
    public class HubNameAttribute : System.Attribute
    {
        public HubNameAttribute(string name) { }
    }
}

namespace System.Web.Mvc
{
    // Minimal Controller and ActionResult shims for legacy MVC usage
    public abstract class ActionResult { }

    public class ViewResult : ActionResult { public object Model { get; set; } }

    public class RedirectToRouteResult : ActionResult { public string RouteName { get; set; } }

    public class RedirectResult : ActionResult { public string Url { get; set; } }

    public abstract class Controller
    {
        public HttpContextBase HttpContext { get; set; } = new System.Web.HttpContextBaseShim();
        public dynamic ViewBag { get; } = new ExpandoObject();
        public ClaimsPrincipal User { get; } = new ClaimsPrincipal(new ClaimsIdentity());
        public System.Web.HttpRequest Request => System.Web.HttpContext.Current?.Request;

        protected ActionResult View()
        {
            return new ViewResult();
        }

        protected ActionResult View(object model)
        {
            return new ViewResult() { Model = model };
        }

        protected ActionResult View(string viewName, object model)
        {
            return new ViewResult() { Model = model };
        }

        protected ActionResult RedirectToAction(string action, string controller)
        {
            return new RedirectToRouteResult() { RouteName = controller + "/" + action };
        }

        protected ActionResult Redirect(string url)
        {
            return new RedirectResult() { Url = url };
        }

        protected ActionResult HttpNotFound()
        {
            return new HttpNotFoundResult();
        }

        protected ActionResult PartialView(string viewName, object model)
        {
            return new ViewResult() { Model = model };
        }
    }

    public class HttpNotFoundResult : ActionResult { }

    // Authorize attribute shim mapping to ASP.NET Core
    public class AuthorizeAttribute : Microsoft.AspNetCore.Authorization.AuthorizeAttribute { }

    // RouteAttribute shim
    public class RouteAttribute : System.Attribute
    {
        public RouteAttribute(string template) { }
    }

    // HttpUnauthorizedResult shim with expected virtual ExecuteResult for legacy overrides
    public class HttpUnauthorizedResult : ActionResult
    {
        public virtual void ExecuteResult(ControllerContext context)
        {
            // no-op
        }
    }

    // ControllerContext shim
    public class ControllerContext { }

    // ValidateAntiForgeryTokenAttribute shim
    public class ValidateAntiForgeryTokenAttribute : System.Attribute { }

    // HttpPost/HttpGet/AllowAnonymous/ChildActionOnly Attribute shims
    public class HttpPostAttribute : System.Attribute { }
    public class HttpGetAttribute : System.Attribute { }
    public class AllowAnonymousAttribute : System.Attribute { }
    public class ChildActionOnlyAttribute : System.Attribute { }

    // HandleErrorInfo used by Error view
    public class HandleErrorInfo
    {
        public HandleErrorInfo(Exception exception, string controllerName, string actionName) { }
    }

    // Global filter collection placeholder
    public class GlobalFilterCollection { public void Add(object filter) { } }

    public class HandleErrorAttribute : System.Attribute { }

    public class RequireHttpsAttribute : System.Attribute { }

    // Route collection placeholder
    public class RouteCollection { }
}

namespace System.Web.Optimization
{
    // Minimal BundleTable shim
    public static class BundleTable
    {
        public static object Bundles => null;
    }

    public static class Styles
    {
        public static IHtmlContent Render(string path) => HtmlString.Empty;
    }

    public static class Scripts
    {
        public static IHtmlContent Render(string path) => HtmlString.Empty;
    }

    public abstract class BundleBase
    {
        public BundleBase Include(params string[] paths) { return this; }
    }

    public class ScriptBundle : BundleBase
    {
        public ScriptBundle(string virtualPath) { }
    }

    public class StyleBundle : BundleBase
    {
        public StyleBundle(string virtualPath) { }
    }

    public class BundleCollection {
        public void Add(BundleBase bundle) { }
    }
}

namespace Microsoft.AspNetCore.Mvc.Rendering
{
    public static class LegacyHtmlHelperExtensions
    {
        private sealed class DisposableHtmlContent : IDisposable
        {
            public void Dispose() { }
        }

        public static IDisposable BeginForm(this IHtmlHelper htmlHelper, string actionName, string controllerName, object routeValues, FormMethod method)
            => new DisposableHtmlContent();

        public static IDisposable BeginForm(this IHtmlHelper htmlHelper, string actionName, string controllerName, object routeValues, FormMethod method, object htmlAttributes)
            => new DisposableHtmlContent();

        public static IHtmlContent Action(this IHtmlHelper htmlHelper, string actionName, string controllerName, object routeValues = null)
            => HtmlString.Empty;

        public static IHtmlContent ReportViewer(this IHtmlHelper htmlHelper, object reportViewer)
            => HtmlString.Empty;
    }
}

namespace System.Web.Helpers
{
    // Placeholder for helpers used in legacy code
    public static class WebGrid { }
}

namespace System.Web.UI
{
    public class Control { }
}

namespace System.Web.UI.WebControls
{
    // Minimal placeholders for common WebControls used in legacy code.
    public class WebControl : System.Web.UI.Control { }
    public class ListItem { }
}

namespace Microsoft.AspNet
{
    namespace Identity
    {
        // Minimal placeholders for legacy Identity namespaces to avoid missing using errors.
        public class IdentityMessage { }
    }
}

namespace Microsoft.AspNet.Identity
{
    public class IdentityResult
    {
        public bool Succeeded { get; set; }
        public string[] Errors { get; set; }
        public static IdentityResult Success => new IdentityResult { Succeeded = true, Errors = new string[0] };
    }

    public class UserManager<T> : IDisposable where T : class
    {
        protected IUserStore<T> _store;
        public UserManager(IUserStore<T> store) { _store = store; }
        public void Dispose() { }

        public object UserValidator { get; set; }
        public object PasswordValidator { get; set; }
        public object EmailService { get; set; }
        public object SmsService { get; set; }
        public object UserTokenProvider { get; set; }

        public void RegisterTwoFactorProvider(string name, object provider) { }

        public virtual Task<IdentityResult> CreateAsync(T user, string password)
        {
            return Task.FromResult(IdentityResult.Success);
        }

        public virtual Task<IdentityResult> CreateAsync(T user)
        {
            return Task.FromResult(IdentityResult.Success);
        }

        public virtual Task<T> FindAsync(string userName, string password)
        {
            return Task.FromResult<T>(null);
        }

        public virtual Task<T> FindByIdAsync(string id)
        {
            return Task.FromResult<T>(null);
        }

        public virtual T FindById(string id)
        {
            return null;
        }

        public virtual Task<T> FindByNameAsync(string name)
        {
            return Task.FromResult<T>(null);
        }

        public virtual Task<bool> IsEmailConfirmedAsync(string userId)
        {
            return Task.FromResult(false);
        }

        public virtual Task<IdentityResult> ConfirmEmailAsync(string userId, string code)
        {
            return Task.FromResult(IdentityResult.Success);
        }

        public virtual Task<IdentityResult> ResetPasswordAsync(string userId, string code, string newPassword)
        {
            return Task.FromResult(IdentityResult.Success);
        }

        public virtual Task<IdentityResult> AddLoginAsync(string userId, object login)
        {
            return Task.FromResult(IdentityResult.Success);
        }

        public virtual Task<IdentityResult> RemoveLoginAsync(string userId, object login)
        {
            return Task.FromResult(IdentityResult.Success);
        }

        public virtual Task<IdentityResult> ChangePasswordAsync(string userId, string oldPassword, string newPassword)
        {
            return Task.FromResult(IdentityResult.Success);
        }

        public virtual Task<IdentityResult> AddPasswordAsync(string userId, string newPassword)
        {
            return Task.FromResult(IdentityResult.Success);
        }

        public virtual Task<IdentityResult> UpdateAsync(T user)
        {
            return Task.FromResult(IdentityResult.Success);
        }

        public virtual IdentityResult Update(T user)
        {
            return IdentityResult.Success;
        }

        public virtual System.Collections.Generic.List<Microsoft.AspNet.Identity.UserLoginInfo> GetLogins(string userId)
        {
            return new System.Collections.Generic.List<Microsoft.AspNet.Identity.UserLoginInfo>();
        }
    }

    public class RoleManager<TRole>
    {
        public IQueryable<TRole> Roles { get; } = new List<TRole>().AsQueryable();
    }
    public class IdentityRole { }
    public interface IUserStore<T> { }
    public interface IIdentityMessageService { }

    public class RoleStore<TRole> : IUserStore<TRole>
    {
        public RoleStore() { }
        public RoleStore(object context) { }
    }

    public class UserLoginInfo
    {
        public UserLoginInfo(string loginProvider, string providerKey) { LoginProvider = loginProvider; ProviderKey = providerKey; }
        public string LoginProvider { get; set; }
        public string ProviderKey { get; set; }
    }

    public static class IdentityExtensions
    {
        public static string GetUserId(this ClaimsIdentity identity) => string.Empty;
        public static string GetUserName(this ClaimsIdentity identity) => string.Empty;
        public static string GetUserId(this ClaimsPrincipal principal) => string.Empty;
        public static string GetUserName(this ClaimsPrincipal principal) => string.Empty;
        public static string GetUserId(this System.Security.Principal.IIdentity identity) => string.Empty;
        public static string GetUserName(this System.Security.Principal.IIdentity identity) => string.Empty;
    }
}

namespace Microsoft.AspNet.Identity.EntityFramework
{
    // Placeholder types
    public class IdentityDbContext<T> { }

    public class UserStore<T> : Microsoft.AspNet.Identity.IUserStore<T>
    {
        public UserStore() { }
        public UserStore(object context) { }
    }

    public class RoleStore<TRole> : Microsoft.AspNet.Identity.IUserStore<TRole>
    {
        public RoleStore() { }
        public RoleStore(object context) { }
    }
}

// AutoMapper shim
namespace AutoMapper
{
    public interface IMapperConfigurationExpression
    {
        void AddProfile<TProfile>() where TProfile : class, new();
    }

    public class Profile
    {
        protected MappingExpression<TSource, TDest> CreateMap<TSource, TDest>() => Mapper.CreateMap<TSource, TDest>();
    }

    public class MappingExpression<TSource, TDest>
    {
        public MappingExpression<TSource, TDest> ForMember(System.Linq.Expressions.Expression<Func<TDest, object>> member, Action<dynamic> opts)
        {
            return this;
        }
    }

    internal sealed class MapperConfigurationExpression : IMapperConfigurationExpression
    {
        public void AddProfile<TProfile>() where TProfile : class, new() { }
    }

    public static class Mapper
    {
        public static void Initialize(Action<IMapperConfigurationExpression> configAction) { }

        public static MappingExpression<TSource, TDest> CreateMap<TSource, TDest>()
        {
            return new MappingExpression<TSource, TDest>();
        }

        public static TDest Map<TDest>(object source) where TDest : new()
        {
            return new TDest();
        }

        public static TDest Map<TSource, TDest>(TSource source) where TDest : new()
        {
            return new TDest();
        }

        public static void Map<TSource, TDest>(TSource source, TDest destination) { }
    }
}

// Identity validators and token providers (minimal)
namespace Microsoft.AspNet.Identity
{
    public class UserValidator<TUser> where TUser : class
    {
        public UserValidator(UserManager<TUser> manager) { }
        public bool AllowOnlyAlphanumericUserNames { get; set; }
        public bool RequireUniqueEmail { get; set; }
    }

    public class PasswordValidator { public int RequiredLength; public bool RequireNonLetterOrDigit; public bool RequireDigit; public bool RequireLowercase; public bool RequireUppercase; }

    public class PhoneNumberTokenProvider<TUser> { public string MessageFormat { get; set; } }
    public class EmailTokenProvider<TUser> { public string Subject { get; set; } public string BodyFormat { get; set; } }

    public class DataProtectorTokenProvider<TUser>
    {
        public DataProtectorTokenProvider(object protector) { }
    }
}

// Remove conflicting Microsoft.AspNet.Identity.Owin shims to prefer Microsoft.Owin types from packages

namespace System.Data.Entity
{
    // Minimal DbContext and model builder placeholders to support EF6-based code during compilation.
    public class DbContext
    {
        protected virtual void OnModelCreating(DbModelBuilder modelBuilder) { }
    }

    public class DbModelBuilder { }
}

namespace System.Data.Entity.Migrations
{
    public class DbMigrationsConfiguration<TContext> where TContext : class { }
}

namespace Microsoft.Owin
{
    // Note: IOwinContext is defined later with required members.
}

namespace Microsoft.Owin.Security.Cookies
{
    public class CookieAuthenticationOptions { }
}

// --- Web API (System.Web.Http) compatibility shims ---
namespace System.Web.Http
{
    using Microsoft.AspNetCore.Mvc;
    using System.Threading;
    using System.Threading.Tasks;

    // Minimal ApiController shim mapping to ControllerBase and supporting Dispose override
    public abstract class ApiController : ControllerBase, IDisposable
    {
        public new System.Web.HttpRequest Request { get; } = new System.Web.HttpRequest();

        // allow legacy controllers to override Dispose(bool)
        protected virtual void Dispose(bool disposing) { }

        public void Dispose() { Dispose(true); }

        protected new IHttpActionResult Ok() => new HttpActionResult();
        protected new IHttpActionResult Ok(object value) => new HttpActionResult();
        protected new IHttpActionResult BadRequest() => new HttpActionResult();
        protected new IHttpActionResult BadRequest(string message) => new HttpActionResult();
        protected new IHttpActionResult NotFound() => new HttpActionResult();
        protected IHttpActionResult Created(Uri uri, object value) => new HttpActionResult();
        protected IHttpActionResult CreatedAtRoute(string routeName, object routeValues, object value) => new HttpActionResult();
    }

    // Marker interface used in many controllers
    public interface IHttpActionResult { }

    public class HttpActionResult : IHttpActionResult { }

    // Attributes used by Web API controllers
    public class HttpGetAttribute : System.Attribute { }
    public class HttpPostAttribute : System.Attribute { }
    public class HttpPutAttribute : System.Attribute { }
    public class HttpDeleteAttribute : System.Attribute { }

    // Minimal HttpConfiguration used in WebApiConfig.Register signature
    public class HttpConfiguration { }

    // Authorize attribute for Web API (distinct namespace)
    public class AuthorizeAttribute : System.Attribute { }
}

// --- OWIN shims ---
namespace Owin
{
    // Minimal IAppBuilder placeholder used in Startup.Auth.cs
    public interface IAppBuilder { }

    public static class AppBuilderExtensions
    {
        public static void CreatePerOwinContext<T>(this IAppBuilder app, Func<object> createCallback) { }
        public static void CreatePerOwinContext<T>(this IAppBuilder app, Func<IServiceProvider, T> createCallback) { }
        public static void UseCookieAuthentication(this IAppBuilder app, object options) { }
        public static void UseExternalSignInCookie(this IAppBuilder app, string authenticationType) { }
    }
}

namespace Microsoft.Owin
{
    // IOwinContext placeholder with Authentication property
    public interface IOwinContext
    {
        Microsoft.Owin.Security.IAuthenticationManager Authentication { get; }
    }

    public static class OwinContextGetExtensions
    {
        public static T Get<T>(this IOwinContext context) where T : class
        {
            return default(T);
        }
    }
}

// Provide GetOwinContext extension for HttpContext
namespace System.Web
{
    public static class OwinContextExtensions
    {
        public static Microsoft.Owin.IOwinContext GetOwinContext(this HttpContextBase context)
        {
            return null;
        }

        public static Microsoft.Owin.IOwinContext GetOwinContext(this HttpContext context)
        {
            return null;
        }
    }
}

namespace Microsoft.Owin.Security
{
    // IAuthenticationManager used by legacy code
    public interface IAuthenticationManager
    {
        void SignOut(params string[] authenticationTypes);
        void SignIn(object properties, params ClaimsIdentity[] identities);
    }

    namespace DataProtection
    {
        public class DpapiDataProtectionProvider { }
    }

    namespace Google
    {
        public class GoogleOAuth2AuthenticationOptions { }
    }
}

namespace Microsoft.AspNet.Identity.Owin
{
    // Minimal placeholder types used by legacy Identity OWIN glue.
    public class IdentityFactoryOptions<T>
    {
        public IDataProtectionProvider DataProtectionProvider { get; set; }
    }

    public interface IDataProtectionProvider { object Create(string purpose); }
}

namespace Microsoft.Extensions.DependencyInjection
{
    using AutoMapper;

    public static class AutoMapperServiceCollectionExtensions
    {
        public static IServiceCollection AddAutoMapper(this IServiceCollection services, params Type[] profileAssemblyMarkerTypes) => services;
        public static IServiceCollection AddAutoMapper(this IServiceCollection services, Action<IMapperConfigurationExpression> configAction) => services;
    }
}

namespace Microsoft.AspNetCore.Builder
{
    public sealed class SystemWebAdaptersBuilder
    {
        public SystemWebAdaptersBuilder AddWrappedAspNetCoreSession() => this;
        public SystemWebAdaptersBuilder AddJsonSessionSerializer(Action<dynamic> configure = null) => this;
    }

    public static class SystemWebAdaptersExtensions
    {
        public static SystemWebAdaptersBuilder AddSystemWebAdapters(this Microsoft.Extensions.DependencyInjection.IServiceCollection services) => new SystemWebAdaptersBuilder();
        public static IApplicationBuilder UseSystemWebAdapters(this IApplicationBuilder app) => app;
        public static ControllerActionEndpointConventionBuilder RequireSystemWebAdapterSession(this ControllerActionEndpointConventionBuilder builder) => builder;
    }
}

namespace System.Configuration
{
    public class ConnectionStringSettings
    {
        public string Name { get; set; }
        public string ConnectionString { get; set; }
        public string ProviderName { get; set; }

        public ConnectionStringSettings() { }
        public ConnectionStringSettings(string name, string connectionString)
        {
            Name = name;
            ConnectionString = connectionString;
        }
    }

    public class ConnectionStringSettingsCollection : IEnumerable<ConnectionStringSettings>
    {
        private readonly Dictionary<string, ConnectionStringSettings> _items = new Dictionary<string, ConnectionStringSettings>(StringComparer.OrdinalIgnoreCase);
        public ConnectionStringSettings this[string name] => _items.TryGetValue(name, out var value) ? value : null;
        public void Add(ConnectionStringSettings item) => _items[item.Name] = item;
        public IEnumerator<ConnectionStringSettings> GetEnumerator() => _items.Values.GetEnumerator();
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator() => GetEnumerator();
    }

    public static class ConfigurationManager
    {
        public static ConnectionStringSettingsCollection ConnectionStrings { get; } = new ConnectionStringSettingsCollection();
        public static NameValueCollection AppSettings { get; } = new NameValueCollection();
    }
}

namespace System.Data.Entity
{
    public static class QueryableExtensions
    {
        public static IQueryable<T> Include<T, TProperty>(this IQueryable<T> source, Expression<Func<T, TProperty>> path) => source;
    }
}
