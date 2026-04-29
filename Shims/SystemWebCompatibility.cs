// Compatibility shims to reduce compile errors during migration to ASP.NET Core.
// These are lightweight placeholders to allow the project to compile for iterative fixes.
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Threading.Tasks;
using System.Security.Claims;

// NOTE: These shims are temporary and only exist to allow iterative compilation while migrating
// the application from ASP.NET MVC / OWIN to ASP.NET Core. They do not provide runtime behavior.

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
    }

    public abstract class HttpContextBase { }

    public class HttpRequest
    {
        public string UserAgent { get; set; }
        public System.Collections.Specialized.NameValueCollection ServerVariables { get; } = new System.Collections.Specialized.NameValueCollection();
    }

    public class HttpResponse
    {
        public int StatusCode { get; set; }
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
    public class ReportViewer { }
}

namespace ReportViewerForMvc
{
    public class ReportViewer { }
}

// SignalR shims for old Microsoft.AspNet.SignalR
namespace Microsoft.AspNet.SignalR
{
    public abstract class Hub { }
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
        public class UserLoginInfo { }
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

    public class RoleManager<TRole> { }
    public class IdentityRole { }
    public interface IUserStore<T> { }
    public interface IIdentityMessageService { }
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
}

// AutoMapper shim
namespace AutoMapper
{
    public class MappingExpression<TSource, TDest>
    {
        public MappingExpression<TSource, TDest> ForMember(System.Linq.Expressions.Expression<Func<TDest, object>> member, Action<dynamic> opts)
        {
            return this;
        }
    }

    public static class Mapper
    {
        public static MappingExpression<TSource, TDest> CreateMap<TSource, TDest>()
        {
            return new MappingExpression<TSource, TDest>();
        }
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
        // allow legacy controllers to override Dispose(bool)
        protected virtual void Dispose(bool disposing) { }

        public void Dispose() { Dispose(true); }
    }

    // Marker interface used in many controllers
    public interface IHttpActionResult { }

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

namespace Microsoft.AspNetCore.Http
{
    public static class OwinContextExtensions
    {
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
