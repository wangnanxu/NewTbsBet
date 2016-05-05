using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NewTbsBetTwo
{
    public class ScoketConnection : SignalrConnection
    {
        public LobbyScoket LobbyScoket { get; set; }
        public GameScoket GameScoket { get; set; }

    }
}