package com.mtp.api.utils.zk;

import java.time.LocalDateTime;

public class ZkAttendanceLog {
    public final String userId;
    public final LocalDateTime timestamp;

    public ZkAttendanceLog(String userId, LocalDateTime timestamp) {
        this.userId = userId;
        this.timestamp = timestamp;
    }
}
