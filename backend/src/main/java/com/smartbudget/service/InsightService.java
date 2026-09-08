package com.smartbudget.service;

import com.smartbudget.dto.BudgetDTO;
import com.smartbudget.dto.CategorySpendingDTO;
import com.smartbudget.dto.SmartInsightDTO;
import com.smartbudget.repository.ExpenseRepository;
import com.smartbudget.repository.IncomeRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Service
public class InsightService {

    private final BudgetService budgetService;
    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;

    public InsightService(BudgetService budgetService,
                          ExpenseRepository expenseRepository,
                          IncomeRepository incomeRepository) {
        this.budgetService = budgetService;
        this.expenseRepository = expenseRepository;
        this.incomeRepository = incomeRepository;
    }

    public List<SmartInsightDTO> generateInsights(Long userId) {
        List<SmartInsightDTO> insights = new ArrayList<>();
        LocalDate now = LocalDate.now();

        // 1. Budget Alerts
        List<BudgetDTO> budgets = budgetService.getBudgetsForUser(userId, now.getMonthValue(), now.getYear());
        for (BudgetDTO b : budgets) {
            if ("EXCEEDED".equals(b.getStatus())) {
                insights.add(new SmartInsightDTO(
                        "INS-BUD-EXC-" + b.getId(),
                        "Budget Exceeded",
                        "Your spending in " + b.getCategory().getName() + " ($" + b.getSpentAmount() + ") has exceeded the monthly budget limit of $" + b.getAmount() + ".",
                        "ALERT",
                        "AlertTriangle"
                ));
            } else if ("WARNING".equals(b.getStatus())) {
                insights.add(new SmartInsightDTO(
                        "INS-BUD-WARN-" + b.getId(),
                        "Approaching Budget Limit",
                        "You have used " + b.getPercentageUsed() + "% of your " + b.getCategory().getName() + " budget. Remaining: $" + b.getRemainingAmount() + ".",
                        "WARNING",
                        "AlertCircle"
                ));
            }
        }

        // 2. Current Month Income vs Expenses Ratio
        YearMonth currentMonth = YearMonth.now();
        LocalDate startCurrent = currentMonth.atDay(1);
        LocalDate endCurrent = currentMonth.atEndOfMonth();

        BigDecimal monthlyIncome = incomeRepository.sumTotalByUserIdAndDateRange(userId, startCurrent, endCurrent);
        BigDecimal monthlyExpense = expenseRepository.sumTotalByUserIdAndDateRange(userId, startCurrent, endCurrent);

        if (monthlyIncome.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal savings = monthlyIncome.subtract(monthlyExpense);
            double savingsRate = savings.divide(monthlyIncome, 4, RoundingMode.HALF_UP).doubleValue() * 100.0;

            if (savingsRate >= 20.0) {
                insights.add(new SmartInsightDTO(
                        "INS-SAV-EXCELLENT",
                        "Healthy Savings Rate",
                        "Great job! You are saving " + Math.round(savingsRate) + "% of your income this month ($" + savings + " saved).",
                        "SUCCESS",
                        "TrendingUp"
                ));
            } else if (savingsRate < 0) {
                insights.add(new SmartInsightDTO(
                        "INS-SAV-DEFICIT",
                        "Monthly Deficit Detected",
                        "Your expenses ($" + monthlyExpense + ") currently exceed your income ($" + monthlyIncome + ") by $" + monthlyExpense.subtract(monthlyIncome) + " for this month.",
                        "ALERT",
                        "TrendingDown"
                ));
            }
        }

        // 3. Top Spending Category
        List<Object[]> categoryData = expenseRepository.findCategorySpendingBreakdown(userId, startCurrent, endCurrent);
        if (!categoryData.isEmpty()) {
            Object[] topCategory = categoryData.get(0);
            String categoryName = (String) topCategory[0];
            BigDecimal amount = (BigDecimal) topCategory[2];

            if (monthlyExpense.compareTo(BigDecimal.ZERO) > 0) {
                double pct = amount.divide(monthlyExpense, 4, RoundingMode.HALF_UP).doubleValue() * 100.0;
                if (pct >= 40.0) {
                    insights.add(new SmartInsightDTO(
                            "INS-TOP-CAT",
                            "High Category Concentration",
                            categoryName + " accounts for " + Math.round(pct) + "% ($" + amount + ") of all your monthly expenses so far.",
                            "INFO",
                            "PieChart"
                    ));
                }
            }
        }

        // 4. Default welcoming insight if list is short
        if (insights.isEmpty()) {
            insights.add(new SmartInsightDTO(
                    "INS-WELCOME",
                    "Budgeting On Track",
                    "Your financial tracking is active. Keep logging incomes and expenses to get personalized smart insights!",
                    "INFO",
                    "CheckCircle2"
            ));
        }

        return insights;
    }
}
