using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NewTbsBetTwo
{
    public interface ISignalrSink
    {
        bool OnSignalrRead(string connectionID, ushort mainCommand, ushort subCommand, string data);
        void SendSignalrCmd(ushort mainCommand, ushort subCommand, string data);
        void RemoveConnection(string connectionID);
    }

    public interface ISignalrCommandHandle
    {
        bool OnCommand(string connectID, ushort subCmd, string data);
    }
}
