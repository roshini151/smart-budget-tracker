package com.smartbudget.controller;

import com.smartbudget.dto.BudgetDTO;
import com.smartbudget.dto.CategorySpendingDTO;
import com.smartbudget.dto.DashboardSummaryDTO;
import com.smartbudget.dto.SmartInsightDTO;
import com.smartbudget.dto.TransactionDTO;
import com.smartbudget.security.UserPrincipal;
import com.smartbudget.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final UserService userService;
    private final TransactionService transactionService;
    private final InsightService insightService;
    private final BudgetService budgetService;
    private final ReportService reportService;

    public DashboardController(UserService userService,
                               TransactionService transactionService,
                               InsightService insightService,
                               BudgetService budgetService,
                               ReportService reportService) {
        this.userService = userService;
        this.transactionService = transactionService;
        this.insightService = insightService;
        this.budgetService = budgetService;
        this.reportService = reportService;
    }

    @GetMapping
    public ResponseEntity<DashboardSummaryDTO> getDashboardData(@AuthenticationPrincipal UserPrincipal currentUser) {
        Long userId = currentUser.getId();

        var userProfile = userService.getUserProfile(userId);
        LocalDate now = LocalDate.now();

        List<BudgetDTO> activeBudgets = budgetService.getBudgetsForUser(userId, now.getMonthValue(), now.getYear());
        BigDecimal totalRemainingBudget = activeBudgets.stream()
                .map(BudgetDTO::getRemainingAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<TransactionDTO> allTransactions = transactionService.getAllTransactions(userId, "ALL", null, null, null, null);
        List<TransactionDTO> recentActivity = allTransactions.stream().limit(5).toList();

        List<SmartInsightDTO> smartInsights = insightService.generateInsights(userId);

        YearMonth currentMonth = YearMonth.now();
        List<CategorySpendingDTO> categoryBreakdown = reportService.getCategoryBreakdown(userId, currentMonth.atDay(1), currentMonth.atEndOfMonth(), userProfile.getTotalExpenses());

        DashboardSummaryDTO summary = new DashboardSummaryDTO();
        summary.setTotalBalance(userProfile.getTotalBalance());
        summary.setTotalIncome(userProfile.getTotalIncome());
        summary.setTotalExpenses(userProfile.getTotalExpenses());
        summary.setTotalRemainingBudget(totalRemainingBudget);
        summary.setTotalSavings(userProfile.getTotalBalance().compareTo(BigDecimal.ZERO) > 0 ? userProfile.getTotalBalance() : BigDecimal.ZERO);
        summary.setRecentActivity(recentActivity);
        summary.setSmartInsights(smartInsights);
        summary.setCategoryBreakdown(categoryBreakdown);
        summary.setActiveBudgets(activeBudgets);

        return ResponseEntity.ok(summary);
    }
}
