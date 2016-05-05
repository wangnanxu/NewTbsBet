using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NewTbsBetTwo
{
    public interface ISignalrPusher
    {
        void InitCentralService(ISignalrSink ss);
        void Start(string serverUrl);
        void SendByConnetionID(string connetionID, string data);
        void SendByConnetions(List<string> connetionID, ushort mainCmd, ushort subCmd, string data);
        void SendByConnetionID(string connetionID, ushort mainCmd, ushort subCmd, string data);
        void SendByGroupID(string groupID, string data, params string[] excludeConnectionIds);
        void SendByGroups(List<string> groupIDs, string data, params string[] excludeConnectionIds);
        void SendAll(ushort mainCmd, ushort subCmd, string data);

    }
}
