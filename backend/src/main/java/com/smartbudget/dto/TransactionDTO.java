package com.smartbudget.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class TransactionDTO {
    private String id; // e.g. INC-1 or EXP-2
    private String type; // INCOME or EXPENSE
    private String title; // Source or Description
    private BigDecimal amount;
    private LocalDate date;
    private CategoryDTO category;
    private String paymentMethodOrSource;

    public TransactionDTO() {}

    public TransactionDTO(String id, String type, String title, BigDecimal amount, LocalDate date, CategoryDTO category, String paymentMethodOrSource) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.amount = amount;
        this.date = date;
        this.category = category;
        this.paymentMethodOrSource = paymentMethodOrSource;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public CategoryDTO getCategory() { return category; }
    public void setCategory(CategoryDTO category) { this.category = category; }

    public String getPaymentMethodOrSource() { return paymentMethodOrSource; }
    public void setPaymentMethodOrSource(String paymentMethodOrSource) { this.paymentMethodOrSource = paymentMethodOrSource; }
}
