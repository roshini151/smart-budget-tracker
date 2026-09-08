package com.smartbudget.service;

import com.smartbudget.dto.AnalyticsDataDTO;
import com.smartbudget.dto.CategorySpendingDTO;
import com.smartbudget.dto.MonthlyTrendDTO;
import com.smartbudget.repository.ExpenseRepository;
import com.smartbudget.repository.IncomeRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReportService {

    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;

    public ReportService(IncomeRepository incomeRepository, ExpenseRepository expenseRepository) {
        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
    }

    public AnalyticsDataDTO getAnalytics(Long userId, LocalDate startDate, LocalDate endDate) {
        LocalDate start = startDate != null ? startDate : LocalDate.now().minusMonths(6).withDayOfMonth(1);
        LocalDate end = endDate != null ? endDate : LocalDate.now();

        BigDecimal totalIncome = incomeRepository.sumTotalByUserIdAndDateRange(userId, start, end);
        BigDecimal totalExpenses = expenseRepository.sumTotalByUserIdAndDateRange(userId, start, end);
        BigDecimal netSavings = totalIncome.subtract(totalExpenses);

        double savingsRate = 0.0;
        if (totalIncome.compareTo(BigDecimal.ZERO) > 0) {
            savingsRate = netSavings.divide(totalIncome, 4, RoundingMode.HALF_UP).doubleValue() * 100.0;
        }

        // Category Breakdown
        List<CategorySpendingDTO> categoryBreakdown = getCategoryBreakdown(userId, start, end, totalExpenses);

        // Monthly Trends (Past 6 Months)
        List<MonthlyTrendDTO> monthlyTrends = getMonthlyTrends(userId, 6);

        AnalyticsDataDTO dto = new AnalyticsDataDTO();
        dto.setTotalIncome(totalIncome);
        dto.setTotalExpenses(totalExpenses);
        dto.setNetSavings(netSavings);
        dto.setSavingsRatePercentage(Math.round(savingsRate * 10.0) / 10.0);
        dto.setCategorySpending(categoryBreakdown);
        dto.setMonthlyTrends(monthlyTrends);

        return dto;
    }

    public List<CategorySpendingDTO> getCategoryBreakdown(Long userId, LocalDate start, LocalDate end, BigDecimal totalExpenses) {
        List<Object[]> results = expenseRepository.findCategorySpendingBreakdown(userId, start, end);
        List<CategorySpendingDTO> list = new ArrayList<>();

        BigDecimal total = totalExpenses.compareTo(BigDecimal.ZERO) > 0 ? totalExpenses : BigDecimal.ONE;

        for (Object[] row : results) {
            String name = (String) row[0];
            String color = row[1] != null ? (String) row[1] : "#3b82f6";
            BigDecimal amt = (BigDecimal) row[2];
            double pct = amt.divide(total, 4, RoundingMode.HALF_UP).doubleValue() * 100.0;

            list.add(new CategorySpendingDTO(name, color, amt, Math.round(pct * 10.0) / 10.0));
        }

        return list;
    }

    public List<MonthlyTrendDTO> getMonthlyTrends(Long userId, int monthCount) {
        List<MonthlyTrendDTO> trends = new ArrayList<>();
        YearMonth current = YearMonth.now();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy");

        for (int i = monthCount - 1; i >= 0; i--) {
            YearMonth ym = current.minusMonths(i);
            LocalDate first = ym.atDay(1);
            LocalDate last = ym.atEndOfMonth();

            BigDecimal inc = incomeRepository.sumTotalByUserIdAndDateRange(userId, first, last);
            BigDecimal exp = expenseRepository.sumTotalByUserIdAndDateRange(userId, first, last);
            BigDecimal sav = inc.subtract(exp);

            trends.add(new MonthlyTrendDTO(
                    ym.format(formatter),
                    ym.getMonthValue(),
                    ym.getYear(),
                    inc,
                    exp,
                    sav
            ));
        }

        return trends;
    }
}
