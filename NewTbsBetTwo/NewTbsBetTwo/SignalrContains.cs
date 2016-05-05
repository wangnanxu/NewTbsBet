using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.Script.Serialization;
using Microsoft.AspNet.SignalR.Hubs;

namespace NewTbsBetTwo
{
    public class SignalrContains:ISignalrSink
    {
        private SignalrPusher _signalrPusher;
        public SignalrControl _signalrControl;
        public SignalrContains()
        {
            _signalrPusher = SignalrPusher.Instance;
            _signalrPusher.InitCentralService(this);
            _signalrControl = new SignalrControl(_signalrPusher);
        }
        public void RemoveConnection(string connectionID)
        {
            _signalrControl.RemoveConnection(connectionID);
        }
        public bool OnSignalrRead(string connectionID, ushort mainCommand, ushort subCommand, string data)
        {
           if(_signalrControl!=null)
            {
                _signalrControl.ScoketSend(connectionID, mainCommand, subCommand, data);
            }
            return true;
        }
        public void SendSignalrCmd(ushort mainCommand, ushort subCommand, string data)
        {
            throw new NotImplementedException();
        }

    }
}