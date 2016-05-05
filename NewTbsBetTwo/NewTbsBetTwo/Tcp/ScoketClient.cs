using log4net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Web;

namespace NewTbsBetTwo.Tcp
{
    public class ScoketClient
    {
        private ILog m_Loger = LogManager.GetLogger(typeof(ScoketClient));
        const int RECVBUFFSIZE = 2048; //单次接受的最大长度
        const int RECVTOTALBUFFSIZE = 80000; //缓冲区最大长度
        private byte[] m_RecvBuff = new byte[RECVBUFFSIZE]; //单次接收缓冲区
        private byte[] m_RecvTotalBuff = new byte[RECVTOTALBUFFSIZE]; //总缓冲区
        private string m_Host = string.Empty; //主机
        private int m_Port = 0; //端口
        private bool m_AutoConnect = true;//是否自动重连
        private int m_RecvTotalLen = 0; //当前缓冲区收到的长度
        private Socket m_Socket = null; //socket

        public byte[] RecvBuff { get { return m_RecvBuff; } }
        public byte[] RecvTotalBuff { get { return m_RecvTotalBuff; } }
        public int RecvTotalLen { get { return m_RecvTotalLen; } }
        public bool Connected { get { return m_Socket.Connected; } }

        #region 事件

        public delegate void ConnetedEventHandler(Object sender, EventArgs e);
        /// <summary>
        /// 连接成功事件
        /// </summary>
        public event ConnetedEventHandler Conneted;
        protected virtual void OnConnected(EventArgs e)
        {
            m_Loger.Debug(new { Function = "OnConnected" });
            if (Conneted != null) Conneted(this, e);
        }

        public delegate void AsyncMessageEventHandler(Object sender, EventArgs e);
        /// <summary>
        /// 异步返回消息事件
        /// </summary>
        public event AsyncMessageEventHandler AsyncMessage;
        protected virtual void OnAsyncMessage(EventArgs e)
        {
            if (AsyncMessage != null) AsyncMessage(this, e);
        }

        public delegate void ClosedEventHandler(Object sender, EventArgs e);
        /// <summary>
        /// 关闭事件
        /// </summary>
        public event ClosedEventHandler Closed;
        protected virtual void OnClosed(EventArgs e)
        {
            if (Closed != null) Closed(this, e);
        }

        public delegate void ReConnectdEventHandler(Object sender, EventArgs e);
        /// <summary>
        /// 重连事件
        /// </summary>
        public event ReConnectdEventHandler ReConnectd;
        protected virtual void OnReConnect(EventArgs e)
        {
            if (ReConnectd != null) ReConnectd(this, e);
        }
        #endregion

        /// <summary>
        /// 连接socket
        /// </summary>
        public bool Connect(string host, int port, bool autoConnect)
        {
            m_AutoConnect = autoConnect;
            m_Host = host;
            m_Port = port;

            try
            {
                if (m_Socket == null)
                {
                    m_Socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
                    m_Socket.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.DontLinger, true);
                }
                if (!m_Socket.Connected)
                {
                    m_Socket.Connect(m_Host, m_Port);
                    if (m_Socket.Connected)
                    {
                        m_Loger.Info("ScoketConnect:Host=" + m_Host + ",Port=" + m_Port);
                        OnConnected(EventArgs.Empty);//触发连接成功事件
                        m_Socket.BeginReceive(m_RecvBuff, 0, RECVBUFFSIZE, SocketFlags.None, new AsyncCallback(RecvCallBack), m_Socket);
                    }
                }
            }
            catch (Exception ex)
            {
                m_Loger.Error("ConnectError:Host=" + m_Host + ",Port=" + m_Port);
            }
            return m_Socket.Connected;
        }

        /// <summary>
        /// 当有socket有数据时，系统回调
        /// </summary>
        public void RecvCallBack(IAsyncResult ar)
        {
            if (m_Socket != null)//防止关闭了 返回0字节的通知
            {
                try
                {
                    if (m_Socket.Connected)
                    {
                        int nRecvLen = m_Socket.EndReceive(ar);
                        if (nRecvLen > 0)
                        {
                            m_Loger.Debug(Encoding.UTF8.GetString(m_RecvBuff, 0, nRecvLen));
                            Array.Copy(m_RecvBuff, 0, m_RecvTotalBuff, m_RecvTotalLen, nRecvLen);
                            m_RecvTotalLen += nRecvLen;
                            OnAsyncMessage(EventArgs.Empty);
                            m_Socket.BeginReceive(m_RecvBuff, 0, RECVBUFFSIZE, SocketFlags.None, new AsyncCallback(RecvCallBack), m_Socket);
                        }
                        else
                        {
                            if (m_AutoConnect)
                                ReConnect();
                        }
                    }
                }
                catch (Exception ex)
                {
                    m_Loger.Error(ex.ToString());
                }
                finally
                {
                    if (!m_Socket.Connected)
                    {
                        ReConnect();//重新连接
                    }
                }
            }
        }

        public void ReConnect()
        {
            m_RecvTotalBuff = new byte[RECVTOTALBUFFSIZE];
            m_RecvTotalLen = 0;
            OnReConnect(EventArgs.Empty);
            if (m_Socket != null && m_Socket.Connected) Close();
            if (m_Socket != null) m_Socket = null;
            Connect(m_Host, m_Port, m_AutoConnect);
        }

        private void Close()
        {
            try
            {
                if (m_Socket != null)
                {
                    m_Socket.Shutdown(SocketShutdown.Both);
                    m_Socket.Close();
                    m_Socket = null;
                    OnClosed(EventArgs.Empty);
                }
            }
            catch (Exception ex)
            {
                m_Loger.Error(ex.ToString());
            }
            finally
            {
                m_RecvTotalLen = 0;
            }
        }

        /// <summary>
        /// 删除指定大小的buf区域
        /// </summary>
        public void DelBuf(int nDelLen)
        {
            m_RecvTotalLen -= nDelLen;
            if (m_RecvTotalLen > 0)
            {
                Array.Copy(m_RecvTotalBuff, nDelLen, m_RecvTotalBuff, 0, m_RecvTotalLen);
            }
            else
            {
                m_RecvTotalLen = 0;
            }
        }
        /// <summary>
        /// 发送ByteArray内容到服务器
        /// </summary>
        public void Send(ByteArray baSend)
        {
            try
            {
                if (m_Socket.Connected)
                {
                    int nLen = 1, nSendSize = 0, nSize = baSend.Size;
                    byte[] bsSendBuf = baSend.GetBuf();
                    while (nLen != 0 && nSendSize < nSize)
                    {
                        nLen = m_Socket.Send(bsSendBuf, nSendSize, nSize - nSendSize, SocketFlags.None);
                        nSendSize += nLen;
                    }
                }
            }
            catch (Exception ex)
            {
                m_Loger.Error(ex.ToString());
            }
            finally
            {
                if (m_Socket != null && !m_Socket.Connected)
                {
                    ReConnect();
                }
            }
        }
    }
}