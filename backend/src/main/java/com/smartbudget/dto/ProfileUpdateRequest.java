package com.smartbudget.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public class ProfileUpdateRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String currency = "$";

    private BigDecimal monthlyIncomePreference = BigDecimal.ZERO;

    public ProfileUpdateRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public BigDecimal getMonthlyIncomePreference() { return monthlyIncomePreference; }
    public void setMonthlyIncomePreference(BigDecimal monthlyIncomePreference) { this.monthlyIncomePreference = monthlyIncomePreference; }
}
