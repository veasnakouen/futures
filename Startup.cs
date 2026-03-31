using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(MtpApp.Startup))]
[assembly: OwinStartup(typeof(MtpApp.Startup))]

namespace MtpApp
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            app.MapSignalR();
        }
    }
}
