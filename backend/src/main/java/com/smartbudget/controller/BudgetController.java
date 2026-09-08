package com.smartbudget.controller;

import com.smartbudget.dto.BudgetDTO;
import com.smartbudget.dto.BudgetRequest;
import com.smartbudget.security.UserPrincipal;
import com.smartbudget.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public ResponseEntity<List<BudgetDTO>> getBudgets(@AuthenticationPrincipal UserPrincipal currentUser,
                                                     @RequestParam(required = false) Integer month,
                                                     @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(budgetService.getBudgetsForUser(currentUser.getId(), month, year));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BudgetDTO> getBudgetById(@AuthenticationPrincipal UserPrincipal currentUser,
                                                    @PathVariable Long id) {
        return ResponseEntity.ok(budgetService.getBudgetById(currentUser.getId(), id));
    }

    @PostMapping
    public ResponseEntity<BudgetDTO> createBudget(@AuthenticationPrincipal UserPrincipal currentUser,
                                                   @Valid @RequestBody BudgetRequest request) {
        return new ResponseEntity<>(budgetService.createBudget(currentUser.getId(), request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BudgetDTO> updateBudget(@AuthenticationPrincipal UserPrincipal currentUser,
                                                   @PathVariable Long id,
                                                   @Valid @RequestBody BudgetRequest request) {
        return ResponseEntity.ok(budgetService.updateBudget(currentUser.getId(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@AuthenticationPrincipal UserPrincipal currentUser,
                                              @PathVariable Long id) {
        budgetService.deleteBudget(currentUser.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
