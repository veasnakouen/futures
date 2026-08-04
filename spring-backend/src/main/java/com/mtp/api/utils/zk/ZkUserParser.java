package com.mtp.api.utils.zk;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

public class ZkUserParser {
    private static final Logger log = LoggerFactory.getLogger(ZkUserParser.class);

    public static List<ZkUser> parseUserList(byte[] data) {
        List<ZkUser> users = new ArrayList<>();
        if (data == null || data.length < 8)
            return users;

        log.info("[ZK-Protocol] Received user block: {} bytes", data.length);

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

    private static ZkUser parseUser(byte[] data, int offset, int size) {
        try {
            if (size == 72) {
                String id = ZkProtocolUtils.extractString(data, offset + 48, 20).trim();
                String name = ZkProtocolUtils.extractString(data, offset + 24, 24).trim();
                if (id.isEmpty()) {
                    id = ZkProtocolUtils.extractString(data, offset, 24).trim();
                }
                return new ZkUser(id, name.isEmpty() ? "User " + id : name);
            } else {
                int id = (data[offset] & 0xFF) | ((data[offset + 1] & 0xFF) << 8);
                String name = ZkProtocolUtils.extractString(data, offset + 8, 8).trim();
                return new ZkUser(String.valueOf(id), name.isEmpty() ? "User " + id : name);
            }
        } catch (Exception e) {
            return null;
        }
    }
}
