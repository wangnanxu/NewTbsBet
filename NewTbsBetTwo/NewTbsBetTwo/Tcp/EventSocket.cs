using log4net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Web;

namespace NewTbsBetTwo.Tcp
{

    public interface ISocketSink
    {
        bool OnConnect();
        bool OnNCRead(ushort mainCmd, ushort subCmd, string data);
        bool OnWSRead(string data);
        bool OnClose();
    }
    public class EventSocket : IDisposable
    {
        //
        private ILog m_Loger = LogManager.GetLogger(typeof(EventSocket));
        //申明委托
        private delegate bool OnConnectCallback(int ErrorCode, string ErrorDesc);
        private delegate bool OnReadCallback(ushort mainCmd, ushort subCmd, IntPtr data, ushort size);
        private delegate bool OnCloseCallback();
        //定义委托
        private OnConnectCallback m_pfnOnConnectCallback;
        private OnReadCallback m_pfnOnReadCallback;
        private OnCloseCallback m_pfnOnCloseCallback;
        //创建对象
        [DllImport(@"c:\MyDllx64\EventSocket.dll")]//asp.net只能识别绝对路径或则path路径
        private static extern IntPtr CreateSocket();
        //销毁对象
        [DllImport(@"c:\MyDllx64\EventSocket.dll")]
        private static extern bool DestroySocket(IntPtr socket);
        //连接网络
        [DllImport(@"c:\MyDllx64\EventSocket.dll")]
        private static extern bool ConnectServer(IntPtr socket, string ip, ushort port);
        //关闭网络
        [DllImport(@"c:\MyDllx64\EventSocket.dll")]
        private static extern bool CloseSocket(IntPtr socket, bool bNotify);
        //获取状态
        [DllImport(@"c:\MyDllx64\EventSocket.dll")]
        private static extern int GetSocketState(IntPtr socket);
        //设置应答
        [DllImport(@"c:\MyDllx64\EventSocket.dll")]
        private static extern void SetOnSocketConnect(IntPtr socket, OnConnectCallback callback);
        //设置读取
        [DllImport(@"c:\MyDllx64\EventSocket.dll")]
        private static extern void SetOnSocketRead(IntPtr socket, OnReadCallback callback);
        //设置关闭
        [DllImport(@"c:\MyDllx64\EventSocket.dll")]
        private static extern void SetOnSocketClose(IntPtr socket, OnCloseCallback callback);
        //设置发送
        [DllImport(@"c:\MyDllx64\EventSocket.dll")]
        private static extern bool SendData(IntPtr socket, ushort mainCmd, ushort subCmd, byte[] data, ushort size);
        //设置发送
        [DllImport(@"c:\MyDllx64\EventSocket.dll")]
        private static extern bool SendCommand(IntPtr socket, ushort mainCmd, ushort subCmd);
        //连接状态
        private IntPtr m_Socket = IntPtr.Zero;
        private ISocketSink m_SocketSink = null;
        private bool m_AutoConnect = false;//当网络关闭时是否重新连接服务器
        private string m_ServerIP;//服务器地址
        private ushort m_ServerPort;//服务器端口
        public EventSocket()
        {
            m_Socket = CreateSocket();
            if (m_Socket == IntPtr.Zero) return;
            //设置委托
            m_pfnOnConnectCallback = new OnConnectCallback(OnConnect);
            SetOnSocketConnect(m_Socket, m_pfnOnConnectCallback);
            m_pfnOnReadCallback = new OnReadCallback(OnRead);
            SetOnSocketRead(m_Socket, m_pfnOnReadCallback);
            m_pfnOnCloseCallback = new OnCloseCallback(OnClose);
            SetOnSocketClose(m_Socket, m_pfnOnCloseCallback);
        }
        public void Dispose()
        {
            DestroySocket(m_Socket);
        }
        public ISocketSink SocketSink
        {
            get { return m_SocketSink; }
            set { m_SocketSink = value; }
        }
        public bool AutoConnect
        {
            get { return m_AutoConnect; }
            set { m_AutoConnect = value; }
        }
        public string ServerIP
        {
            get { return m_ServerIP; }
            set { m_ServerIP = value; }
        }
        public ushort ServerPort
        {
            get { return m_ServerPort; }
            set { m_ServerPort = value; }
        }
        public bool Connect(string ip, ushort port)
        {
            m_ServerIP = ip;
            m_ServerPort = port;

            bool result = false;

            if (m_Socket == IntPtr.Zero)
            {
                result = false;
            }
            else if (GetSocketState(m_Socket) == 0)
            {
                result = ConnectServer(m_Socket, ip, port);
            }
            else
            {
                result = false;
            }
            m_Loger.Debug(new { Function = "Connect", Param = new { ip, port }, result });
            return result;
        }
        public bool Connect()
        {
            return Connect(m_ServerIP, m_ServerPort);
        }
        public bool Close(bool Notify)
        {
            if (m_Socket == IntPtr.Zero) return false;
            return CloseSocket(m_Socket, Notify);
        }
        public int GetState()
        {
            return GetSocketState(m_Socket);
        }
        protected virtual bool OnConnect(int ErrorCode, string ErrorDesc)
        {
            m_Loger.Debug(new { Function = "OnConnect", Param = new { ErrorCode, ErrorDesc } });
            if (m_SocketSink == null) return false;
            if (ErrorCode == 0)
            {
                m_SocketSink.OnConnect();
            }
            else
            {
                if (m_AutoConnect)//自动连接
                    ConnectServer(m_Socket, m_ServerIP, m_ServerPort);
            }
            return true;
        }
        protected virtual bool OnRead(ushort mainCmd, ushort subCmd, IntPtr data, ushort size)
        {
            m_Loger.Debug(new { Function = "OnRead", Param = new { mainCmd, subCmd, data }});
            if (m_SocketSink == null) return false;
            byte[] buff = new byte[size];
            Marshal.Copy(data, buff, 0, size);
            string strdata = Encoding.UTF8.GetString(buff);
            if (mainCmd == 0xFFFF && subCmd == 0xFFFF)
            {
                return m_SocketSink.OnWSRead(strdata);
            }
            else
            {
                return m_SocketSink.OnNCRead(mainCmd, subCmd, strdata);
            }
        }
        protected virtual bool OnClose()
        {
            m_Loger.Debug(new { Function = "OnClose" });
            if (m_SocketSink == null) return false;
            m_SocketSink.OnClose();

            if (m_AutoConnect)//自动连接
                ConnectServer(m_Socket, m_ServerIP, m_ServerPort);

            return true;
        }
        public bool Send(ushort mainCmd, ushort subCmd, byte[] data, ushort size)
        {
            m_Loger.Debug(new { Function = "Send", Param = new { mainCmd, subCmd, data, size } });
            if (m_Socket == IntPtr.Zero) return false;
            return SendData(m_Socket, mainCmd, subCmd, data, size);
        }
        public bool Send(ushort mainCmd, ushort subCmd)
        {
            m_Loger.Debug(new { Function = "Send", Param = new { mainCmd, subCmd } });
            if (m_Socket == IntPtr.Zero) return false;
            return SendCommand(m_Socket, mainCmd, subCmd);
        }
        public bool Send(string data)
        {
            m_Loger.Debug(new { Function = "Send", Param = data });
            if (m_Socket == IntPtr.Zero) return false;
            byte[] buff = Encoding.UTF8.GetBytes(data);
            if (buff.Length > 2000)
            {
                if (m_Loger.IsDebugEnabled) m_Loger.Debug("Data too long:" + data.Substring(0, 20) + "...");
                return false;
            }
            return SendData(m_Socket, 0xFFFF, 0xFFFF, buff, (ushort)buff.Length);
        }
        public bool Send(ushort mainCmd, ushort subCmd, string data)
        {
            m_Loger.Debug(new { Function = "Send", Param = new { mainCmd, subCmd, data } });
            if (m_Socket == IntPtr.Zero) return false;
            byte[] buff = Encoding.UTF8.GetBytes(data);
            if (buff.Length > 2000)
            {
                if (m_Loger.IsDebugEnabled) m_Loger.Debug("Data too long:" + data.Substring(0, 20) + "...");
                return false;
            }
            var _bool = SendData(m_Socket, mainCmd, subCmd, buff, (ushort)buff.Length);
            return _bool;
        }
    }
}