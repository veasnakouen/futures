package com.mtp.api.utils.zk;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.ArrayList;
import java.util.List;

public class ZkUdpHandler {

    private static final int CMD_ATTLOG_RRQ = 13;
    private static final int CMD_USER_RRQ = 12;
    private static final int CMD_GET_PRODUCT_CODE = 9;
    private static final int CMD_DATA_QUERY = 1503;

    public static void sendUdpCommand(DatagramSocket socket, InetAddress addr, int port, int cmd, int sessionId, int replyId) throws Exception {
        byte[] pkt = ZkProtocolUtils.createHeader(cmd, (short) sessionId, (short) replyId, new byte[0]);
        socket.send(new DatagramPacket(pkt, pkt.length, addr, port));
        socket.receive(new DatagramPacket(new byte[1024], 1024));
    }

    public static List<ZkUser> requestUsers(DatagramSocket socket, InetAddress addr, int port, int sessionId, int replyId) throws Exception {
        String[] userTables = { "user", "USER_INFO", "person" };
        for (String table : userTables) {
            byte[] payload = (table + "\0").getBytes();
            byte[] pkt = ZkProtocolUtils.createHeader(CMD_DATA_QUERY, (short) sessionId, (short) replyId, payload);
            socket.send(new DatagramPacket(pkt, pkt.length, addr, port));

            ByteBuffer totalData = ByteBuffer.allocate(1024 * 1024);
            byte[] buf = new byte[8096];
            DatagramPacket respPkt = new DatagramPacket(buf, buf.length);
            boolean dataFound = false;

            while (true) {
                try {
                    socket.setSoTimeout(3000);
                    socket.receive(respPkt);
                    if (respPkt.getLength() <= 8)
                        break;
                    totalData.put(buf, 8, respPkt.getLength() - 8);
                    dataFound = true;
                    if (respPkt.getLength() < 8096)
                        break;
                } catch (Exception e) {
                    break;
                }
            }

            if (dataFound) {
                byte[] collected = new byte[totalData.position()];
                totalData.flip();
                totalData.get(collected);
                List<ZkUser> users = ZkUserParser.parseUserList(collected);
                if (!users.isEmpty())
                    return users;
            }
        }

        byte[] pkt = ZkProtocolUtils.createHeader(CMD_USER_RRQ, (short) sessionId, (short) replyId, new byte[0]);
        socket.send(new DatagramPacket(pkt, pkt.length, addr, port));

        ByteBuffer userData = ByteBuffer.allocate(1024 * 1024);
        byte[] buf = new byte[8096];
        DatagramPacket respPkt = new DatagramPacket(buf, buf.length);

        while (true) {
            try {
                socket.setSoTimeout(4000);
                socket.receive(respPkt);
                if (respPkt.getLength() <= 8)
                    break;
                userData.put(buf, 8, respPkt.getLength() - 8);
                if (respPkt.getLength() < 8096)
                    break;
            } catch (Exception e) {
                break;
            }
        }

        if (userData.position() > 0) {
            byte[] collected = new byte[userData.position()];
            userData.flip();
            userData.get(collected);
            return ZkUserParser.parseUserList(collected);
        }

        return new ArrayList<>();
    }

    public static List<ZkAttendanceLog> requestLogs(DatagramSocket socket, InetAddress addr, int port, int sessionId, int replyId) throws Exception {
        byte[] pkt = ZkProtocolUtils.createHeader(CMD_ATTLOG_RRQ, (short) sessionId, (short) replyId, new byte[0]);
        socket.send(new DatagramPacket(pkt, pkt.length, addr, port));

        ByteBuffer legacyData = ByteBuffer.allocate(8 * 1024 * 1024);
        byte[] buf = new byte[8096];
        DatagramPacket respPkt = new DatagramPacket(buf, buf.length);

        while (true) {
            try {
                socket.setSoTimeout(8000);
                socket.receive(respPkt);
                if (respPkt.getLength() <= 8)
                    break;
                legacyData.put(buf, 8, respPkt.getLength() - 8);
                if (respPkt.getLength() < 8096)
                    break;
            } catch (Exception e) {
                break;
            }
        }

        if (legacyData.position() == 0) {
            byte[] modernPkt = ZkProtocolUtils.createHeader(CMD_DATA_QUERY, (short) sessionId, (short) replyId, "attlog\0".getBytes());
            socket.send(new DatagramPacket(modernPkt, modernPkt.length, addr, port));
            while (true) {
                try {
                    socket.setSoTimeout(3000);
                    socket.receive(respPkt);
                    if (respPkt.getLength() <= 8)
                        break;
                    legacyData.put(buf, 8, respPkt.getLength() - 8);
                    if (respPkt.getLength() < 8096)
                        break;
                } catch (Exception e) {
                    break;
                }
            }
        }

        if (legacyData.position() == 0) {
            return new ArrayList<>();
        }

        byte[] collected = new byte[legacyData.position()];
        legacyData.flip();
        legacyData.get(collected);
        return ZkLogParser.parseLogList(collected);
    }

    public static String fetchInfo(DatagramSocket socket, InetAddress addr, int port, int sessionId, int replyId) throws Exception {
        String model = "Modern ZK Node";
        byte[] prodPkt = ZkProtocolUtils.createHeader(CMD_GET_PRODUCT_CODE, (short) sessionId, (short) replyId, new byte[0]);
        socket.send(new DatagramPacket(prodPkt, prodPkt.length, addr, port));
        byte[] buf = new byte[1024];
        DatagramPacket respPkt = new DatagramPacket(buf, buf.length);
        try {
            socket.setSoTimeout(1500);
            socket.receive(respPkt);
            if (respPkt.getLength() > 8)
                model = ZkProtocolUtils.extractString(buf, 8, respPkt.getLength() - 8);
        } catch (Exception e) {
        }

        int userCount = 0;
        int logCount = 0;
        byte[] sizePkt = ZkProtocolUtils.createHeader(15, (short) sessionId, (short) replyId, new byte[0]);
        socket.send(new DatagramPacket(sizePkt, sizePkt.length, addr, port));
        try {
            socket.receive(respPkt);
            if (respPkt.getLength() >= 24) {
                ByteBuffer bb = ByteBuffer.wrap(buf, 8, respPkt.getLength() - 8).order(ByteOrder.LITTLE_ENDIAN);
                userCount = bb.getInt(0);
                logCount = bb.getInt(8);
            }
        } catch (Exception e) {
        }

        return String.format("%s (Users: %d, Logs: %d)", model, userCount, logCount);
    }
}
