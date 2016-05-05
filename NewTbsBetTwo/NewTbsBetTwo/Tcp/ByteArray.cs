using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;

namespace NewTbsBetTwo.Tcp
{
    public class ByteArray
    {
        const int BUFMAXSIZE = 800000;
        private int m_nPos = 0; //读取/写入位置
        private int m_nSize = 0; //存储字节长度
        private byte[] m_bsBuf = new byte[BUFMAXSIZE]; //缓冲区

        public int Size { set { m_nSize = value; } get { return m_nSize; } }
        public int Position { set { m_nPos = value; } get { return m_nPos; } }

        /// <summary>
        /// 将int写入缓冲区
        /// </summary>
        public ByteArray WriteInt(int nSrc)
        {
            m_bsBuf[m_nPos++] = (byte)(nSrc >> 24);
            m_bsBuf[m_nPos++] = (byte)(nSrc >> 16);
            m_bsBuf[m_nPos++] = (byte)(nSrc >> 8);
            m_bsBuf[m_nPos++] = (byte)(nSrc);
            m_nSize += 4;
            return this;
        }

        public ByteArray WriteShort(short stSrc)
        {
            m_bsBuf[m_nPos++] = (byte)(stSrc >> 8);
            m_bsBuf[m_nPos++] = (byte)(stSrc);
            m_nSize += 2;
            return this;
        }

        /// <summary>
        /// 将byte写入缓冲区
        /// </summary>
        public ByteArray WriteByte(byte btSrc)
        {
            m_bsBuf[m_nPos++] = btSrc;
            m_nSize++;
            return this;
        }
        /// <summary>
        /// 将byte[]写入缓冲区
        /// </summary>
        public ByteArray WriteBytes(byte[] bsSrc)
        {
            Array.Copy(bsSrc, 0, m_bsBuf, m_nPos, bsSrc.Length);
            m_nPos += bsSrc.Length;
            m_nSize += bsSrc.Length;
            return this;
        }
        /// <summary>
        /// 将指定大小的byte[]写入缓冲区
        /// </summary>
        public ByteArray WriteBytes(byte[] bsSrc, int nLen)
        {
            Array.Copy(bsSrc, 0, m_bsBuf, m_nPos, nLen);
            m_nPos += nLen;
            m_nSize += nLen;
            return this;
        }
        /// <summary>
        /// 将指定大小的byte[]写入缓冲区
        /// </summary>
        public ByteArray WriteBytes(byte[] bsSrc, int nIndex, int nLen)
        {
            Array.Copy(bsSrc, nIndex, m_bsBuf, m_nPos, nLen);
            m_nPos += nLen;
            m_nSize += nLen;
            return this;
        }
        /// <summary>
        /// 将字符串写入缓冲区
        /// </summary>
        public ByteArray WriteString(string sSrc)
        {
            byte[] bsDes = Encoding.Default.GetBytes(sSrc);
            Array.Copy(bsDes, 0, m_bsBuf, m_nPos, bsDes.Length);
            m_nPos += bsDes.Length;
            m_nSize += bsDes.Length;
            return this;
        }
        /// <summary>
        /// 从缓冲区读取1个字节
        /// </summary>
        /// <returns></returns>
        public byte ReadByte()
        {
            return m_bsBuf[m_nPos++];
        }
        /// <summary>
        /// 从缓冲区读取4个字节的int
        /// </summary>
        public int ReadInt()
        {
            int nResult = ((int)m_bsBuf[m_nPos] << 24) + ((int)m_bsBuf[m_nPos + 1] << 16) + ((int)m_bsBuf[m_nPos + 2] << 8) + m_bsBuf[m_nPos + 3];
            m_nPos += 4;
            return nResult;
        }
        /// <summary>
        /// 得到缓冲区
        /// </summary>
        public byte[] GetBuf()
        {
            return m_bsBuf;
        }

        /// <summary>
        /// zlib解压
        /// </summary>
        public ByteArray UnCompress()
        {
            ByteArray baResult = new ByteArray();
            byte[] d = new byte[m_nSize];
            Array.Copy(m_bsBuf, d, m_nSize);
            FluorineFx.AMF3.ByteArray ba = new FluorineFx.AMF3.ByteArray(new MemoryStream(d));
            ba.Uncompress();
            Array.Copy(ba.GetBuffer(), baResult.m_bsBuf, ba.Length);
            baResult.Size = Convert.ToInt32(ba.Length);
            return baResult;
        }

        /// <summary>
        /// zlib压缩
        /// </summary>
        public ByteArray Compress()
        {
            ByteArray baResult = new ByteArray();
            byte[] d = new byte[m_nSize];
            Array.Copy(m_bsBuf, d, m_nSize);
            FluorineFx.AMF3.ByteArray ba = new FluorineFx.AMF3.ByteArray(new MemoryStream(d));
            ba.Compress();
            Array.Copy(ba.GetBuffer(), baResult.m_bsBuf, ba.Length);
            baResult.Size = Convert.ToInt32(ba.Length);
            return baResult;
        }
    }
}