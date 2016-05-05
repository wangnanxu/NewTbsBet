using log4net;
using NewTbsBetTwo.Tcp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;

namespace NewTbsBetTwo
{
    public class GameScoket : ISocketSink
    {
        private ILog _logger = log4net.LogManager.GetLogger(typeof(GameScoket));
        private readonly EventSocket _socket;
        public bool _running;
        private Thread _workThread;
        private DateTime _syncTime;
        private readonly ConfigSingleton _config = ConfigSingleton.CreateInstance();
        public bool IsClosed = false;
        private ISignalrControl _signalrControl;
        private List<string> userIDs;
        private string connectionId;
        private string sitdata = "";
        private bool isBronwsClose = false;
        public GameScoket(string port,string data)
        {
            sitdata = data;
            _running = false;
            _socket = new EventSocket();
            _socket.SocketSink = this;
            _socket.ServerIP = _config.GetAppConfig<string>("ServerIP");
            _socket.ServerPort = Convert.ToUInt16(port);
            _socket.AutoConnect = false;
        }
        public void SetUserID(string userid, string connectID)
        {
            connectionId = connectID;
            if (userIDs == null)
            {
                userIDs = new List<string>();
            }
            userIDs.Add(userid);
        }
        public DateTime SyncTime
        {
            get { return _syncTime; }
            set { _syncTime = value; }
        }
        public void SetSinglarControl(ISignalrControl sc)
        {
            _signalrControl = sc;
        }

        public void Start()
        {
            if (_running == true) return;
            var _bool=_socket.Connect();
            if (!_bool) _logger.Error("MarketService Socket Connect Defeated!");
            _running = true;
            _workThread = new Thread(Working);
            _workThread.Start();
        }
        private void Working()
        {
            while (!IsClosed)
            {
                Thread.Sleep(100);
            }
        }
        public void Close()
        {
            if (_socket != null)
            {
                isBronwsClose = true;
                _socket.Close(true);
            }
        }
        public bool OnConnect()
        {
            try
            {
                _running = true;
                if (sitdata != null)
                {
                    Send(4, 1, sitdata);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex.ToString());
            }
            return true;
        }
        //接收数据
        public bool OnNCRead(ushort mainCmd, ushort subCmd, string data)
        {
            if (_signalrControl!=null)
            {
                _signalrControl.SendByUserIDs(userIDs, connectionId, mainCmd, subCmd, data);
            }
           
            //发送消息
            return true;

        }
        public bool OnWSRead(string data)
        {
            return true;
        }

        public bool OnClose()
        {
            if (isBronwsClose == false && _signalrControl != null)
            {
                _signalrControl.SendByUserIDs(userIDs, connectionId, 4, 10, "");
                _signalrControl.CloseScoket(connectionId, userIDs[0], 2);
            }
            _running = false;
            return true;
        }
        public void Send(ushort mainCommand, ushort subCommand, string data)
        {
            if (_running)
            {
                _socket.Send(mainCommand, subCommand, data);
            }
        }

        public void Stop()
        {
            IsClosed = true;
        }
    }
}