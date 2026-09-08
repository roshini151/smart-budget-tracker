package com.smartbudget.dto;

import java.math.BigDecimal;

public class BudgetDTO {
    private Long id;
    private CategoryDTO category;
    private Integer budgetMonth;
    private Integer budgetYear;
    private BigDecimal amount;
    private BigDecimal spentAmount;
    private BigDecimal remainingAmount;
    private Double percentageUsed;
    private String status; // OK, WARNING, EXCEEDED

    public BudgetDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CategoryDTO getCategory() { return category; }
    public void setCategory(CategoryDTO category) { this.category = category; }

    public Integer getBudgetMonth() { return budgetMonth; }
    public void setBudgetMonth(Integer budgetMonth) { this.budgetMonth = budgetMonth; }

    public Integer getBudgetYear() { return budgetYear; }
    public void setBudgetYear(Integer budgetYear) { this.budgetYear = budgetYear; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public BigDecimal getSpentAmount() { return spentAmount; }
    public void setSpentAmount(BigDecimal spentAmount) { this.spentAmount = spentAmount; }

    public BigDecimal getRemainingAmount() { return remainingAmount; }
    public void setRemainingAmount(BigDecimal remainingAmount) { this.remainingAmount = remainingAmount; }

    public Double getPercentageUsed() { return percentageUsed; }
    public void setPercentageUsed(Double percentageUsed) { this.percentageUsed = percentageUsed; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
