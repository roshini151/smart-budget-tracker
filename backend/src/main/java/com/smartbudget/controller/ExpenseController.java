package com.smartbudget.controller;

import com.smartbudget.dto.ExpenseDTO;
import com.smartbudget.dto.ExpenseRequest;
import com.smartbudget.security.UserPrincipal;
import com.smartbudget.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public ResponseEntity<List<ExpenseDTO>> getAllExpenses(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(expenseService.getAllExpensesForUser(currentUser.getId()));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ExpenseDTO>> searchExpenses(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "expenseDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(expenseService.searchExpenses(currentUser.getId(), categoryId, query, startDate, endDate, page, size, sortBy, sortDir));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseDTO> getExpenseById(@AuthenticationPrincipal UserPrincipal currentUser,
                                                     @PathVariable Long id) {
        return ResponseEntity.ok(expenseService.getExpenseById(currentUser.getId(), id));
    }

    @PostMapping
    public ResponseEntity<ExpenseDTO> createExpense(@AuthenticationPrincipal UserPrincipal currentUser,
                                                    @Valid @RequestBody ExpenseRequest request) {
        return new ResponseEntity<>(expenseService.createExpense(currentUser.getId(), request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseDTO> updateExpense(@AuthenticationPrincipal UserPrincipal currentUser,
                                                    @PathVariable Long id,
                                                    @Valid @RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.updateExpense(currentUser.getId(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@AuthenticationPrincipal UserPrincipal currentUser,
                                               @PathVariable Long id) {
        expenseService.deleteExpense(currentUser.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
