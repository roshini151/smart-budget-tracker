package com.smartbudget.service;

import com.smartbudget.dto.DepositRequest;
import com.smartbudget.dto.GoalDTO;
import com.smartbudget.dto.GoalRequest;
import com.smartbudget.entity.FinancialGoal;
import com.smartbudget.entity.User;
import com.smartbudget.exception.ResourceNotFoundException;
import com.smartbudget.repository.FinancialGoalRepository;
import com.smartbudget.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GoalService {

    private final FinancialGoalRepository goalRepository;
    private final UserRepository userRepository;

    public GoalService(FinancialGoalRepository goalRepository, UserRepository userRepository) {
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
    }

    public List<GoalDTO> getGoalsForUser(Long userId) {
        return goalRepository.findByUserIdOrderByTargetDateAsc(userId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public GoalDTO getGoalById(Long userId, Long goalId) {
        FinancialGoal goal = goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + goalId));
        return mapToDTO(goal);
    }

    @Transactional
    public GoalDTO createGoal(Long userId, GoalRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        FinancialGoal goal = new FinancialGoal();
        goal.setUser(user);
        goal.setName(request.getName());
        goal.setTargetAmount(request.getTargetAmount());
        goal.setCurrentAmount(request.getCurrentAmount() != null ? request.getCurrentAmount() : BigDecimal.ZERO);
        goal.setTargetDate(request.getTargetDate());

        if (goal.getCurrentAmount().compareTo(goal.getTargetAmount()) >= 0) {
            goal.setStatus("COMPLETED");
        } else {
            goal.setStatus("IN_PROGRESS");
        }

        FinancialGoal saved = goalRepository.save(goal);
        return mapToDTO(saved);
    }

    @Transactional
    public GoalDTO updateGoal(Long userId, Long goalId, GoalRequest request) {
        FinancialGoal goal = goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + goalId));

        goal.setName(request.getName());
        goal.setTargetAmount(request.getTargetAmount());
        if (request.getCurrentAmount() != null) {
            goal.setCurrentAmount(request.getCurrentAmount());
        }
        goal.setTargetDate(request.getTargetDate());

        if (goal.getCurrentAmount().compareTo(goal.getTargetAmount()) >= 0) {
            goal.setStatus("COMPLETED");
        } else {
            goal.setStatus("IN_PROGRESS");
        }

        FinancialGoal updated = goalRepository.save(goal);
        return mapToDTO(updated);
    }

    @Transactional
    public GoalDTO addDeposit(Long userId, Long goalId, DepositRequest request) {
        FinancialGoal goal = goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + goalId));

        BigDecimal newAmount = goal.getCurrentAmount().add(request.getAmount());
        goal.setCurrentAmount(newAmount);

        if (newAmount.compareTo(goal.getTargetAmount()) >= 0) {
            goal.setStatus("COMPLETED");
        }

        FinancialGoal updated = goalRepository.save(goal);
        return mapToDTO(updated);
    }

    @Transactional
    public void deleteGoal(Long userId, Long goalId) {
        FinancialGoal goal = goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + goalId));
        goalRepository.delete(goal);
    }

    public GoalDTO mapToDTO(FinancialGoal goal) {
        GoalDTO dto = new GoalDTO();
        dto.setId(goal.getId());
        dto.setName(goal.getName());
        dto.setTargetAmount(goal.getTargetAmount());
        dto.setCurrentAmount(goal.getCurrentAmount());
        dto.setTargetDate(goal.getTargetDate());
        dto.setStatus(goal.getStatus());

        double progress = 0.0;
        if (goal.getTargetAmount().compareTo(BigDecimal.ZERO) > 0) {
            progress = goal.getCurrentAmount().divide(goal.getTargetAmount(), 4, RoundingMode.HALF_UP).doubleValue() * 100.0;
        }
        dto.setProgressPercentage(Math.min(100.0, Math.round(progress * 10.0) / 10.0));

        return dto;
    }
}
