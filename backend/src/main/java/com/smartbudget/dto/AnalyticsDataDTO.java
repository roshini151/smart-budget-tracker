package com.smartbudget.dto;

import java.math.BigDecimal;
import java.util.List;

public class AnalyticsDataDTO {
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal netSavings;
    private Double savingsRatePercentage;
    private List<CategorySpendingDTO> categorySpending;
    private List<MonthlyTrendDTO> monthlyTrends;

    public AnalyticsDataDTO() {}

    public BigDecimal getTotalIncome() { return totalIncome; }
    public void setTotalIncome(BigDecimal totalIncome) { this.totalIncome = totalIncome; }

    public BigDecimal getTotalExpenses() { return totalExpenses; }
    public void setTotalExpenses(BigDecimal totalExpenses) { this.totalExpenses = totalExpenses; }

    public BigDecimal getNetSavings() { return netSavings; }
    public void setNetSavings(BigDecimal netSavings) { this.netSavings = netSavings; }

    public Double getSavingsRatePercentage() { return savingsRatePercentage; }
    public void setSavingsRatePercentage(Double savingsRatePercentage) { this.savingsRatePercentage = savingsRatePercentage; }

    public List<CategorySpendingDTO> getCategorySpending() { return categorySpending; }
    public void setCategorySpending(List<CategorySpendingDTO> categorySpending) { this.categorySpending = categorySpending; }

    public List<MonthlyTrendDTO> getMonthlyTrends() { return monthlyTrends; }
    public void setMonthlyTrends(List<MonthlyTrendDTO> monthlyTrends) { this.monthlyTrends = monthlyTrends; }
}
