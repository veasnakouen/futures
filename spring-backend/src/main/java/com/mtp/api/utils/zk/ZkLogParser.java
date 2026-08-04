package com.mtp.api.utils.zk;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.ArrayList;
import java.util.List;

public class ZkLogParser {
    private static final Logger log = LoggerFactory.getLogger(ZkLogParser.class);

    public static List<ZkAttendanceLog> parseLogList(byte[] data) {
        List<ZkAttendanceLog> logs = new ArrayList<>();
        if (data == null || data.length < 8)
            return logs;

        int[] possibleSizes = { 14, 40, 12, 8 };
        int recSize = 14;

        for (int size : possibleSizes) {
            if (data.length >= size) {
                int offset = (data.length % size == 8 || data.length % size == 16) ? 8 : 0;
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

    private static ZkAttendanceLog parseLog(byte[] data, int off, int size) {
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
                u = String.valueOf(buf.getShort(0) & 0xFFFF);
                t = buf.getInt(4) & 0xFFFFFFFFL;
            } else if (size == 12) {
                u = String.valueOf(buf.getShort(0) & 0xFFFF);
                t = buf.getInt(4) & 0xFFFFFFFFL;
            } else if (size == 8) {
                u = String.valueOf(buf.getShort(0) & 0xFFFF);
                t = buf.getInt(4) & 0xFFFFFFFFL;
            } else {
                return null;
            }
            return new ZkAttendanceLog(u, ZkProtocolUtils.decodeTime(t));
        } catch (Exception e) {
            return null;
        }
    }
}
