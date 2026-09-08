package com.smartbudget.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardSummaryDTO {
    private BigDecimal totalBalance;
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal totalRemainingBudget;
    private BigDecimal totalSavings;
    private List<TransactionDTO> recentActivity;
    private List<SmartInsightDTO> smartInsights;
    private List<CategorySpendingDTO> categoryBreakdown;
    private List<BudgetDTO> activeBudgets;

    public DashboardSummaryDTO() {}

    public BigDecimal getTotalBalance() { return totalBalance; }
    public void setTotalBalance(BigDecimal totalBalance) { this.totalBalance = totalBalance; }

    public BigDecimal getTotalIncome() { return totalIncome; }
    public void setTotalIncome(BigDecimal totalIncome) { this.totalIncome = totalIncome; }

    public BigDecimal getTotalExpenses() { return totalExpenses; }
    public void setTotalExpenses(BigDecimal totalExpenses) { this.totalExpenses = totalExpenses; }

    public BigDecimal getTotalRemainingBudget() { return totalRemainingBudget; }
    public void setTotalRemainingBudget(BigDecimal totalRemainingBudget) { this.totalRemainingBudget = totalRemainingBudget; }

    public BigDecimal getTotalSavings() { return totalSavings; }
    public void setTotalSavings(BigDecimal totalSavings) { this.totalSavings = totalSavings; }

    public List<TransactionDTO> getRecentActivity() { return recentActivity; }
    public void setRecentActivity(List<TransactionDTO> recentActivity) { this.recentActivity = recentActivity; }

    public List<SmartInsightDTO> getSmartInsights() { return smartInsights; }
    public void setSmartInsights(List<SmartInsightDTO> smartInsights) { this.smartInsights = smartInsights; }

    public List<CategorySpendingDTO> getCategoryBreakdown() { return categoryBreakdown; }
    public void setCategoryBreakdown(List<CategorySpendingDTO> categoryBreakdown) { this.categoryBreakdown = categoryBreakdown; }

    public List<BudgetDTO> getActiveBudgets() { return activeBudgets; }
    public void setActiveBudgets(List<BudgetDTO> activeBudgets) { this.activeBudgets = activeBudgets; }
}
