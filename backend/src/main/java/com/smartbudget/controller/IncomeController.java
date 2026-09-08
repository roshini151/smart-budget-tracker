package com.smartbudget.controller;

import com.smartbudget.dto.IncomeDTO;
import com.smartbudget.dto.IncomeRequest;
import com.smartbudget.security.UserPrincipal;
import com.smartbudget.service.IncomeService;
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
@RequestMapping("/api/income")
public class IncomeController {

    private final IncomeService incomeService;

    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }

    @GetMapping
    public ResponseEntity<List<IncomeDTO>> getAllIncomes(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(incomeService.getAllIncomesForUser(currentUser.getId()));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<IncomeDTO>> searchIncomes(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "incomeDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(incomeService.searchIncomes(currentUser.getId(), query, startDate, endDate, page, size, sortBy, sortDir));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncomeDTO> getIncomeById(@AuthenticationPrincipal UserPrincipal currentUser,
                                                    @PathVariable Long id) {
        return ResponseEntity.ok(incomeService.getIncomeById(currentUser.getId(), id));
    }

    @PostMapping
    public ResponseEntity<IncomeDTO> createIncome(@AuthenticationPrincipal UserPrincipal currentUser,
                                                   @Valid @RequestBody IncomeRequest request) {
        return new ResponseEntity<>(incomeService.createIncome(currentUser.getId(), request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncomeDTO> updateIncome(@AuthenticationPrincipal UserPrincipal currentUser,
                                                   @PathVariable Long id,
                                                   @Valid @RequestBody IncomeRequest request) {
        return ResponseEntity.ok(incomeService.updateIncome(currentUser.getId(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncome(@AuthenticationPrincipal UserPrincipal currentUser,
                                              @PathVariable Long id) {
        incomeService.deleteIncome(currentUser.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
