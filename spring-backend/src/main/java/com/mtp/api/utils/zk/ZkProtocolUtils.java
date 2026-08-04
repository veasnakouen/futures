package com.mtp.api.utils.zk;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.time.LocalDateTime;

public class ZkProtocolUtils {

    public static byte[] createHeader(int cmd, short sess, short reply, byte[] data) {
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

    public static short calcChecksum(byte[] data) {
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

    public static String extractString(byte[] data, int off, int len) {
        if (off + len > data.length)
            return "";
        byte[] b = new byte[len];
        System.arraycopy(data, off, b, 0, len);
        return new String(b).split("\0")[0].trim();
    }

    public static LocalDateTime decodeTime(long t) {
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
}
