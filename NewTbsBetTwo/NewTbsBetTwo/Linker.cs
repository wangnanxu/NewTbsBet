using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NewTbsBetTwo
{
    public class SignalrLinker
    {
        public string UserID { get; set; }
        public string GroupID { get; set; }

        public List<ScoketConnection> ConnectionList { get; set; }

        public SignalrLinker()
        {
            ConnectionList = new List<ScoketConnection>();
        }
    }

    public class SignalrConnection
    {
        //连接ID
        public string ConnectionID { get; set; }

        //用户代理
        public string UserID { get; set; }

        public List<int> MessageType { get; set; }

        public SignalrConnection()
        {
            MessageType = new List<int>();
        }
    }
}
