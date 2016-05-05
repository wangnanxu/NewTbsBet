using log4net;
using Microsoft.AspNet.SignalR.Hosting;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

namespace NewTbsBetTwo
{
    public interface ISignalrControl
    {
        void SendAllLinkers(ushort mainCmd, ushort subCmd, string data);
        void SendByUserIDs(List<string> ids, string connectId, ushort mainCmd, ushort subCmd, string data);
        void SendByGroupIDs(List<string> ids, ushort mainCmd, ushort subCmd, string data);
        void SendGroupsAndUsers(List<string> groupIDs, List<string> userIDs, ushort mainCmd, ushort subCmd, string data);
        void ScoketSend(string connectId, ushort mainCommand, ushort subCommand, string data);
        void CloseScoket(string connectId, string userID, int type);
    }

    public class SignalrControl : ISignalrControl
    {
        enum mainCmd { LobbyForMember = 2, GameForMember = 4 };
        enum proCmd { Login=1,SitDown=1,StandUp=2,CloseGameScoket=10};
        enum scoketType { lobby = 1, game = 2 };
        private ILog m_Loger = LogManager.GetLogger(typeof(SignalrControl));
        private SignalrPusher _pusher;
        public ConcurrentDictionary<string, SignalrLinker> DicLinkers = new ConcurrentDictionary<string, SignalrLinker>();
        private ILog _logger = log4net.LogManager.GetLogger(typeof(SignalrControl));

        public SignalrControl(SignalrPusher sp)
        {
            _pusher = sp;

        }
        public void UserSignalrLink(string connectId, string userID, string data)
        {
            LobbyScoket lobbyscoket = CreateLobbyScoket(connectId, userID, data);
            ScoketConnection connection = new ScoketConnection()
            {
                UserID = userID,
                ConnectionID = connectId,
                LobbyScoket = lobbyscoket

            };
            SignalrLinker linker;
            if (DicLinkers.TryGetValue(userID, out linker))
            {
                linker.ConnectionList.Add(connection);
            }
            else
            {
                linker = new SignalrLinker
                            {
                                UserID = userID
                            };
                linker.ConnectionList.Add(connection);
                DicLinkers.TryAdd(userID, linker);
            }
            //  添加连接到Signalr组里
            _pusher.AddConnection2Group(connectId, linker.GroupID + "");

        }
        public void UserGameScoket(string connectId, string userID, string port, string data)
        {
            GameScoket gamescoket = CreateGameScoket(connectId, userID, port, data);
            if (DicLinkers.ContainsKey(userID))
            {
                ScoketConnection _connection = DicLinkers[userID].ConnectionList.FirstOrDefault(r => r.ConnectionID.Equals(connectId));
                _connection.GameScoket = gamescoket;
            }
        }
        public LobbyScoket CreateLobbyScoket(string connectID, string userid, string data)
        {
            LobbyScoket _scoket = new LobbyScoket(data);
            _scoket.Start();
            _scoket.SetSinglarControl(this);
            _scoket.SetUserID(userid, connectID);
            return _scoket;
        }
        public GameScoket CreateGameScoket(string connectID, string userid, string port, string data)
        {
            GameScoket _scoket = new GameScoket(port, data);
            _scoket.Start();
            _scoket.SetSinglarControl(this);
            _scoket.SetUserID(userid, connectID);
            return _scoket;
        }
        public void CloseScoket(string connectId, string userID, int type)
        {
            try
            {
                ScoketConnection _connection = DicLinkers[userID].ConnectionList.FirstOrDefault(r => r.ConnectionID.Equals(connectId));
                if (type == (int)scoketType.lobby && _connection.LobbyScoket != null)
                {
                    m_Loger.Debug(new { Function = "CloseLobbyScoket", Param = new { connectId, userID, type } });
                    _connection.LobbyScoket.Close();
                    _connection.LobbyScoket = null;
                }
                else if (type == (int)scoketType.game && _connection.GameScoket != null)
                {
                    m_Loger.Debug(new { Function = "CloseGameScoket", Param = new { connectId, userID, type } });
                    _connection.GameScoket.Close();
                    _connection.GameScoket = null;
                }

            }
            catch (Exception err)
            {
                _logger.Error(new { Function = "CloseScoket", err });
            }
        }
        //分析客户端发送数据
        public void ScoketSend(string connectId, ushort mainCommand, ushort subCommand, string data)
        {
            try
            {
                JavaScriptSerializer js = new JavaScriptSerializer();   //实例化一个能够序列化数据的类
                Message list = js.Deserialize<Message>(data);    //将json数据转化为对象类型并赋值给list
                string userID = list.UserID;
                ScoketConnection _connection = null;
                if (DicLinkers.ContainsKey(userID))
                {
                   // string sessionid = Context.Headers["cookie"];
                   // string host = Context.Headers["Host"];
                    _connection = DicLinkers[userID].ConnectionList.FirstOrDefault(r => r.ConnectionID.Equals(connectId));
                }
                switch (mainCommand)
                {
                    case (ushort)mainCmd.LobbyForMember:
                        if (subCommand == (ushort)proCmd.Login)
                        {
                            UserSignalrLink(connectId, userID, list.Data);
                            return;
                        }
                        if (_connection != null && _connection.LobbyScoket != null)
                        {
                            _connection.LobbyScoket.Send(mainCommand, subCommand, list.Data);
                        }
                        break;
                    case (ushort)mainCmd.GameForMember:
                        if (subCommand == (ushort)proCmd.SitDown)
                        {
                            UserGameScoket(connectId, userID, list.port, list.Data);
                            return;
                        }

                        if (_connection != null && _connection.GameScoket != null)
                        {
                            if (subCommand == (ushort)proCmd.CloseGameScoket)
                            {
                                _connection.GameScoket.Close();
                                _connection.GameScoket = null;
                                return;
                            }
                            _connection.GameScoket.Send(mainCommand, subCommand, list.Data);
                            if (subCommand == (ushort)proCmd.StandUp)
                            {
                                _connection.GameScoket.Close();
                                _connection.GameScoket = null;
                            }
                        }
                        break;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(new { Function = "ScoketSend", ex });
            }

        }
        public void SendAllLinkers(ushort mainCmd, ushort subCmd, string data)
        {
            _pusher.SendAll(mainCmd, subCmd, data);
        }

        public void SendByUserIDs(List<string> ids, string connectId, ushort mainCommand, ushort subCmd, string data)
        {
            try
            {
                _pusher.SendByConnetionID(connectId, mainCommand, subCmd, data);
                if (mainCommand == (ushort)mainCmd.GameForMember && subCmd == (ushort)proCmd.StandUp)
                {
                    var userid = ids[0];
                    ScoketConnection _connection = DicLinkers[userid].ConnectionList.FirstOrDefault(r => r.ConnectionID.Equals(connectId));
                    if (_connection != null && _connection.GameScoket != null)
                    {
                        _connection.GameScoket.Close();
                        _connection.GameScoket = null;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.Error(new { Function = "SendByUserIDs", ex });
            }
        }

        public void SendByGroupIDs(List<string> ids, ushort mainCmd, ushort subCmd, string data)
        {
            foreach (var v in DicLinkers.Values.Where(v => ids.Contains(v.GroupID)))
            {
                _pusher.SendByConnetions(v.ConnectionList.Select(o => o.ConnectionID).ToList(), mainCmd, subCmd, data);
            }
        }

        public void SendGroupsAndUsers(List<string> groupIDs, List<string> userIDs, ushort mainCmd, ushort subCmd, string data)
        {
            var userConnetionIDs =
                DicLinkers.Where(kv => userIDs.Contains(kv.Key))
                    .SelectMany(kv => kv.Value.ConnectionList)
                    .Select(o => o.ConnectionID)
                    .ToList();

            _pusher.SendByConnetions(userConnetionIDs, mainCmd, subCmd, data);

            var excludeConnectionIDs =
                DicLinkers.Values.Where(v => groupIDs.Contains(v.GroupID))
                    .SelectMany(o => o.ConnectionList).Select(o => o.ConnectionID).ToList();
            excludeConnectionIDs.AddRange(userConnetionIDs);
            _pusher.SendByGroups(groupIDs.Select(o => o.ToString()).ToList(), data, excludeConnectionIDs.ToArray());
        }
        //关闭signalr连接
        public void RemoveConnection(string connectionID)
        {
            //关闭connectionID相关的所有scoket
            foreach (SignalrLinker _linker in DicLinkers.Values)
            {
                try
                {
                    ScoketConnection _connection = _linker.ConnectionList.FirstOrDefault(r => r.ConnectionID.Equals(connectionID));
                    if (_connection == null)
                    {
                        return;
                    }
                    if (_connection.LobbyScoket != null)
                    {
                        _connection.LobbyScoket.Close();
                        _connection.LobbyScoket = null;
                    }
                    if (_connection.GameScoket != null)
                    {
                        _connection.GameScoket.Close();
                        _connection.GameScoket = null;
                    }
                    _linker.ConnectionList.Remove(_connection);
                }
                catch (Exception err)
                {
                    _logger.Error(new { Function = "RemoveConnection", err });
                }
            }

        }

    }
}
