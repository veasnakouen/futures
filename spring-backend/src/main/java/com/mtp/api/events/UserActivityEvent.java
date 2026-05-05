package com.mtp.api.events;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class UserActivityEvent extends ApplicationEvent {
    private final String username;
    private final String action;

    public UserActivityEvent(Object source, String username, String action) {
        super(source);
        this.username = username;
        this.action = action;
    }
}
