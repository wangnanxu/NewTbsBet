using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace NewTbsBetTwo
{
    /// <summary>
    /// 此类用于客户端能够基于Signalr而调用服务端的方法，而我们服务端的方法具体实现并没有在此类，
    /// 而是在私有对象_signalrPusher里面的方法具体实现，当客户端需要调服务端方法时候，此类中定义
    /// 一个方法，客户端会根据此类中的这个方法名来调用服务端的方法。这个方法里面的具体实现是
    /// _signalrPusher的方法。类似于，此类作为接口，并只暴露给客户端哪些可调用的方法。举例Send()
    /// </summary>
    [HubName("signalrPusher")]
    public class SignalrPusherHub : Hub
    {
        private readonly SignalrPusher _signalrPusher;
        private static SignalrContains _scoket;

        public SignalrPusherHub() :
            this(SignalrPusher.Instance)
        {

        }

        private SignalrPusherHub(SignalrPusher signalrPusher)
        {
            _signalrPusher = signalrPusher;
            if (_scoket == null)
            {
                _scoket = new SignalrContains();
            }
        }

        public void TestSend(string name, string msg)
        {
            Clients.All.addMessage(name, msg);
        }
        /// <summary>
        /// 此方法能够被JS客户端通过方法名Send来调用
        /// </summary>
        public void Send2Server(ushort mainCmd, ushort subCmd, string data)
        {
            //  客户端进入此方法后，就会去执行_signalrPusher对象中具体服务端方法逻辑
            //_signalrPusher.ReciveFromClient(Context.ConnectionId, mainCmd, subCmd, data);
            string connectionID = Context.ConnectionId;
            _signalrPusher.ReciveFromClient(connectionID, mainCmd, subCmd, data);
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            string connectionID = Context.ConnectionId;
            _signalrPusher.RemoveConnection(connectionID);
            
            return base.OnDisconnected(stopCalled);
        }

    }

}
