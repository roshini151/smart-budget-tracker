package com.smartbudget.dto;

import java.math.BigDecimal;

public class MonthlyTrendDTO {
    private String monthLabel; // e.g., "Jan 2026", "Feb 2026"
    private Integer month;
    private Integer year;
    private BigDecimal income;
    private BigDecimal expenses;
    private BigDecimal savings;

    public MonthlyTrendDTO() {}

    public MonthlyTrendDTO(String monthLabel, Integer month, Integer year, BigDecimal income, BigDecimal expenses, BigDecimal savings) {
        this.monthLabel = monthLabel;
        this.month = month;
        this.year = year;
        this.income = income;
        this.expenses = expenses;
        this.savings = savings;
    }

    public String getMonthLabel() { return monthLabel; }
    public void setMonthLabel(String monthLabel) { this.monthLabel = monthLabel; }

    public Integer getMonth() { return month; }
    public void setMonth(Integer month) { this.month = month; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public BigDecimal getIncome() { return income; }
    public void setIncome(BigDecimal income) { this.income = income; }

    public BigDecimal getExpenses() { return expenses; }
    public void setExpenses(BigDecimal expenses) { this.expenses = expenses; }

    public BigDecimal getSavings() { return savings; }
    public void setSavings(BigDecimal savings) { this.savings = savings; }
}
