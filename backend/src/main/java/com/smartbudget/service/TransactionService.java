package com.smartbudget.service;

import com.smartbudget.dto.TransactionDTO;
import com.smartbudget.entity.Expense;
import com.smartbudget.entity.Income;
import com.smartbudget.repository.ExpenseRepository;
import com.smartbudget.repository.IncomeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final CategoryService categoryService;

    public TransactionService(IncomeRepository incomeRepository,
                              ExpenseRepository expenseRepository,
                              CategoryService categoryService) {
        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
        this.categoryService = categoryService;
    }

    public List<TransactionDTO> getAllTransactions(Long userId, String type, Long categoryId, String query, LocalDate startDate, LocalDate endDate) {
        List<TransactionDTO> transactions = new ArrayList<>();

        if (type == null || type.equalsIgnoreCase("ALL") || type.equalsIgnoreCase("INCOME")) {
            List<Income> incomes = incomeRepository.findByUserIdOrderByIncomeDateDesc(userId);
            for (Income inc : incomes) {
                if (matchesFilter(inc.getIncomeDate(), inc.getSource(), inc.getDescription(), null, startDate, endDate, query)) {
                    TransactionDTO dto = new TransactionDTO(
                            "INC-" + inc.getId(),
                            "INCOME",
                            inc.getSource(),
                            inc.getAmount(),
                            inc.getIncomeDate(),
                            incomeCategory(inc),
                            inc.getSource()
                    );
                    transactions.add(dto);
                }
            }
        }

        if (type == null || type.equalsIgnoreCase("ALL") || type.equalsIgnoreCase("EXPENSE")) {
            List<Expense> expenses = expenseRepository.findByUserIdOrderByExpenseDateDesc(userId);
            for (Expense exp : expenses) {
                if (categoryId != null && (exp.getCategory() == null || !exp.getCategory().getId().equals(categoryId))) {
                    continue;
                }
                if (matchesFilter(exp.getExpenseDate(), exp.getDescription(), exp.getPaymentMethod(), exp.getCategory() != null ? exp.getCategory().getName() : null, startDate, endDate, query)) {
                    TransactionDTO dto = new TransactionDTO(
                            "EXP-" + exp.getId(),
                            "EXPENSE",
                            exp.getDescription() != null && !exp.getDescription().isBlank() ? exp.getDescription() : (exp.getCategory() != null ? exp.getCategory().getName() : "Expense"),
                            exp.getAmount(),
                            exp.getExpenseDate(),
                            categoryService.mapToDTO(exp.getCategory()),
                            exp.getPaymentMethod()
                    );
                    transactions.add(dto);
                }
            }
        }

        return transactions.stream()
                .sorted(Comparator.comparing(TransactionDTO::getDate).reversed())
                .collect(Collectors.toList());
    }

    private com.smartbudget.dto.CategoryDTO incomeCategory(Income inc) {
        if (inc.getCategory() != null) {
            return categoryService.mapToDTO(inc.getCategory());
        }
        return new com.smartbudget.dto.CategoryDTO(null, "Income", "INCOME", "DollarSign", "#10b981");
    }

    private boolean matchesFilter(LocalDate date, String str1, String str2, String str3, LocalDate startDate, LocalDate endDate, String query) {
        if (startDate != null && date.isBefore(startDate)) return false;
        if (endDate != null && date.isAfter(endDate)) return false;
        if (query != null && !query.trim().isEmpty()) {
            String q = query.toLowerCase().trim();
            boolean match1 = str1 != null && str1.toLowerCase().contains(q);
            boolean match2 = str2 != null && str2.toLowerCase().contains(q);
            boolean match3 = str3 != null && str3.toLowerCase().contains(q);
            return match1 || match2 || match3;
        }
        return true;
    }
}
