package com.smartbudget.service;

import com.smartbudget.dto.CategoryDTO;
import com.smartbudget.dto.IncomeDTO;
import com.smartbudget.dto.IncomeRequest;
import com.smartbudget.entity.Category;
import com.smartbudget.entity.Income;
import com.smartbudget.entity.User;
import com.smartbudget.exception.ResourceNotFoundException;
import com.smartbudget.repository.CategoryRepository;
import com.smartbudget.repository.IncomeRepository;
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
public class IncomeService {

    private final IncomeRepository incomeRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final CategoryService categoryService;

    public IncomeService(IncomeRepository incomeRepository,
                         UserRepository userRepository,
                         CategoryRepository categoryRepository,
                         CategoryService categoryService) {
        this.incomeRepository = incomeRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.categoryService = categoryService;
    }

    public List<IncomeDTO> getAllIncomesForUser(Long userId) {
        return incomeRepository.findByUserIdOrderByIncomeDateDesc(userId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public Page<IncomeDTO> searchIncomes(Long userId, String query, LocalDate startDate, LocalDate endDate, int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return incomeRepository.searchIncomes(userId, query, startDate, endDate, pageable)
                .map(this::mapToDTO);
    }

    public IncomeDTO getIncomeById(Long userId, Long incomeId) {
        Income income = incomeRepository.findByIdAndUserId(incomeId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Income record not found with id: " + incomeId));
        return mapToDTO(income);
    }

    @Transactional
    public IncomeDTO createIncome(Long userId, IncomeRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Income income = new Income();
        income.setUser(user);
        income.setAmount(request.getAmount());
        income.setSource(request.getSource());
        income.setIncomeDate(request.getIncomeDate());
        income.setDescription(request.getDescription());
        income.setNotes(request.getNotes());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElse(null);
            income.setCategory(category);
        }

        Income saved = incomeRepository.save(income);
        return mapToDTO(saved);
    }

    @Transactional
    public IncomeDTO updateIncome(Long userId, Long incomeId, IncomeRequest request) {
        Income income = incomeRepository.findByIdAndUserId(incomeId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Income record not found with id: " + incomeId));

        income.setAmount(request.getAmount());
        income.setSource(request.getSource());
        income.setIncomeDate(request.getIncomeDate());
        income.setDescription(request.getDescription());
        income.setNotes(request.getNotes());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElse(null);
            income.setCategory(category);
        } else {
            income.setCategory(null);
        }

        Income updated = incomeRepository.save(income);
        return mapToDTO(updated);
    }

    @Transactional
    public void deleteIncome(Long userId, Long incomeId) {
        Income income = incomeRepository.findByIdAndUserId(incomeId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Income record not found with id: " + incomeId));
        incomeRepository.delete(income);
    }

    public IncomeDTO mapToDTO(Income income) {
        IncomeDTO dto = new IncomeDTO();
        dto.setId(income.getId());
        dto.setAmount(income.getAmount());
        dto.setSource(income.getSource());
        dto.setIncomeDate(income.getIncomeDate());
        dto.setDescription(income.getDescription());
        dto.setNotes(income.getNotes());

        if (income.getCategory() != null) {
            dto.setCategory(categoryService.mapToDTO(income.getCategory()));
        } else {
            dto.setCategory(new CategoryDTO(null, "Income", "INCOME", "DollarSign", "#10b981"));
        }
        return dto;
    }
}
