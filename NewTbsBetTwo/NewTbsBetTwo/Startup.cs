using System;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Owin;
//[assembly: OwinStartup(typeof(ML.EGP.Sport.MarketControlService.Central.CentralSignalr.Startup))]

namespace NewTbsBetTwo
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            //// 有关如何配置应用程序的详细信息，请访问 http://go.microsoft.com/fwlink/?LinkID=316888           
            //app.Map("/signalr", map =>
            //{
            //    map.UseCors(CorsOptions.AllowAll);
            //
            //    var hubConfiguration = new HubConfiguration
            //    {
            //        EnableDetailedErrors = true,
            //        EnableJSONP = true
            //    };
            //
            //    map.RunSignalR(hubConfiguration);
            //});
            var hubConfiguration = new HubConfiguration();
            hubConfiguration.EnableDetailedErrors = true;
            hubConfiguration.EnableJavaScriptProxies = true;

            app.MapSignalR("/signalr", hubConfiguration);
        }
    }
}
