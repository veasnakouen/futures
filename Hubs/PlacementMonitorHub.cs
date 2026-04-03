using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace MtpApp.Hubs
{
    public class PlacementMonitorHub : Hub
    {
        public async Task BroadcastData()
        {
            await Clients.All.SendAsync("refreshEmployeeData");
        }
    }
}