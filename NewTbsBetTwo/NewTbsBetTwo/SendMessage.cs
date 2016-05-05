using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NewTbsBetTwo
{
    public class SendMessage
    {
        public ushort mainCmd { get; set; }
        public ushort proCmd { get; set; }
        public string message { get; set; }   
    }
    public class Message
    {
        public string UserID { get; set; }
        public string Data { get; set; }
        public string port { get; set; }
    }
}