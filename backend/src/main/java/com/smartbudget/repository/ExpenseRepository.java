package com.smartbudget.repository;

import com.smartbudget.entity.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserIdOrderByExpenseDateDesc(Long userId);
    Optional<Expense> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT e FROM Expense e WHERE e.user.id = :userId AND " +
           "(:categoryId IS NULL OR e.category.id = :categoryId) AND " +
           "(:query IS NULL OR LOWER(e.description) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(e.paymentMethod) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:startDate IS NULL OR e.expenseDate >= :startDate) AND " +
           "(:endDate IS NULL OR e.expenseDate <= :endDate)")
    Page<Expense> searchExpenses(@Param("userId") Long userId,
                                @Param("categoryId") Long categoryId,
                                @Param("query") String query,
                                @Param("startDate") LocalDate startDate,
                                @Param("endDate") LocalDate endDate,
                                Pageable pageable);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId")
    BigDecimal sumTotalByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId AND e.expenseDate BETWEEN :startDate AND :endDate")
    BigDecimal sumTotalByUserIdAndDateRange(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId AND e.category.id = :categoryId AND e.expenseDate BETWEEN :startDate AND :endDate")
    BigDecimal sumByUserIdAndCategoryIdAndDateRange(@Param("userId") Long userId, @Param("categoryId") Long categoryId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT e.category.name as categoryName, e.category.color as color, SUM(e.amount) as totalAmount " +
           "FROM Expense e WHERE e.user.id = :userId AND e.expenseDate BETWEEN :startDate AND :endDate " +
           "GROUP BY e.category.name, e.category.color ORDER BY totalAmount DESC")
    List<Object[]> findCategorySpendingBreakdown(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
