using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace MtpApp.Hubs
{
    [HubName("placementMonitorHub")]
    public class PlacementMonitorHub : Hub
    {
        public static void BroadcastData()
        {
            IHubContext context = GlobalHost.ConnectionManager.GetHubContext<PlacementMonitorHub>();
            context.Clients.All.refreshEmployeeData();
        }
    }
}