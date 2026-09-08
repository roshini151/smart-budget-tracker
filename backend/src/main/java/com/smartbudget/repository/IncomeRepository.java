package com.smartbudget.repository;

import com.smartbudget.entity.Income;
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
public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findByUserIdOrderByIncomeDateDesc(Long userId);
    Optional<Income> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT i FROM Income i WHERE i.user.id = :userId AND " +
           "(:query IS NULL OR LOWER(i.source) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(i.description) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:startDate IS NULL OR i.incomeDate >= :startDate) AND " +
           "(:endDate IS NULL OR i.incomeDate <= :endDate)")
    Page<Income> searchIncomes(@Param("userId") Long userId,
                               @Param("query") String query,
                               @Param("startDate") LocalDate startDate,
                               @Param("endDate") LocalDate endDate,
                               Pageable pageable);

    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Income i WHERE i.user.id = :userId")
    BigDecimal sumTotalByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Income i WHERE i.user.id = :userId AND i.incomeDate BETWEEN :startDate AND :endDate")
    BigDecimal sumTotalByUserIdAndDateRange(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
