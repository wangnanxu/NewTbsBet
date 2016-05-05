using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Threading;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using Microsoft.Owin;
using Owin;

namespace NewTbsBetTwo
{
    /// <summary>
    /// 服务端的逻辑方法都写到此类中，如需客户端调用服务端的方法，只需要在SignalrPusherHub类中写方法把服务端的方法暴露给客户端即可。
    /// 如何把服务端的方法在SignalrPusherHub类中暴露，参加SignalrPusherHub类的注释说明
    /// </summary>
    public class SignalrPusher : ISignalrPusher
    {
        private IDisposable SignalR { get; set; }
        private SignalrLinker _signalrLinker;
        //private Dictionary<string, string> _dicUserID2ClientID = new Dictionary<string, string>();
        //private Dictionary<string, string> _dicGroupID2GroupName = new Dictionary<string, string>();
        private readonly static Lazy<SignalrPusher> _instance = new Lazy<SignalrPusher>(
        () => new SignalrPusher(GlobalHost.ConnectionManager.GetHubContext<SignalrPusherHub>()));
        private IHubConnectionContext<dynamic> Clients { get { return _hubContext.Clients; } }
        private IHubContext _hubContext;
        public static SignalrPusher Instance { get { return _instance.Value; } }
        public SignalrLinker SignalrLinker { get { return _signalrLinker; } set { _signalrLinker = value; } }

        private ISignalrSink _signalrSink;

        public void InitCentralService(ISignalrSink ss)
        {
            _signalrSink = ss;
        }

        //public Dictionary<string, string> DicUserID2ClientID
        //{
        //    get { return _dicUserID2ClientID; }
        //    set { _dicUserID2ClientID = value; }
        //}
        //
        //public Dictionary<string, string> DicGroupID2GroupName
        //{
        //    get { return _dicGroupID2GroupName; }
        //    set { _dicGroupID2GroupName = value; }
        //}

        public SignalrPusher(IHubContext hubContext)
        {
            _hubContext = hubContext;
        }
        public void Start(string serverUrl)
        {
           // _serverUrl = serverUrl;
           // try
           // {
           //     AppDomain.CurrentDomain.Load(typeof(Microsoft.Owin.Host.HttpListener.OwinHttpListener).Assembly.GetName());
           //     SignalR = WebApp.Start<Startup>(_serverUrl);
           // }
           // catch (TargetInvocationException)
           // {
           //     log4net.LogManager.GetLogger(typeof(SignalrPusher)).Error(
           //         "Server failed to start. A server is already running on " + _serverUrl);
           //     return;
           // }
           // log4net.LogManager.GetLogger(typeof(SignalrPusher)).Info(
           //         "Server started at " + _serverUrl);
        }

        public void Stop()
        {
            if (SignalR != null)
                SignalR.Dispose();
        }

        public void AddConnection2Group(string connetionID, string groupID)
        {
            _hubContext.Groups.Add(connetionID, groupID);
        }
        public void SendByConnetionID(string connetionID, string data)
        {
            Clients.Client(connetionID).JSFunc();
        }
        public void SendByConnetions(List<string> connetionIDs, ushort mainCmd, ushort subCmd, string data)
        {
            Clients.Clients(connetionIDs).addMessage(mainCmd, subCmd, data);
        }
        public void SendByConnetionID(string connetionID, ushort mainCmd, ushort subCmd, string data)
        {
            Clients.Client(connetionID).addMessage(mainCmd, subCmd, data);
        }

        public void SendByGroupID(string groupID, string data, params string[] excludeConnectionIds)
        {
            Clients.Group(groupID, excludeConnectionIds).JSFunc();
        }
        public void SendByGroups(List<string> groupIDs, string data, params string[] excludeConnectionIds)
        {
            Clients.Groups(groupIDs, excludeConnectionIds).addMessage("服务器发来数据", data);
        }
        public void SendAll(ushort mainCmd, ushort subCmd, string data)
        {
            Clients.All.addMessage(mainCmd, subCmd, data);
        }

        /// <summary>
        /// 此方法需要暴露给客户端调用，参看SignalrPusherHub类的Send()方法实现是如何暴露的
        /// </summary>
        internal void ReciveFromClient(string connetionID, ushort mainCmd, ushort subCmd, string data)
        {
            _signalrSink.OnSignalrRead(connetionID, mainCmd, subCmd, data);
        }
        public void RemoveConnection(string connectionID)
        {
            _signalrSink.RemoveConnection(connectionID);
        }
    }
}
