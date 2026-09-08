package com.smartbudget.controller;

import com.smartbudget.dto.DepositRequest;
import com.smartbudget.dto.GoalDTO;
import com.smartbudget.dto.GoalRequest;
import com.smartbudget.security.UserPrincipal;
import com.smartbudget.service.GoalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @GetMapping
    public ResponseEntity<List<GoalDTO>> getGoals(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(goalService.getGoalsForUser(currentUser.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GoalDTO> getGoalById(@AuthenticationPrincipal UserPrincipal currentUser,
                                                @PathVariable Long id) {
        return ResponseEntity.ok(goalService.getGoalById(currentUser.getId(), id));
    }

    @PostMapping
    public ResponseEntity<GoalDTO> createGoal(@AuthenticationPrincipal UserPrincipal currentUser,
                                               @Valid @RequestBody GoalRequest request) {
        return new ResponseEntity<>(goalService.createGoal(currentUser.getId(), request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GoalDTO> updateGoal(@AuthenticationPrincipal UserPrincipal currentUser,
                                               @PathVariable Long id,
                                               @Valid @RequestBody GoalRequest request) {
        return ResponseEntity.ok(goalService.updateGoal(currentUser.getId(), id, request));
    }

    @PostMapping("/{id}/deposit")
    public ResponseEntity<GoalDTO> addDeposit(@AuthenticationPrincipal UserPrincipal currentUser,
                                               @PathVariable Long id,
                                               @Valid @RequestBody DepositRequest request) {
        return ResponseEntity.ok(goalService.addDeposit(currentUser.getId(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@AuthenticationPrincipal UserPrincipal currentUser,
                                            @PathVariable Long id) {
        goalService.deleteGoal(currentUser.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
