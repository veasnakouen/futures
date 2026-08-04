package com.mtp.api.utils.zk;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.util.List;

public class ZkTcpHandler {

    private static final int CMD_ATTLOG_RRQ = 13;
    private static final int CMD_USER_RRQ = 12;
    private static final int CMD_GET_VERSION = 11;
    private static final int CMD_GET_PRODUCT_CODE = 9;
    private static final int CMD_DATA_QUERY = 1503;

    public static byte[] readResponse(InputStream is) throws Exception {
        byte[] buf = new byte[65535];
        int read = is.read(buf);
        if (read <= 0)
            return null;
        byte[] out = new byte[read];
        System.arraycopy(buf, 0, out, 0, read);
        return out;
    }

    public static void executeCommand(OutputStream os, InputStream is, int cmd, int sessionId, int replyId) throws Exception {
        os.write(ZkProtocolUtils.createHeader(cmd, (short) sessionId, (short) replyId, new byte[0]));
        readResponse(is);
    }

    public static List<ZkUser> requestUsers(OutputStream os, InputStream is, int sessionId, int replyId) throws Exception {
        os.write(ZkProtocolUtils.createHeader(CMD_USER_RRQ, (short) sessionId, (short) replyId, new byte[0]));
        byte[] resp = readResponse(is);
        List<ZkUser> users = ZkUserParser.parseUserList(resp);

        if (users.isEmpty()) {
            byte[] payload = "user\0".getBytes();
            os.write(ZkProtocolUtils.createHeader(CMD_DATA_QUERY, (short) sessionId, (short) replyId, payload));
            resp = readResponse(is);
            users = ZkUserParser.parseUserList(resp);
        }
        return users;
    }

    public static List<ZkAttendanceLog> requestLogs(OutputStream os, InputStream is, int sessionId, int replyId) throws Exception {
        os.write(ZkProtocolUtils.createHeader(CMD_ATTLOG_RRQ, (short) sessionId, (short) replyId, new byte[0]));
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
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

        List<ZkAttendanceLog> logs = ZkLogParser.parseLogList(buffer.toByteArray());

        if (logs.isEmpty()) {
            byte[] payload = "attlog\0".getBytes();
            os.write(ZkProtocolUtils.createHeader(CMD_DATA_QUERY, (short) sessionId, (short) replyId, payload));
            ByteArrayOutputStream buffer2 = new ByteArrayOutputStream();
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
            logs = ZkLogParser.parseLogList(buffer2.toByteArray());
        }
        return logs;
    }

    public static String fetchInfo(Socket socket, int sessionId, int replyId) throws Exception {
        OutputStream os = socket.getOutputStream();
        InputStream is = socket.getInputStream();

        os.write(ZkProtocolUtils.createHeader(CMD_GET_PRODUCT_CODE, (short) sessionId, (short) replyId, new byte[0]));
        byte[] prodResp = readResponse(is);
        String product = prodResp != null && prodResp.length > 8
                ? ZkProtocolUtils.extractString(prodResp, 8, prodResp.length - 8)
                : "Unknown Model";

        os.write(ZkProtocolUtils.createHeader(CMD_GET_VERSION, (short) sessionId, (short) replyId, new byte[0]));
        byte[] verResp = readResponse(is);
        String version = verResp != null && verResp.length > 8
                ? ZkProtocolUtils.extractString(verResp, 8, verResp.length - 8)
                : "Unknown Version";

        return product + " (v" + version + ")";
    }
}
