package com.smartbudget.repository;

import com.smartbudget.entity.FinancialGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FinancialGoalRepository extends JpaRepository<FinancialGoal, Long> {
    List<FinancialGoal> findByUserIdOrderByTargetDateAsc(Long userId);
    Optional<FinancialGoal> findByIdAndUserId(Long id, Long userId);
}
