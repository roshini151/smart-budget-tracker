package com.smartbudget.service;

import com.smartbudget.dto.ExpenseDTO;
import com.smartbudget.dto.ExpenseRequest;
import com.smartbudget.entity.Category;
import com.smartbudget.entity.Expense;
import com.smartbudget.entity.User;
import com.smartbudget.exception.ResourceNotFoundException;
import com.smartbudget.repository.CategoryRepository;
import com.smartbudget.repository.ExpenseRepository;
import com.smartbudget.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final CategoryService categoryService;

    public ExpenseService(ExpenseRepository expenseRepository,
                          UserRepository userRepository,
                          CategoryRepository categoryRepository,
                          CategoryService categoryService) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.categoryService = categoryService;
    }

    public List<ExpenseDTO> getAllExpensesForUser(Long userId) {
        return expenseRepository.findByUserIdOrderByExpenseDateDesc(userId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public Page<ExpenseDTO> searchExpenses(Long userId, Long categoryId, String query, LocalDate startDate, LocalDate endDate, int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return expenseRepository.searchExpenses(userId, categoryId, query, startDate, endDate, pageable)
                .map(this::mapToDTO);
    }

    public ExpenseDTO getExpenseById(Long userId, Long expenseId) {
        Expense expense = expenseRepository.findByIdAndUserId(expenseId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense record not found with id: " + expenseId));
        return mapToDTO(expense);
    }

    @Transactional
    public ExpenseDTO createExpense(Long userId, ExpenseRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Expense expense = new Expense();
        expense.setUser(user);
        expense.setCategory(category);
        expense.setAmount(request.getAmount());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setPaymentMethod(request.getPaymentMethod());
        expense.setDescription(request.getDescription());
        expense.setNotes(request.getNotes());

        Expense saved = expenseRepository.save(expense);
        return mapToDTO(saved);
    }

    @Transactional
    public ExpenseDTO updateExpense(Long userId, Long expenseId, ExpenseRequest request) {
        Expense expense = expenseRepository.findByIdAndUserId(expenseId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense record not found with id: " + expenseId));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        expense.setCategory(category);
        expense.setAmount(request.getAmount());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setPaymentMethod(request.getPaymentMethod());
        expense.setDescription(request.getDescription());
        expense.setNotes(request.getNotes());

        Expense updated = expenseRepository.save(expense);
        return mapToDTO(updated);
    }

    @Transactional
    public void deleteExpense(Long userId, Long expenseId) {
        Expense expense = expenseRepository.findByIdAndUserId(expenseId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense record not found with id: " + expenseId));
        expenseRepository.delete(expense);
    }

    public ExpenseDTO mapToDTO(Expense expense) {
        ExpenseDTO dto = new ExpenseDTO();
        dto.setId(expense.getId());
        dto.setAmount(expense.getAmount());
        dto.setExpenseDate(expense.getExpenseDate());
        dto.setPaymentMethod(expense.getPaymentMethod());
        dto.setDescription(expense.getDescription());
        dto.setNotes(expense.getNotes());
        dto.setCategory(categoryService.mapToDTO(expense.getCategory()));
        return dto;
    }
}
