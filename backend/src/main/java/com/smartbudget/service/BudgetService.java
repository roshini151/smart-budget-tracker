package com.smartbudget.service;

import com.smartbudget.dto.BudgetDTO;
import com.smartbudget.dto.BudgetRequest;
import com.smartbudget.entity.Budget;
import com.smartbudget.entity.Category;
import com.smartbudget.entity.User;
import com.smartbudget.exception.DuplicateResourceException;
import com.smartbudget.exception.ResourceNotFoundException;
import com.smartbudget.repository.BudgetRepository;
import com.smartbudget.repository.CategoryRepository;
import com.smartbudget.repository.ExpenseRepository;
import com.smartbudget.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final CategoryService categoryService;

    public BudgetService(BudgetRepository budgetRepository,
                         ExpenseRepository expenseRepository,
                         UserRepository userRepository,
                         CategoryRepository categoryRepository,
                         CategoryService categoryService) {
        this.budgetRepository = budgetRepository;
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.categoryService = categoryService;
    }

    public List<BudgetDTO> getBudgetsForUser(Long userId, Integer month, Integer year) {
        LocalDate now = LocalDate.now();
        int targetMonth = month != null ? month : now.getMonthValue();
        int targetYear = year != null ? year : now.getYear();

        List<Budget> budgets = budgetRepository.findByUserIdAndBudgetMonthAndBudgetYear(userId, targetMonth, targetYear);
        if (budgets.isEmpty() && month == null && year == null) {
            // Return all budgets sorted if current month filter returns empty
            budgets = budgetRepository.findAllByUserIdSorted(userId);
        }

        return budgets.stream()
                .map(b -> mapToDTO(b))
                .collect(Collectors.toList());
    }

    public BudgetDTO getBudgetById(Long userId, Long budgetId) {
        Budget budget = budgetRepository.findByIdAndUserId(budgetId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + budgetId));
        return mapToDTO(budget);
    }

    @Transactional
    public BudgetDTO createBudget(Long userId, BudgetRequest request) {
        if (budgetRepository.existsByUserIdAndCategoryIdAndBudgetMonthAndBudgetYear(
                userId, request.getCategoryId(), request.getBudgetMonth(), request.getBudgetYear())) {
            throw new DuplicateResourceException("A budget already exists for this category in month " + request.getBudgetMonth() + "/" + request.getBudgetYear());
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Budget budget = new Budget();
        budget.setUser(user);
        budget.setCategory(category);
        budget.setBudgetMonth(request.getBudgetMonth());
        budget.setBudgetYear(request.getBudgetYear());
        budget.setAmount(request.getAmount());

        Budget saved = budgetRepository.save(budget);
        return mapToDTO(saved);
    }

    @Transactional
    public BudgetDTO updateBudget(Long userId, Long budgetId, BudgetRequest request) {
        Budget budget = budgetRepository.findByIdAndUserId(budgetId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + budgetId));

        if (!budget.getCategory().getId().equals(request.getCategoryId()) ||
            !budget.getBudgetMonth().equals(request.getBudgetMonth()) ||
            !budget.getBudgetYear().equals(request.getBudgetYear())) {
            
            if (budgetRepository.existsByUserIdAndCategoryIdAndBudgetMonthAndBudgetYear(
                    userId, request.getCategoryId(), request.getBudgetMonth(), request.getBudgetYear())) {
                throw new DuplicateResourceException("A budget already exists for this category in month " + request.getBudgetMonth() + "/" + request.getBudgetYear());
            }
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        budget.setCategory(category);
        budget.setBudgetMonth(request.getBudgetMonth());
        budget.setBudgetYear(request.getBudgetYear());
        budget.setAmount(request.getAmount());

        Budget updated = budgetRepository.save(budget);
        return mapToDTO(updated);
    }

    @Transactional
    public void deleteBudget(Long userId, Long budgetId) {
        Budget budget = budgetRepository.findByIdAndUserId(budgetId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + budgetId));
        budgetRepository.delete(budget);
    }

    public BudgetDTO mapToDTO(Budget budget) {
        YearMonth yearMonth = YearMonth.of(budget.getBudgetYear(), budget.getBudgetMonth());
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        BigDecimal spentAmount = expenseRepository.sumByUserIdAndCategoryIdAndDateRange(
                budget.getUser().getId(), budget.getCategory().getId(), startDate, endDate);

        BigDecimal remaining = budget.getAmount().subtract(spentAmount);
        double percentage = 0.0;
        if (budget.getAmount().compareTo(BigDecimal.ZERO) > 0) {
            percentage = spentAmount.divide(budget.getAmount(), 4, RoundingMode.HALF_UP).doubleValue() * 100.0;
        }

        String status = "OK";
        if (percentage >= 100.0) {
            status = "EXCEEDED";
        } else if (percentage >= 80.0) {
            status = "WARNING";
        }

        BudgetDTO dto = new BudgetDTO();
        dto.setId(budget.getId());
        dto.setCategory(categoryService.mapToDTO(budget.getCategory()));
        dto.setBudgetMonth(budget.getBudgetMonth());
        dto.setBudgetYear(budget.getBudgetYear());
        dto.setAmount(budget.getAmount());
        dto.setSpentAmount(spentAmount);
        dto.setRemainingAmount(remaining);
        dto.setPercentageUsed(Math.round(percentage * 10.0) / 10.0);
        dto.setStatus(status);

        return dto;
    }
}
