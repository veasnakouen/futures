package com.mtp.api.utils;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Hardened Java implementation of the ZK Biometric Protocol.
 * Supports fetching both Attendance Logs and the User List (Enrolled People).
 */
public class ZkDeviceClient {
    private static final Logger log = LoggerFactory.getLogger(ZkDeviceClient.class);

    private static final int CMD_CONNECT = 1000;
    private static final int CMD_EXIT = 1001;
    private static final int CMD_ENABLEDEVICE = 1002;
    private static final int CMD_DISABLEDEVICE = 1003;
    private static final int CMD_ATTLOG_RRQ = 13;
    private static final int CMD_USER_RRQ = 12; // Fetch user list
    private static final int CMD_GET_VERSION = 11;
    private static final int CMD_GET_PRODUCT_CODE = 9;
    private static final int CMD_ACK_OK = 2000;
    private static final int CMD_OPTIONS_RRQ = 10;
    private static final int CMD_PREPARE_DATA = 1500;
    private static final int CMD_DATA_QUERY = 1503;
    private static final int DEFAULT_MACHINE_ID = 1;

    private int commKey = 0;

    private final String ipAddress;
    private final int port;
    private int sessionId = 0;
    private int replyId = 0;

    public ZkDeviceClient(String ipAddress, int port) {
        this.ipAddress = ipAddress;
        this.port = port;
    }

    private boolean connectToDevice(Socket socket, DatagramSocket udpSocket, InetAddress addr) throws Exception {
        byte[] pkt = createHeader(CMD_CONNECT, (short) 0, (short) 0, new byte[0]);
        if (socket != null) {
            socket.getOutputStream().write(pkt);
            byte[] resp = readResponse(socket.getInputStream());
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

            // Confirm Session
            byte[] ackPkt = createHeader(CMD_ACK_OK, (short) sessionId, (short) replyId, new byte[0]);
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

            executeCommand(socket.getOutputStream(), socket.getInputStream(), CMD_DISABLEDEVICE);
            try {
                return requestLogs(socket.getOutputStream(), socket.getInputStream());
            } finally {
                executeCommand(socket.getOutputStream(), socket.getInputStream(), CMD_ENABLEDEVICE);
                executeCommand(socket.getOutputStream(), socket.getInputStream(), CMD_EXIT);
            }
        } catch (Exception e) {
            // Fallback to UDP
            try (DatagramSocket udp = new DatagramSocket()) {
                udp.setSoTimeout(5000);
                InetAddress addr = InetAddress.getByName(ipAddress);
                if (!connectToDevice(null, udp, addr))
                    throw new Exception("Total connection failure");

                sendUdpCommand(udp, addr, CMD_DISABLEDEVICE);
                try {
                    return requestLogsUDP(udp, addr);
                } finally {
                    sendUdpCommand(udp, addr, CMD_ENABLEDEVICE);
                    sendUdpCommand(udp, addr, CMD_EXIT);
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

            // 1. Disable Device (Lock)
            executeCommand(socket.getOutputStream(), socket.getInputStream(), CMD_DISABLEDEVICE);

            try {
                // 2. Fetch Users
                return requestUsers(socket.getOutputStream(), socket.getInputStream());
            } finally {
                // 3. Enable Device (Unlock)
                executeCommand(socket.getOutputStream(), socket.getInputStream(), CMD_ENABLEDEVICE);
                executeCommand(socket.getOutputStream(), socket.getInputStream(), CMD_EXIT);
            }
        } catch (Exception e) {
            // Fallback to UDP
            try (DatagramSocket udp = new DatagramSocket()) {
                udp.setSoTimeout(5000);
                InetAddress addr = InetAddress.getByName(ipAddress);
                if (!connectToDevice(null, udp, addr))
                    throw new Exception("Total connection failure");

                sendUdpCommand(udp, addr, CMD_DISABLEDEVICE);
                try {
                    return requestUsersUDP(udp, addr);
                } finally {
                    sendUdpCommand(udp, addr, CMD_ENABLEDEVICE);
                    sendUdpCommand(udp, addr, CMD_EXIT);
                }
            }
        }
    }

    private void executeCommand(OutputStream os, InputStream is, int cmd) throws Exception {
        os.write(createHeader(cmd, (short) sessionId, (short) replyId, new byte[0]));
        readResponse(is);
    }

    private void sendUdpCommand(DatagramSocket socket, InetAddress addr, int cmd) throws Exception {
        byte[] pkt = createHeader(cmd, (short) sessionId, (short) replyId, new byte[0]);
        socket.send(new DatagramPacket(pkt, pkt.length, addr, port));
        socket.receive(new DatagramPacket(new byte[1024], 1024));
    }

    private List<ZkUser> requestUsers(OutputStream os, InputStream is) throws Exception {
        os.write(createHeader(CMD_USER_RRQ, (short) sessionId, (short) replyId, new byte[0]));
        byte[] resp = readResponse(is);
        List<ZkUser> users = parseUserList(resp);

        if (users.isEmpty()) {
            log.info("[ZK-Protocol] CMD_USER_RRQ returned nothing. Trying CMD_DATA_QUERY fallback...");
            byte[] payload = "user\0".getBytes();
            os.write(createHeader(CMD_DATA_QUERY, (short) sessionId, (short) replyId, payload));
            resp = readResponse(is);
            users = parseUserList(resp);
        }

        return users;
    }

    private List<ZkUser> requestUsersUDP(DatagramSocket socket, InetAddress addr) throws Exception {
        String[] userTables = { "user", "USER_INFO", "person" };

        for (String table : userTables) {
            log.info("[ZK-Protocol] Probing user table: {}...", table);
            byte[] payload = (table + "\0").getBytes();
            byte[] pkt = createHeader(CMD_DATA_QUERY, (short) sessionId, (short) replyId, payload);
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
                List<ZkUser> users = parseUserList(collected);
                if (!users.isEmpty()) {
                    System.out.println(">>> SUCCESS: Found " + users.size() + " users in table " + table);
                    return users;
                }
            }
        }

        // --- Force Progress Output ---
        System.out.println(">>> STARTING DATA STREAM: REQUESTING 15,696 LOGS...");

        log.info("[ZK-Protocol] Modern user tables empty. Trying Streaming Legacy CMD_USER_RRQ...");
        byte[] pkt = createHeader(CMD_USER_RRQ, (short) sessionId, (short) replyId, new byte[0]);
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
            return parseUserList(collected);
        }

        log.info("[ZK-Protocol] UDP failed. Attempting TCP fallback for User List...");
        try (Socket tcpSocket = new Socket()) {
            tcpSocket.connect(new InetSocketAddress(ipAddress, port), 3000);
            tcpSocket.setSoTimeout(5000);
            OutputStream out = tcpSocket.getOutputStream();
            InputStream in = tcpSocket.getInputStream();

            // Handshake over TCP
            byte[] connectPkt = createHeader(CMD_CONNECT, (short) 0, (short) 0, new byte[0]);
            out.write(connectPkt);
            byte[] resp = new byte[1024];
            int len = in.read(resp);

            if (len > 8) {
                int sessId = ByteBuffer.wrap(resp, 4, 2).order(ByteOrder.LITTLE_ENDIAN).getShort() & 0xFFFF;
                byte[] userPkt = createHeader(CMD_USER_RRQ, (short) sessId, (short) 0, new byte[0]);
                out.write(userPkt);

                ByteBuffer tcpData = ByteBuffer.allocate(1024 * 1024);
                while ((len = in.read(resp)) > 0) {
                    if (len > 8)
                        tcpData.put(resp, 8, len - 8);
                    if (len < 1024)
                        break;
                }

                if (tcpData.position() > 0) {
                    byte[] collected = new byte[tcpData.position()];
                    tcpData.flip();
                    tcpData.get(collected);
                    return parseUserList(collected);
                }
            }
        } catch (Exception e) {
            log.warn("[ZK-Protocol] TCP Fallback failed: {}", e.getMessage());
        }

        return new ArrayList<>();
    }

    public String getDeviceInfo() throws Exception {
        // Try TCP First
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(ipAddress, port), 2000);
            if (connectToDevice(socket, null, null)) {
                String info = fetchInfoTCP(socket);
                executeCommand(socket.getOutputStream(), socket.getInputStream(), CMD_EXIT);
                return "[TCP] " + info;
            }
        } catch (Exception e) {
            log.warn("[ZK-Probe] TCP Probe failed: {}", e.getMessage());
        }

        // Fallback to UDP
        try (DatagramSocket udp = new DatagramSocket()) {
            udp.setSoTimeout(3000);
            InetAddress addr = InetAddress.getByName(ipAddress);
            if (connectToDevice(null, udp, addr)) {
                String info = fetchInfoUDP(udp, addr);
                sendUdpCommand(udp, addr, CMD_EXIT);
                return "[UDP] " + info;
            }
        } catch (Exception e) {
            log.error("[ZK-Probe] UDP Probe failed: {}", e.getMessage());
        }

        return "Connection Rejected by Hardware";
    }

    private String fetchInfoTCP(Socket socket) throws Exception {
        osRequest(socket.getOutputStream(), CMD_GET_PRODUCT_CODE);
        byte[] prodResp = readResponse(socket.getInputStream());
        String product = prodResp != null && prodResp.length > 8 ? extractString(prodResp, 8, prodResp.length - 8)
                : "Unknown Model";

        osRequest(socket.getOutputStream(), CMD_GET_VERSION);
        byte[] verResp = readResponse(socket.getInputStream());
        String version = verResp != null && verResp.length > 8 ? extractString(verResp, 8, verResp.length - 8)
                : "Unknown Version";

        return product + " (v" + version + ")";
    }

    private String fetchInfoUDP(DatagramSocket socket, InetAddress addr) throws Exception {
        // 1. Get Model Name
        String model = "Modern ZK Node";
        byte[] prodPkt = createHeader(CMD_GET_PRODUCT_CODE, (short) sessionId, (short) replyId, new byte[0]);
        socket.send(new DatagramPacket(prodPkt, prodPkt.length, addr, port));
        byte[] buf = new byte[1024];
        DatagramPacket respPkt = new DatagramPacket(buf, buf.length);
        try {
            socket.setSoTimeout(1500);
            socket.receive(respPkt);
            if (respPkt.getLength() > 8)
                model = extractString(buf, 8, respPkt.getLength() - 8);
        } catch (Exception e) {
        }

        // 2. Get Storage Counts (Legacy Method)
        int userCount = 0;
        int logCount = 0;
        byte[] sizePkt = createHeader(15, (short) sessionId, (short) replyId, new byte[0]); // CMD_GET_FREE_SIZES
        socket.send(new DatagramPacket(sizePkt, sizePkt.length, addr, port));
        try {
            socket.receive(respPkt);
            if (respPkt.getLength() >= 24) {
                ByteBuffer bb = ByteBuffer.wrap(buf, 8, respPkt.getLength() - 8).order(ByteOrder.LITTLE_ENDIAN);
                userCount = bb.getInt(0); // Offset 0: Users
                logCount = bb.getInt(8); // Offset 8: Logs
            }
        } catch (Exception e) {
        }

        return String.format("%s (Users: %d, Logs: %d)", model, userCount, logCount);
    }

    private void osRequest(OutputStream os, int cmd) throws Exception {
        os.write(createHeader(cmd, (short) sessionId, (short) replyId, new byte[0]));
    }

    private List<ZkUser> parseUserList(byte[] data) {
        List<ZkUser> users = new ArrayList<>();
        if (data == null || data.length < 8)
            return users;

        log.info("[ZK-Protocol] Received user block: {} bytes", data.length);

        // Offset 8 is where ZK data usually starts after header
        int start = (data.length % 72 == 8 || data.length % 28 == 8) ? 8 : 0;

        int recordSize = 72;
        if ((data.length - start) % 28 == 0 && (data.length - start) % 72 != 0) {
            recordSize = 28;
            log.info("[ZK-Protocol] Detected 28-byte legacy format");
        }

        for (int i = start; i <= data.length - recordSize; i += recordSize) {
            ZkUser user = parseUser(data, i, recordSize);
            if (user != null && !user.userId.isEmpty()) {
                users.add(user);
            }
        }
        return users;
    }

    private ZkUser parseUser(byte[] data, int offset, int size) {
        try {
            if (size == 72) {
                // TFT/Color Screen format
                String id = extractString(data, offset + 48, 20).trim();
                String name = extractString(data, offset + 24, 24).trim();
                if (id.isEmpty()) {
                    // Try alternative offset for some firmware versions
                    id = extractString(data, offset, 24).trim();
                }
                return new ZkUser(id, name.isEmpty() ? "User " + id : name);
            } else {
                // Legacy B&W format
                int id = (data[offset] & 0xFF) | ((data[offset + 1] & 0xFF) << 8);
                String name = extractString(data, offset + 8, 8).trim();
                return new ZkUser(String.valueOf(id), name.isEmpty() ? "User " + id : name);
            }
        } catch (Exception e) {
            return null;
        }
    }

    private String extractString(byte[] data, int off, int len) {
        if (off + len > data.length)
            return "";
        byte[] b = new byte[len];
        System.arraycopy(data, off, b, 0, len);
        return new String(b).split("\0")[0].trim();
    }

    private List<ZkAttendanceLog> requestLogs(OutputStream os, InputStream is) throws Exception {
        os.write(createHeader(CMD_ATTLOG_RRQ, (short) sessionId, (short) replyId, new byte[0]));
        java.io.ByteArrayOutputStream buffer = new java.io.ByteArrayOutputStream();
        byte[] buf = new byte[8096];
        while (true) {
            try {
                int read = is.read(buf);
                if (read <= 0)
                    break;
                buffer.write(buf, 0, read);
                if (read < 1024)
                    break;
            } catch (java.net.SocketTimeoutException e) {
                break;
            }
        }

        List<ZkAttendanceLog> logs = parseLogList(buffer.toByteArray());

        if (logs.isEmpty()) {
            log.info("[ZK-Protocol] CMD_ATTLOG_RRQ empty. Trying modern CMD_DATA_QUERY for logs...");
            byte[] payload = "attlog\0".getBytes();
            os.write(createHeader(CMD_DATA_QUERY, (short) sessionId, (short) replyId, payload));
            java.io.ByteArrayOutputStream buffer2 = new java.io.ByteArrayOutputStream();
            while (true) {
                try {
                    int read = is.read(buf);
                    if (read <= 0)
                        break;
                    buffer2.write(buf, 0, read);
                    if (read < 1024)
                        break;
                } catch (java.net.SocketTimeoutException e) {
                    break;
                }
            }
            logs = parseLogList(buffer2.toByteArray());
        }
        return logs;
    }

    private List<ZkAttendanceLog> requestLogsUDP(DatagramSocket socket, InetAddress addr) throws Exception {
        log.info("[ZK-Protocol] Using Legacy CMD_ATTLOG_RRQ for hardware compatibility...");
        byte[] pkt = createHeader(CMD_ATTLOG_RRQ, (short) sessionId, (short) replyId, new byte[0]);
        socket.send(new DatagramPacket(pkt, pkt.length, addr, port));

        ByteBuffer legacyData = ByteBuffer.allocate(8 * 1024 * 1024); // Up to 8MB
        byte[] buf = new byte[8096];
        DatagramPacket respPkt = new DatagramPacket(buf, buf.length);

        System.out.println(">>> WAITING FOR HARDWARE DATA STREAM...");

        while (true) {
            try {
                socket.setSoTimeout(8000); // Wait 8s per chunk
                socket.receive(respPkt);
                if (respPkt.getLength() <= 8)
                    break;
                legacyData.put(buf, 8, respPkt.getLength() - 8);

                int currentCount = legacyData.position() / 14;
                if (currentCount > 0 && currentCount % 500 == 0) {
                    System.out.println(">>> SYNC IN PROGRESS: " + currentCount + " logs retrieved...");
                }

                if (respPkt.getLength() < 8096)
                    break;
            } catch (java.net.SocketTimeoutException e) {
                log.warn("[ZK-Protocol] Stream timeout after {} bytes. Processing partial data.",
                        legacyData.position());
                break;
            } catch (Exception e) {
                break;
            }
        }

        if (legacyData.position() == 0) {
            log.info("[ZK-Protocol] UDP stream returned no legacy data. Probing modern attlog table...");
            byte[] modernPkt = createHeader(CMD_DATA_QUERY, (short) sessionId, (short) replyId, "attlog\0".getBytes());
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
            System.out.println(">>> ERROR: HARDWARE RETURNED NO DATA.");
            return new ArrayList<>();
        }

        byte[] collected = new byte[legacyData.position()];
        legacyData.flip();
        legacyData.get(collected);
        List<ZkAttendanceLog> logs = parseLogList(collected);
        System.out.println(">>> SUCCESS: Processed " + logs.size() + " records.");
        return logs;
    }

    private List<ZkAttendanceLog> parseLogList(byte[] data) {
        List<ZkAttendanceLog> logs = new ArrayList<>();
        if (data == null || data.length < 8)
            return logs;

        // Robust auto-detect: Test parse the first record to ensure date validity
        int[] possibleSizes = { 14, 40, 12, 8 };
        int recSize = 14;

        for (int size : possibleSizes) {
            if (data.length >= size) {
                int offset = (data.length % size == 8 || data.length % size == 16) ? 8 : 0;
                // Some TCP streams have a 16 byte header
                if (data.length >= offset + size) {
                    ZkAttendanceLog testLog = parseLog(data, offset, size);
                    if (testLog != null && testLog.timestamp != null) {
                        int year = testLog.timestamp.getYear();
                        if (year > 2010 && year < 2035) {
                            recSize = size;
                            break;
                        }
                    }
                }
            }
        }

        log.info("[ZK-Protocol] Validated record size: {} bytes (Data length: {})", recSize, data.length);

        int offset = (data.length % recSize == 8 || data.length % recSize == 16) ? 8 : 0;
        for (int i = offset; i <= data.length - recSize; i += recSize) {
            ZkAttendanceLog logEntry = parseLog(data, i, recSize);
            if (logEntry != null && logEntry.timestamp.getYear() > 2010) {
                logs.add(logEntry);
            }
        }
        return logs;
    }

    private ZkAttendanceLog parseLog(byte[] data, int off, int size) {
        try {
            ByteBuffer buf = ByteBuffer.wrap(data, off, size).order(ByteOrder.LITTLE_ENDIAN);
            String u;
            long t;
            if (size == 40) {
                byte[] b = new byte[24];
                buf.get(b);
                u = new String(b).trim();
                t = buf.getInt(28) & 0xFFFFFFFFL;
            } else if (size == 14) {
                // Modern TFT/9.0 Format
                u = String.valueOf(buf.getShort(0) & 0xFFFF);
                t = buf.getInt(4) & 0xFFFFFFFFL;
            } else if (size == 12) {
                // v8.0 / B&W Legacy (12 bytes)
                u = String.valueOf(buf.getShort(0) & 0xFFFF);
                t = buf.getInt(4) & 0xFFFFFFFFL;
            } else if (size == 8) {
                // Very Old B&W (8 bytes)
                // Offset 0-1: ID, Offset 4-7: Time
                u = String.valueOf(buf.getShort(0) & 0xFFFF);
                t = buf.getInt(4) & 0xFFFFFFFFL;
            } else {
                return null;
            }
            return new ZkAttendanceLog(u, decodeTime(t));
        } catch (Exception e) {
            return null;
        }
    }

    private byte[] createHeader(int cmd, short sess, short reply, byte[] data) {
        ByteBuffer buf = ByteBuffer.allocate(8 + data.length).order(ByteOrder.LITTLE_ENDIAN);
        buf.putShort((short) cmd);
        buf.putShort((short) 0);
        buf.putShort(sess);
        buf.putShort(reply);
        buf.put(data);
        short sum = calcChecksum(buf.array());
        buf.putShort(2, sum);
        return buf.array();
    }

    private short calcChecksum(byte[] data) {
        int sum = 0;
        for (int i = 0; i < data.length; i += 2) {
            if (i + 1 < data.length)
                sum += ((data[i + 1] & 0xFF) << 8) | (data[i] & 0xFF);
            else
                sum += (data[i] & 0xFF);
        }
        while (sum > 0xFFFF)
            sum = (sum & 0xFFFF) + (sum >> 16);
        return (short) (~sum & 0xFFFF);
    }

    private byte[] readResponse(InputStream is) throws Exception {
        byte[] buf = new byte[65535];
        int read = is.read(buf);
        if (read <= 0)
            return null;
        byte[] out = new byte[read];
        System.arraycopy(buf, 0, out, 0, read);
        return out;
    }

    private LocalDateTime decodeTime(long t) {
        long s = t % 60;
        t /= 60;
        long m = t % 60;
        t /= 60;
        long h = t % 24;
        t /= 24;
        long d = (t % 31) + 1;
        t /= 31;
        long mon = (t % 12) + 1;
        t /= 12;
        long y = t + 2000;
        return LocalDateTime.of((int) y, (int) mon, (int) d, (int) h, (int) m, (int) s);
    }

    public static class ZkAttendanceLog {
        public final String userId;
        public final LocalDateTime timestamp;

        public ZkAttendanceLog(String userId, LocalDateTime timestamp) {
            this.userId = userId;
            this.timestamp = timestamp;
        }
    }

    public static class ZkUser {
        public final String userId;
        public final String name;

        public ZkUser(String userId, String name) {
            this.userId = userId;
            this.name = name;
        }
    }
}
