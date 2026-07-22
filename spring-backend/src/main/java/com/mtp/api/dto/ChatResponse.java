package com.mtp.api.dto;

import java.util.List;

public class ChatResponse {
    private String response;
    private String actionLabel;
    private String actionLink;
    private List<String> suggestedTopics;

    public ChatResponse() {}

    public ChatResponse(String response) {
        this.response = response;
    }

    public ChatResponse(String response, String actionLabel, String actionLink) {
        this.response = response;
        this.actionLabel = actionLabel;
        this.actionLink = actionLink;
    }

    public ChatResponse(String response, String actionLabel, String actionLink, List<String> suggestedTopics) {
        this.response = response;
        this.actionLabel = actionLabel;
        this.actionLink = actionLink;
        this.suggestedTopics = suggestedTopics;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public String getActionLabel() {
        return actionLabel;
    }

    public void setActionLabel(String actionLabel) {
        this.actionLabel = actionLabel;
    }

    public String getActionLink() {
        return actionLink;
    }

    public void setActionLink(String actionLink) {
        this.actionLink = actionLink;
    }

    public List<String> getSuggestedTopics() {
        return suggestedTopics;
    }

    public void setSuggestedTopics(List<String> suggestedTopics) {
        this.suggestedTopics = suggestedTopics;
    }
}
