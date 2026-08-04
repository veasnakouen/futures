package com.mtp.api.utils;

import com.mtp.api.utils.zk.ZkAttendanceLog;
import com.mtp.api.utils.zk.ZkProtocolUtils;
import com.mtp.api.utils.zk.ZkTcpHandler;
import com.mtp.api.utils.zk.ZkUdpHandler;
import com.mtp.api.utils.zk.ZkUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.List;

public class ZkDeviceClient {
    private static final Logger log = LoggerFactory.getLogger(ZkDeviceClient.class);

    private static final int CMD_CONNECT = 1000;
    private static final int CMD_EXIT = 1001;
    private static final int CMD_ENABLEDEVICE = 1002;
    private static final int CMD_DISABLEDEVICE = 1003;
    private static final int CMD_ACK_OK = 2000;

    private final String ipAddress;
    private final int port;
    private int sessionId = 0;
    private int replyId = 0;

    public ZkDeviceClient(String ipAddress, int port) {
        this.ipAddress = ipAddress;
        this.port = port;
    }

    private boolean connectToDevice(Socket socket, DatagramSocket udpSocket, InetAddress addr) throws Exception {
        byte[] pkt = ZkProtocolUtils.createHeader(CMD_CONNECT, (short) 0, (short) 0, new byte[0]);
        if (socket != null) {
            socket.getOutputStream().write(pkt);
            byte[] resp = ZkTcpHandler.readResponse(socket.getInputStream());
            if (resp == null || resp.length < 8)
                return false;
            this.sessionId = ByteBuffer.wrap(resp).order(ByteOrder.LITTLE_ENDIAN).getShort(4) & 0xFFFF;
            this.replyId = ByteBuffer.wrap(resp).order(ByteOrder.LITTLE_ENDIAN).getShort(6) & 0xFFFF;
        } else {
            udpSocket.send(new DatagramPacket(pkt, pkt.length, addr, port));
            byte[] buf = new byte[1024];
            DatagramPacket respPkt = new DatagramPacket(buf, buf.length);
            udpSocket.receive(respPkt);
            if (respPkt.getLength() < 8)
                return false;
            this.sessionId = ByteBuffer.wrap(buf).order(ByteOrder.LITTLE_ENDIAN).getShort(4) & 0xFFFF;
            this.replyId = ByteBuffer.wrap(buf).order(ByteOrder.LITTLE_ENDIAN).getShort(6) & 0xFFFF;

            byte[] ackPkt = ZkProtocolUtils.createHeader(CMD_ACK_OK, (short) sessionId, (short) replyId, new byte[0]);
            udpSocket.send(new DatagramPacket(ackPkt, ackPkt.length, addr, port));
        }
        log.info("[ZK-Protocol] Session Locked & Confirmed: {}", sessionId);
        return true;
    }

    public List<ZkAttendanceLog> fetchLogs() throws Exception {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(ipAddress, port), 3000);
            socket.setSoTimeout(5000);
            if (!connectToDevice(socket, null, null))
                throw new Exception("Handshake failed");

            ZkTcpHandler.executeCommand(socket.getOutputStream(), socket.getInputStream(), CMD_DISABLEDEVICE, sessionId,
                    replyId);
            try {
                return ZkTcpHandler.requestLogs(socket.getOutputStream(), socket.getInputStream(), sessionId, replyId);
            } finally {
                ZkTcpHandler.executeCommand(socket.getOutputStream(), socket.getInputStream(), CMD_ENABLEDEVICE,
                        sessionId, replyId);
                ZkTcpHandler.executeCommand(socket.getOutputStream(), socket.getInputStream(), CMD_EXIT, sessionId,
                        replyId);
            }
        } catch (Exception e) {
            try (DatagramSocket udp = new DatagramSocket()) {
                udp.setSoTimeout(5000);
                InetAddress addr = InetAddress.getByName(ipAddress);
                if (!connectToDevice(null, udp, addr))
                    throw new Exception("Total connection failure");

                ZkUdpHandler.sendUdpCommand(udp, addr, port, CMD_DISABLEDEVICE, sessionId, replyId);
                try {
                    return ZkUdpHandler.requestLogs(udp, addr, port, sessionId, replyId);
                } finally {
                    ZkUdpHandler.sendUdpCommand(udp, addr, port, CMD_ENABLEDEVICE, sessionId, replyId);
                    ZkUdpHandler.sendUdpCommand(udp, addr, port, CMD_EXIT, sessionId, replyId);
                }
            }
        }
    }

    public List<ZkUser> fetchUserList() throws Exception {
        log.info("Fetching User Registry from hardware: {}", ipAddress);
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(ipAddress, port), 3000);
            socket.setSoTimeout(5000);
            if (!connectToDevice(socket, null, null))
                throw new Exception("Handshake failed");

            ZkTcpHandler.executeCommand(socket.getOutputStream(), socket.getInputStream(), CMD_DISABLEDEVICE, sessionId,
                    replyId);
            try {
                return ZkTcpHandler.requestUsers(socket.getOutputStream(), socket.getInputStream(), sessionId, replyId);
            } finally {
                ZkTcpHandler.executeCommand(socket.getOutputStream(), socket.getInputStream(), CMD_ENABLEDEVICE,
                        sessionId, replyId);
                ZkTcpHandler.executeCommand(socket.getOutputStream(), socket.getInputStream(), CMD_EXIT, sessionId,
                        replyId);
            }
        } catch (Exception e) {
            try (DatagramSocket udp = new DatagramSocket()) {
                udp.setSoTimeout(5000);
                InetAddress addr = InetAddress.getByName(ipAddress);
                if (!connectToDevice(null, udp, addr))
                    throw new Exception("Total connection failure");

                ZkUdpHandler.sendUdpCommand(udp, addr, port, CMD_DISABLEDEVICE, sessionId, replyId);
                try {
                    return ZkUdpHandler.requestUsers(udp, addr, port, sessionId, replyId);
                } finally {
                    ZkUdpHandler.sendUdpCommand(udp, addr, port, CMD_ENABLEDEVICE, sessionId, replyId);
                    ZkUdpHandler.sendUdpCommand(udp, addr, port, CMD_EXIT, sessionId, replyId);
                }
            }
        }
    }

    public String getDeviceInfo() throws Exception {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(ipAddress, port), 2000);
            if (connectToDevice(socket, null, null)) {
                String info = ZkTcpHandler.fetchInfo(socket, sessionId, replyId);
                ZkTcpHandler.executeCommand(socket.getOutputStream(), socket.getInputStream(), CMD_EXIT, sessionId,
                        replyId);
                return "[TCP] " + info;
            }
        } catch (Exception e) {
            log.warn("[ZK-Probe] TCP Probe failed: {}", e.getMessage());
        }

        try (DatagramSocket udp = new DatagramSocket()) {
            udp.setSoTimeout(3000);
            InetAddress addr = InetAddress.getByName(ipAddress);
            if (connectToDevice(null, udp, addr)) {
                String info = ZkUdpHandler.fetchInfo(udp, addr, port, sessionId, replyId);
                ZkUdpHandler.sendUdpCommand(udp, addr, port, CMD_EXIT, sessionId, replyId);
                return "[UDP] " + info;
            }
        } catch (Exception e) {
            log.error("[ZK-Probe] UDP Probe failed: {}", e.getMessage());
        }

        return "Connection Rejected by Hardware";
    }
}
