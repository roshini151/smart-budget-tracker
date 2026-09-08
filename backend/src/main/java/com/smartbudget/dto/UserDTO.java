package com.smartbudget.dto;

import java.math.BigDecimal;

public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String currency;
    private BigDecimal monthlyIncomePreference;

    public UserDTO() {}

    public UserDTO(Long id, String name, String email, String currency, BigDecimal monthlyIncomePreference) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.currency = currency;
        this.monthlyIncomePreference = monthlyIncomePreference;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public BigDecimal getMonthlyIncomePreference() { return monthlyIncomePreference; }
    public void setMonthlyIncomePreference(BigDecimal monthlyIncomePreference) { this.monthlyIncomePreference = monthlyIncomePreference; }
}
