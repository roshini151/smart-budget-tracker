package com.smartbudget.repository;

import com.smartbudget.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUserIdAndBudgetMonthAndBudgetYear(Long userId, Integer budgetMonth, Integer budgetYear);
    Optional<Budget> findByIdAndUserId(Long id, Long userId);
    boolean existsByUserIdAndCategoryIdAndBudgetMonthAndBudgetYear(Long userId, Long categoryId, Integer budgetMonth, Integer budgetYear);
    Optional<Budget> findByUserIdAndCategoryIdAndBudgetMonthAndBudgetYear(Long userId, Long categoryId, Integer budgetMonth, Integer budgetYear);

    @Query("SELECT b FROM Budget b WHERE b.user.id = :userId ORDER BY b.budgetYear DESC, b.budgetMonth DESC")
    List<Budget> findAllByUserIdSorted(@Param("userId") Long userId);
}
