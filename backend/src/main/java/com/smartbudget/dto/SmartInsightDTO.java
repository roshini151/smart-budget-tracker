package com.smartbudget.dto;

public class SmartInsightDTO {
    private String id;
    private String title;
    private String message;
    private String type; // WARNING, ALERT, SUCCESS, INFO
    private String icon;

    public SmartInsightDTO() {}

    public SmartInsightDTO(String id, String title, String message, String type, String icon) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.type = type;
        this.icon = icon;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
}
